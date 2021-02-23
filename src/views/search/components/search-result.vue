<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="(item, index) in list"
        :key="index"
        :title="item.title"
      />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search'
export default {
  name: 'SearchResult',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1, // 页码
      per_page: 10 // 每页大小
    }
  },
  created () { },
  methods: {
    async onLoad () {
      // 1.请求获取数据
      const { data } = await getSearchResult({ page: this.page, per_page: this.per_page, q: this.searchText })
      console.log(data)
      // 2.将数据放到数据列表中
      const { results } = data.data
      this.list.push(...results)
      // 3.关闭本次的loading
      this.loading = false
      // 4.判断是否还有数据
      if (results.length) {
        this.page++
      } else {
        this.finished = true
      }
      // 如果有，则更新获取下一页的数据的页码
      // 如果没有,则把finished设置为true,关闭加载更多
    }
  }
}
</script>

<style lang="less" scoped>
.search-result {
  .van-list {
    position: fixed;
    right: 0;
    left: 0;
    bottom: 0;
    top: 54px;
    overflow-y: auto;
  }
}
</style>
