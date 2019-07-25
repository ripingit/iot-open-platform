/* eslint-disable no-magic-numbers */
/** 定义局部混入的文件 */

import { UPDATE_AUTH_STATE_POST } from "@/lib/api.js"
import { validatePhone, validateEmail } from "@/lib/validate.js"

/**
 * 获取合作商或经销商是否通过认证
 * @param {*} code 标识是经销商还是合作商
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
 * @param {string} account 待替换的账号
 * @param {boolean} isEncryptShort 是否对除手机号码、邮箱之外的账号进行替换
 */
export function encryptUserName (account, isEncryptShort) {
  if (validateEmail(account)) {
    const start = account.slice(0, 2)
    const index = account.indexOf("@")
    const end = account.slice(index)
    // const { length } = account.slice(3, index)
    return start + "*".repeat(4) + end
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
  if (isEncryptShort) {
    const start = account.slice(0, 3)
    return `${start}****`
  }
  return account
}

/** 设备分类 */
export const deviceCategory = [
  {
    value : 1,
    label : "iot_plat_ordinary_camera",
    remark: "普通IPC"
  },
  {
    value : 2,
    label : "iot_plat_nvr",
    remark: "NVR"
  },
  {
    value : 3,
    label : "iot_plat_dvr",
    remark: "DVR"
  },
  {
    value : 4,
    label : "iot_plat_panoramic_camera",
    remark: "全景IPC"
  }
]

/** 解码方式 */
export const decodeFormat = [
  {
    value : 0,
    label : "iot_plat_multi_aisle",
    remark: "多通道"
  },
  {
    value : 1,
    label : "iot_plat_multiple_synthesis",
    remark: "多路合成"
  }
]

/** 校正解码 */
export const pipcDvDecode = [
  {
    value : 1,
    label : "iot_plat_zhongke_longzhi",
    remark: "中科龙智"
  }
]

/** 音频模式 */
export const audioMode = [
  {
    value : 1,
    label : "iot_plat_half_duplex",
    remark: "半双工"
  },
  {
    value : 2,
    label : "iot_plat_full_duplex",
    remark: "全双工"
  }
]

/** 网络节点 */
export const networkNodes = [
  {
    value : "2",
    label : "iot_plat_china",
    remark: "中国"
  },
  {
    value : "1",
    label : "iot_plat_hk",
    remark: "香港"
  },
  {
    value : "4",
    label : "iot_plat_us",
    remark: "美国"
  },
  {
    value : "5",
    label : "iot_plat_dubai",
    remark: "迪拜"
  }
]

/** 运营商 */
export const operators = [
  {
    id    : "aliyun",
    label : "iot_plat_aliyun",
    remark: "阿里云"
  },
  {
    id    : "aws",
    label : "iot_plat_aws",
    remark: "亚马逊"
  }
]

/** 日志等级 */
export const logLevels = [
  {
    id    : 0,
    label : "iot_plat_close",
    remark: "关闭"
  },
  { 
    id    : 1, 
    label : "iot_plat_debug",
    remark: "DEBUG"
  },
  { 
    id    : 2, 
    label : "iot_plat_info",
    remark: "INFO"
  },
  { 
    id    : 3, 
    label : "iot_plat_warn",
    remark: "WARN"
  },
  { 
    id    : 4, 
    label : "iot_plat_error",
    remark: "ERROR"
  },
  { 
    id    : 5, 
    label : "iot_plat_fatal",
    remark: "FATAL"
  }
]

/** 网络协议 */
export const protocols = [
  {
    id    : 1,
    label : "iot_plat_tcp",
    remark: "TCP"
  },
  {
    id    : 2,
    label : "iot_plat_udp",
    remark: "UDP"
  }
]

/** 日志所在集群 */
export const logHosts = [
  {
    ip   : "47.75.85.181",
    label: "hk"
  },
  {
    ip   : "120.77.150.206",
    label: "cn"
  },
  {
    ip   : "47.91.107.36",
    label: "dubai"
  },
  {
    ip   : "47.90.188.115",
    label: "eusa"
  },
  {
    ip   : "120.79.178.33",
    label: "test"
  }
]

/** 日志集群端口 */
export const logHostPort = [
  {
    port : 30524,
    label: "default Port"
  }
]
