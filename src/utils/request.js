/**
 * 请求模块
 */
import axios from 'axios'
import { Toast } from 'vant'
// 在非组件模块中获取store必须通过这种方式
// 这里单独加载store和在组件中 this.$store是一种东西
import store from '@/store/'
import JSONbig from 'json-bigint'
import router from '@/router/'

const refreshTokenReq = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/'
})

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/', // 基础路径
  transformResponse: [function (data) {
    // 后端返回的数据肯不是 JSON 格式字符串
    // 如果不是的话，那么 JSONbig.parse 调用就会报错
    // 所有我们使用 try-catch 来捕获异常，处理异常的发生
    try {
      // 如果转换成功，则直接把结果返回
      return JSONbig.parse(data)
    } catch (err) {
      // console.log('转换失败', err)
      // 如果转换失败了，则进入这里
      // 我们在这里把数据原封不动的直接返回给请求使用
      return data
    }
    // axios默认在内部使用 JSON.parse 来转换处理原始数据
  }]
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

// 响应拦截器
request.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  // 对 2xx 的状态码都会进入到这里
  return response
}, async function (error) {
  // 对响应错误做点什么
  // 超过 2xx 的状态码都会进入这里
  console.dir(error)
  const status = error.response.status
  if (status === 400) {
    // 客户端请求参数错误
    Toast.fail('客户端请求参数错误')
  } else if (status === 401) {
    // token无效
    // 如果没有user 或者 user.token 直接去登录
    const { user } = store.state
    if (!user || !user.token) {
      // 直接跳转到登录页
      return redirectLogin()
    }
    // 使用refresh_token请求获取新的 token
    try {
      const { data } = await refreshTokenReq({
        method: 'PUT',
        url: '/app/v1_0/authorizations',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })
      console.log(data)
      // 拿到新的 token 之后把它重新更新到容器中
      user.token = data.data.token
      store.commit('setUser', user)
      // 把失败的请求重新发出去
      // 这里使用request发请求,它会走自己的拦截器
      // 它的请求拦截器中通过 store 容器访问 token 数据
      return request(error.config)
    } catch (err) {
      // 刷新 token 都失败了,直接跳转登录页
      redirectLogin()
    }
  } else if (status === 403) {
    // 没有权限操作
    Toast.fail('没有权限操作')
  } else if (status >= 500) {
    // 服务器异常
    Toast.fail('服务器异常')
  }
  // 抛出异常
  return Promise.reject(error)
})

function redirectLogin () {
  router.replace({
    name: 'login',
    // 传递查询参数,查询参数会以 ? 作为分隔符放到 url 的后面
    query: {
      // 数据名是自己起的
      // router.currentRoute 和我们在组件中获取的
      redirect: router.currentRoute.fullPath
    }
  })
}
// 导出
export default request
