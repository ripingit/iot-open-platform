<template>
  <el-dialog :title="$t('iot_plat_create_key')" :visible.sync="isVisible" width="51rem" center :before-close="closeDialog">
    <el-form
      label-width="150px"
      status-icon
      label-position="right"
      :model="keyForm"
      ref="keyForm"
      :rules="keyFormRules"
      :hide-required-asterisk="true"
    >
      <el-form-item :label="$t('iot_plat_app_name')" class="form-row" prop="app_name">
        <el-input v-model="keyForm.app_name"></el-input>
        <span class="form-tip">*</span>
      </el-form-item>
      <el-form-item :label="$t('iot_plat_app_english_name')" class="form-row" prop="en_app_name">
        <el-input v-model="keyForm.en_app_name"></el-input>
      </el-form-item>
      <el-form-item :label="$t('iot_plat_app_type')" class="form-row" prop="app_type">
        <el-select v-model="keyForm.app_type" :placeholder="$t('iot_plat_select_app_type')" :no-data-text="$t('iot_plat_none_data')">
          <el-option
            v-for="(item, index) in appType"
            :key="index"
            :label="$t(item.name)"
            :value="item.id"
          ></el-option>
        </el-select>
        <span class="form-tip">*</span>
      </el-form-item>
      <el-form-item :label="$t('iot_plat_app_desc')" class="form-row" prop="app_desc">
        <el-input v-model="keyForm.app_desc"></el-input>
        <span class="form-tip">*</span>
      </el-form-item>
      <el-form-item label style="margin-top: 4.33rem;">
        <el-button type="primary" class="btn-submit" @click="generateKey">{{$t("iot_plat_confirm")}}</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
// createKeyDialog
import { GENERATE_KEY_ID_POST } from "@/lib/api";
import { appType } from "@/lib/const";
import _ from "lodash";
export default {
  mixins: [
    {
      data () {
        return { appType: appType }
      }
    }
  ],
  props: {
    isVisible: {
      type     : Boolean,
      required : true,
      "default": false
    }
  },
  data () {
    return {
      keyForm: { 
        app_name   : "",
        app_desc   : "",
        app_type   : "",
        en_app_name: ""
      },
      keyFormRules: { 
        app_name: [ { required: true, message: this.$t("iot_plat_input_app_name"), trigger: "blur" } ],
        app_desc: [ { required: true, message: this.$t("iot_plat_input_app_desc"), trigger: "blur" } ],
        app_type: [ { required: true, message: this.$t("iot_plat_select_app_type"), trigger: "blur" } ]
      }
    }
  },
  methods: {
    closeDialog () {
      this.$emit("close")
    },
    generateKey: _.debounce(function() {
      try {
        this.$refs.keyForm.validate(async valid => {
          if (valid) {
            const loading = this.vmLoadingFull();
            const param = this.createFormData(this.keyForm);
            const res = await this.$http.post(GENERATE_KEY_ID_POST, param)
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess(this.$t("iot_plat_add_success"))
              this.$refs.keyForm.resetFields()
              this.$emit("close", true)
            }
            loading.close();
          }
        });  
      } catch (error) {
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    }, this.DEBOUNCE_TIME)
  }
}
</script>
