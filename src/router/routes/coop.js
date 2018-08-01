import store from '@/store/index'
import Vue from 'vue'

let RoutingInterception = (to, from, next) => {
  let authState = store.getters.getAuthState
  if (authState !== Vue.prototype.authCode.PASS) {
    Vue.prototype.vmMsgWarning('未通过认证，无法使用！'); return
  }
  next()
}

export let user = {
  path: 'user',
  component: resolve => require(['@/components/user/layout'], resolve),
  children: []
}

export let userRoute = [
  {
    path: 'home/:index',
    name: 'home',
    component: resolve => require(['@/components/user/home'], resolve),
    meta: { title: '首页' }
  }, {
    path: 'authention',
    name: 'authention',
    component: resolve => require(['@/components/user/auth'], resolve),
    meta: { title: '用户认证', identity: [0] }
  }, {
    path: 'resetPass',
    name: 'resetPass',
    component: resolve => require(['@/components/user/edit-password'], resolve),
    meta: { title: '修改密码', identity: [0] }
  }, {
    path: 'model/:index',
    name: 'model',
    component: resolve => require(['@/components/user/device-model/device-model'], resolve),
    meta: { title: '设备型号', identity: [0] },
    beforeEnter: RoutingInterception
  }, {
    path: 'firmware/:index',
    name: 'firmware',
    component: resolve => require(['@/components/user/firmware/firmware'], resolve),
    meta: { title: '固件管理', identity: [0] },
    beforeEnter: RoutingInterception
  }, {
    path: 'appVersion/:index',
    name: 'appVersion',
    component: resolve => require(['@/components/user/app/app-manage'], resolve),
    meta: { title: 'app版本', identity: [0] },
    beforeEnter: RoutingInterception
  }, {
    path: 'userManagement/:index',
    name: 'userManagement',
    component: resolve => require(['@/components/user/users/user-manage'], resolve),
    meta: { title: '用户管理', identity: [0] },
    beforeEnter: RoutingInterception
  }, {
    path: 'key/:index',
    name: 'key',
    component: resolve => require(['@/components/user/key/key'], resolve),
    meta: { title: 'KEY管理', identity: [1] },
    beforeEnter: RoutingInterception
  }, {
    path: 'dealer/:index',
    name: 'key',
    component: resolve => require(['@/components/user/dealer/dealer'], resolve),
    meta: { title: '合作伙伴', identity: [1] },
    beforeEnter: RoutingInterception
  }, {
    path: 'deviceProd/:index',
    name: 'deviceProd',
    component: resolve => require(['@/components/user/equipment-prod/equipment-prod'], resolve),
    meta: { title: '设备生产', identity: [1] },
    beforeEnter: RoutingInterception
  }
]
