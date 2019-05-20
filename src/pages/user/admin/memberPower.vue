<template>
  <div class="memberPower">
    <el-row>
      <el-col :span="24">
        <p class="title-cn">权限管理-成员授权</p>
        <p class="title-en">ADMIN POWER MANAGE</p>
      </el-col>
    </el-row>
    <el-row class="table">
      <el-col :span="24">
        <el-table
          v-loading="loading"
          :data="tableData"
          style="width: 100%;">
          <el-table-column
            type="index"
            align="center"
            label="编号">
          </el-table-column>
          <el-table-column
            prop="user_name"
            align="center"
            label="用户名">
          </el-table-column>
          <el-table-column
            prop=""
            align="center"
            label="操作"
            width="180">
            <template slot-scope="scope">
              <span class="memberPower-power"
                    v-if="vmHasAuth(CoopPermissionsLib.REMOVE_USER_FROM, resData.res)"
                    @click="removePower(scope.row)">解除授权</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="24" style="margin-top: 4rem">
        <el-col :span="2">
          <el-button type="danger"
                     style="background-color: #f56c6c;border-color: #f56c6c;"
                     @click="goBack()">返 回</el-button>
        </el-col>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import "@/assets/css/content.css"
import { GET_USERGROUP_LIST_POST, SET_USERGROUP_LIST_POST } from "../../../lib/api.js"
export default{
  data () {
    return {
      group_id : this.$route.params.group_id,
      tableData: [],
      resData  : [],
      loading  : false
    }
  },
  created () {
    this.onSubmit()
  },
  methods: {
    async onSubmit () {
      try {
        this.loading = true
        const param = this.createFormData({ group_id: parseInt(this.group_id) })
        const res = await this.$http.post(GET_USERGROUP_LIST_POST, param)
        this.loading = false
        if (this.vmResponseHandler(res)) {
          this.tableData = res.data.data
          this.resData = res.data
        }
      } catch (error) {
        this.loading = false
        this.vmMsgError("程序错误！")
      }
      
    },
    removePower (row) {
      const loading = this.vmLoadingFull()
      try {
        const param = this.createFormData({
          user_id : row.user_id,
          group_id: this.group_id
        })
        this.vmConfirm({
          msg            : "确定解除该用户授权？",
          confirmCallback: async () => {
            const res = await this.$http.post(SET_USERGROUP_LIST_POST, param)
            loading.close()
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess("解除成功！")
              this.onSubmit()
            }
          }
        })
      } catch (error) {
        loading.close()
        this.vmMsgError("程序错误！")
      }
    },
    goBack () {
      this.$router.push({ name: "power" })
    }
  }
}
</script>
<style scoped>
 .memberPower{
   padding: 1.67rem 2.5rem;
   color: #fff;
 }
 .memberPower-power:hover{
   color: #2acba7;
   border-bottom: 1px dotted #2acba7;
   padding-bottom: .3rem;
   cursor: pointer;
 }
</style>
