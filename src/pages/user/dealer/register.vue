<template>
  <div class="container">
    <div class="main">
      <div class="panel">
        <div class="panel-pos">
          <el-row>
            <el-col :span="6">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-col>
            <el-col :span="18">
              <p class="brand">
                <span>{{$t("iot_plat_mktech_registered")}}</span>
              </p>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</el-col>
            <el-col :span="18">
              <p class="tips">{{$t("iot_plat_registering_dealer")}}</p>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form :model="formData" status-icon ref="signUpForm" :rules="rules" label-position="right" label-width="140px">
                <el-form-item :label="$t('iot_plat_name')" prop="name" class="row">
                  <el-input
                    :placeholder="$t('iot_plat_input_company_name')"
                    v-model="formData.name"
                    :disabled="isUpdateForm"
                    clearable>
                  </el-input>
                </el-form-item>
                <el-form-item :label="$t('iot_plat_contact_number')" prop="tel" class="row">
                  <el-input
                    :placeholder="$t('iot_plat_input_contact_number')"
                    v-model="formData.tel"
                    :disabled="isUpdateForm">
                  </el-input>
                </el-form-item>
                <el-form-item :label="$t('iot_plat_mailing_address')" prop="addr" class="row">
                  <el-input
                    :placeholder="$t('iot_plat_input_mailing_address')"
                    v-model="formData.addr"
                    :disabled="isUpdateForm">
                  </el-input>
                </el-form-item>
                <el-form-item class="forgot" prop="protocolChecked" v-if='isShowBtn'>
                  <el-checkbox v-model="formData.protocolChecked">{{$t("iot_plat_agree_mktech_protocol")}}
                    <!-- 同意 <a style="color: #3193e6">《迈科智能用户协议》</a> -->
                  </el-checkbox>
                </el-form-item>
                <el-form-item v-if='isShowBtn'>
                  <el-button class="btn-signup" type="primary" @click="signUp">{{$t("iot_plat_registered")}}</el-button>
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
import { PARTNER_AUTH_POST, COOP_AUTH_GET } from "@/lib/api.js"
import { validatePhone, validateFixPhone } from "@/lib/validate.js"
import { AUTH_UPDATE } from "@/store/mutations-type"
import { generateMenus, coopMenuRouteMap } from "@/lib/route-menu-map"
import { createRoutes } from "@/router/routes/index"
import { getState } from "@/lib/mixins"
import _ from "lodash"
export default {
  mixins: [ { methods: { getState } } ],
  data () {
    const validateIsEmpty = (rule, value, callback) => {
      if (value === "") {
        if (rule.field === "name") {
          callback(new Error(this.$t("iot_plat_input_company_name")))
        } else if (rule.field === "addr") {
          callback(new Error(this.$t("iot_plat_input_mailing_address")))
        }
      }
      callback()
    }
    const validateAPhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("iot_plat_input_contact_number")))
      } else {
        const isFixPhone = validateFixPhone(value)
        const isPhone = validatePhone(value)
        if (!isFixPhone && !isPhone) {
          callback(new Error(this.$t("iot_plat_input_correct_contact_number")))
        }
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
      // 判断是否显示提交按钮，是经销商就不显示
      isShowBtn   : false,
      // 判断是否禁止编辑表单
      isUpdateForm: false,
      formData    : {
        role           : this.merchantCode.dealer,
        name           : "",
        addr           : "",
        tel            : "",
        protocolChecked: true
      },
      rules: {
        name: [
          { validator: validateIsEmpty, trigger: "blur" }
        ],
        addr: [
          { validator: validateIsEmpty, trigger: "blur" }
        ],
        tel: [
          { validator: validateAPhone, trigger: "blur" }
        ],
        protocolChecked: [
          { validator: validateProtocol }
        ]
      }
    }
  },
  created () {
    document.body.addEventListener("keydown", this.keyCodeDown, false)
    this.queryState()
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
    signUp: _.debounce(function () {
      try {
        this.$refs.signUpForm.validate(async valid => {
          if (valid) {
            const res = await this.$http.post(PARTNER_AUTH_POST, this.createFormData(this.formData))
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess(this.$t("iot_plat_registered_success"))

              Promise.all([ this.getState(this.merchantCode.coop), this.getState(this.merchantCode.dealer) ]).then(response => {
                // 未提交认证且未注册经销商
                this.resoveState(response)
              })
            }
          }
        }) 
      } catch (error) {
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    }, this.DEBOUNCE_TIME),

    async resoveState (response) {
      if (response[0] && response[0].data.company_status === this.authCode.NO_SUBMIT && (response[1] && !response[1].data.DealerAndCompanys)) {
        this.$router.push("/manage/coopApply")
        this.vmMsgError(this.$t("iot_plat_unknow_identity"))
      } else {
        if (response[1].data.DealerAndCompanys) {
          const res = await this.$http.post(COOP_AUTH_GET)
          if (res.data.title) {
            this.$router.addRoutes(createRoutes(res.data.title))
            this.$store.commit(AUTH_UPDATE, { menus: generateMenus(res.data.title, coopMenuRouteMap) })
          }
        }
        if (response[0] && response[0].data.company_status !== this.authCode.NO_SUBMIT) {
          this.$router.push("/manage/user/home/1"); return
        }
        this.$router.push("/manage/user/deviceManage/1")
      }
    },

    queryState () {
      Promise.all([ this.getState(this.merchantCode.coop), this.getState(this.merchantCode.dealer) ]).then(res => {
        if (res[0].data.company_status === this.authCode.PASS) {
          // 为合作商，显示合作商信息
          this.formData.name = res[0].data.data.name
          this.formData.addr = res[0].data.data.addr
          this.formData.tel = res[0].data.data.tel
          /*
           * this.isUpdateForm = true
           * return false
           */
        }
        if (!res[1].data.DealerAndCompanys) {
          // 不是合作商且未注册为经销商，可以进行经销商注册
          this.isShowBtn = true
        } else {
          // 是经销商，显示经销商信息，禁止修改
          this.formData.name = res[1].data.data.name
          this.formData.addr = res[1].data.data.addr
          this.formData.tel = res[1].data.data.tel
          this.isUpdateForm = true
        }
      })
    }
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
    background: #292c31;
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
  height: 100%;
  display: flex;
  align-items: center;
  margin: 10rem auto;
  width: 35.67rem;
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
.code-panel {
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
