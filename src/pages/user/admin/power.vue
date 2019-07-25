<template>
  <div class="admin">
    <el-row>
      <el-col :span="24">
        <p class="title-cn">{{$t("iot_plat_admin_permission_manage")}}</p>
        <p class="title-en">ADMIN POWER MANAGE</p>
      </el-col>
    </el-row>
    <el-row class="table">
      <el-row>
        <el-col :span="5">
          <!--<el-input-->
            <!--placeholder="点击此处搜索"-->
            <!--v-model="inputVal">-->
            <!--<i slot="prefix" class="el-input__icon el-icon-search" @click="SearchData()"></i>-->
          <!--</el-input>-->
          <el-button
            icon="el-icon-plus"
            type="primary" circle
            class="btn-circle-add"
            v-if="vmHasAuth(CoopPermissionsLib.ADD_USER_GROUP, resData.res)"
            @click="addAdmin()"></el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-table
          ref="multipleTable"
          v-loading="loading"
          :data="tableData"
          style="width: 100%;"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection">
          </el-table-column>
          <el-table-column
            type="index"
            align="center"
            width="80"
            :label="$t('iot_plat_number')">
          </el-table-column>
          <el-table-column
            prop="group_name"
            align="center"
            :label="$t('iot_plat_role')">
          </el-table-column>
          <el-table-column
            prop=""
            v-if="vmHasAuth(CoopPermissionsLib.USER_GROUP_AUTH, resData.res) || vmHasAuth(CoopPermissionsLib.AUTH_USER, resData.res)"
            align="center"
            :label="$t('iot_plat_auth')">
            <template slot-scope="scope">
              <span class="admin-power"
                    v-if="vmHasAuth(CoopPermissionsLib.USER_GROUP_AUTH, resData.res)"
                    @click="VisitPower(scope.row)">{{$t("iot_plat_visit_auth")}}</span>
              <span class="admin-power"
                    style="margin-left: 1rem;"
                    v-if="vmHasAuth(CoopPermissionsLib.AUTH_USER, resData.res)"
                    @click="memberPower(scope.row)">{{$t("iot_plat_member_auth")}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="enable"
            align="center"
            :label="$t('iot_plat_current_state')">
            <template slot-scope="scope">
              <span v-if="scope.row.enable===1" style="color: #2acba7">{{$t("iot_plat_available")}}</span>
              <span v-if="scope.row.enable===2" style="color: #ff5d66">{{$t("iot_plat_disable")}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            align="center"
            :label="$t('iot_plat_operate')"
            width="180">
            <template slot-scope="scope">
              <el-button icon="iconfont icon-bianji"
                         class="btn-circle"
                         size="mini"
                         circle
                         v-if="vmHasAuth(CoopPermissionsLib.EDIT_USER_GROUP, resData.res)"
                         @click="editAdmin(scope.row)"></el-button>
              <el-button icon="iconfont icon-shanchu"
                         class="btn-circle"
                         size="mini"
                         circle
                         v-if="vmHasAuth(CoopPermissionsLib.DEL_USER_GROUP, resData.res)"
                         @click="Delete(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row v-if="total>page" type="flex" justify="center">
        <el-pagination
          :current-page.sync="currentPage"
          :page-size="page"
          layout="prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-row>
    </el-row>
    <el-dialog
      :title="$t('iot_plat_user_group_add')"
      :visible.sync="dialogVisible"
      center
      :before-close="handleClose">
      <el-form label-width="100px" status-icon :model="formAdd" ref="AddForm" :rules="rules">
        <el-form-item :label="$t('iot_plat_user_group')" class="form-row" prop="group_name">
          <el-input v-model="formAdd.group_name"></el-input>
        </el-form-item>
        <el-form-item label="" style="margin-top: 4.33rem;">
          <el-button type="primary" class="btn-submit" @click="addUserGroup()">{{$t("iot_plat_confirm")}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      :title="$t('iot_plat_edit_user_group')"
      :visible.sync="dialogVisible2"
      center
      :before-close="handleClose">
      <el-form label-width="120px" status-icon :model="formAdd2" ref="AddForm" :rules="rules">
        <el-form-item :label="$t('iot_plat_current_state')" class="form-row" prop="enable">
          <el-select v-model="formAdd2.enable" :placeholder="$t('iot_plat_select_please')">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" style="margin-top: 4.33rem;">
          <el-button type="primary" class="btn-submit" @click="setUserGroup()">{{$t('iot_plat_confirm')}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import "@/assets/css/content.css"
import {
  GET_COOP_USERGROUP_POST,
  ADD_COOP_USERGROUP_POST,
  SET_GROUP_POST,
  DELETE_USERGROUP_POST
} from "../../../lib/api.js"
import _ from "lodash"
export default {
  data () {
    const validateIsEmpty = (rule, value, callback) => {
      if (value === "") {
        if (rule.field === "group_name") {
          callback(new Error(this.$t("iot_plat_input_user_group")))
        } else if (rule.field === "enable") {
          callback(new Error(this.$t("iot_plat_select_current_state_please")))
        }
      }
      callback()
    }
    return {
      rules: {
        group_name: [
          { validator: validateIsEmpty, trigger: "blur" }
        ],
        enable: [
          { validator: validateIsEmpty, trigger: "change" }
        ]
      },
      dialogVisible : false,
      dialogVisible2: false,
      inputVal      : "",
      group_id      : "",
      group_name    : "",
      formAdd       : { group_name: "" },
      formAdd2      : { enable: "" },
      options       : [ {
        value: 1,
        label: this.$t("iot_plat_available")
      },
      {
        value: 2,
        label: this.$t("iot_plat_disable")
      } ],
      tableData        : [],
      resData          : [],
      multipleSelection: [],
      currentPage      : 1,
      total            : 0,
      page             : 20
    }
  },
  created () {
    this.onSubmit()
    document.body.addEventListener("keydown", this.keyCodeDown, false)
  },
  beforeDestroy () {
    document.body.removeEventListener("keydown", this.keyCodeDown, false)
  },
  methods: {
    keyCodeDown (e) {
      if (e.keyCode === this.ENTER_KEY_CODE) {
        if (this.dialogVisible) {
          this.addUserGroup()
        }
        if (this.dialogVisible2) {
          this.setUserGroup()
        }
      }
    },
    async onSubmit () {
      try {
        this.loading = true
        const param = this.createFormData({
          page     : parseInt(this.currentPage),
          page_size: parseInt(this.page)
        })
        const res = await this.$http.post(GET_COOP_USERGROUP_POST, param)
        this.loading = false
        if (this.vmResponseHandler(res)) {
          this.tableData = res.data.data
          this.resData = res.data
          this.total = res.data.total
        }
      } catch (error) {
        this.loading = false
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    },
    addUserGroup: _.debounce(function () {
      const loading = this.vmLoadingFull()
      try {
        this.$refs.AddForm.validate(async valid => {
          if (valid) {
            const loading = this.vmLoadingFull()
            const param = this.createFormData(this.formAdd)
            const res = await this.$http.post(ADD_COOP_USERGROUP_POST, param)
            loading.close()
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess(this.$t("iot_plat_operating_success"))
              this.dialogVisible = false
              this.$refs.AddForm.resetFields()
              this.onSubmit()
            }
          }
        })
      } catch (error) {
        loading.close()
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    }, this.DEBOUNCE_TIME),
    setUserGroup: _.debounce(function () {
      const loading = this.vmLoadingFull()
      try {
        this.$refs.AddForm.validate(async valid => {
          if (valid) {
            const param = this.createFormData({
              group_id  : this.group_id,
              group_name: this.group_name,
              enable    : this.formAdd2.enable
            })
            
            const res = await this.$http.post(SET_GROUP_POST, param)
            loading.close()
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess(this.$t("iot_plat_operating_success"))
              this.dialogVisible2 = false
              this.$refs.AddForm.resetFields()
              this.onSubmit()
            }
          }
        })
      } catch (error) {
        loading.close()
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    }, this.DEBOUNCE_TIME),
    Delete (row) {
      const param = this.createFormData({
        group_id  : row.group_id,
        group_name: row.group_name
      })
      this.vmConfirm({
        msg            : this.$t("iot_plat_confirm_delete_data"),
        confirmCallback: async () => {
          const loading = this.vmLoadingFull()
          try {
            const res = await this.$http.post(DELETE_USERGROUP_POST, param)
            loading.close()
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess(this.$t("iot_plat_delete_success"))
              this.onSubmit()
            }
          } catch (error) {
            loading.close()
            this.vmMsgError(this.$t("iot_plat_program_error"));
          }
        }
      })
    },
    addAdmin () {
      this.dialogVisible = true
    },
    editAdmin (row) {
      this.dialogVisible2 = true
      this.group_id = row.group_id
      this.group_name = row.group_name
    },
    VisitPower (row) {
      this.$router.push({ name: "VisitPower", params: { group_id: row.group_id } })
    },
    memberPower (row) {
      this.$router.push({ name: "memberPower", params: { group_id: row.group_id } })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleClose (done) {
      done()
    }
  }
}
</script>
<style scoped>
  .admin{
    padding: 1.67rem 2.5rem;
    color: #fff;
  }
  .admin-power:hover{
    color: #2acba7;
    border-bottom: 1px dotted #2acba7;
    padding-bottom: .3rem;
    cursor: pointer;
  }
</style>
<style>
  .admin /deep/ .el-dialog{
    width:54.17rem;
  }
</style>
