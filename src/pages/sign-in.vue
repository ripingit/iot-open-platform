<template>
  <div class="container">
    <el-select class="lang-select" v-model="lang" @change="onLanguageChange">
      <el-option label="中文" value="CN"></el-option>
      <el-option label="English" value="EN"></el-option>
    </el-select>
    <div class="panel">
      <div class="panel-pos">
        <el-row>
          <el-col :span="24">
            <div class="brand">
              <p>
                <i class="iconfont icon-wulianwang logo"></i>
                <span>{{$t("iot_plat_mk_open_iot")}}</span>
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
                  :placeholder="$t('iot_plat_input_account')"
                  v-model="formData.account"
                  clearable>
                  <i slot="prefix" class="iconfont icon-yonghuming"></i>
                </el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  type="password"
                  :placeholder="$t('iot_plat_input_pwd_please')"
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
             <el-checkbox v-model="pwChecked" @click="rememberPass">{{$t("iot_plat_remember_password")}}</el-checkbox>
             <a @click="forgotPass">{{$t("iot_plat_forget_password")}}</a>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
             <el-button type="primary" @click="signIn">{{$t("iot_plat_login")}}</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
             <router-link to="/signup" class="sign-up">{{$t("iot_plat_none_account_and_registered")}}</router-link>
          </el-col>
        </el-row>
      </div>
    </div>

    <VersionComponent></VersionComponent>

    <textarea id="rsakey">-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDRxqikncjALzDx3qvj7NwGO+wd
od+Q4DuWZr/ZS5P5ze5ahCAjh8MMm2Nx8n8SqhKuB/cY79LEiWG3EGCV2AxU1hEV
YUCnRYiiN30nW7KNiuD6XigaiNQ/hTwBPWPykUKXTiC3tzA06iyVcyts+rIFlUJR
1hV4oaMvB7UZeBkhRQIDAQAB
-----END PUBLIC KEY-----
</textarea>

  <RetrievePassComponent ref="retrievePassComponent"></RetrievePassComponent>

  </div>
</template>

<script>
import VersionComponent from "@/components/version.vue"
import RetrievePassComponent from "./retrieve-pass.vue"
import JSEncrypt from "jsencrypt"
import { SIGNIN_POST, TOKEN_POST, SYSTEM_LANGUAGE } from "@/lib/api.js"
import { AUTH_CHANGE, IDENTITY_UPDATE, AUTH_UPDATE } from "@/store/mutations-type"
import { createRoutes } from "@/router/routes/index"
import { generateMenus, coopMenuRouteMap, adminMenuRouteMap } from "@/lib/route-menu-map"
import { getState } from "@/lib/mixins"

