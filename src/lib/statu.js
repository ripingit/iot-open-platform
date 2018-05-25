/**
 * 说明：
 * 该库采用VUE插件开发方式开发
 * 该库为接口返回状态码定义库
 */

exports.install = function (Vue, options) {
  Vue.prototype.authCode = {
    NO_SUBMIT: -1,
    PASS: 1,
    REJECT: 2,
    WAIT: 9
  }
}
