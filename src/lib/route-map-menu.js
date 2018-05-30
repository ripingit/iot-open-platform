/** 后台菜单路由映射 */
export const menuRouteMap = [
  {
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
  },
  // {
  //   id: 10001,
  //   path: '/manage/admin/users',
  //   icon: 'icon-yonghuguanli',
  //   name: '用户管理',
  //   auth: true
  // },
  {
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
  }
]

export function generateMenus (authList, menus) {
  let authCode = authList.map(o => o.cmd_id)
  for (let item of menus) {
    if (item.children) {
      item.auth = item.children.some(o => authCode.includes(o.id))
      generateMenus(authList, item.children)
    } else {
      item.auth = authCode.includes(item.id)
    }
  }
  return menus
}
