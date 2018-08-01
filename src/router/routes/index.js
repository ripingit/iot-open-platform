import store from '@/store/index'
import Vue from 'vue'

import { admin, adminRoute } from './admin'
import { user, userRoute } from './coop'
import { dealerRoute } from './dealer'

let layout = [
  {
    path: '/manage',
    component: resolve => require(['@/components/layout/layout'], resolve),
    children: [
      {
        path: '',
        redirect: '/manage/user/authention'
      }
    ]
  }
]

export function createRoutes (menu) {
  let identity = store.getters.getUserIdentity
  if (identity === Vue.prototype.identityCode.ADMIN) {
    for (let obj of menu) {
      let route = adminRoute.find(o => o.id === obj.cmd_id)
      if (route) {
        admin.children.push(route.route)
      }
    }
    layout[0].children.push(admin)
  } else if (identity === Vue.prototype.identityCode.COOP) {
    user.children = userRoute.concat(dealerRoute)
    layout[0].children.push(user)
  }
  return layout
}
