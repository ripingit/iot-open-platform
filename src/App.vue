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
@media (max-width:1366px) {
  html, body {
    width: 1366px;
  }
}

::selection {
  background: #00c4b6;
  color: #f7f7f7;
}

html, body, #app{
  height: 100%;
  font-size: 12px;
  font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
}
.fa {
  font: normal normal normal 16px/2.6 FontAwesome;
}

/** alert */
.el-message--success {
  background-color: #2acba7;
  border-color: #2acba7;
}
.el-message--warning {
  background-color: #E6A23C;
  border-color: #E6A23C;
}
.el-message--error {
  background-color: #F56C6C;
  border-color: #F56C6C;
}
.el-message .el-icon-success,
.el-message .el-icon-warning,
.el-message .el-icon-error,
.el-message__closeBtn,
.el-message--success .el-message__content,
.el-message--warning .el-message__content,
.el-message--error .el-message__content {
  color: #fff;
}

/** message-box */
.el-message-box__wrapper /deep/ .el-message-box {
  background-color: #36393E;
  border: 1px solid #36393E;
}
.el-message-box__wrapper /deep/ .el-message-box__content {
  color: #fff;
}
.el-message-box__wrapper /deep/ .el-button {
  background: #909399;
  color: #fff;
  border: 1px solid #909399;
}
.el-message-box__wrapper /deep/ .el-button--primary {
  background: #1f7ecf;
  color: #fff;
  border: 1px solid #1f7ecf;
}

/** loading */
.el-loading-mask {
  background-color: rgba(0, 0, 0, 0.66) !important;
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

/** date-picker */
.el-date-editor,
.el-date-editor .el-range-input,
.el-date-editor.el-input input {
  background: transparent !important;
}
.el-date-editor .el-range-separator,
.el-date-editor .el-range-input {
  color: #fffffe;
}
.el-date-editor {
  border: solid 1px #808080;
  border-radius: 4px;
}

.el-picker-panel {
  background: #292c31;
  color: #fff;
  border: none;
  box-shadow: 0px 16px 24px 0px rgba(0, 0, 0, 0.65);
}

.el-picker-panel .popper__arrow,
.el-picker-panel .popper__arrow::after {
  border-bottom-color: #292c31 !important;
}
.el-picker-panel .el-date-table td.in-range div {
  background-color: #505050;
}
.el-picker-panel .el-picker-panel__icon-btn{
  color: #fff;
}
.el-picker-panel .el-date-table th {
  border-bottom: solid 1px #606266;
}
.el-picker-panel .el-date-range-picker__content.is-left {
  border-right: solid 1px #606266;
}
/** select */
.el-select {
  border: solid 1px #808080;
  border-radius: 4px;
}
.el-select .el-input__inner {
  background: transparent !important;
}
.el-select-dropdown {
  background: #292c31;
  border: none;
  box-shadow: 0px 16px 24px 0px rgba(0, 0, 0, 0.65);
}
.el-select-dropdown .el-select-dropdown__item {
  color: #fffffe;
}
.el-select-dropdown .el-select-dropdown__item.hover,
.el-select-dropdown .el-select-dropdown__item:hover {
  background-color: transparent;
  color: #409EFF;
}
.el-select-dropdown .popper__arrow::after {
  border-bottom-color: #292c31 !important;
}
.el-select-dropdown .popper__arrow {
  border-bottom-color: transparent !important;
}

/** table */
.el-table {
  color: #b3b3b3;
}
.el-table::before {
  background: transparent;
}
.el-table, .el-table tr, .el-table th, .el-table td{
  background: transparent;
}
.el-table th {
  border-bottom: 0.12rem solid #fff !important;
}
.el-table td {
  border-bottom: 0.12rem solid #4c4c4c;
}
.el-table .el-table__body .el-table__row:last-child td {
  border-bottom: none;
}
.el-table .el-table__header thead {
  color: #fff;
}
.el-table .el-table__body tr:hover>td {
  background:transparent;
}

.el-dialog__title,.el-form-item__label{
  color: #ffffff;
}
.el-dialog--center .el-dialog__body{
padding: 25px 66px;
}

/*弹框*/
.el-dialog{
  background: #36393E;
}
.v-modal{
  opacity:.7;
}
.el-dialog__headerbtn{
  font-size:18px;
}
.el-dialog__headerbtn .el-dialog__close{
  color: #ffffff;
}

/*分页*/
 .el-pager li:hover, .el-pager li.active{
color: #ffffff;
background-color: #1f7ecf;
}
 .el-pager li, .el-pagination .btn-next, .el-pagination .btn-prev{
background-color:#36393E;
color: #b3b3b3;
}
.el-pagination button:disabled{
  background-color: transparent;
}
.el-pager li.btn-quicknext, .el-pager li.btn-quickprev{
  color: #b3b3b3;
}
</style>
