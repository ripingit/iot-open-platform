/**
 * 说明：
 * 该库采用VUE插件开发方式开发
 * 该库为状态码、标识码定义库
 */

exports.install = function (Vue, options) {
  /** 审核状态码 */
  Vue.prototype.authCode = {
    // 未提交
    NO_SUBMIT: -1,
    // 通过
    PASS: 1,
    // 驳回
    REJECT: 2,
    // 等待
    WAIT: 0
  }

  /** 登陆者身份码 */
  Vue.prototype.identityCode = {
    // 后台管理员
    ADMIN: 'mkadmin',
    // 合作商
    COOP: 'coop'
  }
}
