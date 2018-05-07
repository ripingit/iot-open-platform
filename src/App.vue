<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
html, body, #app{
  height: 100%;
  font-size: 10px;
  font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
}
.fa {
  font: normal normal normal 16px/2.6 FontAwesome;
}

/** input */
.el-input input {
  border-radius: 0 !important;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: #fff;
}
.el-input input:focus {
  border-color: inherit
}

/** checkbox */
.el-checkbox .el-checkbox__inner {
  background: none !important;
  border-radius: 0;
}
.el-checkbox .el-checkbox__input.is-checked .el-checkbox__inner {
  border-color: inherit;
}
.el-checkbox .el-checkbox__label {
  color: #fff !important;
}
.el-dialog{
  background: #36393E;
}
.el-dialog__title,.el-form-item__label{
  color: #ffffff;
}
</style>
