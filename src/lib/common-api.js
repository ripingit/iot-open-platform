/**
 * 说明：
 * 该库采用VUE插件开发方式开发
 * 该库为全局函数库，在该库定义的函数将在项目vue组件中可以直接调用而不用反复导入
 * 其他开发人员在扩展该库时注意不要将少数地方用到的函数封装到该库，避免不必要的额外资源占用
 */
import i18n from "@/lang/index"

export default {
  install: function (Vue) {
    const vm = new Vue({ i18n })

    Vue.prototype.vmPormpt = function ({
      msg = vm.$t("iot_plat_input_value_please"),
      title = vm.$t("iot_plat_prompt"),
      confirmButtonText = vm.$t("iot_plat_confirm"),
      cancelButtonText = vm.$t("iot_plat_cancel"),
      inputPattern = "",
      inputErrorMessage = vm.$t("iot_plat_input_correct_format_value"),
      inputPlaceholder = vm.$t("iot_plat_input_value_please"),
      confirmCallback,
      cancelCallback
    }) {
      vm.$prompt(msg, title, {
        confirmButtonText: confirmButtonText,
        cancelButtonText : cancelButtonText,
        inputPattern     : inputPattern,
        inputErrorMessage: inputErrorMessage,
        inputPlaceholder : inputPlaceholder
      }).then(({ value }) => {
        confirmCallback(value)
      })
        // eslint-disable-next-line no-unexpected-multiline
        ["catch"](e => {
          if (e !== "cancel") {
            vm.vmMsgError(e.message || e)
          }
          cancelCallback && cancelCallback()
        });
    }

    /**
     * 操作确认提示框
     * 参数传入的时候使用对象的方式
     * @param { msg }  提示信息
     * @param { confirmBtnText } 确认按钮文字
     * @param { cancelBtnText } 取消按钮文字
     * @param { confirmCallback } 点击确认按钮后的回调函数
     * @param { cancelCallback } 点击取消按钮后的回调函数
     */
    Vue.prototype.vmConfirm = function ({
      msg = vm.$t("iot_plat_confirm_operating"),
      confirmBtnText = vm.$t("iot_plat_confirm"),
      cancelBtnText = vm.$t("iot_plat_cancel"),
      // eslint-disable-next-line no-empty-function
      confirmCallback = () => {},
      // eslint-disable-next-line no-empty-function
      cancelCallback = () => {} 
    } = {}) {
      const showConfirmBtn = typeof confirmCallback === "function"
      vm.$confirm(msg, vm.$t("iot_plat_prompt"), {
        showConfirmButton: showConfirmBtn,
        confirmButtonText: confirmBtnText,
        cancelButtonText : cancelBtnText,
        type             : "warning"
      }).then(data => {
        confirmCallback(data)
      // eslint-disable-next-line newline-per-chained-call
      })["catch"](e => {
        if (e !== "cancel") {
          vm.vmMsgError(e.message || e)
        }
        cancelCallback && cancelCallback()
      })
    }

    /**
     * 操作成功提示框
     * @param { msg } 提示信息
     */
    Vue.prototype.vmMsgSuccess = function (msg = vm.$t("iot_plat_operating_success")) {
      vm.$message({
        showClose: true,
        message  : msg,
        type     : "success"
      })
    }

    /**
     * 操作告警提示框
     * @param { msg } 提示信息
     */
    Vue.prototype.vmMsgWarning = function (msg = vm.$t("iot_plat_error_in_operating")) {
      vm.$message({
        showClose: true,
        message  : msg,
        type     : "warning"
      })
    }

    /**
     * 操作错误提示框
     * @param { msg } 提示信息
     */
    Vue.prototype.vmMsgError = function (msg = vm.$t("iot_plat_operating_error")) {
      vm.$message({
        showClose: true,
        message  : msg,
        type     : "error"
      })
    }

    /**
     * 操作等待函数，全屏loading
     * @param { msg } 文字提示
     */
    Vue.prototype.vmLoadingFull = function (msg = vm.$t("iot_plat_processing_waiting")) {
      return vm.$loading({
        lock      : true,
        text      : msg,
        background: "rgba(234, 234, 234, 0.86)"
      })
    }

    /**
     * 创建FormData提交对象
     * @param { 调用接口时所需参数 } obj
     */
    Vue.prototype.createFormData = function (obj) {
      const formData = new FormData()
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const value = obj[key]
          if (Array.isArray(value)) {
            value.forEach(o => formData.append(`${key}[]`, o))
          } else if (value instanceof Object && value.toString() === "[object Object]") {
            formData.append(key, JSON.stringify(value))
          } else {
            formData.append(key, obj[key])
          }
        }
      }
      return formData
    }

    /**
     * 对调用后台接口后返回的数据进行统一处理
     * @param { data } 接口返回数据
     */
    Vue.prototype.vmResponseHandler = res => {
      // eslint-disable-next-line no-magic-numbers
      if (res.status === 200) {
        const { data } = res
        if (!data.status) {
          data.msg ? vm.vmMsgError(data.msg) : vm.vmMsgError(vm.$t("iot_plat_server_error"))
          return false
        } else if (!data || data instanceof Array && data.length === 0 || data instanceof Object && Object.keys(data).length === 0) {
          // || (data instanceof Object && Object.keys(data).length === 0)
          vm.vmMsgError(vm.$t("iot_plat_empty_data"))
          return false
        }
        return res.data
      } 
      vm.vmMsgError(vm.$t("iot_plat_get_data_error"))
      return false
      
    }

    /**
     * 检测操作权限
     */
    Vue.prototype.vmHasAuth = (map, authList) => {
      if (!authList) { return }
      const auth = authList.find(o => o.cmd_id === map.id)
      if (!auth) { return false }
      return auth.status
    }

    Vue.prototype.vmEscapeToHTML = str => {
      let temp = document.createElement("div")
      temp.innerHTML = str
      const output = temp.innerText || temp.textContent
      temp = null
      return output
    }

    Vue.prototype.vmHtmlToEscape = html => {
      let temp = document.createElement("div")
      if (temp.textContent != null) {
        temp.textContent = html
      } else {
        temp.innerText = html
      }
      const output = temp.innerHTML
      temp = null
      return output
    }

    /**
     * 将日期时间转换成指定格式
     * 调用：dateFormat("yyyy-MM-dd hh:mm:ss")
     */
    Vue.prototype.formatDate = (date, fmt) => {
      // 一季度3个月
      const MONTHS_PER_QUARTER = 3
      const o = {
        // 月份
        "M+": date.getMonth() + 1,
        // 日
        "d+": date.getDate(),
        // 小时
        "h+": date.getHours(),
        // 分
        "m+": date.getMinutes(),
        // 秒
        "s+": date.getSeconds(),
        // 季度
        "q+": Math.floor((date.getMonth() + MONTHS_PER_QUARTER) / MONTHS_PER_QUARTER),
        // 毫秒
        S   : date.getMilliseconds() 
      }
      if (/(y+)/.test(fmt)) {
        // eslint-disable-next-line no-magic-numbers
        fmt = fmt.replace(RegExp.$1, `${date.getFullYear()}`.substr(4 - RegExp.$1.length))
      }
      for (const k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
          fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length))
        }
      }
      return fmt
    }

    /**
     * 检测给定字符串是否为JSON字符串
     */
    Vue.prototype.isJsonString = str => {
      try {
        if (typeof JSON.parse(str) === "object") {
          return true
        }
      } catch (e) { 
        // eslint-disable-next-line 
      }
      return false
    }

    Vue.prototype.getSystemLanguage = () => {
      const lang = navigator.language
      if (lang.indexOf("zh") !== -1 || lang.indexOf("ZH") !== -1 || lang.indexOf("cn") !== -1 || lang.indexOf("CN") !== -1) {
        return "CN"
      }
      if (lang.indexOf("en") !== -1 || lang.indexOf("EN") !== -1) {
        return "EN"
      }
    }
  }
}
