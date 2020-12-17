<template>
  <div class="home-container">
    <!-- 头部 -->
    <van-nav-bar class="app-nav-bar">
      <van-button
        class="search-btn"
        slot="title"
        icon="search"
        type="info"
        size="small"
        round
        >搜索</van-button
      >
    </van-nav-bar>
    <!-- /头部 -->

    <!-- 文章频道列表 -->
    <van-tabs v-model="active" class="channel-tabs">
      <van-tab :key="item.id" v-for="item in channels" :title="item.name">
        <!-- 频道的文章列表 -->
        <ArticleList :channel="item"></ArticleList>
        <!-- /频道的文章列表 -->
      </van-tab>
    </van-tabs>
    <!-- /文章频道列表 -->
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './component/article-list'
export default {
  name: 'HomeIndex',
  components: {
    ArticleList
  },
  data () {
    return {
      active: 0, // 控制被激活的标签
      channels: [] // 频道列表
    }
  },
  created () {
    this.loadingChannels()
  },
  methods: {
    async loadingChannels () {
      const { data } = await getUserChannels()
      console.log(data)
      this.channels = data.data.channels
      console.log(this.channels)
    }
  }
}

</script>

<style lang="less" scoped>
.home-container {
  .app-nav-bar {
    /deep/ .van-nav-bar__title {
      max-width: none;
    }
    .search-btn {
      width: 277px;
      height: 32px;
      background-color: #5babfb;
      border: none;
      .van-button__text {
        font-size: 14px;
      }
      .van-icon {
        font-size: 16px;
      }
    }
  }
  .channel-tabs {
    /deep/.van-tab {
      border-right: 1px solid #edeff3;
      border-bottom: 1px solid #edeff3;
    }
    /deep/.van-tabs__line {
      width: 15px;
      height: 3px;
      bottom: 20px;
      background-color: #3296fa;
    }
  }
}
</style>
