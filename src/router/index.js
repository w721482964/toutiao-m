import Vue from 'vue'
import VueRouter from 'vue-router'
import { Dialog } from 'vant'
import store from '@/store/index'
Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    // 路由懒加载 和之前做法没区别
    component: () => import('@/views/login/'),
    meta: { requiresAuth: false } // 添加额外的自定义数据
  },
  {
    path: '/',
    component: () => import('@/views/layout/'),
    children: [
      {
        path: '', // 默认子路由
        name: 'home',
        component: () => import('@/views/home/'),
        meta: { requiresAuth: false }

      },
      {
        path: '/qa',
        name: 'qa',
        component: () => import('@/views/qa/'),
        meta: { requiresAuth: true }

      },
      {
        path: '/my',
        name: 'my',
        component: () => import('@/views/my/'),
        meta: { requiresAuth: false }

      },
      {
        path: '/video',
        name: 'video',
        component: () => import('@/views/video/'),
        meta: { requiresAuth: true }

      }
    ]
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search/'),
    meta: { requiresAuth: false }

  },
  {
    path: '/article/:articleId',
    name: 'article',
    component: () => import('@/views/article/'),
    // 将动态路由参数映射到组件的props中，无论是访问还是维护性都很方便
    props: true,
    meta: { requiresAuth: false }

  },
  {
    name: 'user-profile',
    path: '/user/profile',
    component: () => import('@/views/user-profile/'),
    meta: { requiresAuth: false }

  },
  {
    name: 'user-chat',
    path: '/user/chat',
    component: () => import('@/views/user-chat/'),
    meta: { requiresAuth: true }

  }
]

const router = new VueRouter({
  routes
})

// to:要访问的页面路由信息
// from:来自哪个页面的路由信息
// next:放行的标识
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    // 如果已登录,则直接通过
    if (store.state.user) {
      return next()
    }
    // 没有登录 提示是否登录
    // 校验登录状态 提示用户
    Dialog.confirm({
      title: '提示',
      message: '该功能需要登录才能访问,确定要登录?'
    })
      .then(() => { // 确认 执行这里
        router.replace({
          name: 'login',
          query: {
            redirect: router.currentRoute.fullPath
          }
        })
      })
      .catch(() => { // 取消 执行这里
        // on cancel
        // 中断当前导航
        next(false)
      })
  } else {
    // 不需要登录状态的页面,直接过去
    next()
  }
})
export default router
