<template>
  <div class="container">
    <div class="panel">
      <div class="panel-pos">
        <el-row>
          <el-col :span="4">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-col>
          <el-col :span="20">
            <p class="brand">
              <i class="iconfont icon-wulianwang logo"></i><span>注册</span>
            </p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form :model="formData" status-icon ref="signUpForm" :rules="rules" label-position="right" label-width="80px">
              <el-form-item label="账号" prop="user_name" class="row">
                <el-input
                  placeholder="请输入手机号/邮箱"
                  v-model="formData.user_name"
                  clearable>
                </el-input>
              </el-form-item>
              <el-form-item label="验证码" prop="vcode" class="code-panel row">
                <el-input
                  placeholder="请输入验证码"
                  v-model="formData.vcode">
                </el-input>
                <CheckCodeComponent :isReset="toResetBtnCode" v-on:emit-statu="getVerificationCode"></CheckCodeComponent>
              </el-form-item>
              <el-form-item label="输入密码" prop="text_pass" class="row">
                <el-input
                  type="password"
                  placeholder="请输入密码"
                  v-model="formData.text_pass">
                  <i slot="suffix" class="iconfont icon-chakanmima_guan"></i>
                </el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="confirmPassword">
                <el-input
                  type="password"
                  placeholder="请再次输入密码"
                  v-model="formData.confirmPassword">
                  <i slot="suffix" class="iconfont icon-chakanmima_guan"></i>
                </el-input>
              </el-form-item>
              <el-form-item class="forgot" prop="protocolChecked">
                <el-checkbox v-model="formData.protocolChecked">同意 <a href="" style="color: #3193e6">《迈科智能用户协议》</a></el-checkbox>
              </el-form-item>
              <el-form-item>
                <el-button class="btn-signup" type="primary" @click="signUp">注册</el-button>
              </el-form-item>
              <el-form-item>
                <router-link to="/signin" class="sign-up">已有账号？去登录</router-link>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import CheckCodeComponent from '@/components/_ui/verificate-code.vue'
import { validateEmail, validatePhone } from '@/lib/validate.js'
import { CODE_POST, SIGNUP_POST } from '@/lib/api.js'
import _ from 'lodash'
export default {
  components: { CheckCodeComponent },
  data () {
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

    let validateIsEmpty = (rule, value, callback) => {
      if (value === '') {
        if (rule.field === 'vcode') {
          callback(new Error('请输入验证码'))
        } else if (rule.field === 'text_pass') {
          callback(new Error('请输入密码'))
        }
      }
      callback()
    }

    let validatePassPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.formData.text_pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
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
      toResetBtnCode: false,
      formData: {
        user_name: '',
        text_pass: '',
        confirmPassword: '',
        vcode: '',
        protocolChecked: true
      },
      rules: {
        user_name: [
          { validator: validateAccount, trigger: 'blur' }
        ],
        text_pass: [
          { validator: validateIsEmpty, trigger: 'blur' },
          { min: 8, max: 30, message: '长度在 8 到 30 个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { validator: validatePassPass, trigger: 'blur' }
        ],
        vcode: [
          { validator: validateIsEmpty, trigger: 'blur' }
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
    /** 获取验证码 */
    getVerificationCode: _.debounce(function () {
      if (!this.formData.user_name) {
        this.toResetBtnCode = true
        this.vmMsgWarning('请填写手机号或邮箱'); return
      }
      let data = this.createFormData({
        type: 1,
        user_name: this.formData.user_name
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
    }, 300),
    signUp: _.debounce(function () {
      this.$refs['signUpForm'].validate((valid) => {
        if (valid) {
          this.$http.post(SIGNUP_POST, this.createFormData(this.formData)).then(res => {
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess('注册成功！')
              this.$router.push('/signin')
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
    margin-top: -20rem;
    margin-left: -4.67rem;
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
    height: 100%;;
    display: flex;
    align-items: center;
    margin: 0 auto;
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
/* } */
</style>
