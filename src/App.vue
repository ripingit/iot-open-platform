<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import "@/assets/css/element-reset.css"
import { ADMIN_AUTH_GET, COOP_AUTH_GET } from "@/lib/api.js"
import { createRoutes } from "@/router/routes/index"

export default {
  name: "App",
  created () {
    // 用于解决界面刷新后路由失效的问题
    if (this.$store.getters.getUserIdentity === this.identityCode.ADMIN) {
      this.$http.post(ADMIN_AUTH_GET).then(res => {
        if (res.data.title) {
          this.$router.addRoutes(createRoutes(res.data.title))
        }
      })
    } else if (this.$store.getters.getUserIdentity === this.identityCode.COOP || this.$store.getters.getUserIdentity === this.identityCode.DEALER) {
      this.$http.post(COOP_AUTH_GET).then(res => {
        if (res.data.title) {
          this.$router.addRoutes(createRoutes(res.data.title))
        }
      })
    } else {
      this.$router.addRoutes(createRoutes())
    }
  }
}
</script>

<style>
::selection {
  background: #00c4b6;
  color: #f7f7f7;
}

html, body, #app{
  -webkit-tap-highlight-color: rgba(0,0,0,0);
  height: 100%;
  font-size: 12px;
  font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
}

.icon {
  width: 2rem; height: 2rem;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
