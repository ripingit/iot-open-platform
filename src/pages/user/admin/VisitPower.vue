<template>
  <div class="VisitPower">
    <el-row>
      <el-col :span="24">
        <p class="title-cn">{{$t("iot_plat_permission_visit_auth")}}</p>
        <p class="title-en">ADMIN POWER MANAGE</p>
      </el-col>
    </el-row>
    <el-row class="table" v-loading="loading">
      <el-col :span="24" class="VisitPower-checkbox" v-for="group in groupData" :key="group.cmd_id">
        <el-checkbox class="VisitPower-checkbox-1" :indeterminate="group.hasChecked" v-model="group.hasChecked" @change="CheckAll(group)">{{group.label}}</el-checkbox>
        <div style="margin: 1.5rem 0;"></div>
        <el-checkbox v-model="item.checked" @change="ChangeGroup(group)" v-for="item in group.child" :label="item.label" :key="item.id">{{item.label}}</el-checkbox>
      </el-col>
      <el-col :span="24" style="margin-top: 4rem">
        <el-col :span="2">
          <el-button
            type="primary"
            v-if="vmHasAuth(CoopPermissionsLib.EDIT_USER_GROUP_AUTH, resData.res)"
            @click="confirm()">{{$t("iot_plat_confirm")}}</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="danger"
                     style="background-color: #f56c6c;border-color: #f56c6c;margin-left: 1rem"
                     @click="goBack()">{{$t("iot_plat_return")}}</el-button>
        </el-col>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import "@/assets/css/content.css"
import { GET_USERGROUP_AUTH_POST, COOP_USERGROUP_AUTH_SET } from "../../../lib/api.js"
export default {
  data () {
    return {
      group_id : this.$route.params.group_id,
      groupData: [],
      resData  : [],
      cmd_id   : [],
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
        const res = await this.$http.post(GET_USERGROUP_AUTH_POST, param)
        this.loading = false
        if (this.vmResponseHandler(res)) {
          this.resData = res.data
          const treeData = []
          if (res.data.data && Array.isArray(res.data.data)) {
            res.data.data.forEach(val => {
              const node = {
                hasChecked  : val.status,
                allChecked  : false,
                label       : val.method,
                id          : val.cmd_id,
                child       : [],
                childChecked: []
              }
              if (val.child && Array.isArray(val.child)) {
                val.child.forEach(subVal => {
                  node.child.push({
                    checked: subVal.status,
                    label  : subVal.method,
                    id     : subVal.cmd_id
                  })
                  if (subVal.status) {
                    node.childChecked.push(subVal)
                  } else {
                    node.allChecked = false
                  }
                })
              }
              treeData.push(node)
            })
          }
          this.groupData = treeData
        }
      } catch (error) {
        this.loading = false
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    },
    goBack () {
      this.$router.push({ name: "power" })
    },
    confirm () {
      const loading = this.vmLoadingFull()
      try {
        this.cmd_id = []
        this.groupData.forEach(val => {
          if (val.hasChecked || val.allChecked) {
            this.cmd_id.push(val.id)
          }
          val.child.forEach(subVal => {
            if (subVal.checked) {
              this.cmd_id.push(subVal.id)
            }
          })
        })
        const param = this.createFormData({
          cmd_id  : JSON.stringify(this.cmd_id),
          group_id: this.group_id
        })
        this.vmConfirm({
          msg            : this.$t("iot_plat_confirm_edit_user_auth"),
          confirmCallback: async () => {
            const res = await this.$http.post(COOP_USERGROUP_AUTH_SET, param)
            loading.close()
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess(this.$t("iot_plat_operating_success"))
              this.onSubmit()
            }
          }
        })  
      } catch (error) {
        loading.close()
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    },
    CheckAll (row) {
      row.childChecked = []
      row.child.forEach(val => {
        if (!row.hasChecked) { val.checked = false }
      })

      /*
       * row.allChecked = row.child.length ? (row.childChecked.length === row.child.length) : row.allChecked
       * row.childChecked = []
       * row.child.forEach(function (val) {
       *   val.checked = !row.allChecked
       *   if (val.checked)row.childChecked.push(val)
       * })
       * let childChecked = row.childChecked.length
       * row.allChecked = row.child.length ? (childChecked === row.child.length) : row.allChecked
       * row.hasChecked = childChecked > 0 && childChecked < row.child.length
       */
    },
    ChangeGroup (row) {
      row.childChecked = []
      row.child.forEach(val => {
        if (val.checked){ row.childChecked.push(val) }
      })
      const childChecked = row.childChecked.length
      // row.allChecked = childChecked === row.child.length
      row.hasChecked = childChecked > 0 || row.hasChecked
    }
  }
}
</script>
<style scoped>
.VisitPower {
  padding: 1.67rem 2.5rem;
  color: #fff;
}
.VisitPower-checkbox:first-child {
  margin-top: 0;
}
.VisitPower-checkbox {
  margin-top: 2rem;
  color: #808080;
  padding-bottom: 1rem;
  border-bottom: 1px solid #808080;
}
</style>
<style>
.el-checkbox__input.is-checked .el-checkbox__inner,
.el-checkbox__input.is-indeterminate .el-checkbox__inner {
}
</style>
