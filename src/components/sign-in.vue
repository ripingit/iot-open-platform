<template>
  <div class="container">
    <div class="panel">
      <div class="panel-pos">
        <el-row>
          <el-col :span="24">
            <div class="brand">
              <p>
                <i class="iconfont logo"></i>
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
            <el-input
              placeholder="请输入账号"
              v-model="account"
              clearable>
              <i slot="prefix" class="el-input__icon fa fa-user-o"></i>
            </el-input>
          </el-col>
        </el-row>
        <el-row class="mt1">
          <el-col :span="24">
            <el-input
              type="password"
              placeholder="请输入密码"
              v-model="password">
              <i slot="prefix" class="el-input__icon fa fa-lock"></i>
              <i slot="suffix" class="el-input__icon fa fa-eye-slash"></i>
            </el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="forgot">
             <el-checkbox v-model="pwChecked">记住密码</el-checkbox>
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
    height: 100%;;
    margin-left: -12.5rem;
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
    padding: 4rem 0;
  }

  .panel .brand span.name-en {
    font-size: 1.2rem;
    letter-spacing: 0.2rem;
    color: #a8a8a8;
    vertical-align: text-top;
  }

  .panel .brand i.logo,
  .panel .brand i.placeholder {
    width: 3rem;
    height: 3rem;
    display: inline-block;
  }

  .panel .brand i.logo {
    background: url('../assets/logo.png') no-repeat center center;
    vertical-align: text-bottom;
  }

  .el-input {
    width: 25rem;
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
    font-size: 1.4rem;
    margin-top: 0.2rem;
  }

  .sign-up {
    color: #3193e6;
    font-size: 1.4rem;
  }
  .mt1 {
    margin-top: 1px;
  }
</style>
