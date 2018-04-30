import Vue from 'vue'
import Router from 'vue-router'

import HomeComponent from '@/components/home/home.vue'
import AppVersionComponent from '@/components/app-version/app-version.vue'
import DeviceCateComponent from '@/components/device-category/device-category.vue'
import DeviceModelComponent from '@/components/device-model/device-model.vue'
import KeyComponent from '@/components/key/key.vue'
import UserComponent from '@/components/users/user-manage.vue'

import SignInComponent from '@/components/sign-in.vue'
import SignUpComponent from '@/components/sign-up.vue'
import LayoutComponent from '@/components/layout/layout.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/singin'
    }, {
      path: '/singin',
      component: SignInComponent
    }, {
      path: '/signup',
      component: SignUpComponent
    }, {
      path: '/layout',
      component: LayoutComponent,
      children: [
        {
          path: '',
          redirect: '/layout/home'
        }, {
          path: 'home',
          name: 'home',
          component: HomeComponent
        }, {
          path: 'appVersion',
          name: 'appVersion',
          component: AppVersionComponent
        }, {
          path: 'category',
          name: 'category',
          component: DeviceCateComponent
        }, {
          path: 'model',
          name: 'model',
          component: DeviceModelComponent
        }, {
          path: 'key',
          name: 'key',
          component: KeyComponent
        }, {
          path: 'users',
          name: 'usersManage',
          component: UserComponent
        }
      ]
    }
  ]
})
