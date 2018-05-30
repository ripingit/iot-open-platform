// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ECharts from 'vue-echarts/components/ECharts.vue'
import axios from 'axios'
import ElementUI from 'element-ui'

import 'element-ui/lib/theme-chalk/index.css'
import 'reset-css/reset.css'

import App from './App'
import router from './router'
import store from './store/index'
import CommonApi from './lib/common-api'
import StatuCode from './lib/statu'
import PermissionLib from './lib/auth'

// 提交代码到仓库或者打包发布时请注释
// import './mock/mock.js'

// 拦截接口响应
axios.interceptors.response.use((res) => {
  if (res.data.statu === 0) {
    let identity = store.getters.getUserIdentity
    res.data.msg = '请重新登录！'
    if (identity === Vue.prototype.identityCode.ADMIN) {
      router.push('/login')
    } else {
      router.push('/signin')
    }
  }
  return res
})

axios.interceptors.request.use((req) => {
  req.url = '../' + req.url
  return req
})

Vue.config.productionTip = false
Vue.prototype.$http = axios

Vue.use(ElementUI)
Vue.component('chart', ECharts)
Vue.use(CommonApi)
Vue.use(StatuCode)
Vue.use(PermissionLib)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
