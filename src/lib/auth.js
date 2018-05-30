/**
 * 说明：
 * 该库为权限表定义库
 */

exports.install = function (Vue, options) {
  Vue.prototype.PermissionsLib = {
    ADD_DEVICE_CATE: { id: 1002, name: '设备类别添加' },
    DEL_DEVICE_CATE: { id: 1003, name: '设备类别删除' },
    DEL_DEVICE_MODEL: { id: 2003, name: '设备型号删除' },
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
    REMOVE_USER_FROM: { id: 11008, name: '用户组解除用户' }
  }
}
