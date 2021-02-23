<template>
  <div class="article-list" ref="article-list">
    <van-pull-refresh
      :success-text="refreshSuccessText"
      v-model="isLoading"
      @refresh="onRefresh"
      success-duration="1500"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <AriticleItem
          v-for="(item, index) in ariticles"
          :key="index"
          :article="item"
        >
        </AriticleItem>
        <!-- <van-cell
          v-for="(item, index) in ariticles"
          :key="index"
          :title="item.title"
        /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import AriticleItem from '@/components/index'
import { debounce } from 'lodash'
export default {
  name: 'ArticleList',
  components: {
    AriticleItem: AriticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      ariticles: [], // 数据列表
      loading: false, // 控制加载中的loading状态
      finished: false, // 控制加载结束的状态
      timestamp: null,
      isLoading: false,
      refreshSuccessText: '',
      scrollTop: 0 // 列表滚动到顶部的距离
    }
  },
  mounted () {
    const articleList = this.$refs['article-list']
    articleList.onscroll = debounce(() => {
      this.scrollTop = articleList.scrollTop
    }, 50)
  },
  // 任何缓存组件都可以使用这两个生命周期钩子
  activated () {
    // 把记录到顶部的距离重新设置回去
    this.$refs['article-list'].scrollTop = this.scrollTop
  },
  deactivated () {
    console.log('组件失去活动了')
  },
  methods: {
    async onLoad () {
      // 1.请求获取数据
      const { data } = await getArticles({
        channel_id: this.channel.id, // 频道id
        timestamp: this.timestamp || Date.now(), // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳，timestamp相当于页码，请求最新数据使用当前最新时间戳，下一页数据使用上一次返回的数据中的时间戳
        with_top: 1 // 是否包含置顶，进入页码第一次请求时要包含置顶文章，1-包含 0-不包含
      })
      // console.log(data)
      const { results } = data.data
      this.ariticles.push(...results)
      // 2.把数据放到list数组中
      // 注意：是push进去的
      // 合并数组
      /**
       * var arr1 =  [1,2]
       * var arr2 =  [4,5,6]
       * var arr1 = [1,2,...arr2]
       *
       */
      // 3.设置本次加载状态结束，他才可以判断是否需要加载下一次，否则就会永远的停在这里
      this.loading = false
      // 4.数据全部加载完成
      if (results.length) {
        this.timestamp = data.data.pre_timestamp
      } else {
        // 没有数据了，就把加载状态设置结束，不会再触发加载更多
        this.finished = true
      }
    },
    async onRefresh () {
      const { data } = await getArticles({
        channel_id: this.channel.id,
        timestamp: Date.now(),
        with_top: 1
      })
      const { results } = data.data
      console.log(results)
      // 2.把数据放到数据列表中（往顶部追加）
      this.ariticles.unshift(...results)
      // 3.关闭刷新的状态 loading
      this.isLoading = false
      this.refreshSuccessText = `更新了${results.length}条数据`
    }
  }
}
</script>

<style lang="less" scoped>
.article-list {
  position: fixed;
  left: 0;
  right: 0;
  top: 90px;
  bottom: 50px;
  overflow-y: auto;
}
</style>
