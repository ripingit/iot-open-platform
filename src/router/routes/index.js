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
    layout[0].children.push(generateRoutes(menu, admin, adminRoute))
  } else if (identity === Vue.prototype.identityCode.COOP) {
    layout[0].children.push(generateRoutes(menu, user, userRoute))
  } else if (identity === Vue.prototype.identityCode.DEALER) {
    user.children = userRoute.concat(dealerRoute)
    layout[0].children.push(user)
  }
  return layout
}
