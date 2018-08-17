<template>
  <div class="container">
    <div class="main">
      <div class="panel">
        <div class="panel-pos">
          <el-row>
            <el-col :span="4">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-col>
            <el-col :span="20">
              <p class="brand">
                <span>迈科智能开放平台注册</span>
              </p>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-col>
            <el-col :span="20">
              <p class="tips">您正在注册成为经销商（权限：设备管理等）</p>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form :model="formData" status-icon ref="signUpForm" :rules="rules" label-position="right" label-width="80px">
                <el-form-item label="名称" prop="name" class="row">
                  <el-input
                    placeholder="请输入公司或者商铺名称"
                    v-model="formData.name"
                    clearable>
                  </el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="tel" class="row">
                  <el-input
                    placeholder="请输入联系电话"
                    v-model="formData.tel">
                  </el-input>
                </el-form-item>
                <el-form-item label="通讯地址" prop="addr" class="row">
                  <el-input
                    placeholder="请输入通讯地址"
                    v-model="formData.addr">
                  </el-input>
                </el-form-item>
                <el-form-item class="forgot" prop="protocolChecked">
                  <el-checkbox v-model="formData.protocolChecked">同意 <a href="" style="color: #3193e6">《迈科智能用户协议》</a></el-checkbox>
                </el-form-item>
                <el-form-item>
                  <el-button class="btn-signup" type="primary" @click="signUp">注册</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { PARTNER_AUTH_POST, COOP_AUTH_GET } from '@/lib/api.js'
import { validatePhone, validateFixPhone } from '@/lib/validate.js'
import { AUTH_UPDATE } from '@/store/mutations-type'
import { generateMenus, coopMenuRouteMap } from '@/lib/route-menu-map'
import { createRoutes } from '@/router/routes/index'
import { getState } from '@/lib/mixins'
import _ from 'lodash'
export default {
  mixins: [{
    methods: { getState }
  }],
  data () {
    let validateIsEmpty = (rule, value, callback) => {
      if (value === '') {
        if (rule.field === 'name') {
          callback(new Error('请输入公司或商铺名称'))
        } else if (rule.field === 'addr') {
          callback(new Error('请输入通讯地址'))
        }
      }
      callback()
    }
    let validateAPhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入联系电话'))
      } else {
        let isFixPhone = validateFixPhone(value)
        let isPhone = validatePhone(value)
        if (!isFixPhone && !isPhone) {
          callback(new Error('请输入正确的联系电话'))
        }
        callback()
      }
    }
    let validateProtocol = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请勾选同意《迈科智能用户协议》'))
      } else {
        callback()
      }
    }

    return {
      formData: {
        role: this.merchantCode.dealer,
        name: '',
        addr: '',
        tel: '',
        protocolChecked: true
      },
      rules: {
        name: [
          { validator: validateIsEmpty, trigger: 'blur' }
        ],
        addr: [
          { validator: validateIsEmpty, trigger: 'blur' }
        ],
        tel: [
          { validator: validateAPhone, trigger: 'blur' }
        ],
        protocolChecked: [
          { validator: validateProtocol }
        ]
      }
    }
  },
  created () {
    document.body.addEventListener('keydown', this.keyCodeDown, false)
  },
  beforeDestroy () {
    document.body.removeEventListener('keydown', this.keyCodeDown, false)
  },
  methods: {
    keyCodeDown (e) {
      if (e.keyCode === 13) {
        this.signUp()
      }
    },
    signUp: _.debounce(function () {
      this.$refs['signUpForm'].validate((valid) => {
        if (valid) {
          this.$http.post(PARTNER_AUTH_POST, this.createFormData(this.formData)).then(res => {
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess('注册成功！')

              Promise.all([this.getState(this.merchantCode.coop), this.getState(this.merchantCode.dealer)]).then(response => {
                // 未提交认证且未注册经销商
                if ((response[0] && response[0].data.company_status === this.authCode.NO_SUBMIT) && (response[1] && !response[1].data.DealerAndCompanys)) {
                  this.$router.push('/manage/coopApply')
                  this.vmMsgError('身份不明')
                } else {
                  if (response[1].data.DealerAndCompanys) {
                    this.$http.post(COOP_AUTH_GET).then(res => {
                      if (res.data.title) {
                        this.$router.addRoutes(createRoutes(res.data.title))
                        this.$store.commit(AUTH_UPDATE, { menus: generateMenus(res.data.title, coopMenuRouteMap) })
                      }
                    })
                  }
                  if (response[0] && response[0].data.company_status !== this.authCode.NO_SUBMIT) {
                    this.$router.push('/manage/user/home/1'); return
                  }
                  this.$router.push('/manage/user/deviceManage/1')
                }
              })
            }
          }).catch(() => {
            this.vmMsgError('网络错误！')
          })
        }
      })
    }, 300)
  }
}
</script>

<style scoped>
@media (min-width: 1366px) {
  .panel-pos {
    margin-left: -4.67rem;
  }
}

@media (max-width: 1366px) {
  .main {
    padding-bottom: 4000px;
    margin-bottom: -4000px;
    background:#292c31;
    height: 100%;
    overflow: auto;
  }
}

/* @media (min-width: 720px) { */
  .container {
    height: 100%;
    position: relative;
  }
  .panel {
    height: 100%;;
    display: flex;
    align-items: center;
    margin: 10rem auto;
    width: 31.67rem;
  }
  .panel-pos {
    width: 100%;
    text-align: center;
    color: #fff;
  }

  .panel .brand {
    font-size: 2.5rem;
    padding: 5rem 0;
  }
  .panel .brand i.logo {
    font-size: 2.5rem;
    display: inline-block;
    vertical-align: bottom;
    margin-right: 1.33rem;
  }

  .btn-signup {
    width: 100%;
    border-radius: 0;
    margin: 1rem 0;
  }

  .el-form-item /deep/ .el-form-item__label {
    line-height: 40px;
    font-size: 1.17rem;
    color: #fff;
    padding-right: 1.17rem;
  }

  .el-form-item {
    margin-bottom: 0;
  }
  .row {
    margin-bottom: 0.5rem;
  }

  .forgot {
    margin-top: 1rem;
  }
  .forgot .el-checkbox {
    float: left;
  }

  .sign-up {
    color: #3193e6;
    font-size: 1.17rem;
  }
  .code-panel{
    position: relative;
  }

  .code-panel .el-button {
    position: absolute;
    height: 2.17rem;
    width: auto;
    right: 0.67rem;
    top: 0.6rem;
    font-size: 1rem;
    background: #1f7ecf;
    border: none;
    padding: 0.56rem 0.83rem;
  }
  .code-panel .el-button.disabled {
    background: #949494 !important;
  }
  .tips {
    margin: 2rem 0;
    text-align: left;
    text-indent: 0.5rem;
    font-size: 1.25rem;
  }
/* } */
</style>
