/*
 * The Vue build version to load with the `import` command
 * (runtime-only or standalone) has been set in webpack.base.conf with an alias.
 */
import Vue from "vue"
import ECharts from "vue-echarts/components/ECharts.vue"
import ElementUI from "element-ui"

import "element-ui/lib/theme-chalk/index.css"
import "reset-css/reset.css"

import App from "./App"
import router from "./router"
import store from "./store/index"
import i18n from "./lang/index"
import CommonApi from "./lib/common-api"
import StatuCode from "./lib/statu"
import PermissionLib from "./lib/auth"
import axios from "@/lib/axios"

/*
 * 提交代码到仓库或者打包发布时请注释
 * import './mock/mock.js'
 */

Vue.prototype.DEBOUNCE_TIME = 300
Vue.prototype.ENTER_KEY_CODE = 13

Vue.config.productionTip = false
Vue.prototype.$http = axios

Vue.use(ElementUI)
Vue.component("chart", ECharts)
Vue.use(CommonApi)
Vue.use(StatuCode)
Vue.use(PermissionLib)

/* eslint-disable no-new */
new Vue({
  el        : "#app",
  i18n,
  router,
  store,
  components: { App },
  template  : "<App/>"
})
