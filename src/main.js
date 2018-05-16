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
import CommonApi from './lib/common-api'

// 提交代码到仓库或者打包发布时请注释
// import './mock/mock.js'

Vue.config.productionTip = false
Vue.prototype.$http = axios

Vue.use(ElementUI)
Vue.component('chart', ECharts)
Vue.use(CommonApi)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
