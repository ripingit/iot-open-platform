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
}
.fa {
  font: normal normal normal 16px/2.6 FontAwesome;
}

/** input */
.el-input /deep/ input {
  border-radius: 0 !important;
  background: #4444448f;
  border: none;
  color: #fff;
}
.el-input /deep/ input:focus {
  border-color: inherit
}

/** checkbox */
.el-checkbox /deep/ .el-checkbox__inner {
  background: none !important;
  border-radius: 0;
}
.el-checkbox /deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
  border-color: inherit;
}
.el-checkbox /deep/ .el-checkbox__label {
  color: #fff !important;
}
</style>
