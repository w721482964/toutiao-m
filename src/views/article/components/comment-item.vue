<template>
  <van-cell class="comment-item">
    <van-image
      class="avatar"
      slot="icon"
      round
      fit="cover"
      src="https://img.yzcdn.cn/vant/cat.jpeg"
    />
    <div slot="title" class="title">
      <div class="name">
        {{ comment.aut_name }}
        <div class="like-wrap" @click="onLike">
          <van-icon
            class="like-icon"
            :color="comment.is_like ? 'red' : ''"
            :name="comment.is_like ? 'good-job' : 'good-job-o'"
          />
          <span class="like-count">{{ comment.like_count }}</span>
        </div>
      </div>
      <div class="content">{{ comment.content }}</div>
      <div class="down">
        <span class="pubdate">{{
          comment.pubdate | dateTime('MM-DD hh:mm:ss')
        }}</span>
        <van-button
          @click="$emit('reply-click', comment)"
          class="reply-btn"
          size="mini"
          round
          >{{ comment.reply_count }}回复</van-button
        >
      </div>
    </div>
  </van-cell>
</template>

<script>
import { deleteLike, addLike } from '@/api/comment'
export default {
  name: 'CommentItem',
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data () {
    return {

    }
  },
  methods: {
    async onLike () {
      const id = this.comment.com_id.toString()
      if (this.comment.is_like) {
        await deleteLike(id)
        this.comment.like_count--
      } else {
        await addLike(id)
        this.comment.like_count++
      }
      this.comment.is_like = !this.comment.is_like
    }
  }
}
</script>

<style lang="less" scoped>
.comment-item {
  .avatar {
    width: 38px;
    height: 38px;
    margin-right: 12px;
  }
  .title {
    .name {
      font-size: 14px;
      color: #406599;
      display: flex;
      justify-content: space-between;
    }
    .content {
      font-size: 16px;
      color: #222222;
    }
    .pubdate {
      font-size: 10px;
      margin-right: 12px;
    }
    .reply-btn {
      width: 62px;
      height: 24px;
      color: #222;
      background-color: #f4f5f6;
    }
    .like-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .down {
    display: flex;
  }
}
</style>
