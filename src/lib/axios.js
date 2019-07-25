import Vue from "vue"
import axios from "axios"
import router from "@/router"
import i18n from "@/lang/index"

const vm = new Vue({ i18n })

// 拦截接口响应
axios.interceptors.response.use(res => {
  if (res.data.statu === 0) {
    res.data.msg = vm.$t("iot_plat_relogin_please")
    router.push("/signin")
  }
  return res
})

axios.interceptors.request.use(req => {
  req.url = `../${req.url}`
  return req
})

export default axios
