export let admin = {
  path: 'admin',
  component: resolve => require(['@/components/manage/layout'], resolve),
  children: [
    {
      path: 'resetAdminPass',
      name: 'resetAdminPass',
      component: resolve => require(['@/components/manage/edit-password'], resolve),
      meta: { title: '修改密码', identity: [1] }
    }, {
      path: 'home/:index',
      name: 'home',
      component: resolve => require(['@/components/manage/home'], resolve),
      meta: { title: '首页' }
    }
  ]
}

export let adminRoute = [
  {
    id: 1001,
    route: {
      path: 'category/:index',
      name: 'category',
      component: resolve => require(['@/components/manage/device-category/device-category'], resolve),
      meta: { title: '设备类别', identity: [1] }
    }
  }, {
    id: 2001,
    route: {
      path: 'model/:index',
      name: 'model',
      component: resolve => require(['@/components/manage/device-model/device-model'], resolve),
      meta: { title: '设备型号', identity: [1] }
    }
  }, {
    id: 3001,
    route: {
      path: 'firmware/:index',
      name: 'firmware',
      component: resolve => require(['@/components/manage/firmware/firmware'], resolve),
      meta: { title: '固件管理', identity: [1] }
    }
  }, {
    id: 4001,
    route: {
      path: 'cooperation/:index',
      name: 'cooperation',
      component: resolve => require(['@/components/manage/cooperation/cooperation'], resolve),
      meta: { title: '合作', identity: [1] }
    }
  }, {
    id: 5001,
    route: {
      path: 'reviewCompany/:index',
      name: 'reviewCompany',
      component: resolve => require(['@/components/manage/review-manage/company'], resolve),
      meta: { title: '审核管理-公司', identity: [1] }
    }
  }, {
    id: 6001,
    route: {
      path: 'reviewModel/:index',
      name: 'reviewModel',
      component: resolve => require(['@/components/manage/review-manage/model'], resolve),
      meta: { title: '审核管理-型号', identity: [1] }
    }
  }, {
    id: 7001,
    route: {
      path: 'reviewFirmware/:index',
      name: 'reviewFirmware',
      component: resolve => require(['@/components/manage/review-manage/firmware'], resolve),
      meta: { title: '审核管理-固件', identity: [1] }
    }
  }, {
    id: 8001,
    route: {
      path: 'reviewCategory/:index',
      name: 'reviewCategory',
      component: resolve => require(['@/components/manage/review-manage/category'], resolve),
      meta: { title: '审核管理-类别', identity: [1] }
    }
  }, {
    id: 9001,
    route: {
      path: 'appVersion/:index',
      name: 'appVersion',
      component: resolve => require(['@/components/manage/app-version/app-version'], resolve),
      meta: { title: 'app版本', identity: [1] }
    }
  }, {
    id: 10001,
    route: {
      path: 'admins/:index',
      name: 'admins',
      component: resolve => require(['@/components/manage/admin/admin'], resolve),
      meta: { title: '用户信息', identity: [1] }
    }
  }, {
    id: 11001,
    route: {
      path: 'powerHome/:index',
      name: 'powerHome',
      component: resolve => require(['@/components/manage/admin/powerHome'], resolve),
      meta: { title: '权限管理', identity: 1 },
      children: [{
        path: '/',
        name: 'power',
        component: resolve => require(['@/components/manage/admin/power'], resolve)
      }, {
        path: 'VisitPower/:group_id',
        name: 'VisitPower',
        component: resolve => require(['@/components/manage/admin/VisitPower'], resolve)
      }, {
        path: 'memberPower/:group_id',
        name: 'memberPower',
        component: resolve => require(['@/components/manage/admin/memberPower'], resolve)
      }]
    }
  }, {
    id: 12001,
    route: {
      path: 'userManage/:index',
      name: 'userManage',
      component: resolve => require(['@/components/manage/users/user-manage'], resolve),
      meta: { title: '用户管理', identity: [1] }
    }
  }, {
    id: 13001,
    route: {
      path: 'goodsManage/:index',
      name: 'goodsManage',
      component: resolve => require(['@/components/manage/goods-manage/goods-manage'], resolve),
      meta: { title: '商品管理', identity: [1] }
    }
  }, {
    id: 14001,
    route: {
      path: 'deviceProd/:index',
      name: 'deviceProd',
      component: resolve => require(['@/components/manage/equipment-prod/equipment-prod'], resolve),
      meta: { title: '设备生产', identity: [1] }
    }
  }
]
