/** 后台菜单路由映射 */
export const coopMenuRouteMap = [
  {
    id: 16001,
    path: '/manage/user/home',
    icon: 'icon-shouye',
    name: '首页',
    auth: true
  }, {
    id: 12001,
    path: '/manage/user/userManagement',
    icon: 'icon-yonghuguanli',
    name: '用户管理',
    auth: true
  }, {
    id: 2001,
    path: '/manage/user/model',
    icon: 'icon-shebeixinghao',
    name: '设备型号',
    auth: true
  }, {
    id: 3001,
    path: '/manage/user/firmware',
    icon: 'icon-gujianguanli',
    name: '固件管理',
    auth: true
  }, {
    id: 9001,
    path: '/manage/user/appVersion',
    icon: 'icon-APPbanben1',
    name: 'APP管理',
    auth: true
  }, {
    id: 17001,
    path: '/manage/user/key',
    icon: 'icon-KEY',
    name: 'KEY',
    auth: true
  }, {
    id: 14001,
    path: '/manage/user/deviceProd',
    icon: 'icon-shebeishengchan',
    name: '设备生产',
    auth: true
  }, {
    path: '',
    icon: 'icon-guanliyuan',
    name: '管理员',
    children: [
      {
        id: 10001,
        path: '/manage/user/admins',
        icon: '',
        name: '平台用户'
      }, {
        id: 11001,
        path: '/manage/user/powerHome',
        icon: '',
        name: '权限设置'
      }
    ],
    auth: true
  }, {
    id: 7001,
    path: '/manage/user/reviewFirmware',
    icon: 'icon-shenheguanli',
    name: '固件审核',
    auth: true
  }, {
    id: 19001,
    path: '/manage/user/deviceManage',
    icon: 'icon-yonghuguanli',
    name: '设备管理',
    auth: true
  }
]
// , {
//     id: 0,
//     path: '/manage/user/dealer',
//     icon: 'icon-KEY',
//     name: '合作伙伴',
//     auth: true
//   }
