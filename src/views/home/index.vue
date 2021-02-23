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
        to="/search"
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
      <!-- 寒冰按钮定位把列表最后的位置给挡住了，
      解决帮扶的就是再这里添加一个占位元素 -->
      <div slot="nav-right" class="wap-nav-placeholder"></div>
      <div
        @click="isChannelEditShow = true"
        slot="nav-right"
        class="wap-nav-wrap"
      >
        <van-icon name="wap-nav" />
      </div>
    </van-tabs>
    <!-- /文章频道列表 -->

    <!-- 弹出框 -->
    <van-popup
      v-model="isChannelEditShow"
      class="channel-edit-popup"
      position="bottom"
      closeable
      close-icon-position="top-left"
      :style="{ height: '100%' }"
      get-container="body"
    >
      <!-- 模板中的$event表示事件参数 -->
      <ChannelEdit
        :user-channel="channels"
        :active="active"
        @close="isChannelEditShow = false"
        @updataactive="active = $event"
      ></ChannelEdit>
    </van-popup>
    <!-- /弹出框 -->
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './component/article-list'
import ChannelEdit from './component/channel-edit'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'

export default {
  name: 'HomeIndex',
  components: {
    ArticleList,
    ChannelEdit
  },
  data () {
    return {
      active: 0, // 控制被激活的标签
      channels: [], // 频道列表
      isChannelEditShow: false // 控制弹出框
    }
  },
  created () {
    this.loadingChannels()
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    async loadingChannels () {
      let channels = []
      if (this.user) {
        // 已登录，请求获取线上的用户频道列表数据
        const { data } = await getUserChannels()
        channels = data.data.channels
      } else {
        // 没有登录，判断是否有本地存储
        const loaclChannels = getItem('user-channels')

        // 如果有本地存储的频道列表则使用
        if (loaclChannels) {
          channels = loaclChannels
        } else {
          // 用户没有登录，也没有本地存储的频道，那就请求获取默认推荐的频道列表
          const { data } = await getUserChannels()
          channels = data.data.channels
        }
      }
      // 把处理好的数据放到 data 中以供模板使用
      this.channels = channels
    }
    // updata (index) {
    //   this.active = index
    //   // console.log(index)
    // }
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
  .wap-nav-wrap {
    position: fixed;
    right: 0;
    height: 42px;
    width: 33px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    opacity: 0.9;
  }
  .wap-nav-placeholder {
    width: 33px;
    flex-shrink: 0;
  }
}
</style>