import _ from "lodash"
export default {
  mixins    : [ { methods: { getState } } ],
  components: { VersionComponent, RetrievePassComponent },
  data () {
    return {
      lang    : "",
      formData: {
        account : "",
        password: ""
      },
      pwChecked: true,
      rules    : {
        account: [
          { required: true, message: this.$t("iot_plat_input_account"), trigger: "blur" }
        ],
        password: [
          { required: true, message: this.$t("iot_plat_input_pwd_please"), trigger: "blur" }
        ]
      }
    }
  },
  created () {
    this.lang = localStorage.getItem("lang") || this.getSystemLanguage()
    const pwdChecked = localStorage.getItem("_ck")
    this.pwChecked = pwdChecked === void 0 ? true : Boolean(pwdChecked)

    if (this.pwChecked) {
      this.formData.account = localStorage.getItem("_acd")
    }

    this.getToken()
    this.onLanguageChange()

    document.body.addEventListener("keydown", this.keyCodeDown, false)
  },
  beforeDestroy () {
    document.body.removeEventListener("keydown", this.keyCodeDown, false)
  },
  methods: {
    keyCodeDown (e) {
      if (e.keyCode === this.ENTER_KEY_CODE) {
        if (this.isForgotVisible) {
          this.changePassword()
        } else {
          this.signIn()
        }
      }
    },
    rememberPass () {
      localStorage.setItem("_ck", this.pwChecked)
    },

    async onLanguageChange (val) {
      this.$i18n.locale = this.lang;
      localStorage.setItem("lang", this.lang)
      await this.$http.post(SYSTEM_LANGUAGE, this.createFormData({ lang: this.lang }))
      if (val) { location.reload() }
    },

    async getToken () {
      try {
        const res = await this.$http.post(TOKEN_POST)
        if (this.vmResponseHandler(res)) {
          sessionStorage.token = res.data.token
        }
      } catch (error) {
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    },
    signIn: _.debounce(function () {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          const loading = this.vmLoadingFull()
          try {
            localStorage.setItem("_acd", this.formData.account)

            const encrypt = new JSEncrypt()
            encrypt.setPublicKey(document.getElementById("rsakey").value)

            const token = sessionStorage.getItem("token")
            const data = this.createFormData({
              user_name: this.formData.account,
              password : encrypt.encrypt(token + this.formData.password)
            })
            const res = await this.$http.post(SIGNIN_POST, data)
            loading.close()
            if (this.vmResponseHandler(res)) {
              this.$store.dispatch("getLanguages", { identity: res.data.client_id })
              if (res.data.client_id === this.identityCode.ADMIN) {
                this.$store.commit(IDENTITY_UPDATE, { identity: res.data.client_id })
                this.$store.commit(AUTH_UPDATE, { menus: generateMenus(res.data.title, adminMenuRouteMap) })
                this.$router.addRoutes(createRoutes(res.data.title))
                this.$router.push("/manage/admin/home/0")
              } else {
                this.$store.commit(AUTH_CHANGE, { authState: res.data.company_status })
                this.$store.commit(IDENTITY_UPDATE, { identity: res.data.client_id || this.identityCode.COOP })
                this.$store.commit(AUTH_UPDATE, { menus: generateMenus(res.data.title, coopMenuRouteMap) })
                this.$router.addRoutes(createRoutes(res.data.title))
                Promise.all([ this.getState(this.merchantCode.coop), this.getState(this.merchantCode.dealer) ]).then(response => {
                  // 未提交认证且未注册经销商
                  if (response[0] && response[0].data.company_status === this.authCode.NO_SUBMIT && (response[1] && !response[1].data.DealerAndCompanys)) {
                    this.$router.push("/manage/coopApply")
                  } else {
                    // 通过审核的合作商登陆后进入主页
                    if (response[0] && response[0].data.company_status === this.authCode.PASS) {
                      this.$router.push("/manage/user/home/1"); return
                    }
                    // 未提交认证、提交认证尚未通过审核的合作商登陆后进入认证页
                    if (response[0] && response[0].data.company_status !== this.authCode.PASS) {
                      this.$router.push("/manage"); return
                    }
                    this.$store.commit(IDENTITY_UPDATE, { identity: this.identityCode.DEALER })
                    this.$router.push("/manage/user/deviceManage/1")
                  }
                })
              }
            }
          } catch (error) {
            loading.close()
            this.vmMsgError(this.$t("iot_plat_program_error"));
          }
        }
      })
    }, this.DEBOUNCE_TIME),

    forgotPass () {
      this.$refs.retrievePassComponent.isForgotVisible = true
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

.lang-select {
  position: absolute;
  right: 100px;
  top: 60px;
  border: none;
  background: #c0c0c0;
}
.lang-select.el-select /deep/ .el-input__inner {
  color: #1c1a1b;
}
.lang-select.el-select /deep/ .el-input .el-select__caret {
  color: #1c1c1c;
}

/* @media (min-width: 720px) { */
.container {
  height: 100%;
  position: relative;
  background: url("../assets/img/bg.jpg") no-repeat;
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
  cursor: pointer;
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
