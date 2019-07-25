<template>
  <el-form
    label-width="150px"
    status-icon
    label-position="right"
    :hide-required-asterisk="true"
    :model="emailForm"
    ref="emailForm"
    :rules="emailFormRules"
  >
    <el-form-item :label="$t('iot_plat_server')" class="form-row" prop="smtp_server">
      <el-input v-model="emailForm.smtp_server" :placeholder="$t('iot_plat_input_emial_server')"></el-input>
      <span class="form-tip">*</span>
    </el-form-item>
    <el-form-item :label="$t('iot_plat_port')" class="form-row" prop="smtp_port">
      <el-input v-model="emailForm.smtp_port" :placeholder="$t('iot_plat_input_emial_server_port')"></el-input>
      <span class="form-tip">*</span>
    </el-form-item>
    <el-form-item :label="$t('iot_plat_send_account')" class="form-row" prop="smtp_account">
      <el-input v-model="emailForm.smtp_account" :placeholder="$t('iot_plat_input_emial_send_account')"></el-input>
      <span class="form-tip">*</span>
    </el-form-item>
    <el-form-item :label="$t('iot_plat_send_password')" class="form-row" prop="smtp_password">
      <el-input v-model="emailForm.smtp_password" :placeholder="$t('iot_plat_input_emia_send_password')"></el-input>
      <span class="form-tip">*</span>
    </el-form-item>
    <el-form-item :label="$t('iot_plat_template_language')" class="form-row" prop="temp_type">
      <el-select
        v-model="emailForm.temp_type"
        :placeholder="$t('iot_plat_select_template_language')"
        :no-data-text="$t('iot_plat_none_data')"
        @change="tempLangChange">
        <el-option
          v-for="item in multiLanguage"
          :key="item.language"
          :label="item.language_desc"
          :value="item.language"
        ></el-option>
      </el-select>
      <span class="form-tip">*</span>
    </el-form-item>
    <el-form-item :label="$t('iot_plat_template_type')" class="form-row" prop="class">
      <el-select
        v-model="emailForm.class"
        :placeholder="$t('iot_plat_select_template_type')"
        :no-data-text="$t('iot_plat_none_data')"
        :disabled="isUpdate">
        <el-option
          v-for="item in typeTemplate"
          :key="item.id"
          :label="$t(item.name)"
          :value="item.id"
        ></el-option>
      </el-select>
      <span class="form-tip">*</span>
    </el-form-item>
    <el-form-item :label="$t('iot_plat_subject')" class="form-row" prop="subject">
      <el-input v-model="emailTemplateLang[emailLanguage].subject" :placeholder="$t('iot_plat_input_subject')"></el-input>
      <span class="form-tip">*</span>
    </el-form-item>
    <el-form-item :label="$t('iot_plat_emial_template_content')" class="form-row" prop="mail_temp">
      <el-input type="textarea" :rows="6" :placeholder="$t('iot_plat_input_emial_template_content')" v-model="emailTemplateLang[emailLanguage].sms_temp"></el-input>
      <span class="form-tip">*</span>
    </el-form-item>
    <el-form-item label prop="smtp_tls">
      <el-checkbox :label="$t('iot_plat_use_tls')" name="smtp_tls" v-model="emailForm.smtp_tls"></el-checkbox>
    </el-form-item>
    <el-form-item label style="margin-top: 4.33rem;">
      <el-button type="primary" class="btn-submit" @click="createEmailSeting">{{$t("iot_plat_confirm")}}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { typeTemplate } from "@/lib/const";
