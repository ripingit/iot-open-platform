<template>
  <div class="container">
    <div class="panel">
      <div class="panel-pos">
        <el-row>
          <el-col :span="24">
            <div class="brand">
              <p>
                <i class="iconfont icon-wulianwang logo"></i>
                <span>迈科物联开放平台</span>
              </p>
              <p>
                <i class="iconfont placeholder"></i>
                <span class="name-en">MKTECH IOT OPEN PLATFORM</span>
              </p>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form :model="formData" status-icon :show-message="false" :rules="rules" ref="loginForm">
              <el-form-item prop="account">
                <el-input
                  placeholder="请输入账号"
                  v-model="formData.account"
                  clearable>
                  <i slot="prefix" class="iconfont icon-yonghuming"></i>
                </el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  type="password"
                  placeholder="请输入密码"
                  v-model="formData.password">
                  <i slot="prefix" class="iconfont icon-mima"></i>
                  <i slot="suffix" class="iconfont icon-chakanmima_guan"></i>
                </el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="forgot">
             <el-checkbox v-model="pwChecked" @click="rememberPass">记住密码</el-checkbox>
             <a @click="forgotPass">忘记密码？</a>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
             <el-button type="primary" @click="signIn">登录</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
             <router-link to="/signup" class="sign-up">还没账号？去注册</router-link>
          </el-col>
        </el-row>
      </div>
    </div>

    <textarea id="rsakey">-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDRxqikncjALzDx3qvj7NwGO+wd
od+Q4DuWZr/ZS5P5ze5ahCAjh8MMm2Nx8n8SqhKuB/cY79LEiWG3EGCV2AxU1hEV
YUCnRYiiN30nW7KNiuD6XigaiNQ/hTwBPWPykUKXTiC3tzA06iyVcyts+rIFlUJR
1hV4oaMvB7UZeBkhRQIDAQAB
-----END PUBLIC KEY-----
</textarea>

    <el-dialog
      title="找回密码"
      :visible.sync="isForgotVisible"
      width="50rem"
      center>
      <el-form :model="formDataCheck" status-icon ref="checkForm" :rules="rulesCheck" label-position="right" label-width="100px">
        <el-form-item label="账号" prop="user_name" class="form-row">
          <el-input
            placeholder="请输入手机号/邮箱"
            v-model="formDataCheck.user_name"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="vcode" class="form-row">
          <el-input
            placeholder="请输入验证码"
            v-model="formDataCheck.vcode"
            clearable
            style="width: 15rem">
          </el-input>
          <CheckCodeComponent class="btn-code" :isReset="toResetBtnCode" v-on:emit-statu="getCheckCode"></CheckCodeComponent>
        </el-form-item>
        <el-form-item label="新密码" prop="new_pass" class="form-row">
          <el-input
            type="password"
            placeholder="请输入新密码"
            v-model="formDataCheck.new_pass"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPass" class="form-row">
          <el-input
            type="password"
            placeholder="请再次输入新密码"
            v-model="formDataCheck.confirmPass"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item class="form-row" style="margin-top: 2rem">
          <el-button type="primary" class="btn-submit" @click="changePassword">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import CheckCodeComponent from '@/components/_ui/verificate-code.vue'
import JSEncrypt from 'jsencrypt'
import { validateEmail, validatePhone } from '@/lib/validate.js'
import { SIGNIN_POST, TOKEN_POST, LOST_PASS_POST, CODE_POST } from '@/lib/api.js'
import { AUTH_CHANGE, IDENTITY_UPDATE } from '@/store/mutations-type'
import { createRoutes } from '@/router/routes'

