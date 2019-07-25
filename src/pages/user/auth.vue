<template>
  <div class="content-container">
    <el-row>
      <el-col :span="24">
        <div class="big-font"></div>
        <div class="small-font">
          <p class="cn">{{$t("iot_plat_apply_qualifications")}}</p><p class="en">ELIGIBILITY</p>
        </div>
      </el-col>
    </el-row>
    <el-row class="panel">
      <el-col :span="8" class="eligibility">
        <div class="eligi-icon right">
          <i class="iconfont icon-yingyezhizhao" aria-hidden="true"></i>
          <i class="iconfont pass icon-duihao1"></i>
        </div>
        <div class="eligi-desc">
          <p class="name">{{$t("iot_plat_company_qualifications")}}</p>
          <p class="note note-01">{{$t("iot_plat_apply_condition_desc")}}</p>
        </div>
      </el-col>
      <el-col :span="8" class="eligibility center">
        <div class="eligi-icon">
          <i class="iconfont icon-yingjianzhichi" aria-hidden="true"></i>
          <i class="iconfont pass icon-duihao1"></i>
        </div>
        <div class="eligi-desc">
          <p class="name">{{$t("iot_plat_hardware_support")}}</p>
          <p class="note note-02">{{$t("iot_plat_have_hardware_own")}}</p>
        </div>
      </el-col>
      <el-col :span="8" class="eligibility">
        <div class="eligi-icon">
          <i class="iconfont icon-ruanjianzhichi" aria-hidden="true"></i>
          <i class="iconfont pass icon-duihao1"></i>
        </div>
        <div class="eligi-desc">
          <p class="name">{{$t("iot_plat_software_support")}}</p>
          <p class="note note-03">{{$t("iot_plat_have_develop_tech")}}</p>
        </div>
      </el-col>
    </el-row>
    <el-row class="mt30">
      <el-col :span="24">
        <div class="big-font"></div>
        <div class="small-font">
          <p class="cn">{{$t("iot_plat_certification_process")}}</p><p class="en">WORKFLOW</p>
        </div>
      </el-col>
    </el-row>
    <el-row class="panel flow">
      <el-col :span="24">
        <el-steps :active="steps" finish-status="success">
          <el-step :title="$t('iot_plat_registered_mktech_account')" :description="$t('iot_plat_remember_username_password')"></el-step>
          <el-step :title="$t('iot_plat_apply_certification')" :description="$t('iot_plat_apply_mktech_certification')"></el-step>
          <el-step :title="authResult" :status="proStatu" :description="description"></el-step>
          <!--<el-step title="申请KEY" description="认证可查看到独有的KEY请牢记"></el-step>-->
        </el-steps>
        <el-steps class="step-operation">
          <el-step></el-step>
          <el-step v-if="isShowSubmit" class="auth"></el-step>
          <el-step v-else-if="canUpdate" @click.native="showDialog" class="edit">
            <template v-slot:icon>{{$t("iot_plat_submit_cert")}}</template>
          </el-step>
          <!-- 使用if 而不是 else 是因为 $t，if会导致界面状态改变$t 无法正常渲染 -->
          <el-step v-if="!isShowSubmit && !canUpdate" @click.native="showDialog">
            <template v-slot:icon>{{$t("iot_plat_miodify_info")}}</template>
          </el-step>
          <el-step v-if="isShowUpdate || isUpdateState" class="review"></el-step>
          <el-step v-if="!isShowUpdate && !isUpdateState" @click.native="updateReviewState(true)">
            <template v-slot:icon>{{$t("iot_plat_refresh")}}</template>
          </el-step>
          <!--<el-step class="key"></el-step>-->
        </el-steps>
      </el-col>
    </el-row>

    <el-dialog :title="$t('iot_plat_submit_review')" :visible.sync="isDialogVisible" center>
      <p class="note">* {{$t("iot_plat_with_business_license_same")}}</p>
      <el-form :model="form" status-icon ref="authForm" :rules="rules" label-position="right" label-width="150px">
        <el-form-item :label="$t('iot_plat_company_name')" prop="name" class="form-row" v-if="authStatu !== authCode.PASS">
          <el-input
            :placeholder="$t('iot_plat_input_company_full_name')"
            v-model="form.name"
            clearable>
          </el-input>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item :label="$t('iot_plat_company_english_name')" prop="en_name" class="form-row" v-if="authStatu !== authCode.PASS">
          <el-input
            :placeholder="$t('iot_plat_input_company_english_name')"
            v-model="form.en_name"
            clearable>
          </el-input>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item :label="$t('iot_plat_id_number')" prop="agency_code" class="form-row" v-if="authStatu !== authCode.PASS">
          <el-input
            :placeholder="$t('iot_plat_input_company_id_number')"
            v-model="form.agency_code">
          </el-input>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item :label="$t('iot_plat_mailing_address')" prop="addr" class="form-row">
          <el-input
            :placeholder="$t('iot_plat_input_mailing_address')"
            v-model="form.addr">
          </el-input>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item :label="$t('iot_plat_contact_number')" prop="tel" class="form-row">
          <el-input
            :placeholder="$t('iot_plat_input_contact_number')"
            v-model="form.tel">
          </el-input>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item :label="$t('iot_plat_business_license')" prop="file_ids" class="form-row" v-if="authStatu !== authCode.PASS">
          <div class="form-btn-upload">
            <UploadComponent
              class="pic-format-2"
              :path="uploadPath"
              :previewPath="form.file_ids"
              :accept="['image/jpeg', 'image/png']"
              :size="2"
              model="preview"
              :condition="$t('iot_plat_picture_desc_04')"
              @response="getUploadResult"
            ></UploadComponent>
          </div>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item prop="protocolChecked" class="form-row" v-if="authStatu !== authCode.PASS">
          <el-checkbox v-model="form.protocolChecked">{{$t("iot_plat_agree_mktech_protocol")}}
            <!-- 同意 <a href="" style="color: #3193e6">《迈科智能用户协议》</a> -->
          </el-checkbox>
        </el-form-item>
        <el-form-item class="form-row">
           <el-button class="btn-submit" type="primary" @click="authenticate">{{$t("iot_plat_submit")}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import "@/assets/css/content.css"
import { CERT_UPLOAD_POST, PARTNER_AUTH_POST, UPDATE_AUTH_STATE_POST, COOP_AUTH_GET } from "@/lib/api.js"
import { validatePhone, validateFixPhone, validateBusinessLicense } from "@/lib/validate.js"
import { AUTH_CHANGE, USER_ID_UPDATE, USER_KEY_UPDATE, AUTH_UPDATE } from "@/store/mutations-type"
import { generateMenus, coopMenuRouteMap } from "@/lib/route-menu-map"
import { createRoutes } from "@/router/routes/index"
import UploadComponent from "@/components/uploader/upload.vue";
export default {
  components: { UploadComponent },
  data () {
    const validateIsEmpty = (rule, value, callback) => {
      if (rule.field === "protocolChecked") {
        if (!value) { callback(new Error(this.$t("iot_plat_agree_mktech_protocol_please"))) }
      }
      if (value === "") {
        if (rule.field === "name") {
          callback(new Error(this.$t("iot_plat_input_company_name_please")))
        } else if (rule.field === "addr") {
          callback(new Error(this.$t("iot_plat_input_mailing_address")))
        } else if (rule.field === "agency_code") {
          callback(new Error(this.$t("iot_plat_input_id_number")))
        } else if (rule.field === "tel") {
          callback(new Error(this.$t("iot_plat_input_contact_number")))
        } else if (rule.field === "file_ids") {
          callback(new Error(this.$t("iot_plat_upload_business_license")))
        }
      } else {
        if (rule.field === "tel") {
          if (!validatePhone(value) && !validateFixPhone(value)) {
            callback(new Error(this.$t("iot_plat_input_corret_phone_number")))
          }
        }
        if (rule.field === "agency_code") {
          if (!validateBusinessLicense(value)) {
            callback(new Error(this.$t("iot_plat_input_corret_business_license_number")))
          }
        }
      }
      callback()
    }
    return {
      authStatu       : this.$store.getters.getAuthState,
      isUpdateState   : false,
      isToUpdate      : false,
      uploadPath      : CERT_UPLOAD_POST,
      isDialogVisible : false,
      protocolChecked : false,
      uploadProgress  : "",
      isUploading     : true,
      authFailedReason: "",
      picPath         : "",
      picTip          : this.$t("iot_plat_picture_desc_04"),
      form            : {
        role           : this.merchantCode.coop,
        name           : "",
        en_name        : "",
        addr           : "",
        agency_code    : "",
        tel            : "",
        protocolChecked: true,
        file_ids       : ""
      },
      rules: {
        name: [
          { validator: validateIsEmpty, trigger: "blur" }
        ],
        addr: [
          { validator: validateIsEmpty, trigger: "blur" }
        ],
        agency_code: [
          { validator: validateIsEmpty, trigger: "blur" }
        ],
        tel: [
          { validator: validateIsEmpty, trigger: "blur" }
        ],
        protocolChecked: [
          { validator: validateIsEmpty, trigger: "blur" }
        ],
        file_ids: [
          { validator: validateIsEmpty, trigger: "blur" }
        ]
      }
    }
  },
  computed: {
    canUpdate () {
      return this.isToUpdate && this.authStatu === this.authCode.PASS
    },
    isShowSubmit () {
      return this.authStatu === this.authCode.WAIT
    },
    isShowUpdate () {
      return this.authStatu !== this.authCode.WAIT
    },
    steps () {
      const REJECT = 2
      const PASS = 4
      return this.authStatu === this.authCode.NO_SUBMIT ? 1
        : this.authStatu === this.authCode.WAIT || this.authStatu === this.authCode.REJECT ? REJECT
          : this.authStatu === this.authCode.PASS ? PASS : PASS
    },
    authResult () {
      return this.authStatu === this.authCode.NO_SUBMIT ? this.$t("iot_plat_waiting_review")
        : this.authStatu === this.authCode.WAIT ? this.$t("iot_plat_reviewing")
          : this.authStatu === this.authCode.PASS ? this.$t("iot_plat_rewiew_pass")
            : this.authStatu === this.authCode.REJECT ? this.$t("iot_plat_review_no_pass") : this.$t("iot_plat_unknow_state")
    },
    description () {
      return this.authStatu === this.authCode.REJECT ? this.authFailedReason : this.$t("iot_plat_24_hour_feedback")
    },
    proStatu () {
      if (this.authStatu === this.authCode.NO_SUBMIT) { return "wait" }
      if (this.authStatu === this.authCode.REJECT) { return "error" }
      if (this.authStatu === this.authCode.PASS) { return "success" }
      return "process"
    }
  },
  created () {
    this.updateReviewState(false)
  },
  methods: {
    showDialog () {
      this.isDialogVisible = true
    },

    authenticate () {
      try {
        this.$refs.authForm.validate(async valid => {
          if (valid) {
            const loading = this.vmLoadingFull()
            const res = await this.$http.post(PARTNER_AUTH_POST, this.createFormData(this.form))
            loading.close()
            if (this.vmResponseHandler(res)) {
              this.isDialogVisible = false
              if (this.authStatu === this.authCode.PASS) {
                return this.vmMsgSuccess(this.$t("iot_plat_edit_success"));
              } 
              this.vmMsgSuccess(this.$t("iot_plat_review_submit_success"))
              
              this.isUploading = true
              this.uploadProgress = ""
              this.$refs.authForm.resetFields()
              this.authStatu = this.authCode.WAIT
              this.$store.commit(AUTH_CHANGE, { authState: this.authCode.WAIT })
            }
          }
        })
      } catch (error) {
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    },
    async updateReviewState (flag) {
      const loading = this.vmLoadingFull()
      try {
        this.isUpdateState = true
        const res = await this.$http.post(UPDATE_AUTH_STATE_POST, this.createFormData({ role: this.merchantCode.coop }))
        loading.close()
        if (this.vmResponseHandler(res)) {
          this.isUpdateState = false
          this.isToUpdate = res.data.company_change
          this.authStatu = res.data.company_status
          this.authFailedReason = res.data.data.review_mark
          this.$store.commit(AUTH_CHANGE, { authState: res.data.company_status })
          this.$store.commit(USER_ID_UPDATE, { ID: res.data.company_client_id })
          this.$store.commit(USER_KEY_UPDATE, { KEY: res.data.company_client_secret })
          if (this.authStatu === this.authCode.REJECT || this.authStatu === this.authCode.PASS) {
            this.form.name = res.data.data.name
            this.form.en_name = res.data.data.en_name
            this.form.addr = res.data.data.addr
            this.form.agency_code = res.data.data.agency_code
            this.form.tel = res.data.data.tel
            this.form.file_ids = res.data.data.file_ids
            this.picPath = res.data.data.file_ids
            this.isUploading = false
          }
          if (flag && res.data.company_status === this.authCode.PASS) {
            this.$http.post(COOP_AUTH_GET).then(res => {
              if (res.data.title) {
                this.$router.addRoutes(createRoutes(res.data.title))
                this.$store.commit(AUTH_UPDATE, { menus: generateMenus(res.data.title, coopMenuRouteMap) })
              }
            })
          }
        }
      } catch (error) {
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    },

    getUploadResult (res) {
      if (res) {
        this.form.file_ids = res.file_ids
      }
    }
  }
}
</script>

<style scoped>
@media (min-width: 1366px) {
  /**大于笔记本屏幕 */
}
.content-container {
  padding: 5rem 5.83rem;
  color: #fff;
}
.panel {
  height: 17.5rem;
  background: #36393e;
  margin-top: 1.75rem;
  border-radius: 0.5rem;
}
.panel.flow {
  padding: 4.17rem;
  height: 24.25rem;
}
.big-font {
  font-size: 2.5rem;
  color: #3da0f4;
  display: inline-block;
  vertical-align: middle;
}
.small-font {
  display: inline-block;
  vertical-align: middle;
}

.small-font .cn {
  font-size: 1.5rem;
}
.small-font .en {
  font-size: 0.83rem;
  transform: scale(0.8);
  margin-left: -0.5rem;
  color: #808080;
  margin-top: 0.4rem;
}

.eligibility {
  text-align: center;
  height: 100%;
  display: flex;
  align-items: center;
}
.eligibility .right {
  flex: 1;
  text-align: right;
}
.eligibility.center {
  justify-content: center;
}
.eligibility i.iconfont {
  font-size: 6rem;
}
.eligibility i.pass {
  display: inline-block;
  font-size: inherit;
  width: 2.58rem;
  height: 2.58rem;
  border-radius: 50%;
  background-color: #2acba7;
  border: 0.17rem solid #36393e;
  position: absolute;
  bottom: -0.7rem;
  right: -0.8rem;
  line-height: 2.58rem;
  text-align: center;
}

.eligibility .eligi-icon,
.eligi-desc {
  display: inline-block;
  position: relative;
}
.eligibility .eligi-desc {
  text-align: left;
  padding-left: 2.5rem;
}

.eligibility .eligi-desc .name {
  font-size: 1.33rem;
}
.eligibility .eligi-desc .note {
  font-size: 1.17rem;
  line-height: 1.4;
  color: #9f9f9f;
  margin-top: 1.2rem;
}
.eligibility .eligi-desc .note-01 {
  width: 15.5rem;
}
.eligibility .eligi-desc .note-02 {
  width: 11rem;
}
.eligibility .eligi-desc .note-03 {
  width: 13rem;
}

.el-steps /deep/ .el-step__title.is-success,
.el-steps /deep/ .el-step__title.is-process,
.el-steps /deep/ .el-step__title.is-wait,
.el-steps /deep/ .el-step__head.is-success,
.el-steps /deep/ .el-step__head.is-error {
  color: #fff !important;
}
.el-steps /deep/ .el-step__head.is-error .el-step__icon.is-text,
.el-steps /deep/ .el-step__head.is-error .el-step__line {
  border: none;
  background: #f56c6c;
}
.el-steps /deep/ .el-step__head.is-success .el-step__icon.is-text,
.el-steps /deep/ .el-step__head.is-success .el-step__line {
  background: #2acba7;
  border: none;
}
.el-steps /deep/ .el-step__head.is-success .el-step__line-inner {
  width: 0 !important;
}
.el-steps /deep/ .el-step__head.is-process .el-step__icon.is-text {
  border: 0.17rem solid #2acba7;
  background: #36393e;
  color: transparent;
}
.el-steps /deep/ .el-step__head.is-process .el-step__line,
.el-steps /deep/ .el-step__head.is-wait .el-step__line,
.el-steps /deep/ .el-step__head.is-error .el-step__line {
  background-color: #808080;
}

.el-steps /deep/ .el-step__head.is-wait .el-step__icon.is-text {
  border: 0.17rem solid #808080;
  background: #36393e;
  color: transparent;
}

.el-steps /deep/ .el-step__description.is-success,
.el-steps /deep/ .el-step__description.is-process {
  color: #9f9f9f;
  font-size: 1.17rem;
}

.el-steps /deep/ .el-step:nth-child(2) .el-step__description {
  width: 9.4rem;
}
.el-steps /deep/ .el-step:nth-child(3) .el-step__description {
  width: 9.4rem;
}
.el-steps /deep/ .el-step:nth-child(4) .el-step__description {
  width: 11rem;
}

.step-operation {
  margin-top: 1.5rem;
}
.step-operation .el-step:first-child /deep/ .el-step__head,
.step-operation .el-step:nth-child(2) /deep/ .el-step__head .el-step__line,
.step-operation .el-step:nth-child(3) /deep/ .el-step__head .el-step__line,
.step-operation
  .el-step:nth-child(2)
  /deep/
  .el-step__head
  .el-step__icon
  .el-step__icon-inner,
.step-operation
  .el-step:nth-child(3)
  /deep/
  .el-step__head
  .el-step__icon
  .el-step__icon-inner,
.step-operation
  .el-step:nth-child(4)
  /deep/
  .el-step__head
  .el-step__icon
  .el-step__icon-inner,
.step-operation .el-step.auth:nth-child(2) /deep/ .el-step__head .el-step__icon,
.step-operation
  .el-step.review:nth-child(3)
  /deep/
  .el-step__head
  .el-step__icon,
.step-operation .el-step.key:nth-child(4) /deep/ .el-step__head .el-step__icon {
  display: none;
}

.step-operation .el-step:nth-child(2) /deep/ .el-step__head .el-step__icon {
  width: 7.8rem;
  height: 2.5rem;
  border: solid 1px #3da0f4;
  border-radius: 0;
  background: transparent;
  color: #3da0f4;
  font-size: 1.17rem;
  cursor: pointer;
}

.step-operation
  .el-step:nth-child(2)
  /deep/
  .el-step__head
  .el-step__icon:active {
  border: none;
  background: #3da0f4;
}
.step-operation
  .el-step:nth-child(2)
  /deep/
  .el-step__head
  .el-step__icon:active::after {
  color: #fff;
}

.step-operation .el-step:nth-child(3) /deep/ .el-step__head .el-step__icon{
  color: #2acba7;
  cursor: pointer;
}

.step-operation .el-step:nth-child(3) /deep/ .el-step__head .el-step__icon,
.step-operation .el-step:nth-child(4) /deep/ .el-step__head .el-step__icon {
  width: 7.8rem;
  height: 2.5rem;
  border: none;
  background: transparent;
}
.step-operation
  .el-step.loading:nth-child(3)
  /deep/
  .el-step__head
  .el-step__icon::after {
  content: "\E61E";
  position: absolute;
  left: 0;
}
.step-operation
  .el-step:nth-child(3)
  /deep/
  .el-step__head
  .el-step__icon::after,
.step-operation
  .el-step:nth-child(4)
  /deep/
  .el-step__head
  .el-step__icon::after {
  color: #ff6870;
  position: absolute;
  left: 0;
}
.el-dialog__wrapper /deep/ .el-dialog {
  width: 51rem;
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
.el-dialog .form-img-cert {
  display: inline-block;
  width: 14rem;
  height: 8rem;
  background: #636363;
  vertical-align: middle;
  color: #fff;
  text-align: center;
  line-height: 8rem;
}
.el-dialog .form-btn-upload {
  display: inline-block;
  vertical-align: middle;
}
.el-dialog .form-btn-upload .btn-upload {
  height: 8rem;
  width: 3rem;
  border-radius: 0;
  padding: 0;
  font-size: 1.2rem;
  background: #1f7ecf;
  border: none;
}
.mt30 {
  margin-top: 3rem;
}
</style>
