<template>
  <el-dialog title="设置回调" :visible.sync="isVisible" width="50rem" center :before-close="close">
    <el-form label-width="120px" status-icon :model="notifyForm" ref="notifyForm">
      <el-form-item label="ID" class="form-row" prop="client_id">
        <el-input v-model="notifyForm.client_id" readonly></el-input>
      </el-form-item>
      <el-form-item label="通知回调URL" class="form-row" prop="notify_url">
        <el-input v-model="notifyForm.notify_url" placeholder="请输入支持post请求的URL"></el-input>
      </el-form-item>
      <el-form-item label="鉴权回调URL" class="form-row" prop="chat_auth_url">
        <el-input v-model="notifyForm.chat_auth_url" placeholder="请输入支持post请求的URL"></el-input>
      </el-form-item>
      <el-form-item label style="margin-top: 4.33rem;">
        <el-button type="primary" class="btn-submit" @click="submitNotifyUrl()">确 定</el-button>
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
              this.vmMsgSuccess("设置成功");
              this.notifyForm.notify_url = "";
              this.$emit("close", true)
            }
            loading.close();
          }
        });
      } catch (error) {
        loading.close();
        this.vmMsgError("程序错误！");
      }
    }, this.DEBOUNCE_TIME)
  }
}
</script>
