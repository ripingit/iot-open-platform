<template>
  <el-dialog :title="$t('iot_plat_create_manage')" :visible.sync="isVisible" width="50rem" center class="dialog">
    <el-row class="row">
      <el-col :span="4" class="label-left">{{$t('iot_plat_user_name')}}：</el-col>
      <el-col :span="20">{{data.user_name}}</el-col>
    </el-row>
    <el-row class="row">
      <el-col :span="4" class="label-left">{{$t("iot_plat_password")}}：</el-col>
      <el-col :span="20">{{data.password}}</el-col>
    </el-row>
    <el-row class="row">
      <el-col :span="24" class="btn-container">
        <el-button type="primary" class="btn" @click="isVisible = false">{{$t("iot_plat_confirm")}}</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { COOP_DEVICE_BIND_MANAGE } from "@/lib/api.js";
export default {
  data () {
    return {
      isVisible: false,
      data     : {
        user_name: "",
        password : ""
      }
    }
  },

  methods: {
    generate(clientId) {
      const loading = this.vmLoadingFull()
      try {
        this.vmConfirm({
          msg            : this.$t("iot_plat_confirm_create_new_account"),
          confirmCallback: async () => {
            const data = this.createFormData({ client_id: clientId })
            const res = await this.$http.post(COOP_DEVICE_BIND_MANAGE, data)
            loading.close()
            if (this.vmResponseHandler(res)) {
              this.isVisible = true
              this.$emit("refresh")
              this.data.user_name = res.data.user_name
              this.data.password = res.data.password
              this.vmMsgSuccess(this.$t("iot_plat_create_success"))
            }
          },
          cancelCallback: () => loading.close()
        })
      } catch (error) {
        loading.close();
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    }
  }
}
</script>

<style scoped>
.row{
  margin-bottom: 1rem;
  color: #fff;
}
.label-left {
  text-align: right;
}
.btn {
  width: auto;
  margin-top: 1rem;
}
.btn-container {
  text-align: center
}
</style>

