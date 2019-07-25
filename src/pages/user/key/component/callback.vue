<template>
  <el-dialog :title="$t('iot_plat_set_callback')" :visible.sync="isVisible" width="50rem" center :before-close="close">
    <el-form label-width="165px" status-icon :model="notifyForm" ref="notifyForm">
      <el-form-item :label="$t('iot_plat_id')" class="form-row" prop="client_id">
        <el-input v-model="notifyForm.client_id" readonly></el-input>
      </el-form-item>
      <el-form-item :label="$t('iot_plat_notify_callback_url')" class="form-row" prop="notify_url">
        <el-input v-model="notifyForm.notify_url" :placeholder="$t('iot_plat_input_post_request_url')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('iot_plat_auth_callback_url')" class="form-row" prop="chat_auth_url">
        <el-input v-model="notifyForm.chat_auth_url" :placeholder="$t('iot_plat_input_post_request_url')"></el-input>
      </el-form-item>
      <el-form-item label style="margin-top: 4.33rem;">
        <el-button type="primary" class="btn-submit" @click="submitNotifyUrl()">{{$t("iot_plat_confirm")}}</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { SET_NOTIFY_URL_POST } from "@/lib/api";
import _ from "lodash";
export default {
  props: {
    isVisible: {
      type     : Boolean,
      required : true,
      "default": false
    },
    data: {
      type    : Object,
      required: true
    }
  },
  watch: {
    data (newVal) {
      if (newVal) {
        this.notifyForm = newVal
      }
    }
  },
  data () {
    return {
      notifyForm: {
        client_id    : "",
        notify_url   : "",
        chat_auth_url: ""
      }
    }
  },
  methods: {
    close () {
      this.$emit("close")
    },
    submitNotifyUrl: _.debounce(function() {
      const loading = this.vmLoadingFull();
      try {
        this.$refs.notifyForm.validate(async valid => {
          if (valid) {
            const param = this.createFormData(this.notifyForm);
            const res = await this.$http.post(SET_NOTIFY_URL_POST, param)
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess(this.$t("iot_plat_set_success"));
              this.notifyForm.notify_url = "";
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
