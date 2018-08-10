import store from '@/store/index'
import Vue from 'vue'

import { admin, adminRoute } from './admin'
import { user, userRoute } from './coop'

let layout = [
  {
    path: '/manage',
    component: resolve => require(['@/components/layout/layout'], resolve),
    children: [
      {
        path: '',
        component: resolve => require(['@/components/layout/body'], resolve),
        children: [
          {
            path: '',
            redirect: '/manage/user/authention'
          }
        ]
      }, {
        name: 'dealerRegister',
        path: 'dealerRegister',
        component: resolve => require(['@/components/user/dealer/register'], resolve),
        meta: { title: '注册经销商', identity: [0] }
      }, {
        path: 'coopApply',
        name: 'coopApply',
        component: resolve => require(['@/components/coop-apply'], resolve),
        meta: { title: '申请', identity: [0] }
      }
    ]
  }
]

function generateRoutes (menu, router, routes) {
  for (let obj of menu) {
    let route = routes.find(o => o.id === obj.cmd_id)
    if (route) {
      router.children.push(route.route)
    }
  }
  return router
}

export function createRoutes (menu) {
  let identity = store.getters.getUserIdentity
  if (identity === Vue.prototype.identityCode.ADMIN) {
    layout[0].children[0].children.push(generateRoutes(menu, admin, adminRoute))
  } else if (identity === Vue.prototype.identityCode.COOP) {
    layout[0].children[0].children.push(generateRoutes(menu, user, userRoute))
  }
  return layout
}
