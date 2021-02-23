<template>
  <div class="comment-list">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell title="全部评论"></van-cell>
      <CommentItem
        v-for="(item, index) in list"
        :key="index"
        :comment="item"
        @reply-click="$emit('reply-click', $event)"
      ></CommentItem>
      <!-- <van-cell v-for="(item, index) in list" :key="index" :title="item" /> -->
    </van-list>
  </div>
</template>

<script>
import { getComments } from '@/api/comment'
import CommentItem from './comment-item'
// import { getItem } from '@/utils/storage'
export default {
  name: 'CommentList',
  components: {
    CommentItem
  },
  props: {
    source: {
      type: [String, Number, Object],
      required: true
    },
    list: {
      type: Array,
      // 数组或对象的默认值必须通过函数返回
      default: () => []
      // default: function () {
      //   return []
      // }
    },
    type: {
      type: String,
      default: 'a'
    }
  },
  data () {
    return {
      // list: [
      //   {
      //     aut_id: 3,
      //     aut_name: '黑马头条号1',
      //     aut_photo: 'https://img.yzcdn.cn/vant/cat.jpeg',
      //     com_id: 99,
      //     content: '撒大苏打大苏打',
      //     is_like: false,
      //     is_top: 0,
      //     like_count: 3,
      //     pubdate: '2020-05-18T15:45:30',
      //     reply_count: 15
      //   },
      //   {
      //     aut_id: 4,
      //     aut_name: '黑马头条号2',
      //     aut_photo: 'https://img.yzcdn.cn/vant/cat.jpeg',
      //     com_id: 100,
      //     content: '哈哈哈哈哈哈',
      //     is_like: true,
      //     is_top: 0,
      //     like_count: 5,
      //     pubdate: '2020-05-18T20:45:30',
      //     reply_count: 10
      //   }
      // ],
      loading: false,
      finished: false,
      offset: 1,
      limit: 10
    }
  },
  methods: {
    async onLoad () {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      // setTimeout(() => {
      //   // for (let i = 0; i < 10; i++) {
      //   //   this.list.push(this.list.length + 1)
      //   // }

      //   // 加载状态结束
      //   this.loading = false
      //   // 数据全部加载完成
      //   if (this.list.length >= 2) {
      //     this.finished = true
      //   }
      // }, 1000)
      // 1.请求获取数据
      const { data } = await getComments({
        type: this.type,
        source: this.source.toString(),
        offset: this.offset,
        limit: this.limit
      })
      console.log(data)
      const { results } = data.data
      this.list.unshift(...results)
      this.$emit('totalCount', data.data.total_count)
      // 加载状态结束
      this.loading = false
      // 数据全部加载完成
      if (results.length) {
        console.log('11')
      } else {
        this.finished = true
      }
      // const { resutls } = data.data
      // 2.将数据放到列表中
      // this.list.unshift(...resutls)
      // // 3.将本次的loading设为false
      // this.loading = false
      // 4.判断是否还有数据，如果有，则更新下一页页码，否则将finished设置true
    }
  }
}
</script>

<style>
</style>
