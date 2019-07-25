/* eslint-disable no-undef */
import store from "@/store/index"
import router from "@/router/index"
import i18n from "@/lang/index"
import Vue from "vue"

const vm = new Vue({ i18n })

const RoutingInterception = (to, from, next) => {
  const authState = store.getters.getAuthState
  const identity = store.getters.getUserIdentity
  if (identity !== Vue.prototype.identityCode.COOP && identity !== Vue.prototype.identityCode.DEALER) {
    Vue.prototype.vmMsgError(vm.$t("iot_plat_no_access"))
    router.back(); return
  }
  if (identity === Vue.prototype.identityCode.COOP && authState !== Vue.prototype.authCode.PASS) {
    Vue.prototype.vmMsgWarning(vm.$t("iot_plat_not_available_none_cert")); return
  }
  next()
}

export const user = {
  path     : "user",
  component: resolve => require([ "@/pages/user/layout" ], resolve),
  children : [
    {
      path     : "resetPass",
      name     : "resetPass",
      component: resolve => require([ "@/pages/user/edit-password" ], resolve),
      meta     : { title: vm.$t("iot_plat_change_pwd"), identity: [ 0 ] }
    },
    {
      path     : "authention",
      name     : "authention",
      component: resolve => require([ "@/pages/user/auth" ], resolve),
      meta     : { title: vm.$t("iot_plat_user_cert"), identity: [ 0 ] }
    }
  ]
}

export const userRoute = [
  {
    id   : 16001,
    route: {
      path     : "home/:index",
      name     : "home",
      component: resolve => require([ "@/pages/user/home" ], resolve),
      meta     : { title: vm.$t("iot_plat_home") }
    }
  },
  {
    id   : 2001,
    route: {
      path       : "model/:index",
      name       : "model",
      component  : resolve => require([ "@/pages/user/device-model/device-model" ], resolve),
      meta       : { title: vm.$t("iot_plat_device_model"), identity: [ 0 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 3001,
    route: {
      path       : "firmware/:index",
      name       : "firmware",
      component  : resolve => require([ "@/pages/user/firmware/firmware" ], resolve),
      meta       : { title: vm.$t("iot_plat_fireware_manage"), identity: [ 0 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 9001,
    route: {
      path       : "appVersion/:index",
      name       : "appVersion",
      component  : resolve => require([ "@/pages/user/app/app-manage" ], resolve),
      meta       : { title: vm.$t("iot_plat_app_version"), identity: [ 0 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 7001,
    route: {
      path       : "reviewFirmware/:index",
      name       : "reviewFirmware",
      component  : resolve => require([ "@/pages/user/review-manage/firmware" ], resolve),
      meta       : { title: vm.$t("iot_plat_fireware_review"), identity: [ 0 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 12001,
    route: {
      path       : "userManagement/:index",
      name       : "userManagement",
      component  : resolve => require([ "@/pages/user/users/user-manage" ], resolve),
      meta       : { title: vm.$t("iot_plat_user_manage"), identity: [ 0 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 17001,
    route: {
      path       : "key/:index",
      name       : "key",
      component  : resolve => require([ "@/pages/user/key/key" ], resolve),
      meta       : { title: vm.$t("iot_plat_key_manage"), identity: [ 1 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 0,
    route: {
      path       : "dealer/:index",
      name       : "key",
      component  : resolve => require([ "@/pages/user/dealer/dealer" ], resolve),
      meta       : { title: vm.$t("iot_plat_partner"), identity: [ 1 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 14001,
    route: {
      path       : "deviceProd/:index",
      name       : "deviceProd",
      component  : resolve => require([ "@/pages/user/equipment-prod/equipment-prod" ], resolve),
      meta       : { title: vm.$t("iot_plat_device_produce"), identity: [ 1 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 23001,
    route: {
      path       : "deviceBind/:index",
      name       : "deviceBind",
      component  : resolve => require([ "@/pages/user/device-manage/device-bind" ], resolve),
      meta       : { title: vm.$t("iot_plat_device_bind"), identity: [ 1 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 10001,
    route: {
      path       : "admins/:index",
      name       : "admins",
      component  : resolve => require([ "@/pages/user/admin/admin" ], resolve),
      meta       : { title: vm.$t("iot_plat_platform_users"), identity: [ 1 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 11001,
    route: {
      path     : "powerHome/:index",
      name     : "powerHome",
      component: resolve => require([ "@/pages/user/admin/powerHome" ], resolve),
      meta     : { title: vm.$t("iot_plat_permission_setting"), identity: 1 },
      children : [ {
        path     : "/",
        name     : "power",
        component: resolve => require([ "@/pages/user/admin/power" ], resolve)
      },
      {
        path     : "VisitPower/:group_id",
        name     : "VisitPower",
        component: resolve => require([ "@/pages/user/admin/VisitPower" ], resolve)
      },
      {
        path     : "memberPower/:group_id",
        name     : "memberPower",
        component: resolve => require([ "@/pages/user/admin/memberPower" ], resolve)
      } ],
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 19001,
    route: {
      path       : "deviceManage/:index",
      name       : "deviceManage",
      component  : resolve => require([ "@/pages/user/device-manage/device-statistics" ], resolve),
      meta       : { title: vm.$t("iot_plat_device_manage"), identity: [ 1 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 22001,
    route: {
      path     : "orderManage/:index",
      name     : "orderManage",
      component: resolve => require([ "@/pages/user/goods-manage/order-manage" ], resolve),
      meta     : { title: vm.$t("iot_plat_order_manage"), identity: [ 1 ] }
    }
  },
  {
    id   : 21001,
    route: {
      path     : "productData/:index",
      name     : "productData",
      component: resolve => require([ "@/pages/user/product-data/product-data" ], resolve),
      meta     : { title: vm.$t("iot_plat_produce_data"), identity: [ 1 ] }
    }
  },
  {
    id   : 24001,
    route: {
      path     : "multiLanguage/:index",
      name     : "multiLanguage",
      component: resolve => require([ "@/pages/user/multi-language/multi-language" ], resolve),
      meta     : { title: vm.$t("iot_plat_multi_language"), identity: [ 1 ] }
    }
  }
]