import { COOP_EMAIL_ADD_POST, COOP_EMAIL_UPDATE_POST } from "@/lib/api";
import _ from "lodash";
export default {
  props: {
    clientId: {
      type    : String,
      required: true
    },
    /**
     * 待编辑的数据
     */
    formData: { type: Object }
  },
  data () {
    const validate = (rule, value, callback) => {
      const temp = this.emailTemplateLang[this.emailLanguage]
      if (rule.field === "mail_temp" && !temp.sms_temp) {
        callback(new Error(this.$t("iot_plat_input_emial_template_content")));
      }
      if (rule.field === "subject" && !temp.subject) {
        callback(new Error(this.$t("iot_plat_input_subject")));
      }
      callback();
    };

    const validateNumber = (rule, value, callback) => {
      if (!Number.isInteger(Number(value))) {
        callback(new Error(this.$t("iot_plat_input_number_please")));
      }
      callback()
    }
    return {
      multiLanguage: this.$store.getters.getLanguages,
      typeTemplate : typeTemplate,
      isUpdate     : false,
      emailLanguage: "CN",
      emailForm    : {
        client_id    : this.clientId,
        smtp_server  : "",
        smtp_port    : "",
        smtp_tls     : "",
        smtp_account : "",
        smtp_password: "",
        temp_type    : "",
        mail_temp    : "",
        subject      : "",
        "class"      : ""
      },
      emailTemplateLang: {
        CN: {
          sms_sign: "",
          subject : "",
          sms_temp: ""
        },
        CN_AL: {
          sms_sign: "",
          sms_temp: ""
        },
        EN: {
          sms_sign: "",
          subject : "",
          sms_temp: ""
        },
        EN_AL: {
          sms_sign: "",
          sms_temp: ""
        },
        PT: {
          sms_sign: "",
          subject : "",
          sms_temp: ""
        },
        PT_AL: {
          sms_sign: "",
          sms_temp: ""
        },
        IT: {
          sms_sign: "",
          subject : "",
          sms_temp: ""
        },
        IT_AL: {
          sms_sign: "",
          sms_temp: ""
        },
        RU: {
          sms_sign: "",
          subject : "",
          sms_temp: ""
        },
        RU_AL: {
          sms_sign: "",
          sms_temp: ""
        }
      },
      emailFormRules: {
        smtp_server: [ { required: true, message: this.$t("iot_plat_input_emial_server"), trigger: "change" } ],
        smtp_port  : [ 
          { required: true, message: this.$t("iot_plat_input_emial_server_port"), trigger: "change" }, { validator: validateNumber, trigger: "change" }
        ],
        smtp_account : [ { required: true, message: this.$t("iot_plat_input_emial_send_account"), trigger: "change" } ],
        smtp_password: [ { required: true, message: this.$t("iot_plat_input_emia_send_password"), trigger: "change" } ],
        temp_type    : [ { required: true, message: this.$t("iot_plat_select_template_language"), trigger: "change" } ],
        mail_temp    : [ { validator: validate, trigger: "change" } ],
        subject      : [ { validator: validate, trigger: "change" } ],
        "class"      : [ { required: true, message: this.$t("iot_plat_select_template_type"), trigger: "change" } ]
      }
    }
  },
  created (){
    this.initForm(this.formData, true)
  },

  watch: {
    formData (newVal) {
      this.initForm(newVal)
    }
  },
  methods: {
    /** 
     * 判断新增还是更新，分别作出不同的处理
     * data props中的formData
     * flag 是否是在组件创建时调用
     */
    initForm (data, flag) {
      // newVal 无值时，表示为添加操作，要清空表单数据
      if (!data && !flag) { this.resetForm(); this.isUpdate = false; return }
      if (data) {
        this.isUpdate = true
        // this.defaultTempInfo()
        
        this.emailForm.smtp_server = data.smtp_server
        this.emailForm.smtp_port = data.smtp_port
        this.emailForm.smtp_tls = Boolean(data.smtp_tls)
        this.emailForm.smtp_account = data.smtp_account
        this.emailForm.smtp_password = data.smtp_password
        this.emailForm["class"] = data["class"]

        this.emailForm.temp_type = "CN"
        this.emailLanguage = "CN"
        this.emailTemplateLang = JSON.parse(data.str_translation)
      }
    },
    tempLangChange(val) {
      this.emailForm.temp_type = val
      this.emailLanguage = val
    },
    resetForm () {
      this.$refs.emailForm.resetFields();
      this.emailForm.smtp_server = ""
      this.emailForm.smtp_port = ""
      this.emailForm.smtp_tls = ""
      this.emailForm.smtp_account = ""
      this.emailForm.smtp_password = ""
      this.emailForm.temp_type = ""
      this.emailForm["class"] = ""
      Object.keys(this.emailTemplateLang).forEach(key => {
        const temp = this.emailTemplateLang[key]
        temp.sms_sign = ""
        temp.sms_temp = ""
        if ("subject" in temp) {
          temp.subject = ""
        }
      })
    },
    createEmailSeting: _.debounce(function() {
      this.$refs.emailForm.validate(async valid => {
        if (valid) {
          const loading = this.vmLoadingFull();
          try {
            this.emailForm.smtp_tls = Number(this.emailForm.smtp_tls);
            this.emailForm.str_translation = JSON.stringify(this.emailTemplateLang)
            const param = this.createFormData(this.emailForm);
            const url = this.isUpdate ? COOP_EMAIL_UPDATE_POST : COOP_EMAIL_ADD_POST
            const res = await this.$http.post(url, param)
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess(this.$t("iot_plat_set_success"));
              this.resetForm()
              this.$emit("close")
            }
            loading.close();
          } catch (error) {
            loading.close();
            this.vmMsgError(this.$t("iot_plat_program_error"));
          }
        }
      });
    }, this.DEBOUNCE_TIME)
  }
}
</script>
