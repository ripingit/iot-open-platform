<template>
  <el-dialog title="创建管理" :visible.sync="isVisible" width="50rem" center class="dialog">
    <el-row class="row">
      <el-col :span="4" class="label-left">用户名：</el-col>
      <el-col :span="20">{{data.user_name}}</el-col>
    </el-row>
    <el-row class="row">
      <el-col :span="4" class="label-left">密码：</el-col>
      <el-col :span="20">{{data.password}}</el-col>
    </el-row>
    <el-row class="row">
      <el-col :span="24" class="btn-container">
        <el-button type="primary" class="btn" @click="isVisible = false">确 定</el-button>
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
          msg            : "该操作将生成一个新的账号，确认继续吗？",
          confirmCallback: async () => {
            const data = this.createFormData({ client_id: clientId })
            const res = await this.$http.post(COOP_DEVICE_BIND_MANAGE, data)
            loading.close()
            if (this.vmResponseHandler(res)) {
              this.isVisible = true
              this.$emit("refresh")
              this.data.user_name = res.data.user_name
              this.data.password = res.data.password
              this.vmMsgSuccess("创建成功！")
            }
          },
          cancelCallback: () => loading.close()
        })
      } catch (error) {
        loading.close();
        this.vmMsgError("程序错误！");
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