export default {
  components: { CheckCodeComponent },
  data () {
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.formDataCheck.new_pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    let validateIsEmpty = (rule, value, callback) => {
      if (value === '') {
        if (rule.field === 'vcode') {
          callback(new Error('请输入验证码'))
        } else if (rule.field === 'confirmPass' || rule.field === 'new_pass') {
          callback(new Error('请输入密码'))
        }
      }
      callback()
    }
    let validateAccount = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入账号'))
      } else {
        let isEmail = validateEmail(value)
        let isPhone = validatePhone(value)
        if (!isEmail && !isPhone) {
          callback(new Error('请输入正确的账号'))
        }
        callback()
      }
    }
    return {
      isForgotVisible: false,
      toResetBtnCode: false,
      formData: {
        account: '',
        password: ''
      },
      formDataCheck: {
        user_name: '',
        vcode: '',
        new_pass: '',
        confirmPass: ''
      },
      pwChecked: true,
      rules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      rulesCheck: {
        user_name: [
          { validator: validateAccount, trigger: 'blur' }
        ],
        new_pass: [
          { validator: validateIsEmpty, trigger: 'blur' },
          { min: 8, max: 50, message: '长度在 8 到 50 个字符', trigger: 'blur' }
        ],
        confirmPass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        vcode: [
          { validator: validateIsEmpty, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    let pwdChecked = localStorage['_ck']
    this.pwChecked = pwdChecked === undefined ? true : Boolean(pwdChecked)

    if (this.pwChecked) {
      this.formData.account = localStorage['_acd']
    }

    this.getToken()
  },
  methods: {
    rememberPass () {
      localStorage['_ck'] = this.pwChecked
    },
    getToken () {
      this.$http.post(TOKEN_POST).then(res => {
        if (this.vmResponseHandler(res)) {
          sessionStorage['token'] = res.data.token
        }
      }).catch(() => {
        this.vmMsgError('网络错误！')
      })
    },
    signIn () {
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          let loading = this.vmLoadingFull()
          if (this.pwChecked) {
            localStorage['_acd'] = this.formData.account
          } else {
            localStorage.removeItem('_acd')
          }

          let encrypt = new JSEncrypt()
          encrypt.setPublicKey(document.getElementById('rsakey').value)

          let token = sessionStorage['token']
          let data = this.createFormData({
            user_name: this.formData.account,
            password: encrypt.encrypt(token + this.formData.password)
          })
          this.$http.post(SIGNIN_POST, data).then(res => {
            loading.close()
            if (this.vmResponseHandler(res)) {
              this.$store.commit(AUTH_CHANGE, { authState: res.data.company_status })
              this.$store.commit(IDENTITY_UPDATE, { identity: res.data.client_id || this.identityCode.COOP })
              this.$router.addRoutes(createRoutes())
              this.$router.push('/manage')
            }
          }).catch(e => {
            this.vmMsgError('网络错误！')
            loading.close()
          })
        }
      })
    },

    forgotPass () {
      this.isForgotVisible = true
    },
    getCheckCode () {
      if (!this.formDataCheck.user_name) {
        this.toResetBtnCode = true
        this.vmMsgWarning('请填写手机号或邮箱'); return
      }
      let data = this.createFormData({
        type: 2,
        user_name: this.formDataCheck.user_name
      })
      this.$http.post(CODE_POST, data).then(res => {
        if (this.vmResponseHandler(res)) {
          this.vmMsgSuccess('验证码已发送！')
        } else {
          this.toResetBtnCode = true
        }
      }).catch((e) => {
        this.vmMsgError('网络错误！')
        this.toResetBtnCode = true
      })
    },
    changePassword () {
      this.$refs['checkForm'].validate((valid) => {
        if (valid) {
          this.$http.post(LOST_PASS_POST, this.createFormData(this.formDataCheck)).then(res => {
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess('您的密码已成功重置！')
              this.isForgotVisible = false
            }
          }).catch(() => {
            this.vmMsgError('网络错误！')
          })
        }
      })
    }
  }
}
</script>

<style scoped>

@media (min-width: 1366px) {
  .panel-pos {
    margin-top: -20rem;
  }
}

/* @media (min-width: 720px) { */
  .container {
    height: 100%;
    position: relative;
    background: url('../../assets/img/bg.jpg') no-repeat;
    background-size: cover;
  }
  .panel {
    height: 100%;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    align-items: center;
    width: 25rem;
  }
  .panel-pos {
    width: 100%;
    text-align: center;
    color: #fff;
  }
  .panel .brand {
    font-size: 2.5rem;
    padding: 3rem 0;
  }
  .panel .brand span.name-en {
    font-size: 1rem;
    letter-spacing: 0.2rem;
    color: #a8a8a8;
    vertical-align: text-top;
  }
  .panel .brand i.logo {
    font-size: 2.5rem;
    vertical-align: text-bottom;
  }
  .panel .brand i.logo,
  .panel .brand i.placeholder {
    width: 2.5rem;
    height: 2.5rem;
    display: inline-block;
  }

  .panel .el-button {
    width: 100%;
    border-radius: 0;
    margin: 2rem 0;
  }

  .forgot {
    margin-top: 1rem;
  }
  .forgot .el-checkbox {
    float: left;
  }

  .forgot a {
    float: right;
    color: #fff;
    text-decoration: none;
    font-size: 1.17rem;
    margin-top: 0.2rem;
  }

  .sign-up {
    color: #3193e6;
    font-size: 1.17rem;
  }
  .el-form-item {
    margin-bottom: 1px;
  }
/* } */

  .btn-code {
    width: 9.7rem;
    height: 3.33rem;
    margin: 0;
  }
  #rsakey {
    display: none;
  }
</style>
