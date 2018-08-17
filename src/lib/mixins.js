/** 定义局部混入的文件 */

import { UPDATE_AUTH_STATE_POST } from '@/lib/api.js'
/**
 * 获取合作商或经销商是否通过认证
 * { code } 标识是经销商还是合作商
 */
export function getState (code) {
  return new Promise((resolve, reject) => {
    let loading = this.vmLoadingFull()
    this.$http.post(UPDATE_AUTH_STATE_POST, this.createFormData({role: code})).then(res => {
      loading.close()
      if (this.vmResponseHandler(res)) {
        resolve(res)
      }
      resolve()
    })
  })
}
