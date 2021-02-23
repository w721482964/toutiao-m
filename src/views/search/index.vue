<template>
  <div class="search-container">
    <!-- 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮。 -->
    <!-- 搜索栏 -->
    <form action="/">
      <van-search
        v-model="searchText"
        placeholder="请输入搜索关键词"
        show-action
        @search="onSearch"
        @cancel="$router.back()"
        @focus="isShowResult = false"
      />
    </form>
    <!-- /搜索栏 -->

    <!-- 搜索结果 -->
    <SearchResult v-if="isShowResult" :search-text="searchText"></SearchResult>
    <!-- /搜索结果 -->

    <!-- 联想建议 -->
    <SearchSuggestion
      v-else-if="searchText"
      :search-text="searchText"
      @search="onSearch"
    ></SearchSuggestion>
    <!-- /联想建议 -->

    <!-- 历史记录 -->
    <SearchHistory
      v-else
      :search-text="searchText"
      :searchHistory="searchHistory"
      @search="onSearch"
      @updata-histories="searchHistory = $event"
    ></SearchHistory>
    <!-- /历史记录 -->
  </div>
</template>

<script>
import SearchSuggestion from './components/search-suggsetion'
import SearchHistory from './components/search-history'
import SearchResult from './components/search-result'
import { setItem, getItem } from '@/utils/storage'
import { getSearchHistory } from '@/api/search'
import { mapState } from 'vuex'

export default {
  name: 'SearchIndex',
  components: {
    SearchSuggestion,
    SearchHistory,
    SearchResult
  },
  data () {
    return {
      searchText: '', // 搜索框内容
      isShowResult: false,
      searchHistory: []
    }
  },
  created () {
    this.loadingSearchHistory()
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {
    // 监视搜索里面记录的变化，存储到本地存储
    // 原来所有的 setItem 都可以删了
    searchHistory () {
      setItem('search-history', this.searchHistory)
    }
  },
  methods: {
    onSearch (str) {
      // 把输入框设置为你要搜索的文本
      this.searchText = str
      const index = this.searchHistory.indexOf(str)
      if (index !== -1) {
        // 把重复项删除
        this.searchHistory.splice(index, 1)
      }
      this.searchHistory.unshift(str)

      // 如果用户已登录,则把搜索历史记录存储到线上
      // 提示:只要我们调用获取搜索结果的数据接口,后端会给我们自动存储用户的搜索历史记录
      // 如果没有登录页,则把搜索记录存储到本地
      if (!this.user) {
        setItem('search-history', this.searchHistory)
      }
      this.isShowResult = true
    },
    async loadingSearchHistory () {
      // 因为后端帮我们存储的用户搜索历史记录太少了(只有4条)
      // 所有我们这里让后端返回的历史记录和本地的历史记录合并到一起
      let loaclHistory = getItem('search-history') || []
      // 如果用户已登录
      if (this.user) {
        const { data } = await getSearchHistory()
        console.log(data.data.keywords)
        // 合并数组:[...数组,...数组]
        // 把Set转为数组:[...Set对象]
        // 数组去重:[...new Set([...数组,...数组])]
        loaclHistory = [...new Set([
          ...loaclHistory,
          ...data.data.keywords
        ])]
      }
      console.log(loaclHistory)
      this.searchHistory = loaclHistory
    }
  }
}
</script>

<style>
</style>
