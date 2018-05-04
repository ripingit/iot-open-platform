import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/signin'
    }, {
      path: '/signin',
      component: resolve => require(['@/components/sign-in'], resolve),
      meta: { title: '登录' }
    }, {
      path: '/signup',
      component: resolve => require(['@/components/sign-up'], resolve),
      meta: { title: '注册' }
    }, {
      path: '/manage',
      component: resolve => require(['@/components/layout/layout'], resolve),
      children: [
        {
          path: '',
          redirect: '/manage/home'
        }, {
          path: 'home',
          name: 'home',
          component: resolve => require(['@/components/home/home'], resolve),
          meta: { title: '首页' }
        }, {
          path: 'appVersion',
          name: 'appVersion',
          component: resolve => require(['@/components/app-version/app-version'], resolve),
          meta: { title: 'app版本' }
        }, {
          path: 'category',
          name: 'category',
          component: resolve => require(['@/components/device-category/device-category'], resolve),
          meta: { title: '设备类别' }
        }, {
          path: 'model',
          name: 'model',
          component: resolve => require(['@/components/device-model/device-model'], resolve),
          meta: { title: '设备型号' }
        }, {
          path: 'key',
          name: 'key',
          component: resolve => require(['@/components/key/key'], resolve),
          meta: { title: 'KEY管理' }
        }, {
          path: 'users',
          name: 'usersManage',
          component: resolve => require(['@/components/users/user-manage'], resolve),
          meta: { title: '用户管理' }
        }, {
          path: 'authention',
          name: 'authention',
          component: resolve => require(['@/components/layout/auth'], resolve),
          meta: { title: '用户认证' }
        }
      ]
    }
  ]
})
export default router

router.afterEach((route) => {
  let documentTitle = '迈科物联开放平台'
  route.matched.forEach((path) => {
    if (path.meta.title) {
      documentTitle += ` - ${path.meta.title}`
    }
  })

  document.title = documentTitle
})
