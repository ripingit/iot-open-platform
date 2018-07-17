/** 邮箱 */
export function validateEmail (str) {
  let reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/
  return reg.test(str)
}

/** 手机号 */
export function validatePhone (str) {
  let reg = /^(0|86|17951)?(13[0-9]|14[1456789]|15[012356789]|16[6]|18[0-9]|17[0-9]|19[0-9])[0-9]{8}$/
  return reg.test(str)
}

/** 固定电话 */
export function validateFixPhone (str) {
  let reg = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/
  return reg.test(str)
}

/** 营业执照 */
export function validateBusinessLicense (str) {
  let reg = /(^(?:(?![IOZSV])[\dA-Z]){2}\d{6}(?:(?![IOZSV])[\dA-Z]){10}$)|(^\d{15}$)/
  return reg.test(str)
}

/** 型号代码 */
export function validateProductCode (str) {
  let reg = /(^[a-zA-Z0-9]{0,6}$)/
  return reg.test(str)
}
