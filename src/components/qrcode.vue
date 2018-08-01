<template>
  <div class="container-bg" v-show="isShowModal">
    <div class="tips"></div>
  </div>
</template>
<script>
import { GET_DOWNLOAD_URL_POST } from '@/lib/api'
export default {
  data () {
    return {
      appName: '',
      companyName: '',
      isShowModal: false
    }
  },
  created () {
    this.appName = this.$route.params.appName
    this.companyName = this.$route.params.company
    this.getDownloadUrl()
  },
  methods: {
    getDownloadUrl () {
      let data = this.createFormData({
        app_name: unescape(this.appName),
        company_name: unescape(this.companyName)
      })
      let windows = this.terminal()
      this.$http.post(GET_DOWNLOAD_URL_POST, data).then(res => {
        if (this.vmResponseHandler(res)) {
          let downloadUrl = res.data.data
          if (this.isJsonString(downloadUrl)) {
            let arr = JSON.parse(downloadUrl)
            if (windows.ios) { window.location.href = arr[3].url || arr[0].url; return }
            if (windows.wechat) { // 如果是微信扫码，且应用宝地址存在则通过应用宝下载，否则提示在浏览器打开
              if (arr[2].url) { window.location.href = arr[2].url } else { this.isShowModal = true }
            } else {
              window.location.href = arr[0].url
            }
          } else {
            window.location.href = downloadUrl
          }
        }
      }).catch(() => {
        this.vmMsgError('网络错误！')
      })
    },

    terminal () {
      let u = navigator.userAgent.toLowerCase()
      // let app = navigator.appVersion
      return {
        wechat: u.indexOf('micromessenger') > -1,
        ios: !!u.match(/\(i[^;]+;( u;)? cpu.+mac os x/),
        android: u.indexOf('android') > -1 || u.indexOf('linux') > -1,
        iPhone: u.indexOf('iphone') > -1,
        iPad: u.indexOf('ipad') > -1
      }
    }
  }
}
</script>
<style>
.container-bg {
  background-color: rgb(29, 29, 29);
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}
.tips {
  height: 100%;
  background: url('../assets/img/open-browser.png') no-repeat top center;
  background-size: contain;
}
</style>
