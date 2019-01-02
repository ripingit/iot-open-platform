/**
 * 说明：
 * 该库为权限表定义库，依赖后台的权限定义
 */
export default {
  install: function (Vue) {
    /** 管理平台 */
    Vue.prototype.AdminPermissionsLib = {
      ADD_DEVICE_CATE: { id: 1002, name: '设备类别添加' },
      DEL_DEVICE_CATE: { id: 1003, name: '设备类别删除' },
      DEL_DEVICE_MODEL: { id: 2003, name: '设备型号删除' },
      UPDATE_DEVICE_MODEL: { id: 2006, name: '设备型号编辑' },
      FIRMWARE_HISTORY: { id: 3002, name: '固件升级记录' },
      DEL_COOP: { id: 4002, name: '合作商删除' },
      DEL_AUDIT_COMPANY: { id: 5002, name: '公司删除' },
      REVIEW_AUDIT_COMPANY: { id: 5003, name: '公司审核' },
      DEL_AUDIT_MODEL: { id: 6002, name: '型号删除' },
      REVIEW_AUDIT_MODEL: { id: 6003, name: '型号审核' },
      DEL_AUDIT_FIRMWARE: { id: 7002, name: '固件删除' },
      REVIEW_AUDIT_FIRMWARE: { id: 7003, name: '固件审核' },
      DEL_AUDIT_CATEGORY: { id: 8002, name: '类别删除' },
      REVIEW_AUDIT_CATEGORY: { id: 8003, name: '类别审核' },
      DEL_APP: { id: 9002, name: 'APP删除' },
      DEL_USER: { id: 10002, name: '删除用户' },
      ADD_USER: { id: 10003, name: '添加用户' },
      ADD_USER_TO_GROUP: { id: 10004, name: '添加用户到用户组' },
      RESET_USER_PASS: { id: 10005, name: '重置用户密码' },
      ADD_USER_GROUP: { id: 11002, name: '添加用户组' },
      EDIT_USER_GROUP: { id: 11003, name: '编辑用户组' },
      DEL_USER_GROUP: { id: 11004, name: '删除用户组' },
      EDIT_USER_GROUP_AUTH: { id: 11006, name: '修改用户组权限' },
      ADD_USER_GROUP_AUTH: { id: 11005, name: '添加用户组权限' },
      DEL_USER_GROUP_USER: { id: 11007, name: '删除用户组成员' },
      REMOVE_USER_FROM: { id: 11008, name: '用户组解除用户' },
      GOODS_ADD: { id: 13002, name: '商品添加' },
      REWORK_EQUIPMENT: { id: 14002, name: '查看设备返修' },
      PERMISSION_COOP: { id: 4003, name: '查看合作商Key' },
      COOP_AUTH_SELECT: { id: 20002, name: '编辑合作商权限列表' }
    }

    /** 合作商 */
    Vue.prototype.CoopPermissionsLib = {
      DEL_APP: { id: 9002, name: 'APP删除' },
      ADD_APP: { id: 9003, name: '添加APP' },
      UPLOAD_APP: { id: 9004, name: '上传APP' },
      GENERATE_KEY: { id: 17002, name: '生成Key' },
      ADD_NOTIFY_URL: { id: 17003, name: '添加回调地址' },
      ADD_FIREWARE: { id: 3003, name: '添加固件' },
      RECORD_UPDATE_FIREWARE: { id: 3002, name: '固件升级记录' },
      RELEASE_FIREWARE: { id: 3004, name: '固件发布' },
      RELEASE_FIREWARE_CANCEL: { id: 3005, name: '固件发布撤销' },
      ADD_DEVICE_MODEL: { id: 2002, name: '设备型号添加' },
      DEL_DEVICE_MODEL: { id: 2003, name: '设备型号删除' },
      SET_DEVICE_MODEL: { id: 2004, name: '设备型号配置' },
      GENERATE_DEVICE_ID: { id: 2005, name: '设备型号ID生成' },
      ADD_REWORK: { id: 14003, name: '设备返修记录添加' },
      DEVICE_IMPORT: { id: 14005, name: '设备生产导入' },
      QUERY_REWORK: { id: 14002, name: '设备返修记录查询' },
      QUERY_REWORK_DEALER: { id: 19003, name: '设备管理返修记录查询' },
      ADD_REWORK_DEALER: { id: 19002, name: '设备管理返修记录添加' },
      DEL_USER: { id: 10002, name: '用户删除' },
      ADD_USER: { id: 10003, name: '用户添加' },
      ADD_USER_TO_GROUP: { id: 10004, name: '用户绑定权限组' },
      RESET_USER_PASS: { id: 10005, name: '重置用户密码' },
      ADD_USER_GROUP: { id: 11002, name: '添加权限组' },
      EDIT_USER_GROUP: { id: 11003, name: '编辑权限组' },
      DEL_USER_GROUP: { id: 11004, name: '删除权限组' },
      USER_GROUP_AUTH: { id: 11005, name: '访问授权' },
      EDIT_USER_GROUP_AUTH: { id: 11006, name: '访问授权编辑' },
      AUTH_USER: { id: 11007, name: '成员授权' },
      REMOVE_USER_FROM: { id: 11008, name: '解除成员授权' }
    }
  }
}
