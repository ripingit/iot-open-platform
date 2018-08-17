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

  /** 商家类型 */
  Vue.prototype.merchantCode = {
    coop: 1,
    dealer: 2
  }

  /** 固件类型码 */
  Vue.prototype.firmwareTypeMap = {
    // 正式
    FORMAL: 1,
    // 临时
    TEMP: 2,
    // 灰度
    GRAYSCALE: 3
  }

  /** 固件类型 */
  Vue.prototype.firmwareTypeCode = {
    1: '正式',
    2: '临时',
    3: '灰度'
  }

  /** 固件版本 */

  Vue.prototype.firmwareVerCode = {
    1: '正式版本',
    2: '临时版本',
    3: '测试版本'
  }

  /** 国家识别码 */
  Vue.prototype.countryCode = {
    1: '中国香港',
    2: '中国大陆',
    3: '美国',
    4: '迪拜',
    5: '美东'
  }

  Vue.prototype.areaCode = {
    CN: '中国',
    US: '美西',
    BR: '巴西',
    AE: '阿联酋',
    DZ: '美东'
  }

  /** 商品类型 */
  Vue.prototype.goodTypeCode = {
    css: '云储存服务'
  }

  /** 商品上下架状态 */
  Vue.prototype.goodSaleCode = {
    1: '已上架',
    2: '已下架'
  }

  /** 设备解绑状态 */
  Vue.prototype.untieCode = {
    1: '成功',
    2: '失败',
    3: '解绑中'
  }

  /** 设备返修方式 */
  Vue.prototype.repairWayCode = {
    1: '更换',
    2: '维修'
  }

  /** 短信、邮件设置模板语言类型 */
  Vue.prototype.langTemplateType = {
    1: '中文模板',
    2: '英文模板'
  }

  /** 短信、邮件设置模板类型 */
  Vue.prototype.smsTemplateType = {
    1: '注册',
    2: '找回密码',
    3: '更换账号'
  }

  /** 是否使用邮件TLS */
  Vue.prototype.tlsCode = {
    0: '未使用',
    1: '使用'
  }
}
