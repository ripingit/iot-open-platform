/* eslint-disable no-undef */
import store from "@/store/index"
import router from "@/router/index"
import Vue from "vue"

const RoutingInterception = (to, from, next) => {
  const authState = store.getters.getAuthState
  const identity = store.getters.getUserIdentity
  if (identity !== Vue.prototype.identityCode.COOP && identity !== Vue.prototype.identityCode.DEALER) {
    Vue.prototype.vmMsgError("无访问权限")
    router.back(); return
  }
  if (identity === Vue.prototype.identityCode.COOP && authState !== Vue.prototype.authCode.PASS) {
    Vue.prototype.vmMsgWarning("未通过认证，无法使用！"); return
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
      meta     : { title: "修改密码", identity: [ 0 ] }
    },
    {
      path     : "authention",
      name     : "authention",
      component: resolve => require([ "@/pages/user/auth" ], resolve),
      meta     : { title: "用户认证", identity: [ 0 ] }
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
      meta     : { title: "首页" }
    }
  },
  {
    id   : 2001,
    route: {
      path       : "model/:index",
      name       : "model",
      component  : resolve => require([ "@/pages/user/device-model/device-model" ], resolve),
      meta       : { title: "设备型号", identity: [ 0 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 3001,
    route: {
      path       : "firmware/:index",
      name       : "firmware",
      component  : resolve => require([ "@/pages/user/firmware/firmware" ], resolve),
      meta       : { title: "固件管理", identity: [ 0 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 9001,
    route: {
      path       : "appVersion/:index",
      name       : "appVersion",
      component  : resolve => require([ "@/pages/user/app/app-manage" ], resolve),
      meta       : { title: "app版本", identity: [ 0 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 7001,
    route: {
      path       : "reviewFirmware/:index",
      name       : "reviewFirmware",
      component  : resolve => require([ "@/pages/user/review-manage/firmware" ], resolve),
      meta       : { title: "固件审核", identity: [ 0 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 12001,
    route: {
      path       : "userManagement/:index",
      name       : "userManagement",
      component  : resolve => require([ "@/pages/user/users/user-manage" ], resolve),
      meta       : { title: "用户管理", identity: [ 0 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 17001,
    route: {
      path       : "key/:index",
      name       : "key",
      component  : resolve => require([ "@/pages/user/key/key" ], resolve),
      meta       : { title: "KEY管理", identity: [ 1 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 0,
    route: {
      path       : "dealer/:index",
      name       : "key",
      component  : resolve => require([ "@/pages/user/dealer/dealer" ], resolve),
      meta       : { title: "合作伙伴", identity: [ 1 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 14001,
    route: {
      path       : "deviceProd/:index",
      name       : "deviceProd",
      component  : resolve => require([ "@/pages/user/equipment-prod/equipment-prod" ], resolve),
      meta       : { title: "设备生产", identity: [ 1 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 23001,
    route: {
      path       : "deviceBind/:index",
      name       : "deviceBind",
      component  : resolve => require([ "@/pages/user/device-manage/device-bind" ], resolve),
      meta       : { title: "设备绑定", identity: [ 1 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 10001,
    route: {
      path       : "admins/:index",
      name       : "admins",
      component  : resolve => require([ "@/pages/user/admin/admin" ], resolve),
      meta       : { title: "平台用户", identity: [ 1 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 11001,
    route: {
      path     : "powerHome/:index",
      name     : "powerHome",
      component: resolve => require([ "@/pages/user/admin/powerHome" ], resolve),
      meta     : { title: "权限设置", identity: 1 },
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
      meta       : { title: "设备管理", identity: [ 1 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 22001,
    route: {
      path     : "orderManage/:index",
      name     : "orderManage",
      component: resolve => require([ "@/pages/user/goods-manage/order-manage" ], resolve),
      meta     : { title: "订单管理", identity: [ 1 ] }
    }
  },
  {
    id   : 21001,
    route: {
      path     : "productData/:index",
      name     : "productData",
      component: resolve => require([ "@/pages/user/product-data/product-data" ], resolve),
      meta     : { title: "生产数据", identity: [ 1 ] }
    }
  },
  {
    id   : 24001,
    route: {
      path     : "multiLanguage/:index",
      name     : "multiLanguage",
      component: resolve => require([ "@/pages/user/multi-language/multi-language" ], resolve),
      meta     : { title: "多语言", identity: [ 1 ] }
    }
  }
]
