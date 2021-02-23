<template>
  <div class="comment-reply">
    <van-nav-bar :title="`${comment.reply_count}条回复`"> </van-nav-bar>
    <!-- 评论项-->
    <CommentItem :comment="comment"></CommentItem>
    <!-- 回复评论 -->
    <CommentList
      type="c"
      :source="comment.com_id"
      :list="replyCommentList"
    ></CommentList>
    <!-- 底部区域 -->
    <div class="article-bottom">
      <van-button
        @click="isReplyShow = true"
        class="comment-btn"
        round
        size="samll"
        >写评论</van-button
      >
    </div>
    <!-- 回复评论弹出框 -->
    <van-popup v-model="isReplyShow" position="bottom">
      <PostComment
        :target="comment.com_id"
        :articleId="articleId"
        @post-success="PostSuccess"
      ></PostComment>
    </van-popup>
  </div>
</template>

<script>
import CommentItem from './comment-item'
import CommentList from './comment-list'
import PostComment from './post-comment'

export default {
  name: 'CommentReply',
  components: {
    CommentItem,
    CommentList,
    PostComment
  },
  props: {
    comment: {
      type: Object,
      required: true
    },
    articleId: {
      type: [Number, Object, String],
      required: true
    }
  },
  data () {
    return {
      isReplyShow: false,
      replyCommentList: [] // 评论回复的列表
    }
  },
  methods: {
    PostSuccess (comment) {
      console.log(comment)
      // 将发布成功的评论放到评论列表的顶部
      this.replyCommentList.unshift(comment)
      this.comment.reply_count++
      // 关闭发布回复的弹出层
      this.isReplyShow = false
    }
  }
}
</script>

<style lang="less" scoped>
.comment-reply {
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
      flex: 1;
      width: 141px;
      height: 23px;
      border: 1px solid #999;
      color: #999;
      line-height: 44px;
      margin: 0 15px;
    }
  }
}
</style>
