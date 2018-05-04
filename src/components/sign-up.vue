<template>
  <div class="container">
    <div class="panel">
      <div class="panel-pos">
        <el-row>
          <el-col :span="4">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-col>
          <el-col :span="20">
            <p class="brand">
              <i class="iconfont logo"></i>
              <span>注册</span>
            </p>
          </el-col>
        </el-row>
        <el-row :gutter="14">
          <el-col :span="6"><span class="sign-up-label">账号</span></el-col>
          <el-col :span="18">
            <el-input
              placeholder="请输入手机号/邮箱"
              v-model="account"
              clearable>
            </el-input>
          </el-col>
        </el-row>
        <el-row class="mt1" :gutter="14">
          <el-col :span="6"><span class="sign-up-label">验证码</span></el-col>
          <el-col :span="18" class="code-panel">
            <el-input
              placeholder="请输入验证码"
              v-model="password">
            </el-input>
            <el-button type="primary">获取验证码</el-button>
          </el-col>
        </el-row>
        <el-row class="mt1" :gutter="14">
          <el-col :span="6"><span class="sign-up-label">输入密码</span></el-col>
          <el-col :span="18">
            <el-input
              type="password"
              placeholder="请输入密码"
              v-model="password">
              <i slot="suffix" class="el-input__icon fa fa-eye-slash"></i>
            </el-input>
          </el-col>
        </el-row>
        <el-row class="mt1" :gutter="14">
          <el-col :span="6"><span class="sign-up-label">确认密码</span></el-col>
          <el-col :span="18">
            <el-input
              type="password"
              placeholder="请再次输入密码"
              v-model="password">
              <i slot="suffix" class="el-input__icon fa fa-eye-slash"></i>
            </el-input>
          </el-col>
        </el-row>
        <el-row :gutter="14">
          <el-col :span="6">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-col>
          <el-col :span="18" class="forgot">
             <el-checkbox v-model="pwChecked">同意 <a href="" style="color: #3193e6">《迈科智能用户协议》</a></el-checkbox>
          </el-col>
        </el-row>
        <el-row :gutter="14">
          <el-col :span="6">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-col>
          <el-col :span="18">
             <el-button class="btn-signup" type="primary" >注册</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="14">
          <el-col :span="6">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-col>
          <el-col :span="18">
             <router-link to="/signin" class="sign-up">已有账号？去登录</router-link>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      account: '',
      password: '',
      pwChecked: true
    }
  },
  methods: {
    signIn () {
      this.$router.push('/manage')
    }
  }
}
</script>

<style scoped>
  .container {
    height: 100%;
    position: relative;
    background: url('../assets/bg.jpg') no-repeat;
    background-size: cover;
  }
  .panel {
    position: absolute;
    left: 50%;
    width: 34rem;
    height: 100%;;
    margin-left: -19rem;
    display: flex;
    align-items: center;
  }
  .panel-pos {
    width: 100%;
    text-align: center;
    color: #fff;
    margin-top: -20rem;
  }

  .panel .brand {
    font-size: 3rem;
    padding: 6rem 0;
  }
  .panel .brand i.logo {
    width: 3rem;
    height: 3rem;
    display: inline-block;
    background: url('../assets/logo.png') no-repeat center center;
    vertical-align: text-bottom;
  }

  .btn-signup {
    width: 100%;
    border-radius: 0;
    margin: 2rem 0;
  }

  .sign-up-label {
    line-height: 40px;
    float: right;
    font-size: 1.6rem;
  }

  .forgot {
    margin-top: 1rem;
  }
  .forgot .el-checkbox {
    float: left;
  }

  .sign-up {
    color: #3193e6;
    font-size: 1.4rem;
  }
  .mt1 {
    margin-top: 5px;
  }
  .code-panel{
    position: relative;
  }

  .code-panel .el-button {
    padding: .5rem;
    position: absolute;
    right: 1.2rem;
    top: 0.6rem;
    font-size: 1.2rem;
    background: #1f7ecf;
  }
</style>
