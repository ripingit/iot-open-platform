/** 
 * 后台菜单路由映射 
 * name字段的值为多语言的标识字段
 */
export const adminMenuRouteMap = [
  {
    id  : 12001,
    path: "/manage/admin/userManage",
    icon: "icon-yonghuguanli",
    name: "iot_plat_user_manage",
    auth: true
  },
  {
    id  : 1001,
    path: "/manage/admin/category",
    icon: "icon-shebeileibie",
    name: "iot_plat_device_class",
    auth: true
  },
  {
    id  : 2001,
    path: "/manage/admin/model",
    icon: "icon-shebeixinghao",
    name: "iot_plat_device_model",
    auth: true
  },
  {
    id  : 3001,
    path: "/manage/admin/firmware",
    icon: "icon-gujianguanli",
    name: "iot_plat_fireware_manage",
    auth: true
  },
  {
    id  : 4001,
    path: "/manage/admin/cooperation",
    icon: "icon-hezuo",
    name: "iot_plat_coop",
    auth: true
  },
  {
    path    : "",
    icon    : "icon-shenheguanli",
    name    : "iot_plat_review_manage",
    children: [
      {
        id  : 5001,
        path: "/manage/admin/reviewCompany",
        icon: "",
        name: "iot_plat_company"
      },
      {
        id  : 6001,
        path: "/manage/admin/reviewModel",
        icon: "",
        name: "iot_plat_model"
      },
      {
        id  : 7001,
        path: "/manage/admin/reviewFirmware",
        icon: "",
        name: "iot_plat_fireware"
      },
      {
        id  : 8001,
        path: "/manage/admin/reviewCategory",
        icon: "",
        name: "iot_plat_class"
      }
    ],
    auth: true
  },
  {
    id  : 9001,
    path: "/manage/admin/appVersion",
    icon: "icon-APPbanben1",
    name: "iot_plat_app_manage",
    auth: true
  },
  {
    path    : "",
    icon    : "icon-guanliyuan",
    name    : "iot_plat_admin",
    children: [
      {
        id  : 10001,
        path: "/manage/admin/admins",
        icon: "",
        name: "iot_plat_platform_users"
      },
      {
        id  : 11001,
        path: "/manage/admin/powerHome",
        icon: "",
        name: "iot_plat_permission_setting"
      },
      {
        id  : 20001,
        path: "/manage/admin/coopAuth",
        icon: "",
        name: "iot_plat_coop_permission"
      },
      {
        id  : 25001,
        path: "/manage/admin/baseLanguage",
        icon: "",
        name: "iot_plat_multi_language_setting"
      },
      {
        id  : 26001,
        path: "/manage/admin/log",
        icon: "",
        name: "iot_plat_operation_log"
      }
    ],
    auth: true
  },
  {
    path    : "",
    icon    : "icon-shangpinguanli",
    name    : "iot_plat_goods_manage",
    children: [
      {
        id  : 13001,
        path: "/manage/admin/goodsManage",
        icon: "",
        name: "iot_plat_goods"
      },
      {
        id  : 22001,
        path: "/manage/admin/ordersManage",
        icon: "",
        name: "iot_plat_order"
      }
    ],
    auth: true
  },
  {
    path    : "",
    icon    : "icon-shebeishengchan",
    name    : "iot_plat_device_manage",
    children: [
      {
        id  : 14001,
        path: "/manage/admin/deviceProd",
        icon: "",
        name: "iot_plat_device_produce"
      }
      /*
       * {
       *   id  : 23001,
       *   path: "/manage/admin/deviceBind",
       *   icon: "",
       *   name: "设备绑定"
       * }
       */
    ],
    auth: true
  }
]

/*
 * , {
 *     id: 20001,
 *     path: '/manage/admin/coopAdmin',
 *     icon: 'icon-shebeishengchan',
 *     name: '合作商权限',
 *     auth: true
 *   }
 */
