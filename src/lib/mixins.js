/* eslint-disable no-magic-numbers */
/** 定义局部混入的文件 */

import { UPDATE_AUTH_STATE_POST } from "@/lib/api.js"
import { validatePhone, validateEmail } from "@/lib/validate.js"

/**
 * 获取合作商或经销商是否通过认证
 * { code } 标识是经销商还是合作商
 */
export function getState (code) {
  return new Promise(async resolve => {
    const loading = this.vmLoadingFull()
    const res = await this.$http.post(UPDATE_AUTH_STATE_POST, this.createFormData({ role: code }))
    loading.close()
    if (this.vmResponseHandler(res)) {
      resolve(res)
    }
    resolve()
  })
}

/**
 * 替换账号中部分为 * 号
 */
export function encryptUserName (account) {
  if (validateEmail(account)) {
    const start = account.slice(0, 3)
    const index = account.indexOf("@")
    const end = account.slice(index)
    const { length } = account.slice(3, index)
    return start + "*".repeat(length) + end
  } else if (account.indexOf("-") !== -1) {
    account = account.split("-")
    const start = account[1].slice(0, 3)
    const end = account[1].slice(8)
    return `${account[0]}-${start}****${end}`
  } else if (validatePhone(account)) {
    const start = account.slice(0, 3)
    const end = account.slice(8)
    return `${start}****${end}`
  } 
  const start = account.slice(0, 3)
  return `${start}****`
  
}

/** 设备分类 */
export const deviceCategory = [
  {
    value: 1,
    label: "IPC"
  },
  {
    value: 2,
    label: "NVR"
  },
  {
    value: 3,
    label: "DVR"
  },
  {
    value: 4,
    label: "PIPC"
  }
]

/** 解码方式 */
export const decodeFormat = [
  {
    value: 0,
    label: "多通道"
  },
  {
    value: 1,
    label: "多路合成"
  }
]

/** 校正解码 */
export const pipcDvDecode = [
  {
    value: 1,
    label: "中科龙智"
  }
]

/** 音频模式 */
export const audioMode = [
  {
    value: 1,
    label: "半双工"
  },
  {
    value: 2,
    label: "全双工"
  }
]

/** 网络节点 */
export const networkNodes = [
  {
    value: "2",
    label: "中国"
  },
  {
    value: "1",
    label: "香港"
  },
  {
    value: "4",
    label: "美国"
  },
  {
    value: "5",
    label: "迪拜"
  }
]
