<template>
  <el-form
    label-width="150px"
    status-icon
    :hide-required-asterisk="true"
    label-position="right"
    :model="smsForm"
    ref="smsForm"
    :rules="smsFormRules"
  >
    <el-form-item :label="$t('iot_plat_operators')" class="form-row" prop="operators">
      <el-select
        v-model="smsForm.operators"
        :placeholder="$t('iot_plat_select_operators_please')"
        :no-data-text="$t('iot_plat_none_data')"
        @change="operatorChange">
        <el-option
          v-for="item in operators"
          :key="item.id"
          :label="$t(item.label)"
          :value="item.id"
        ></el-option>
      </el-select>
      <span class="form-tip">*</span>
    </el-form-item>
    <el-form-item :label="$t('iot_plat_app_id')" class="form-row" :prop="appId">
      <el-input v-model="smsForm[appId]" :placeholder="$t('iot_plat_input_app_id')"></el-input>
      <span class="form-tip">*</span>
    </el-form-item>
    <el-form-item :label="$t('iot_plat_app_seckey')" class="form-row" :prop="appSeckey">
      <el-input v-model="smsForm[appSeckey]" :placeholder="$t('iot_plat_input_app_key')"></el-input>
      <span class="form-tip">*</span>
    </el-form-item>
    <el-form-item :label="$t('iot_plat_template_type')" class="form-row" prop="class">
      <el-select
        v-model="smsForm.class"
        :placeholder="$t('iot_plat_select_template_type')"
        :no-data-text="$t('iot_plat_none_data')"
        :disabled="isUpdate"
      >
        <el-option
          v-for="item in typeTemplate"
          :key="item.id"
          :label="$t(item.name)"
          :value="item.id"
        ></el-option>
      </el-select>
      <span class="form-tip">*</span>
    </el-form-item>
    <el-form-item :label="$t('iot_plat_template_language')" class="form-row" prop="temp_type">
      <el-select
        v-model="smsForm.temp_type"
        :placeholder="$t('iot_plat_select_template_language')"
        :no-data-text="$t('iot_plat_none_data')"
        @change="smsTempLangChange"
      >
        <el-option
          v-for="item in multiLanguage"
          :key="item.language"
          :label="item.language_desc"
          :value="item.language"
        ></el-option>
      </el-select>
      <span class="form-tip">*</span>
    </el-form-item>
    <el-form-item :label="$t('iot_plat_sign')" class="form-row" prop="sms_sign">
      <el-input v-model="smsTemplateLang[smsLanguage].sms_sign" :placeholder="$t('iot_plat_input_sign')"></el-input>
      <span class="form-tip">*</span>
    </el-form-item>
    <el-form-item :label="$t('iot_plat_subject')" class="form-row" v-if="smsForm.operators === 'aws'" prop="subject">
      <el-input v-model="smsTemplateLang[smsLanguage].subject" :placeholder="$t('iot_plat_input_subject')"></el-input>
      <span class="form-tip">*</span>
    </el-form-item>
    <el-form-item :label="$t('iot_plat_template_content')" class="form-row" prop="sms_temp">
      <el-input type="textarea" :rows="6" v-model="smsTemplateLang[smsLanguage].sms_temp" :placeholder="$t('iot_plat_input_template_content')"></el-input>
      <span class="form-tip">*</span>
    </el-form-item>
    <el-form-item label style="margin-top: 4.33rem;">
      <el-button type="primary" class="btn-submit" @click="createSmsSeting">{{$t("iot_plat_confirm")}}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { operators } from "@/lib/mixins"
import { typeTemplate } from "@/lib/const";
import { COOP_SMS_ADD_POST, COOP_SMS_UPDATE_POST } from "@/lib/api";
import _ from "lodash";

const mixins = {
  data () {
    return { operators: operators }
  }
}

const appIdMap = {
  aliyun: "app_id",
  aws   : "app_id_out"
}

const appSeckeyMap = {
  aliyun: "app_seckey",
  aws   : "app_seckey_out"
}
/**
 * @TODO 编辑时某些字段禁用
 */
