<template>
  <el-dialog
    :title="$t('iot_plat_retrieve_pwd')"
    :visible.sync="isForgotVisible"
    width="60rem"
    center>
    <p class="note">* {{$t("iot_plat_ammin_distribution_reset")}}</p>
    <el-form :model="formDataCheck" status-icon ref="checkForm" :rules="rulesCheck" label-position="right" label-width="180px">
      <el-form-item :label="$t('iot_plat_change_account')" prop="user_name" class="form-row">
        <el-input
          :placeholder="$t('iot_plat_input_phone_emial')"
          v-model="formDataCheck.user_name"
          clearable>
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('iot_plat_vertification_code')" prop="vcode" class="form-row">
        <el-input
          :placeholder="$t('iot_plat_input_vertification_code')"
          v-model="formDataCheck.vcode"
          clearable
          style="width: 15rem">
        </el-input>
        <CheckCodeComponent class="btn-code" :isReset="toResetBtnCode" v-on:emit-statu="getCheckCode"></CheckCodeComponent>
      </el-form-item>
      <el-form-item :label="$t('iot_plat_new_password')" prop="new_pass" class="form-row">
        <el-input
          type="password"
          :placeholder="$t('iot_plat_input_new_password')"
          v-model="formDataCheck.new_pass"
          clearable>
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('iot_plat_confirm_new_password')" prop="confirmPass" class="form-row">
        <el-input
          type="password"
          :placeholder="$t('iot_plat_input_new_password_again')"
          v-model="formDataCheck.confirmPass"
          clearable>
        </el-input>
      </el-form-item>
      <el-form-item class="form-row" style="margin-top: 2rem">
        <el-button type="primary" class="btn-submit" @click="changePassword">{{$t("iot_plat_confirm")}}</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>


<script>
import CheckCodeComponent from "@/components/veritificate-code/verificate-code.vue"
import { LOST_PASS_POST, CODE_POST } from "@/lib/api.js"
import { validateEmail, validatePhone } from "@/lib/validate.js"
import _ from "lodash"
export default {
  components: { CheckCodeComponent },
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("iot_plat_input_password_again")))
      } else if (value !== this.formDataCheck.new_pass) {
        callback(new Error(this.$t("iot_plat_twice_input_not_same")))
      } else {
        callback()
      }
    }
    const validateIsEmpty = (rule, value, callback) => {
      if (value === "") {
        if (rule.field === "vcode") {
          callback(new Error(this.$t("iot_plat_input_vertification_code")))
        } else if (rule.field === "confirmPass" || rule.field === "new_pass") {
          callback(new Error(this.$t("iot_plat_input_pwd_please")))
        }
      }
      callback()
    }
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
    return {
      isForgotVisible: false,
      toResetBtnCode : false,
      formDataCheck  : {
        user_name  : "",
        vcode      : "",
        new_pass   : "",
        confirmPass: ""
      },
      rulesCheck: {
        user_name: [
          { validator: validateAccount, trigger: "blur" }
        ],
        new_pass: [
          { validator: validateIsEmpty, trigger: "blur" }, { min: 8, max: 50, message: this.$t("iot_plat_str_length_limit"), trigger: "blur" }
        ],
        confirmPass: [
          { validator: validatePass, trigger: "blur" }
        ],
        vcode: [
          { validator: validateIsEmpty, trigger: "blur" }
        ]
      }
    }
  },
  methods: {
    getCheckCode: _.debounce(async function () {
      if (!this.formDataCheck.user_name) {
        this.toResetBtnCode = !this.toResetBtnCode
        return this.vmMsgWarning(this.$t("iot_plat_input_phone_emial"));
      }
      try {
        const data = this.createFormData({
          type     : 2,
          user_name: this.formDataCheck.user_name
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
    changePassword: _.debounce(function () {
      try {
        this.$refs.checkForm.validate(async valid => {
          if (valid) {
            const res = await this.$http.post(LOST_PASS_POST, this.createFormData(this.formDataCheck))
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess(this.$t("iot_plat_passwrod_reset_success"))
              this.isForgotVisible = false
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
.btn-code {
  width: 9.7rem;
  height: 3.33rem;
  margin: 0;
}

.el-dialog .note {
  position: absolute;
  top: 5rem;
  width: 100%;
  left: 0;
  text-align: center;
  color: #e36068;
  font-size: 1rem;
}
</style>
