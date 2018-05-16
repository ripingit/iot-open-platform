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
             <router-link to="">忘记密码？</router-link>
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
  </div>
</template>

<script>
import JSEncrypt from 'jsencrypt'
import { SIGNIN_POST, TOKEN_POST } from '../lib/api.js'

export default {
  data () {
    return {
      formData: {
        account: '',
        password: ''
      },
      pwChecked: true,
      rules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    let pwdChecked = localStorage['_ck']
    this.pwChecked = !pwdChecked ? true : Boolean(pwdChecked)

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
      let loading = this.vmLoadingFull()
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
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
              sessionStorage['isLogin'] = true
              this.$router.push('/manage')
            }
          }).catch(e => {
            this.vmMsgError('网络错误！')
            loading.close()
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
    background: url('../assets/img/bg.jpg') no-repeat;
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

  .el-button {
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

  #rsakey {
    display: none;
  }
</style>
