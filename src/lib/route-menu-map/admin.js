/** 后台菜单路由映射 */
export const adminMenuRouteMap = [
  {
    id: 12001,
    path: '/manage/admin/userManage',
    icon: 'icon-yonghuguanli',
    name: '用户管理',
    auth: true
  }, {
    id: 1001,
    path: '/manage/admin/category',
    icon: 'icon-shebeileibie',
    name: '设备类别',
    auth: true
  }, {
    id: 2001,
    path: '/manage/admin/model',
    icon: 'icon-shebeixinghao',
    name: '设备型号',
    auth: true
  }, {
    id: 3001,
    path: '/manage/admin/firmware',
    icon: 'icon-gujianguanli',
    name: '固件管理',
    auth: true
  }, {
    id: 4001,
    path: '/manage/admin/cooperation',
    icon: 'icon-hezuo',
    name: '合作',
    auth: true
  }, {
    path: '',
    icon: 'icon-shenheguanli',
    name: '审核管理',
    children: [
      {
        id: 5001,
        path: '/manage/admin/reviewCompany',
        icon: '',
        name: '公司'
      }, {
        id: 6001,
        path: '/manage/admin/reviewModel',
        icon: '',
        name: '型号'
      }, {
        id: 7001,
        path: '/manage/admin/reviewFirmware',
        icon: '',
        name: '固件'
      }, {
        id: 8001,
        path: '/manage/admin/reviewCategory',
        icon: '',
        name: '类别'
      }
    ],
    auth: true
  }, {
    id: 9001,
    path: '/manage/admin/appVersion',
    icon: 'icon-APPbanben1',
    name: 'APP管理',
    auth: true
  }, {
    path: '',
    icon: 'icon-guanliyuan',
    name: '管理员',
    children: [
      {
        id: 10001,
        path: '/manage/admin/admins',
        icon: '',
        name: '用户信息'
      }, {
        id: 11001,
        path: '/manage/admin/powerHome',
        icon: '',
        name: '权限管理'
      }
    ],
    auth: true
  }, {
    id: 13001,
    path: '/manage/admin/goodsManage',
    icon: 'icon-guanliyuan',
    name: '商品管理',
    auth: true
  }, {
    id: 14001,
    path: '/manage/admin/deviceProd',
    icon: 'icon-guanliyuan',
    name: '设备生产',
    auth: true
  }
]
