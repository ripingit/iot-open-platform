/**
 * 说明：
 * 该库采用VUE插件开发方式开发
 * 该库为状态码、标识码定义库
 */
export default {
  install: function (Vue) {
    /** 审核状态码 */
    Vue.prototype.authCode = {
      // 未提交
      NO_SUBMIT: -1,
      // 通过
      PASS     : 1,
      // 驳回
      REJECT   : 2,
      // 等待
      WAIT     : 0
    }

    /** 登陆者身份码 */
    Vue.prototype.identityCode = {
      // 后台管理员
      ADMIN : "mkadmin",
      // 合作商
      COOP  : "coop",
      // 经销商
      DEALER: "dealer"
    }

    /** 商家类型 */
    Vue.prototype.merchantCode = {
      // 合作商
      coop  : 1,
      // 经销商
      dealer: 2
    }

    /** 固件类型码 */
    Vue.prototype.firmwareTypeMap = {
      // 正式
      FORMAL   : 1,
      // 临时
      TEMP     : 2,
      // 灰度
      GRAYSCALE: 3
    }

    /** 固件类型 */
    Vue.prototype.firmwareTypeCode = {
      // 正式
      1: "iot_plat_formal",
      // 临时
      2: "iot_plat_temporary",
      // 灰度
      3: "iot_plat_grayscale"
    }

    /** 固件版本 */
    /*
     * Vue.prototype.firmwareVerCode = {
     *   1: "正式版本",
     *   2: "临时版本",
     *   3: "测试版本"
     * }
     */

    /** 商品类型 */
    /* Vue.prototype.goodTypeCode = { css: "云储存服务" } */

    /** 商品上下架状态 */
    Vue.prototype.goodSaleCode = {
      // 已上架
      1: "iot_plat_already_shelf",
      // 已下架
      2: "iot_plat_already_obtained"
    }

    /** 商品促销状态 */
    Vue.prototype.goodPromotionCode = {
      // 未促销
      1: "iot_plat_not_promoted",
      // 促销中
      2: "iot_plat_on_sale",
      // 免费
      3: "iot_plat_free"
    }

    /** 设备解绑状态 */
    Vue.prototype.untieCode = {
      // 成功
      1: "iot_plat_success",
      // 失败
      2: "iot_plat_fail",
      // 解绑中
      3: "iot_plat_unbinding"
    }

    /** 设备返修方式 */
    Vue.prototype.repairWayCode = {
      // 更换
      1: "iot_plat_replace",
      // 维修
      2: "iot_plat_repair"
    }

    /** 短信、邮件设置模板语言类型 */
    Vue.prototype.langTemplateType = {
      // 中文模板
      1: "iot_plat_chinese_template",
      // 英文模板
      2: "iot_plat_english_template"
    }

    /** 短信、邮件设置模板类型 */
    Vue.prototype.smsTemplateType = {
      // 注册
      1: "iot_plat_registered",
      // 找回密码
      2: "iot_plat_retrieve_pwd",
      // 更换账号
      3: "iot_plat_change_account"
    }

    /** 协议设置语言 */
    /*
     * Vue.prototype.protocolLangTemplateType = {
     * zh: "中文",
     * en: "英语",
     * pt: "葡萄牙语"
     *} 
     */

    /** 协议设置类型 */
    Vue.prototype.protocolTemplateType = {
      // 用户协议
      1: "iot_plat_user_agreement",
      // 隐私协议
      2: "iot_plat_privacy_agreement",
      // 云存储协议
      3: "iot_plat_lloud_storage_protocol",
      // 使用说明
      4: "iot_plat_instruction_use"
    }

    /** 是否使用邮件TLS */
    Vue.prototype.tlsCode = {
      // 未使用
      0: "iot_plat_not_use",
      // 使用
      1: "iot_plat_use"
    }

    /** 支付类型 */
    Vue.prototype.payType = {
      // 支付宝
      1: "iot_plat_alipay",
      // 微信
      2: "iot_plat_wechat",
      // PayPal
      3: "iot_plat_paypal",
      // 新用户专享
      9: "iot_plat_new_user_exclusive"
    }
  }
}
