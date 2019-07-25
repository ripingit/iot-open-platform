<template>
  <el-dialog :title="$t('iot_plat_model_transfer')" :visible.sync="isVisible" center :before-close="close">
    <el-form
      label-width="120px"
      status-icon
      :model="formModelTransfer"
      ref="modelTransferForm"
      :rules="rulesTransfer"
    >
      <el-form-item :label="$t('iot_plat_device_id')" class="form-row" prop="device_id">
        <el-input v-model="formModelTransfer.device_id"></el-input>
        <span class="form-tip">*</span>
      </el-form-item>
      <el-form-item :label="$t('iot_plat_transfer_way')" class="form-row" prop="change_id">
        <el-radio v-model="formModelTransfer.change_id" label="1">{{$t("iot_plat_formal_to_test")}}</el-radio>
        <el-radio v-model="formModelTransfer.change_id" label="2">{{$t("iot_plat_test_to_formal")}}</el-radio>
      </el-form-item>
      <el-form-item style="margin-top: 4.33rem;">
        <el-button type="primary" class="btn-submit" @click="transferSubmit()">{{$t("iot_plat_submit")}}</el-button>
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
          { required: true, message: this.$t("iot_plat_input_device_id"), trigger: "blur" }
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
      const msgTip = `${this.$t("iot_plat_device_transfer_desc_01", [ this.formModelTransfer.device_id ])}${
        this.formModelTransfer.change_id === "1"
          ? this.$t("iot_plat_device_transfer_desc_02")
          : this.$t("iot_plat_device_transfer_desc_03")
      }?`;
      this.vmConfirm({
        msg            : msgTip,
        confirmCallback: async () => {
          const loading = this.vmLoadingFull();
          try {
            const res = await this.$http.post(ADMIN_TRANSFER_POST, param)
            loading.close();
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess(this.$t("iot_plat_trans_success"));
            }
          } catch (e) {
            loading.close();
            this.vmMsgError(this.$t("iot_plat_program_error"));
          }
        }
      });
    }),
    close(done) {
      this.$emit("close")
      done()
    }
  }
}
</script>
