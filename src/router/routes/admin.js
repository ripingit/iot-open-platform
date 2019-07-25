/* eslint-disable no-undef */
import store from "@/store/index"
import router from "@/router/index"
import i18n from "@/lang/index"
import Vue from "vue"

const vm = new Vue({ i18n })

const RoutingInterception = (to, from, next) => {
  const identity = store.getters.getUserIdentity
  if (identity !== Vue.prototype.identityCode.ADMIN) {
    Vue.prototype.vmMsgError(vm.$t("iot_plat_no_access"))
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
      meta       : { title: vm.$t("iot_plat_change_pwd"), identity: [ 1 ] },
      beforeEnter: RoutingInterception
    },
    {
      path       : "home/:index",
      name       : "home",
      component  : resolve => require([ "@/pages/manage/home" ], resolve),
      meta       : { title: vm.$t("iot_plat_home") },
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
      meta       : { title: vm.$t("iot_plat_device_class"), identity: [ 1 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 2001,
    route: {
      path       : "model/:index",
      name       : "model",
      component  : resolve => require([ "@/pages/manage/device-model/device-model" ], resolve),
      meta       : { title: vm.$t("iot_plat_device_model"), identity: [ 1 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 3001,
    route: {
      path       : "firmware/:index",
      name       : "firmware",
      component  : resolve => require([ "@/pages/manage/firmware/firmware" ], resolve),
      meta       : { title: vm.$t("iot_plat_fireware_manage"), identity: [ 1 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 4001,
    route: {
      path       : "cooperation/:index",
      name       : "cooperation",
      component  : resolve => require([ "@/pages/manage/cooperation/cooperation" ], resolve),
      meta       : { title: vm.$t("iot_plat_coop"), identity: [ 1 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 5001,
    route: {
      path       : "reviewCompany/:index",
      name       : "reviewCompany",
      component  : resolve => require([ "@/pages/manage/review-manage/company" ], resolve),
      meta       : { title: vm.$t("iot_plat_review_manage_company"), identity: [ 1 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 6001,
    route: {
      path       : "reviewModel/:index",
      name       : "reviewModel",
      component  : resolve => require([ "@/pages/manage/review-manage/model" ], resolve),
      meta       : { title: vm.$t("iot_plat_review_manage_model"), identity: [ 1 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 7001,
    route: {
      path       : "reviewFirmware/:index",
      name       : "reviewFirmware",
      component  : resolve => require([ "@/pages/manage/review-manage/firmware" ], resolve),
      meta       : { title: vm.$t("iot_plat_review_manage_fireware"), identity: [ 1 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 8001,
    route: {
      path       : "reviewCategory/:index",
      name       : "reviewCategory",
      component  : resolve => require([ "@/pages/manage/review-manage/category" ], resolve),
      meta       : { title: vm.$t("iot_plat_review_manage_category"), identity: [ 1 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 9001,
    route: {
      path       : "appVersion/:index",
      name       : "appVersion",
      component  : resolve => require([ "@/pages/manage/app-version/app-version" ], resolve),
      meta       : { title: vm.$t("iot_plat_app_version"), identity: [ 1 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 10001,
    route: {
      path       : "admins/:index",
      name       : "admins",
      component  : resolve => require([ "@/pages/manage/admin/admin" ], resolve),
      meta       : { title: vm.$t("iot_plat_platform_users"), identity: [ 1 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 20001,
    route: {
      path       : "coopAuth/:index",
      name       : "coopAuth",
      component  : resolve => require([ "@/pages/manage/admin/coop-auth" ], resolve),
      meta       : { title: vm.$t("iot_plat_coop_permission"), identity: [ 1 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 11001,
    route: {
      path       : "powerHome/:index",
      name       : "powerHome",
      component  : resolve => require([ "@/pages/manage/admin/powerHome" ], resolve),
      meta       : { title: vm.$t("iot_plat_permission_setting"), identity: 1 },
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
      meta       : { title: vm.$t("iot_plat_user_manage"), identity: [ 1 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 13001,
    route: {
      path       : "goodsManage/:index",
      name       : "goodsManage",
      component  : resolve => require([ "@/pages/manage/goods-manage/goods-manage" ], resolve),
      meta       : { title: vm.$t("iot_plat_goods_manage"), identity: [ 1 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 22001,
    route: {
      path       : "ordersManage/:index",
      name       : "ordersManage",
      component  : resolve => require([ "@/pages/manage/goods-manage/order-manage" ], resolve),
      meta       : { title: vm.$t("iot_plat_order_manage"), identity: [ 1 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 14001,
    route: {
      path       : "deviceProd/:index",
      name       : "deviceProd",
      component  : resolve => require([ "@/pages/manage/equipment-prod/equipment-prod" ], resolve),
      meta       : { title: vm.$t("iot_plat_device_produce"), identity: [ 1 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 23001,
    route: {
      path       : "deviceBind/:index",
      name       : "deviceBind",
      component  : resolve => require([ "@/pages/manage/device-bind/device-bind" ], resolve),
      meta       : { title: vm.$t("iot_plat_device_bind"), identity: [ 1 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 20001,
    route: {
      path       : "coopAdmin/:index",
      name       : "coopAdmin",
      component  : resolve => require([ "@/pages/manage/coop-admin/coop-admin" ], resolve),
      meta       : { title: vm.$t("iot_plat_partner_permissions"), identity: [ 1 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 25001,
    route: {
      path       : "baseLanguage/:index",
      name       : "baseLanguage",
      component  : resolve => require([ "@/pages/manage/admin/language-base" ], resolve),
      meta       : { title: vm.$t("iot_plat_multi_language_setting"), identity: [ 1 ] },
      beforeEnter: RoutingInterception
    }
  },
  {
    id   : 26001,
    route: {
      path       : "log/:index",
      name       : "log",
      component  : resolve => require([ "@/pages/manage/admin/logs" ], resolve),
      meta       : { title: vm.$t("iot_plat_operation_log"), identity: [ 1 ] },
      beforeEnter: RoutingInterception
    }
  }
]
