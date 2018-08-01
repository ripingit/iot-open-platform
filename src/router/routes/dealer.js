export let dealerRoute = [
  {
    path: 'deviceManage',
    name: 'deviceManage',
    component: resolve => require(['@/components/dealer/device-manage/device-manage'], resolve),
    meta: { title: '设备管理' }
  }
]