export default {
  mixins: [ mixins ],
  props : {
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
      const tempInfo = this.smsTemplateLang[this.smsLanguage]
      if (!tempInfo.sms_sign && rule.field === "sms_sign"){
        callback(new Error(this.$t("iot_plat_input_sign")));
      } else if (!tempInfo.sms_temp && rule.field === "sms_temp"){
        callback(new Error(this.$t("iot_plat_input_template_content")));
      } else if (!tempInfo.subject && !this.smsLanguage.endsWith("AL") && rule.field === "subject"){
        callback(new Error(this.$t("iot_plat_input_subject")));
      }

      if (value === "") {
        if (rule.field === "app_id" || rule.field === "app_id_out") {
          callback(new Error(this.$t("iot_plat_input_app_id")));
        } else if (rule.field === "app_seckey_out" || rule.field === "app_seckey") {
          callback(new Error(this.$t("iot_plat_input_app_key")));
        }
      }
      callback();
    };
    return {
      appId          : appIdMap.aliyun,
      appSeckey      : appSeckeyMap.aliyun,
      typeTemplate   : typeTemplate,
      multiLanguage  : this.$store.getters.getLanguages,
      smsLanguage    : "CN",
      // 是否是编辑状态
      isUpdate       : false,
      smsTemplateLang: {
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
      smsForm: {
        client_id      : this.clientId,
        app_id         : "",
        app_id_out     : "",
        app_seckey     : "",
        app_seckey_out : "",
        operators      : "",
        temp_type      : "",
        "class"        : "",
        // sms_sign sms_temp subject 仅用于验证
        sms_sign       : "",
        sms_temp       : "",
        subject        : "",
        str_translation: ""
      },
      smsFormRules: {
        app_id        : [ { validator: validate, trigger: "change" } ],
        app_id_out    : [ { validator: validate, trigger: "change" } ],
        app_seckey_out: [ { validator: validate, trigger: "change" } ],
        app_seckey    : [ { validator: validate, trigger: "change" } ],
        temp_type     : [ { required: true, message: this.$t("iot_plat_select_template_language"), trigger: "change" } ],
        "class"       : [ { required: true, message: this.$t("iot_plat_select_template_type"), trigger: "change" } ],
        sms_sign      : [ { validator: validate, trigger: "change" } ],
        sms_temp      : [ { validator: validate, trigger: "change" } ],
        subject       : [ { validator: validate, trigger: "change" } ]
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
        this.defaultTempInfo()
        
        this.smsForm.app_id = data.app_id
        this.smsForm.app_id_out = data.app_id_out
        this.smsForm.app_seckey = data.app_seckey
        this.smsForm.app_seckey_out = data.app_seckey_out
        this.smsForm["class"] = data["class"]

        this.smsForm.str_id = data.str_id
        this.smsTemplateLang = JSON.parse(data.str_translation)
      }
    },

    /**
     * 默认显示阿里云及中文模板
     */
    defaultTempInfo() {
      // 默认显示运营商为阿里云
      this.smsForm.operators = "aliyun"
      this.appId = appIdMap.aliyun
      this.appSeckey = appSeckeyMap.aliyun
      // 默认显示模板语言为中文
      this.smsForm.temp_type = "CN"
      this.smsLanguage = "CN_AL"
    },

    /** 
     * 重置表单
     */
    resetForm () {
      this.$refs.smsForm.resetFields()
      this.smsForm.app_id = ""
      this.smsForm.app_id_out = ""
      this.smsForm.app_seckey = ""
      this.smsForm.app_seckey_out = ""
      this.smsForm["class"] = ""
      this.smsForm.operators = ""
      this.smsForm.temp_type = ""
      Object.keys(this.smsTemplateLang).forEach(key => {
        const temp = this.smsTemplateLang[key]
        temp.sms_sign = ""
        temp.sms_temp = ""
        if ("subject" in temp) {
          temp.subject = ""
        }
      })
    },

    /**
     * 修改模板语言绑定
     */
    tempLangBind () {
      if (this.smsForm.operators === "aliyun") {
        this.smsLanguage = `${this.smsForm.temp_type}_AL`; return
      }
      this.smsLanguage = this.smsForm.temp_type
    },
    operatorChange (val) {
      this.appId = appIdMap[val]
      this.appSeckey = appSeckeyMap[val]
      if (this.smsForm.temp_type) {
        this.tempLangBind()
      }
    },
    smsTempLangChange(val) {
      this.smsForm.temp_type = val
      this.tempLangBind()
    },
    createSmsSeting: _.debounce(function() {
      this.$refs.smsForm.validate(async valid => {
        if (valid) {
          const loading = this.vmLoadingFull();
          try {
            this.smsForm.str_translation = JSON.stringify(this.smsTemplateLang)
            const param = this.createFormData(this.smsForm);
            const url = this.isUpdate ? COOP_SMS_UPDATE_POST : COOP_SMS_ADD_POST
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
