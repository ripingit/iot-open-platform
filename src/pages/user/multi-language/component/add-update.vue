<template>
  <el-dialog :title="title" :visible.sync="isVisible" width="51rem" center :before-close="close">
    <el-form label-width="150px" status-icon :model="i18nForm" ref="i18nForm" :rules="rules" :hide-required-asterisk="true">
      <el-form-item :label="$t('iot_plat_variable')" class="form-row" prop="str_id">
        <el-input v-model="i18nForm.str_id" :placeholder="$t('iot_plat_input_variable')" :disabled="model !== 0"></el-input>
        <span class="form-tip">*</span>
      </el-form-item>
      <el-form-item v-for="(item, index) in multiLanguage" :key="index" :label="item.language_desc" class="form-row" :prop="item.language">
        <el-input v-model="translation[item.language]" :placeholder="$t('iot_plat_input_translate_language')"></el-input>
      </el-form-item>
      <el-form-item label style="margin-top: 4.33rem;">
        <el-button type="primary" class="btn-submit" @click="submit()">{{$t("iot_plat_confirm")}}</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { COOP_I18N_ADD, COOP_I18N_UPDATE } from "@/lib/api";
import _ from "lodash";

const TITLE = {
  add   : "iot_plat_add",
  update: "iot_plat_modify"
}

export default {
  props: {
    isVisible: {
      type     : Boolean,
      required : true,
      "default": false
    },
    /**
     * 修改时所需数据
     */
    data : { type: Object },
    /**
     * 判断是编辑还是添加，0 添加，1 编辑
     */
    model: {
      type     : Number,
      required : true,
      "default": 0
    }
  },
  watch: {
    isVisible (newVal) {
      if (newVal && this.model === 1) {
        this.i18nForm.str_id = this.data.str_id
        this.translation = _.clone(this.data.str_translation)
      }
    },
    model(newVal) {
      if (newVal || newVal === 0) {
        if (newVal === 0) {
          this.title = this.$t(TITLE.add)
        } else {
          this.title = this.$t(TITLE.update)
        }
      }
    }
  },
  data () {
    return {
      title        : this.$t(TITLE.add),
      multiLanguage: this.$store.getters.getLanguages,
      i18nForm     : {
        str_id         : "",
        str_translation: ""
      },
      translation: {},

      rules: {
        str_id: [
          { required: true, message: this.$t("iot_plat_input_variable"), trigger: "change" }
        ]
      }
    }
  },
  created () {
    this.multiLanguage.map(o => o.language).forEach(item => {
      this.$set(this.translation, item, "")
    })
  },
  methods: {
    close () {
      this.resetFormData()
      this.$refs.i18nForm.resetFields();
      this.$emit("close")
    },

    resetFormData () {
      Object.keys(this.translation).forEach(key => {
        this.translation[key] = ""
      })
      this.i18nForm.str_id = ""
    },

    submit: _.debounce(function() {
      // 标识翻译是否有填写
      let flag = false
      const keys = Object.keys(this.translation)
      for (let index = 0; index < keys.length; index++) {
        if (this.translation[keys[index]]) {
          flag = true;
          break;
        }
      }

      if (!flag) {
        return this.vmMsgError(this.$t("iot_plat_atleast_input_one_translate"))
      } 

      const loading = this.vmLoadingFull();
      try {
        this.$refs.i18nForm.validate(async valid => {
          if (valid) {
            this.i18nForm.str_translation = JSON.stringify(this.translation)
            const param = this.createFormData(this.i18nForm);
            const url = this.model === 0 ? COOP_I18N_ADD : COOP_I18N_UPDATE
            const res = await this.$http.post(url, param)
            if (this.vmResponseHandler(res)) {
              this.resetFormData()
              this.vmMsgSuccess(this.model === 0 ? this.$t("iot_plat_add_success") : this.$t("iot_plat_edit_success"));
              this.$refs.i18nForm.resetFields();
              this.$emit("close", true)
            }
            loading.close();
          }
        });
      } catch (error) {
        loading.close();
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    }, this.DEBOUNCE_TIME)
  }
}
</script>
