<template>
  <div class="main">
    <div class="layout">
      <el-row>
        <el-col :span="24">
          <el-menu
            default-active="1"
            background-color="#3b3f42"
            text-color="rgba(255, 255, 255, 0.5)"
            active-text-color="#ffd04b">
            <el-menu-item-group>
              <template slot="title">合作商</template>
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
            <el-menu-item-group>
              <template slot="title">Admin管理</template>
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
                    <span slot="title">公司</span>
                  </el-menu-item>
                  <el-menu-item index="14" @click="routeGo('/manage/admin/reviewModel')">
                    <span slot="title">型号</span>
                  </el-menu-item>
                  <el-menu-item index="15" @click="routeGo('/manage/admin/reviewFirmware')">
                    <span slot="title">固件</span>
                  </el-menu-item>
                  <el-menu-item index="16" @click="routeGo('/manage/admin/reviewCategory')">
                    <span slot="title">类别</span>
                  </el-menu-item>
              </el-submenu>
              <el-menu-item index="12" @click="routeGo('/manage/admin/admins')">
                <i class="iconfont icon-guanliyuan"></i>
                <span slot="title">管理员</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-menu>
        </el-col>
      </el-row>
    </div>
    <el-dialog
      title="KEY信息"
      center
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :append-to-body="true"
      :before-close="handleClose" class="key_dialog">
      <el-row class="key_dialog_head">
        <p>* 每个账号独有一个ID和KEY，请保存并牢记，切勿泄露给他人</p>
      </el-row>
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px">
      <el-form-item label="ID" class="form-row">
        <el-input readonly v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="KEY" class="form-row">
        <el-input readonly v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item style="margin-top: 4.33rem">
        <el-button type="primary" class="btn-submit" @click="confirm">确定</el-button>
      </el-form-item>
    </el-form>
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
      this.$emit('menu-toggle')
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
@media (max-width:1366px) { /**小于笔记本屏幕 */
  .el-menu {
    border-right: none;
    margin-right: -0.08rem;
  }
  .el-menu /deep/ .el-menu-item,
  .el-menu /deep/ .el-submenu__title {
      padding-left: 2.67rem !important;
  }
  .el-menu /deep/ .el-submenu__title+.el-menu .el-menu-item {
    padding-left: 7.08rem !important;
  }
  .el-menu /deep/ i.iconfont {
      font-size: 2rem;
      margin-right: 2rem;
  }
  .main {
    padding-bottom: 4000px;
    margin-bottom: -4000px;
    background: #3b3f42;
    height: 100%;
    overflow: auto;
  }
  .el-row, .el-col, .el-menu {
      height: auto;
  }
}

@media (min-width:1366px) { /**大于笔记本屏幕 */
  .el-row, .el-col, .el-menu {
    height: 100%;
  }
  .main {
    height: 100%;
    overflow: hidden;
  }
  .layout {
    overflow-y: scroll;
    overflow-x: hidden;
    height: 100%;
    margin-right: -1.7rem;
  }
  .el-menu {
      border-right: none;
  }
  .el-menu /deep/ .el-submenu__icon-arrow {
    right: 3.33rem;
    font-size: 1.4rem;
  }
  .el-menu /deep/ .el-menu-item,
  .el-menu /deep/ .el-submenu__title {
      padding-left: 2.67rem !important;
  }
  .el-menu /deep/ .el-submenu__title+.el-menu .el-menu-item {
    padding-left: 7.08rem !important;
  }
  .el-menu /deep/ i.iconfont {
      font-size: 2rem;
      margin-right: 2rem;
  }
}

.key_dialog /deep/ .el-dialog{
  width:65.33rem;
}

.key_dialog_head p{
  font-size:1rem;
  color: #e36068;
  text-align: center;
}
.key_dialog .el-form{
  margin-top:3.33rem;
}
.key_dialog /deep/ .el-dialog__body{
  padding-top:0;
}
</style>
