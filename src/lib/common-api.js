/**
 * 说明：
 * 该库采用VUE插件开发方式开发
 * 该库为全局函数库，在该库定义的函数将在项目vue组件中可以直接调用而不用反复导入
 * 其他开发人员在扩展该库时注意不要将少数地方用到的函数封装到该库，避免不必要的额外资源占用
 */

exports.install = function (Vue, options) {
  const vm = new Vue()

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
    msg = '确认进行该操作吗？',
    confirmBtnText = '确定',
    cancelBtnText = '取消',
    confirmCallback = () => {},
    cancelCallback = () => {} } = {}
  ) {
    let showConfirmBtn = typeof confirmCallback === 'function'
    vm.$confirm(msg, '提示', {
      showConfirmButton: showConfirmBtn,
      confirmButtonText: confirmBtnText,
      cancelButtonText: cancelBtnText,
      type: 'warning'
    }).then(data => {
      confirmCallback(data)
    }).catch((e) => {
      if (e !== 'cancel') {
        vm.vmMsgError(e.message || e)
      }
      cancelCallback && cancelCallback()
    })
  }

  /**
   * 操作成功提示框
   * @param { msg } 提示信息
   */
  Vue.prototype.vmMsgSuccess = function (msg = '操作成功！') {
    vm.$message({
      showClose: true,
      message: msg,
      type: 'success'
    })
  }

  /**
   * 操作告警提示框
   * @param { msg } 提示信息
   */
  Vue.prototype.vmMsgWarning = function (msg = '操作过程中出了问题！') {
    vm.$message({
      showClose: true,
      message: msg,
      type: 'warning'
    })
  }

  /**
   * 操作错误提示框
   * @param { msg } 提示信息
   */
  Vue.prototype.vmMsgError = function (msg = '操作出错！') {
    vm.$message({
      showClose: true,
      message: msg,
      type: 'error'
    })
  }

  /**
   * 操作等待函数，全屏loading
   * @param { msg } 文字提示
   */
  Vue.prototype.vmLoadingFull = function (msg = '处理中，请稍后...') {
    return vm.$loading({
      lock: true,
      text: msg,
      background: 'rgba(234, 234, 234, 0.86)'
    })
  }

  /**
   * 创建FormData提交对象
   * @param { 调用接口时所需参数 } obj
   */
  Vue.prototype.createFormData = function (obj) {
    let formData = new FormData()
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        formData.append(key, obj[key])
      }
    }
    return formData
  }

  /**
   * 对调用后台接口后返回的数据进行统一处理
   * @param { data } 接口返回数据
   */
  Vue.prototype.vmResponseHandler = (res) => {
    if (res.status === 200) {
      let data = res.data
      if (!data.status) {
        vm.vmMsgError(data.msg)
        return false
      } else if (!data || (data instanceof Array && data.length === 0)) {
        // || (data instanceof Object && Object.keys(data).length === 0)
        vm.vmMsgError('数据为空')
        return false
      }
      return res.data
    } else {
      vm.vmMsgError('获取数据出错!')
      return false
    }
  }

  /**
   * 检测操作权限
   */
  Vue.prototype.vmHasAuth = (map, authList) => {
    if (!authList) { return }
    let auth = authList.find(o => o.cmd_id === map.id)
    if (!auth) { return false }
    return auth.status
  }

  Vue.prototype.vmEscapeToHTML = (str) => {
    let temp = document.createElement('div')
    temp.innerHTML = str
    let output = temp.innerText || temp.textContent
    temp = null
    return output
  }

  Vue.prototype.vmHtmlToEscape = (html) => {
    let temp = document.createElement('div')
    if (temp.textContent != null) {
      temp.textContent = html
    } else {
      temp.innerText = html
    }
    let output = temp.innerHTML
    temp = null
    return output
  }

  /**
    * 将日期时间转换成指定格式
    * 调用：dateFormat("yyyy-MM-dd hh:mm:ss")
    */
  Vue.prototype.dateFormat = (date, fmt) => {
    var o = {
      'M+': date.getMonth() + 1, // 月份
      'd+': date.getDate(), // 日
      'h+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      'S': date.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
    return fmt
  }
}
