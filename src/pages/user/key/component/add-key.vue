<template>
  <el-dialog title="创建KEY" :visible.sync="isVisible" width="50rem" center :before-close="closeDialog">
    <el-form
      label-width="120px"
      status-icon
      label-position="right"
      :model="keyForm"
      ref="keyForm"
      :rules="keyFormRules"
      :hide-required-asterisk="true"
    >
      <el-form-item label="APP名称" class="form-row" prop="app_name">
        <el-input v-model="keyForm.app_name"></el-input>
        <span class="form-tip">*</span>
      </el-form-item>
      <el-form-item label="APP英文名称" class="form-row" prop="en_app_name">
        <el-input v-model="keyForm.en_app_name"></el-input>
      </el-form-item>
      <el-form-item label="APP类型" class="form-row" prop="app_type">
        <el-select v-model="keyForm.app_type" placeholder="请选择APP类型" no-data-text="无数据">
          <el-option
            v-for="(item, index) in appType"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <span class="form-tip">*</span>
      </el-form-item>
      <el-form-item label="APP描述" class="form-row" prop="app_desc">
        <el-input v-model="keyForm.app_desc"></el-input>
        <span class="form-tip">*</span>
      </el-form-item>
      <el-form-item label style="margin-top: 4.33rem;">
        <el-button type="primary" class="btn-submit" @click="generateKey">确 定</el-button>
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
        app_name: [ { required: true, message: "请输入APP名称", trigger: "blur" } ],
        app_desc: [ { required: true, message: "请输入APP描述", trigger: "blur" } ],
        app_type: [ { required: true, message: "请选择app类型", trigger: "blur" } ]
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
              this.vmMsgSuccess("添加成功！")
              this.$refs.keyForm.resetFields()
              this.$emit("close", true)
            }
            loading.close();
          }
        });  
      } catch (error) {
        this.vmMsgError("程序错误！");
      }
    }, this.DEBOUNCE_TIME)
  }
}
</script>
