<template>
  <el-dialog :title="title" :visible.sync="isVisible" center :before-close="handleClose">
    <el-form label-width="150px" status-icon :model="formData" ref="form" :rules="rules">
      <el-form-item :label="$t('iot_plat_class_name')" class="form-row" prop="prodt_name">
        <el-input v-model="formData.prodt_name" v-bind:disabled="model === types.edit"></el-input>
      </el-form-item>
      <el-form-item :label="$t('iot_plat_class_code')" class="form-row" prop="prodt_code">
        <el-input v-model="formData.prodt_code" v-bind:disabled="model === types.edit"></el-input>
      </el-form-item>
      <el-form-item :label="$t('iot_plat_security')" class="form-row" prop="sec_type">
        <el-radio v-model="formData.sec_type" label="1">{{$t("iot_plat_non_security_devie")}}</el-radio>
        <el-radio v-model="formData.sec_type" label="2">{{$t("iot_plat_default_serurity_device")}}</el-radio>
        <el-radio v-model="formData.sec_type" label="3">{{$t("iot_plat_ordinary_security_device")}}</el-radio>
      </el-form-item>
      <el-form-item style="margin-top: 4rem;" class="form-row">
        <el-button type="primary" class="btn-submit" @click="submit()">{{$t("iot_plat_confirm")}}</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import {
  EQUIPMENT_CATEGORY_ADD,
  ADMIN_DEVICE_CATE_EDIT
} from "@/lib/api.js";
export default {
  props: {
    /**
     * 弹出层标题
     */
    title: {
      type    : String,
      required: true
    },

    /**
     * 控制弹出层显示隐藏
     */
    isVisible: {
      type    : Boolean,
      required: true
    },

    /**
     * 判断弹出层是处于编辑还是添加模式
     */
    model: {
      type    : String,
      required: true
    },

    formData: {
      type    : Object,
      required: true
    }
  },
  data() {
    const validateIsEmpty = (rule, value, callback) => {
      if (value === "") {
        if (rule.field === "prodt_name") {
          callback(new Error(this.$t("iot_plat_input_class_name")));
        } else if (rule.field === "prodt_code") {
          callback(new Error(this.$t("iot_plat_input_class_code")));
        }
      }
      callback();
    };
    return {
      rules: {
        prodt_name: [ { validator: validateIsEmpty, trigger: "blur" } ],
        prodt_code: [ { validator: validateIsEmpty, trigger: "blur" } ]
      },
      types: {
        edit: "edit",
        add : "add"
      }
    };
  },
  methods: {
    handleClose() {
      this.$refs.form.resetFields();
      this.$emit("close");
    },
    submit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const loading = this.vmLoadingFull();
          try {
            const param = this.createFormData(this.formData);
            const url
              = this.model === this.types.edit
                ? ADMIN_DEVICE_CATE_EDIT
                : EQUIPMENT_CATEGORY_ADD;
            const res = await this.$http.post(url, param);

            loading.close();
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess(this.$t("iot_plat_operating_success"))
              this.$refs.form.resetFields();
              this.$emit("close", true);
            }
          } catch (e) {
            loading.close();
            this.vmMsgError(this.$t("iot_plat_program_error"));
          }
        }
      });
    }
  }
};
</script>
