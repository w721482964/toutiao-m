// 用户相关请求模块
import request from '@/utils/request'

// 登录/注册
export const login = data => {
  return request({
    method: 'POST',
    url: '/app/v1_0/authorizations',
    data: data
  })
}

// 请求发送验证码
export const sendSms = mobile => {
  return request({
    method: 'GET',
    url: `/app/v1_0/sms/codes/${mobile}`
  })
}

// 获取登录用户信息
export const getCurrentUser = mobile => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/profile'
    // headers: {
    //   Authorization: `Bearer ${store.state.user.token}`
    // }
  })
}