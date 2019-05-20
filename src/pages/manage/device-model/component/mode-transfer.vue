<template>
  <el-dialog title="型号转移" :visible.sync="isVisible" center>
    <el-form
      label-width="100px"
      status-icon
      :model="formModelTransfer"
      ref="modelTransferForm"
      :rules="rulesTransfer"
    >
      <el-form-item label="设备ID" class="form-row" prop="device_id">
        <el-input v-model="formModelTransfer.device_id"></el-input>
        <span class="form-tip">*</span>
      </el-form-item>
      <el-form-item label="转移方式" class="form-row" prop="change_id">
        <el-radio v-model="formModelTransfer.change_id" label="1">正式到测试</el-radio>
        <el-radio v-model="formModelTransfer.change_id" label="2">测试到正式</el-radio>
      </el-form-item>
      <el-form-item style="margin-top: 4.33rem;">
        <el-button type="primary" class="btn-submit" @click="transferSubmit()">提 交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import _ from "lodash";
import { ADMIN_TRANSFER_POST } from "@/lib/api.js";
export default {
  props: {
    isVisible: {
      type     : Boolean,
      required : true,
      "default": false
    }
  },
  data () {
    return {
      formModelTransfer: {
        device_id: "",
        change_id: "1"
      },
      rulesTransfer: {
        device_id: [
          { required: true, message: "请输入设备ID", trigger: "blur" }
        ]
      }
    }
  },
  methods: {
    transferSubmit: _.debounce(function() {
      const param = this.createFormData({
        device_id: this.formModelTransfer.device_id,
        change_id: parseInt(this.formModelTransfer.change_id)
      });
      const msgTip = `确定将设备ID为${this.formModelTransfer.device_id}的设备从${
        this.formModelTransfer.change_id === "1"
          ? "正式环境转移到测试环境"
          : "测试环境转移到正式环境"
      }?`;
      this.vmConfirm({
        msg            : msgTip,
        confirmCallback: async () => {
          const loading = this.vmLoadingFull();
          try {
            const res = await this.$http.post(ADMIN_TRANSFER_POST, param)
            loading.close();
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess("转移成功！");
            }
          } catch (e) {
            loading.close();
            this.vmMsgError("程序错误");
          }
        }
      });
    })
  }
}
</script>
