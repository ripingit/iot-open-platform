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
              <el-form-item label="账号" prop="account" class="row">
                <el-input
                  placeholder="请输入手机号/邮箱"
                  v-model="formData.account"
                  clearable>
                </el-input>
              </el-form-item>
              <el-form-item label="验证码" prop="vertificateCode" class="code-panel row">
                <el-input
                  placeholder="请输入验证码"
                  v-model="formData.vertificateCode">
                </el-input>
                <el-button type="primary" size="mini">获取验证码</el-button>
              </el-form-item>
              <el-form-item label="输入密码" prop="password" class="row">
                <el-input
                  type="password"
                  placeholder="请输入密码"
                  v-model="formData.password">
                  <i slot="suffix" class="el-input__icon fa fa-eye-slash"></i>
                </el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="password">
                <el-input
                  type="password"
                  placeholder="请再次输入密码"
                  v-model="formData.password">
                  <i slot="suffix" class="el-input__icon fa fa-eye-slash"></i>
                </el-input>
              </el-form-item>
              <el-form-item class="forgot">
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
import { validateEmail, validatePhone } from '../lib/validate.js'
export default {
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
        if (rule.field === 'vertificateCode') {
          callback(new Error('请输入验证码'))
        } else if (rule.field === 'password') {
          callback(new Error('请输入密码'))
        }
      }
      callback()
    }

    return {
      formData: {
        account: '',
        password: '',
        vertificateCode: '',
        protocolChecked: true
      },
      rules: {
        account: [
          { validator: validateAccount, trigger: 'blur' }
        ],
        password: [
          { validator: validateIsEmpty, trigger: 'blur' },
          { min: 8, max: 50, message: '长度在 8 到 50 个字符', trigger: 'blur' }
        ],
        vertificateCode: [
          { validator: validateIsEmpty, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    signUp () {
      this.$refs['signUpForm'].validate((valid) => {
        if (valid) {
          this.$http.get(`/aaa/getdevice`, this.formData).then(res => {
            console.log(res)
          })
        }
      })
    }
  }
}
</script>

<style scoped>
/* @media (min-width: 720px) { */
  .container {
    height: 100%;
    position: relative;
    background: url('../assets/img/bg.jpg') no-repeat;
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
    width: 6.67rem;
    height: 2.17rem;
    right: 0.67rem;
    top: 0.6rem;
    font-size: 1rem;
    background: #1f7ecf;
    border: none;
    padding: 0.56rem 0.83rem;
  }
/* } */
</style>
