<template>
  <div class="main">
    <div class="container layout">
      <el-row>
        <el-col :span="24">
          <el-menu
            default-active="1"
            background-color="#3b3f42"
            text-color="rgba(255, 255, 255, 0.5)"
            active-text-color="#ffd04b">
            <el-submenu index="1">
              <template slot="title">
                  <span>合作商</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="1" @click="routeGo('/manage/home')">
                  <i class="iconfont icon-shouye"></i>
                  <span slot="title">首页</span>
                </el-menu-item>
                <el-menu-item index="2" @click="routeGo('/manage/user/model')">
                  <i class="iconfont icon-shebeixinghao"></i>
                  <span slot="title">设备型号</span>
                </el-menu-item>
                <el-menu-item index="3" @click="routeGo('/manage/user/firmware')">
                  <i class="iconfont icon-gujianguanli"></i>
                  <span slot="title">固件管理</span>
                </el-menu-item>
                <el-menu-item index="4" @click="routeGo('/manage/user/appVersion')">
                  <i class="iconfont icon-APPbanben1"></i>
                  <span slot="title">APP管理</span>
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">
                <span>Admin管理</span>
              </template>
              <el-menu-item index="5" @click="routeGo('/manage/admin/category')">
                <i class="iconfont icon-shebeileibie"></i>
                <span slot="title">设备类别</span>
              </el-menu-item>
              <el-menu-item index="6" @click="routeGo('/manage/admin/model')">
                <i class="iconfont icon-shebeixinghao"></i>
                <span slot="title">设备型号</span>
              </el-menu-item>
              <el-menu-item index="7" @click="routeGo('/manage/admin/sKey')">
                <i class="iconfont icon-KEY"></i>
                <span slot="title">KEY</span>
              </el-menu-item>
              <el-menu-item index="8" @click="routeGo('/manage/admin/firmware')">
                <i class="iconfont icon-gujianguanli"></i>
                <span slot="title">固件管理</span>
              </el-menu-item>
              <el-menu-item index="9" @click="routeGo('/manage/admin/cooperation')">
                <i class="iconfont icon-hezuo"></i>
                <span slot="title">合作</span>
              </el-menu-item>
              <el-menu-item index="10" @click="routeGo('/manage/admin/users')">
                <i class="iconfont icon-yonghuguanli"></i>
                <span slot="title">用户管理</span>
              </el-menu-item>
              <el-menu-item index="11" @click="routeGo('/manage/admin/appVersion')">
                <i class="iconfont icon-APPbanben1"></i>
                <span slot="title">APP管理</span>
              </el-menu-item>
              <el-submenu index="2-1">
                <template slot="title">
                  <i class="iconfont icon-shenheguanli"></i>
                  <span>审核管理</span>
                </template>
                  <el-menu-item index="13" @click="routeGo('/manage/admin/reviewCompany')">
                    <i class="iconfont icon-APPbanben1"></i>
                    <span slot="title">公司</span>
                  </el-menu-item>
                  <el-menu-item index="14" @click="routeGo('')">
                    <i class="iconfont icon-APPbanben1"></i>
                    <span slot="title">型号</span>
                  </el-menu-item>
                  <el-menu-item index="15" @click="routeGo('')">
                    <i class="iconfont icon-APPbanben1"></i>
                    <span slot="title">固件</span>
                  </el-menu-item>
                  <el-menu-item index="16" @click="routeGo('')">
                    <i class="iconfont icon-APPbanben1"></i>
                    <span slot="title">类别</span>
                  </el-menu-item>
              </el-submenu>
            </el-submenu>
          </el-menu>
        </el-col>
      </el-row>
    </div>
    <el-dialog
      title=""
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :append-to-body="true"
      :before-close="handleClose" class="key_dialog">
      <el-row type="flex" justify="center">
        <el-col :span="17">
          <el-row class="key_dialog_head">
            <h3>KEY信息</h3>
            <p>* 每个账号独有一个ID和KEY，请保存并牢记，切勿泄露给他人</p>
          </el-row>
          <el-row>
            <el-form :model="ruleForm" ref="ruleForm" label-width="50px">
              <el-form-item label="ID">
                <el-input readonly v-model="ruleForm.name"></el-input>
              </el-form-item>
              <el-form-item label="KEY">
                <el-input readonly v-model="ruleForm.name"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="confirm" style="width:100%;">确定</el-button>
              </el-form-item>
            </el-form>
          </el-row>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dialogVisible: false,
      ruleForm: {
        name: '发过火发个和'
      }
    }
  },
  methods: {
    routeGo (path) {
      if (path === '/manage/admin/sKey') { // 为key的话就弹框
        this.dialogVisible = true
      } else {
        this.$router.push(path)
      }
    },
    handleClose (done) {
      done()
    },
    confirm () {
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>
@media (max-width:1366px) {
  .main {
    width: 170px;
    padding-bottom: 4000px;
    margin-bottom: -4000px;
    padding-right: 2px;
    background: #3b3f42;
    height: 100%;
    overflow: auto;
  }
  .el-row, .el-col, .el-menu {
      height: auto;
  }
}

@media (min-width:1366px) {
    .el-row, .el-col, .el-menu {
        height: 100%;
    }
    .main {
      height: 100%;
      overflow: hidden;
      padding-bottom: 4000px;
      margin-bottom: -4000px;
      background: #3b3f42;
    }
    .container {
      margin-right: -1.5rem;
      overflow-y: scroll;
    }
}
.container {
    overflow-x: hidden;
    height: 100%;
}

.el-menu {
    border-right: none;
}

.el-menu /deep/ .el-menu-item {
    /* padding-left: 2.5rem !important; */
}
.el-menu /deep/ i {
    font-size: 2rem;
    margin-right: 2rem;
}
.key_dialog /deep/ .el-dialog{
  width:78.4rem;
}
.key_dialog_head{
  text-align: center;
}
.key_dialog_head h3{
  font-size:1.8rem;
  color: #ffffff;
}
.key_dialog_head p{
  font-size:1.2rem;
  color: #e36068;
}
.key_dialog .el-form{
  margin-top:4.7rem;
}
.key_dialog /deep/ .el-dialog__body{
  padding: 2rem 0 4.7rem;
}
.key_dialog .el-button{
  margin-top:2.8rem;
}
</style>
