/** 后台菜单路由映射 */
export const coopMenuRouteMap = [
  {
    id  : 16001,
    path: "/manage/user/home",
    icon: "icon-shouye",
    name: "iot_plat_home",
    auth: true
  },
  {
    id  : 12001,
    path: "/manage/user/userManagement",
    icon: "icon-yonghuguanli",
    name: "iot_plat_user_manage",
    auth: true
  },
  {
    id  : 2001,
    path: "/manage/user/model",
    icon: "icon-shebeixinghao",
    name: "iot_plat_device_model",
    auth: true
  },
  {
    id  : 3001,
    path: "/manage/user/firmware",
    icon: "icon-gujianguanli",
    name: "iot_plat_fireware_manage",
    auth: true
  },
  {
    id  : 9001,
    path: "/manage/user/appVersion",
    icon: "icon-APPbanben1",
    name: "iot_plat_app_manage",
    auth: true
  },
  {
    id  : 17001,
    path: "/manage/user/key",
    icon: "icon-KEY",
    name: "iot_plat_key",
    auth: true
  },
  {
    path    : "",
    icon    : "icon-shebeishengchan",
    name    : "iot_plat_device_manage",
    children: [
      {
        id  : 19001,
        path: "/manage/user/deviceManage",
        icon: "",
        name: "iot_plat_data_statistic",
        auth: true
      },
      {
        id  : 14001,
        path: "/manage/user/deviceProd",
        icon: "",
        name: "iot_plat_device_produce",
        auth: true
      },
      {
        id  : 23001,
        path: "/manage/user/deviceBind",
        icon: "",
        name: "iot_plat_device_bind",
        auth: true
      }
    ]
  },
  {
    path    : "",
    icon    : "icon-guanliyuan",
    name    : "iot_plat_admin",
    children: [
      {
        id  : 10001,
        path: "/manage/user/admins",
        icon: "",
        name: "iot_plat_platform_users"
      },
      {
        id  : 11001,
        path: "/manage/user/powerHome",
        icon: "",
        name: "iot_plat_permission_setting"
      }
    ],
    auth: true
  },
  {
    id  : 7001,
    path: "/manage/user/reviewFirmware",
    icon: "icon-shenheguanli",
    name: "iot_plat_fireware_review",
    auth: true
  },
  {
    id  : 22001,
    path: "/manage/user/orderManage",
    icon: "icon-shangpinguanli",
    name: "iot_plat_order_manage",
    auth: true
  },
  {
    id  : 24001,
    path: "/manage/user/multiLanguage",
    icon: "icon-duoyuyan",
    name: "iot_plat_multi_language",
    auth: true
  }
]

/*
 * {
 *     id: 21001,
 *     path: '/manage/user/productData',
 *     icon: 'icon-yonghuguanli',
 *     name: '生产数据',
 *     auth: true
 *   }
 */

/*
 * , {
 *     id: 0,
 *     path: '/manage/user/dealer',
 *     icon: 'icon-KEY',
 *     name: '合作伙伴',
 *     auth: true
 *   }
 */
