<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import '@/assets/css/element-reset.css'

export default {
  name: 'App'
}
</script>

<style>
::selection {
  background: #00c4b6;
  color: #f7f7f7;
}

html, body, #app{
  height: 100%;
  font-size: 12px;
  font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
}

</style>
