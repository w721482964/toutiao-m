<template>
  <div class="search-suggestion">
    <van-cell
      :key="index"
      v-for="(str, index) in suggestions"
      icon="search"
      @click="$emit('search', str)"
    >
      <div slot="title" v-html="highlight(str)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'
import { debounce } from 'lodash'
// import _ from 'lodash'
// // 函数防抖
// // const fn = _.debounce(function () {
// //   console.log(22)
// // }, 1000)
// // setInterval(function () {
// //   fn()
// // }, 1200)

export default {
  name: 'SearchSuggestion',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      suggestions: [] // 联想建议数据列表
    }
  },
  watch: {
    // 属性名：受监视的数据的名称
    // searchResult () {
    //   console.log(11)
    // }

    // 这才是完整写法
    searchText: {
      // 当数据发生变化时会执行handler处理函数
      // async handler () {
      //   // 找到数据接口
      //   // 请求获取数据
      //   // 模板绑定展示
      //   const { data } = await getSearchSuggestions(this.searchText)
      //   this.suggestions = data.data.options
      // }

      // debounce 函数
      // 参数1：函数
      // 参数2：时间
      // 返回值：防抖处理的函数
      handler: debounce(async function () {
        const { data } = await getSearchSuggestions(this.searchText)
        this.suggestions = data.data.options
      }, 500),
      immediate: true // 该回调将会在侦听开始之后被立即调用
    }
  },
  methods: {
    highlight (str) {
      // console.log(str)
      return str.replace(new RegExp(this.searchText, 'gi'), `<span style="color:red">${this.searchText}</span>`)
    },
    fn (str) {
      console.log(str)
    }
  }
}
</script>

<style>
</style>
