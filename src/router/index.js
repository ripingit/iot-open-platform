import Vue from 'vue'
import Router from 'vue-router'

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
      path: '/manage',
      component: resolve => require(['@/components/layout/layout'], resolve),
      children: [
        {
          path: '',
          redirect: '/manage/user/authention'
        }, {
          path: 'home',
          name: 'home',
          component: resolve => require(['@/components/home/home'], resolve),
          meta: { title: '首页' }
        }, {
          path: 'user',
          component: resolve => require(['@/components/user/layout'], resolve),
          children: [
            {
              path: 'authention',
              name: 'authention',
              component: resolve => require(['@/components/user/auth'], resolve),
              meta: { title: '用户认证' }
            }, {
              path: 'resetPass',
              name: 'resetPass',
              component: resolve => require(['@/components/user/edit-password'], resolve),
              meta: { title: '修改密码' }
            }, {
              path: 'model',
              name: 'model',
              component: resolve => require(['@/components/user/device-model/device-model'], resolve),
              meta: { title: '设备型号' }
            }, {
              path: 'firmware',
              name: 'firmware',
              component: resolve => require(['@/components/user/firmware/firmware'], resolve),
              meta: { title: '固件管理' }
            }, {
              path: 'appVersion',
              name: 'appVersion',
              component: resolve => require(['@/components/user/app/app-manage'], resolve),
              meta: { title: 'app版本' }
            }
          ]
        }, {
          path: 'admin',
          component: resolve => require(['@/components/manage/layout'], resolve),
          children: [
            {
              path: 'appVersion',
              name: 'appVersion',
              component: resolve => require(['@/components/manage/app-version/app-version'], resolve),
              meta: { title: 'app版本' }
            }, {
              path: 'category',
              name: 'category',
              component: resolve => require(['@/components/manage/device-category/device-category'], resolve),
              meta: { title: '设备类别' }
            }, {
              path: 'model',
              name: 'model',
              component: resolve => require(['@/components/manage/device-model/device-model'], resolve),
              meta: { title: '设备型号' }
            }, {
              path: 'key',
              name: 'key',
              component: resolve => require(['@/components/manage/key/key'], resolve),
              meta: { title: 'KEY管理' }
            }, {
              path: 'users',
              name: 'usersManage',
              component: resolve => require(['@/components/manage/users/user-manage'], resolve),
              meta: { title: '用户管理' }
            }, {
              path: 'firmware',
              name: 'firmware',
              component: resolve => require(['@/components/manage/firmware/firmware'], resolve),
              meta: { title: '固件管理' }
            }, {
              path: 'cooperation',
              name: 'cooperation',
              component: resolve => require(['@/components/manage/cooperation/cooperation'], resolve),
              meta: { title: '合作' }
            }, {
              path: 'reviewCompany',
              name: 'reviewCompany',
              component: resolve => require(['@/components/manage/review-manage/company'], resolve),
              meta: { title: '审核管理-公司' }
            }, {
              path: 'reviewFirmware',
              name: 'reviewFirmware',
              component: resolve => require(['@/components/manage/review-manage/firmware'], resolve),
              meta: { title: '审核管理-固件' }
            }, {
              path: 'reviewCategory',
              name: 'reviewCategory',
              component: resolve => require(['@/components/manage/review-manage/category'], resolve),
              meta: { title: '审核管理-类别' }
            }, {
              path: 'reviewModel',
              name: 'reviewModel',
              component: resolve => require(['@/components/manage/review-manage/model'], resolve),
              meta: { title: '审核管理-型号' }
            }, {
              path: 'admins',
              name: 'admins',
              component: resolve => require(['@/components/manage/admin/admin'], resolve),
              meta: { title: '管理员' }
            }
          ]
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  let filter = ['/signin', '/signup', '/login']

  if (filter.includes(to.fullPath)) {
    next(); return
  }

  if (!sessionStorage['isLogin']) {
    next('/signin')
  } else {
    next()
  }
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
