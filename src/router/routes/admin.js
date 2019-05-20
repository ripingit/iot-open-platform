/* eslint-disable no-undef */
import store from "@/store/index"
import router from "@/router/index"
import Vue from "vue"

const RoutingInterception = (to, from, next) => {
  const identity = store.getters.getUserIdentity
  if (identity !== Vue.prototype.identityCode.ADMIN) {
    Vue.prototype.vmMsgError("无访问权限")
    router.back(); return
  }
  next()
}

export const admin = {
  path     : "admin",
  component: resolve => require([ "@/pages/manage/layout" ], resolve),
  children : [
    {
      path       : "resetAdminPass",
      name       : "resetAdminPass",
      component  : resolve => require([ "@/pages/manage/edit-password" ], resolve),
      meta       : { title: "修改密码", identity: [ 1 ] },
      beforeEnter: RoutingInterception
    },
    {
      path       : "home/:index",
      name       : "home",
      component  : resolve => require([ "@/pages/manage/home" ], resolve),
      meta       : { title: "首页" },
      beforeEnter: RoutingInterception
    }
  ]
}

export const adminRoute = [
  {
    id   : 1001,
    route: {
      path       : "category/:index",
      name       : "category",
      component  : resolve => require([ "@/pages/manage/device-category/device-category" ], resolve),
      meta       : { title: "设备类别", identity: [ 1 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 2001,
    route: {
      path       : "model/:index",
      name       : "model",
      component  : resolve => require([ "@/pages/manage/device-model/device-model" ], resolve),
      meta       : { title: "设备型号", identity: [ 1 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 3001,
    route: {
      path       : "firmware/:index",
      name       : "firmware",
      component  : resolve => require([ "@/pages/manage/firmware/firmware" ], resolve),
      meta       : { title: "固件管理", identity: [ 1 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 4001,
    route: {
      path       : "cooperation/:index",
      name       : "cooperation",
      component  : resolve => require([ "@/pages/manage/cooperation/cooperation" ], resolve),
      meta       : { title: "合作", identity: [ 1 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 5001,
    route: {
      path       : "reviewCompany/:index",
      name       : "reviewCompany",
      component  : resolve => require([ "@/pages/manage/review-manage/company" ], resolve),
      meta       : { title: "审核管理-公司", identity: [ 1 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 6001,
    route: {
      path       : "reviewModel/:index",
      name       : "reviewModel",
      component  : resolve => require([ "@/pages/manage/review-manage/model" ], resolve),
      meta       : { title: "审核管理-型号", identity: [ 1 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 7001,
    route: {
      path       : "reviewFirmware/:index",
      name       : "reviewFirmware",
      component  : resolve => require([ "@/pages/manage/review-manage/firmware" ], resolve),
      meta       : { title: "审核管理-固件", identity: [ 1 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 8001,
    route: {
      path       : "reviewCategory/:index",
      name       : "reviewCategory",
      component  : resolve => require([ "@/pages/manage/review-manage/category" ], resolve),
      meta       : { title: "审核管理-类别", identity: [ 1 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 9001,
    route: {
      path       : "appVersion/:index",
      name       : "appVersion",
      component  : resolve => require([ "@/pages/manage/app-version/app-version" ], resolve),
      meta       : { title: "app版本", identity: [ 1 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 10001,
    route: {
      path       : "admins/:index",
      name       : "admins",
      component  : resolve => require([ "@/pages/manage/admin/admin" ], resolve),
      meta       : { title: "平台用户", identity: [ 1 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 20001,
    route: {
      path       : "coopAuth/:index",
      name       : "coopAuth",
      component  : resolve => require([ "@/pages/manage/admin/coop-auth" ], resolve),
      meta       : { title: "合作权限", identity: [ 1 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 11001,
    route: {
      path       : "powerHome/:index",
      name       : "powerHome",
      component  : resolve => require([ "@/pages/manage/admin/powerHome" ], resolve),
      meta       : { title: "权限设置", identity: 1 },
      beforeEnter: RoutingInterception,
      children   : [ {
        path       : "/",
        name       : "power",
        component  : resolve => require([ "@/pages/manage/admin/power" ], resolve),
        beforeEnter: RoutingInterception
      },
      {
        path       : "VisitPower/:group_id",
        name       : "VisitPower",
        component  : resolve => require([ "@/pages/manage/admin/VisitPower" ], resolve),
        beforeEnter: RoutingInterception
      },
      {
        path       : "memberPower/:group_id",
        name       : "memberPower",
        component  : resolve => require([ "@/pages/manage/admin/memberPower" ], resolve),
        beforeEnter: RoutingInterception
      } ]
    }
  },
  {
    id   : 12001,
    route: {
      path       : "userManage/:index",
      name       : "userManage",
      component  : resolve => require([ "@/pages/manage/users/user-manage" ], resolve),
      meta       : { title: "用户管理", identity: [ 1 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 13001,
    route: {
      path       : "goodsManage/:index",
      name       : "goodsManage",
      component  : resolve => require([ "@/pages/manage/goods-manage/goods-manage" ], resolve),
      meta       : { title: "商品管理", identity: [ 1 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 22001,
    route: {
      path       : "ordersManage/:index",
      name       : "ordersManage",
      component  : resolve => require([ "@/pages/manage/goods-manage/order-manage" ], resolve),
      meta       : { title: "订单管理", identity: [ 1 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 14001,
    route: {
      path       : "deviceProd/:index",
      name       : "deviceProd",
      component  : resolve => require([ "@/pages/manage/equipment-prod/equipment-prod" ], resolve),
      meta       : { title: "设备生产", identity: [ 1 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 23001,
    route: {
      path       : "deviceBind/:index",
      name       : "deviceBind",
      component  : resolve => require([ "@/pages/manage/device-bind/device-bind" ], resolve),
      meta       : { title: "设备绑定", identity: [ 1 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 20001,
    route: {
      path       : "coopAdmin/:index",
      name       : "coopAdmin",
      component  : resolve => require([ "@/pages/manage/coop-admin/coop-admin" ], resolve),
      meta       : { title: "合作商权限", identity: [ 1 ] },
      beforeEnter: RoutingInterception
    }
  }
]
