/* eslint-disable no-undef */
import store from "@/store/index"
import i18n from "@/lang/index"
import Vue from "vue"

const vm = new Vue({ i18n })

import { admin, adminRoute } from "./admin"
import { user, userRoute } from "./coop"

const layout = [
  {
    path     : "/manage",
    component: resolve => require([ "@/pages/layout/layout" ], resolve),
    children : [
      {
        path     : "",
        component: resolve => require([ "@/pages/layout/body" ], resolve),
        children : [
          {
            path    : "",
            redirect: "/manage/user/authention"
          }
        ]
      },
      {
        name     : "dealerRegister",
        path     : "dealerRegister",
        component: resolve => require([ "@/pages/user/dealer/register" ], resolve),
        meta     : { title: vm.$t("iot_plat_registered_dealer"), identity: [ 0 ] }
      },
      {
        path     : "coopApply",
        name     : "coopApply",
        component: resolve => require([ "@/pages/user/coop-apply" ], resolve),
        meta     : { title: vm.$t("iot_plat_apply"), identity: [ 0 ] }
      }
    ]
  }
]

function generateRoutes (menu, router, routes) {
  for (const obj of menu) {
    const route = routes.find(o => o.id === obj.cmd_id)
    if (route) {
      router.children.push(route.route)
    }
  }
  return router
}

export function createRoutes (menu) {
  const identity = store.getters.getUserIdentity
  if (identity === Vue.prototype.identityCode.ADMIN) {
    layout[0].children[0].children.push(generateRoutes(menu, admin, adminRoute))
  } else if (identity === Vue.prototype.identityCode.COOP || identity === Vue.prototype.identityCode.DEALER) {
    layout[0].children[0].children.push(generateRoutes(menu, user, userRoute))
  }
  return layout
}
