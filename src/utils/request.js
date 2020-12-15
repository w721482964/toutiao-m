/**
 * 请求模块
 */
import axios from 'axios'

// 在非组件模块中获取store必须通过这种方式
// 这里单独加载store和在组件中 this.$store是一种东西
import store from '@/store/'

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/'
})

// 请求拦截器
request.interceptors.request.use(function (config) {
  // Do something before request is sent
  const { user } = store.state
  // 如果用户已登录，统一给接口设置token信息
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }

  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})
// 导出
export default request
