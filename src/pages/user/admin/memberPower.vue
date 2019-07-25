<template>
  <div class="memberPower">
    <el-row>
      <el-col :span="24">
        <p class="title-cn">{{$t("iot_plat_permission_auth")}}</p>
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
            width="80"
            :label="$t('iot_plat_number')">
          </el-table-column>
          <el-table-column
            prop="user_name"
            align="center"
            :label="$t('iot_plat_user_name')">
          </el-table-column>
          <el-table-column
            prop=""
            align="center"
            :label="$t('iot_plat_operate')"
            width="180">
            <template slot-scope="scope">
              <span class="memberPower-power"
                    v-if="vmHasAuth(CoopPermissionsLib.REMOVE_USER_FROM, resData.res)"
                    @click="removePower(scope.row)">{{$t("iot_plat_release_auth")}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="24" style="margin-top: 4rem">
        <el-col :span="2">
          <el-button type="danger"
                     style="background-color: #f56c6c;border-color: #f56c6c;"
                     @click="goBack()">{{$t("iot_plat_return")}}</el-button>
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
        this.vmMsgError(this.$t("iot_plat_program_error"));
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
          msg            : this.$t("iot_plat_confirm_release_auth"),
          confirmCallback: async () => {
            const res = await this.$http.post(SET_USERGROUP_LIST_POST, param)
            loading.close()
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess(this.$t("iot_plat_release_success"))
              this.onSubmit()
            }
          },
          cancelCallback: () => {
            loading.close()
          }
        })
      } catch (error) {
        loading.close()
        this.vmMsgError(this.$t("iot_plat_program_error"));
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
