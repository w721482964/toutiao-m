<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="app-nav-bar"
      title="文章详情"
      left-arrow
      @click-left="$router.back()"
    />
    <div class="article-wrap">
      <h1 class="title">{{ article.title }}</h1>
      <van-cell center class="user-info">
        <van-image
          class="avatar"
          slot="icon"
          fit="conver"
          round
          :src="article.aut_photo"
        />
        <div slot="title" class="name">{{ article.aut_name }}</div>
        <div slot="label" class="pubdate">
          {{ article.pubdate | relativeTime }}
        </div>
        <van-button
          class="follow-btn"
          :icon="article.is_followed ? 'success' : 'plus'"
          size="small"
          :type="article.is_followed ? 'default' : 'info'"
          round
          :loading="isFllowLoading"
          @click="onFllow"
          >{{ article.is_followed ? '已关注' : '关注' }}</van-button
        >
      </van-cell>
      <!-- 正文 -->
      <div
        ref="article-content"
        class="content markdown-body"
        v-html="article.content"
      ></div>
      <!-- 评论区域 -->
      <CommentList
        :source="articleId"
        :list="commentList"
        @totalCount="commentTotal = $event"
        @reply-click="replyBtn"
      ></CommentList>
    </div>
    <!-- 底部区域 -->
    <div class="article-bottom">
      <van-button
        @click="isPostShow = true"
        class="comment-btn"
        round
        size="samll"
        >写评论</van-button
      >
      <van-icon name="chat-o" :badge="commentTotal" color="#777" />
      <van-icon
        :name="article.is_collected ? 'star' : 'star-o'"
        :color="article.is_collected ? 'orange' : '#777'"
        @click="onCollect"
      />
      <van-icon
        :name="article.attitude === 1 ? 'good-job' : 'good-job-o'"
        :color="article.attitude === 1 ? 'red' : '#777'"
        @click="onLike"
      />
      <van-icon name="share" color="#777" />
    </div>
    <!-- 发布评论弹出框 -->
    <van-popup v-model="isPostShow" position="bottom">
      <PostComment
        :target="articleId"
        @post-success="PostSuccess"
      ></PostComment>
    </van-popup>

    <!-- 回复评论弹出框 -->
    <van-popup
      v-model="replyShow"
      position="bottom"
      closeable
      close-icon-position="top-left"
    >
      <!-- 这里使用v-if的目的是让组件随着弹出层的显示进行渲染和销毁，
    防止加载国的组件不会重新渲染导致数据不会重新加载的问题 -->
      <CommentReply
        v-if="replyShow"
        :comment="replyComment"
        :articleId="articleId"
      ></CommentReply>
    </van-popup>
  </div>
</template>

<script>
import './github-markdown.css'
import { getArticleById, addCollecArticle, deleteCollecArticle, addLikeArticle, deleteLikeArticle } from '@/api/article'
import { ImagePreview } from 'vant'
import { addUserFllow, deleteUserFllow } from '@/api/user'
import CommentList from './components/comment-list'
import PostComment from './components/post-comment'
import CommentReply from './components/comment-reply'

// 在组件中获取动态路由参数：
// 方式一：this.$router.params.articleId
// 方式二：props 传参，推荐
export default {
  name: 'ArticleIndex',
  components: {
    CommentList,
    PostComment,
    CommentReply
  },
  props: {
    articleId: {
      type: [String, Number, Object],
      required: true
    }
  },
  data () {
    return {
      article: {}, // 文章数据对象
      isFllowLoading: false, // 用户关注按钮的loading状态
      isPostShow: false, // 控制弹出框的显示与隐藏
      commentList: [], // 文章评论列表
      commentTotal: 0, // 评论总数量
      replyShow: false, // 控制回复显示的状态
      replyComment: {} // 当前评论项
    }
  },
  created () {
    this.isLoadingArticle()
  },
  methods: {
    async isLoadingArticle () {
      const { data } = await getArticleById(this.articleId)
      this.article = data.data

      // 数据改变影响视图更新（DOM数据）不是立即的
      // 所以如果需要在修改数据之后马上操作被该数据影响的使用DOM，需要把这个代码放到 $nextTick 中

      // this.$nextTick 是vue提供的一个方法
      this.$nextTick(() => {
        this.handlePreviewImage()
      })
    },
    handlePreviewImage () {
      // 1.获取文章内容DOM容器
      const articleContent = this.$refs['article-content']
      // 2.得到所有的img标签
      const imgs = articleContent.querySelectorAll('img')
      const imgPaths = [] // 收集所有的图片路径
      // 3.循环 img 列表，给 img 注册点击事件
      imgs.forEach((img, index) => {
        imgPaths.push(img.src)
        img.onclick = function () {
          // 4.在事件处理函数中调用 ImagePreview() 预览
          ImagePreview({
            images: imgPaths, // 预览图片路径列表
            startPosition: index // 起始位置
          })
        }
      })
    },
    async onFllow () {
      this.isFllowLoading = true
      if (this.article.is_followed) {
        // 已关注状态 取消关注
        await deleteUserFllow(this.article.aut_id)
      } else {
        // 没有关注 添加关注
        await addUserFllow(this.article.aut_id)
      }
      this.article.is_followed = !this.article.is_followed
      this.isFllowLoading = false
    },
    async onCollect () {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true
      })
      if (this.article.is_collected) {
        await deleteCollecArticle(this.articleId)
      } else {
        await addCollecArticle(this.articleId)
      }
      this.article.is_collected = !this.article.is_collected
      this.$toast.success(`${this.article.is_collected ? '' : '取消'}收藏成功`)
    },
    async onLike () {
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true
      })
      if (this.article.attitude !== 1) {
        await addLikeArticle(this.articleId)
        this.article.attitude = 1
      } else {
        await deleteLikeArticle(this.articleId)
        this.article.attitude = -1
      }
      this.$toast.success(`${this.article.attitude === 1 ? '' : '取消'}点赞成功`)
    },
    PostSuccess (comment) {
      this.commentList.unshift(comment)
      this.commentTotal++

      this.isPostShow = false
    },
    replyBtn (comment) {
      console.log(comment)
      this.replyComment = comment
      this.replyShow = true
    }
  }
}
</script>

<style lang="less" scoped>
.article-container {
  .article-wrap {
    position: fixed;
    right: 0;
    left: 0;
    top: 46px;
    bottom: 44px;
    overflow-y: auto;
  }
  .title {
    font-size: 20px;
    color: #3a3a3a;
    padding: 14px;
    background-color: #fff;
    margin: 0;
  }
  .user-info {
    .avatar {
      width: 35px;
      height: 35px;
      margin-right: 8px;
    }
    .name {
      font-size: 12px;
      color: #333;
    }
    .pubdate {
      font-size: 11px;
      color: #b4b4b4;
    }
    .follow-btn {
      width: 85px;
      height: 29px;
    }
  }
  .content {
    padding: 14px;
    background-color: #fff;
  }
  .article-bottom {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    bottom: 0;
    background-color: #fff;
    width: 100%;
    height: 44px;
    /deep/.comment-btn {
      flex: 3;
      width: 141px;
      height: 23px;
      border: 1px solid #999;
      color: #999;
      line-height: 44px;
      margin: 0 15px;
    }
    /deep/.van-icon {
      flex: 1;
      .van-info {
        right: 21px !important;
      }
    }
  }
}
</style>
