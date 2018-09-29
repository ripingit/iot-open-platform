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

/** 设备分类 */
export const deviceCategory = [
  {
    value: 1,
    label: 'IPC'
  }, {
    value: 2,
    label: 'NVR'
  }, {
    value: 3,
    label: 'DVR'
  }, {
    value: 4,
    label: 'PIPC'
  }
]

/** 解码方式 */
export const decodeFormat = [
  {
    value: 0,
    label: '多通道'
  }, {
    value: 1,
    label: '多路合成'
  }
]

/** 校正解码 */
export const pipcDvDecode = [
  {
    value: 1,
    label: '中科龙智'
  }
]

/** 音频模式 */
export const audioMode = [
  {
    value: 1,
    label: '半双工'
  }, {
    value: 2,
    label: '全双工'
  }
]
