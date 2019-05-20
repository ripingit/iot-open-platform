<template>
  <el-dialog :title="title" :visible.sync="isVisible" center :before-close="handleClose">
    <el-form label-width="100px" status-icon :model="formData" ref="form" :rules="rules">
      <el-form-item label="类别名称" class="form-row" prop="prodt_name">
        <el-input v-model="formData.prodt_name" v-bind:disabled="model === types.edit"></el-input>
      </el-form-item>
      <el-form-item label="类别代码" class="form-row" prop="prodt_code">
        <el-input v-model="formData.prodt_code" v-bind:disabled="model === types.edit"></el-input>
      </el-form-item>
      <el-form-item label="安防" class="form-row" prop="sec_type">
        <el-radio v-model="formData.sec_type" label="1">非安防设备</el-radio>
        <el-radio v-model="formData.sec_type" label="2">默认安防设备</el-radio>
        <el-radio v-model="formData.sec_type" label="3">普通安防设备</el-radio>
      </el-form-item>
      <el-form-item style="margin-top: 4rem;" class="form-row">
        <el-button type="primary" class="btn-submit" @click="submit()">确 定</el-button>
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
          callback(new Error("请输入类别名称"));
        } else if (rule.field === "prodt_code") {
          callback(new Error("请输入类别代码"));
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
              this.vmMsgSuccess("操作成功！");
              this.$refs.form.resetFields();
              this.$emit("close", true);
            }
          } catch (e) {
            loading.close();
            this.vmMsgError("程序错误！");
          }
        }
      });
    }
  }
};
</script>
