import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/index'

Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/signin'
    }, {
      path: '/login',
      name: 'login',
      component: resolve => require(['@/components/manage/sign-in'], resolve),
      meta: { title: '登录' }
    }, {
      path: '/signin',
      component: resolve => require(['@/components/user/sign-in'], resolve),
      meta: { title: '登录' }
    }, {
      path: '/signup',
      component: resolve => require(['@/components/user/sign-up'], resolve),
      meta: { title: '注册' }
    }, {
      path: '/qrcode/:appName/:company',
      component: resolve => require(['@/components/qrcode'], resolve),
      meta: { title: '二维码' }
    }
  ]
})

router.beforeEach((to, from, next) => {
  let filter = ['/signin', '/signup', '/login', '/qrcode']

  if (filter.includes(to.fullPath) || to.fullPath.indexOf('/qrcode') !== -1) {
    next(); return
  }
  if (store.getters.getUserIdentity !== Vue.prototype.identityCode.ADMIN &&
    store.getters.getUserIdentity !== Vue.prototype.identityCode.COOP) {
    next(from.fullPath); return
  }
  next()
})

router.afterEach((route) => {
  let documentTitle = '迈科物联开放平台'
  route.matched.forEach((path) => {
    if (path.meta.title) {
      documentTitle += ` - ${path.meta.title}`
    }
  })

  document.title = documentTitle
})

export default router
