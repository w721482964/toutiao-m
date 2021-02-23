<template>
  <div id="app">
    <!-- 路由出口 -->
    <!-- 利用keep-alive 实现组件缓存
    keep-alive仅对该路由出口渲染的组件有效
     -->
    <keep-alive :include="cachePages">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'App',
  computed: {
    ...mapState(['cachePages'])
  }
}
</script>

<style lang="less" scoped>
</style>
