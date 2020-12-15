import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage'
Vue.use(Vuex)

const USER_KEY = 'toutiao-user'
export default new Vuex.Store({
  state: {
    // user: null // 当前登录用户的等着状态（token等数据）
    // user: JSON.parse(window.localStorage.getItem('user'))
    user: getItem(USER_KEY)
  },
  mutations: {
    setUser (state, data) {
      state.user = data
      // 未来防止页面刷新数据丢失，我们还需要把数据放到本地存储中，这里仅仅是未来持久化数据
      setItem(USER_KEY, state.user)
    }
  },
  actions: {},
  modules: {}
})
