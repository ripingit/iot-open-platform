<template>
  <div class="container">
    <div class="panel">
      <div class="panel-pos">
        <el-row>
          <el-col :span="4">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-col>
          <el-col :span="20">
            <p class="brand">
              <i class="iconfont icon-wulianwang logo"></i><span>{{$t("iot_plat_registered")}}</span>
            </p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form :model="formData" status-icon ref="signUpForm" :rules="rules" label-position="right" label-width="150px">
              <el-form-item :label="$t('iot_plat_account')" prop="user_name" class="row">
                <el-input
                  :placeholder="$t('iot_plat_input_phone_emial')"
                  v-model="formData.user_name"
                  clearable>
                </el-input>
              </el-form-item>
              <el-form-item :label="$t('iot_plat_vertification_code')" prop="vcode" class="code-panel row">
                <el-input
                  :placeholder="$t('iot_plat_input_vertification_code')"
                  v-model="formData.vcode">
                </el-input>
                <CheckCodeComponent :isReset="toResetBtnCode" v-on:emit-statu="getVerificationCode"></CheckCodeComponent>
              </el-form-item>
              <el-form-item :label="$t('iot_plat_password')" prop="text_pass" class="row">
                <el-input
                  type="password"
                  :placeholder="$t('iot_plat_input_pwd_please')"
                  v-model="formData.text_pass">
                  <i slot="suffix" class="iconfont icon-chakanmima_guan"></i>
                </el-input>
              </el-form-item>
              <el-form-item :label="$t('iot_plat_confirm_password')" prop="confirmPassword">
                <el-input
                  type="password"
                  :placeholder="$t('iot_plat_input_password_again')"
                  v-model="formData.confirmPassword">
                  <i slot="suffix" class="iconfont icon-chakanmima_guan"></i>
                </el-input>
              </el-form-item>
              <el-form-item class="forgot" prop="protocolChecked">
                <el-checkbox v-model="formData.protocolChecked">{{$t("iot_plat_agree_mktech_protocol")}}
                  <!-- 同意 <a href="" style="color: #3193e6">《迈科智能用户协议》</a> -->
                </el-checkbox>
              </el-form-item>
              <el-form-item>
                <el-button class="btn-signup" type="primary" @click="signUp">{{$t("iot_plat_registered")}}</el-button>
              </el-form-item>
              <el-form-item>
                <router-link to="/signin" class="sign-up">{{$t("iot_plat_have_account_and_login")}}</router-link>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import CheckCodeComponent from "@/components/veritificate-code/verificate-code.vue"
import { validateEmail, validatePhone } from "@/lib/validate.js"
import { CODE_POST, SIGNUP_POST } from "@/lib/api.js"
import _ from "lodash"
export default {
  components: { CheckCodeComponent },
  data () {
    const validateAccount = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("iot_plat_input_account")))
      } else {
        const isEmail = validateEmail(value)
        const isPhone = validatePhone(value)
        if (!isEmail && !isPhone) {
          callback(new Error(this.$t("iot_plat_input_corret_account")))
        }
        callback()
      }
    }

    const validateIsEmpty = (rule, value, callback) => {
      if (value === "") {
        if (rule.field === "vcode") {
          callback(new Error(this.$t("iot_plat_input_vertification_code")))
        } else if (rule.field === "text_pass") {
          callback(new Error(this.$t("iot_plat_input_pwd_please")))
        }
      }
      callback()
    }

    const validatePassPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("iot_plat_input_password_again")))
      } else if (value !== this.formData.text_pass) {
        callback(new Error(this.$t("iot_plat_twice_input_not_same")))
      } else {
        callback()
      }
    }
    const validateProtocol = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t("iot_plat_agree_mktech_protocol_please")))
      } else {
        callback()
      }
    }

    return {
      toResetBtnCode: false,
      formData      : {
        user_name      : "",
        text_pass      : "",
        confirmPassword: "",
        vcode          : "",
        protocolChecked: true
      },
      rules: {
        user_name: [
          { validator: validateAccount, trigger: "blur" }
        ],
        text_pass: [
          { validator: validateIsEmpty, trigger: "blur" }, { min: 8, max: 50, message: this.$t("iot_plat_str_length_limit"), trigger: "blur" }
        ],
        confirmPassword: [
          { validator: validatePassPass, trigger: "blur" }
        ],
        vcode: [
          { validator: validateIsEmpty, trigger: "blur" }
        ],
        protocolChecked: [
          { validator: validateProtocol }
        ]
      }
    }
  },
  created () {
    document.body.addEventListener("keydown", this.keyCodeDown, false)
  },
  beforeDestroy () {
    document.body.removeEventListener("keydown", this.keyCodeDown, false)
  },
  methods: {
    keyCodeDown (e) {
      if (e.keyCode === this.ENTER_KEY_CODE) {
        this.signUp()
      }
    },
    /** 获取验证码 */
    getVerificationCode: _.debounce(async function () {
      if (!this.formData.user_name) {
        this.toResetBtnCode = !this.toResetBtnCode
        return this.vmMsgWarning(this.$t("iot_plat_input_phone_emial")); 
      }
      try {
        const data = this.createFormData({
          type     : 1,
          user_name: this.formData.user_name
        })
        const res = await this.$http.post(CODE_POST, data)
        if (this.vmResponseHandler(res)) {
          this.vmMsgSuccess(this.$t("iot_plat_vertification_code_sended"))
        } else {
          this.toResetBtnCode = !this.toResetBtnCode
        }  
      } catch (error) {
        this.vmMsgError(this.$t("iot_plat_program_error"));
        this.toResetBtnCode = !this.toResetBtnCode
      }
    }, this.DEBOUNCE_TIME),
    signUp: _.debounce(function () {
      try {
        this.$refs.signUpForm.validate(async valid => {
          if (valid) {
            const res = await this.$http.post(SIGNUP_POST, this.createFormData(this.formData))
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess(this.$t("iot_plat_registered_success"))
              this.$router.push("/signin")
            }
          }
        })
      } catch (error) {
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    }, this.DEBOUNCE_TIME)
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
