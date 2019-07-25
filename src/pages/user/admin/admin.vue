<template>
  <div class="admin">
    <el-row>
      <el-col :span="24">
        <p class="title-cn">{{$t("iot_plat_admin_user_info")}}</p>
        <p class="title-en">ADMIN USER INFORMATION</p>
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
            v-if="vmHasAuth(CoopPermissionsLib.ADD_USER, resData.res)"
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
          <!--<el-table-column
            type="selection">
          </el-table-column>-->
          <el-table-column
            type="index"
            width="100"
            :label="$t('iot_plat_number')">
          </el-table-column>
          <el-table-column
            prop="user_name"
            :label="$t('iot_plat_full_name')">
          </el-table-column>
          <el-table-column
            prop="groupName"
            :label="$t('iot_plat_role')">
          </el-table-column>
          <el-table-column
            prop="create_time"
            :label="$t('iot_plat_create_time')">
          </el-table-column>
          <el-table-column
            prop="last_time"
            :label="$t('iot_plat_last_login')">
          </el-table-column>
          <el-table-column
            prop=""
            :label="$t('iot_plat_operate')"
            width="180">
            <template slot-scope="scope">
              <el-button icon="iconfont icon-tianjia"
                        class="btn-circle"
                        size="mini"
                        circle
                        v-if="vmHasAuth(CoopPermissionsLib.ADD_USER_TO_GROUP, resData.res)"
                        @click="editAdmin(scope.row)"></el-button>
              <el-button icon="iconfont icon-zhongzhi"
                        size="mini"
                        class="btn-circle"
                        circle
                        v-if="vmHasAuth(CoopPermissionsLib.RESET_USER_PASS, resData.res)"
                        @click="resetPassword(scope.row)"></el-button>
              <el-button icon="iconfont icon-shanchu"
                        size="mini"
                        class="btn-circle"
                        circle
                        v-if="vmHasAuth(CoopPermissionsLib.DEL_USER, resData.res)"
                        @click="deleteUser(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row  v-if="total>page" type="flex" justify="center">
        <el-pagination
          :current-page.sync="currentPage"
          :page-size="page"
          layout="prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-row>
    </el-row>
    <el-dialog
      :title="$t('iot_plat_add_user')"
      :visible.sync="dialogVisible"
      center
      :before-close="handleClose">
      <el-form label-width="100px" status-icon :model="formAdd" ref="AddForm" :rules="rules">
        <el-form-item :label="$t('iot_plat_user_name')" class="form-row" prop="user_name">
          <el-input v-model="formAdd.user_name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('iot_plat_password')" class="form-row" prop="password">
          <el-input v-model="formAdd.password"></el-input>
        </el-form-item>
        <el-form-item label="" style="margin-top: 4.33rem;">
          <el-button type="primary" class="btn-submit" @click="addUser()">{{$t("iot_plat_confirm")}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      :title="$t('iot_plat_user_group_add')"
      :visible.sync="dialogVisible2"
      center
      :before-close="handleClose">
      <el-form label-width="100px" status-icon :model="groupForm" ref="AddForm" :rules="rules">
        <el-form-item :label="$t('iot_plat_user_group')" class="form-row" prop="group">
          <el-select
            v-model="groupForm.group"
            :collapse-tags="true"
            multiple
            :placeholder="$t('iot_plat_select_please')">
            <template v-for="item in options" >
              <el-option
                v-if="!alreadyExistGroup.includes(item.group_id)"
                :key="item.group_id"
                :label="item.group_name"
                :value="item.group_id"
                :disabled="item.disabled">
              </el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="" style="margin-top: 4.33rem;">
          <el-button type="primary" class="btn-submit" @click="setUserGroup()">{{$t("iot_plat_confirm")}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import "@/assets/css/content.css"
import {
  GET_COOP_AUTH_USER_POST,
  ADD_COOP_AUTH_USER_POST,
  COOP_USER_DELETE,
  COOP_AUTH_SET,
  RESET_PWD_AUTH_POST
} from "../../../lib/api.js"
import _ from "lodash"
export default {
  data () {
    const validateIsEmpty = (rule, value, callback) => {
      if (value === "") {
        if (rule.field === "user_name") {
          callback(new Error(this.$t("iot_plat_input_username_please")))
        } else if (rule.field === "password") {
          callback(new Error(this.$t("iot_plat_input_pwd_please")))
        } else if (rule.field === "group") {
          callback(new Error(this.$t("iot_plat_select_user_group")))
        }
      }
      callback()
    }
    return {
      rules: {
        user_name: [
          { validator: validateIsEmpty, trigger: "blur" }
        ],
        password: [
          { validator: validateIsEmpty, trigger: "blur" }
        ],
        group: [
          { validator: validateIsEmpty, trigger: "change" }
        ]
      },
      dialogVisible : false,
      dialogVisible2: false,
      inputVal      : "",
      user_id       : "",
      formAdd       : {
        user_name: "",
        password : ""
      },
      groupForm        : { group: [] },
      alreadyExistGroup: [],
      options          : [],
      tableData        : [],
      resData          : [],
      multipleSelection: [],
      currentPage      : 1,
      total            : 0,
      page             : 20,
      loading          : false
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
          this.addUser()
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
        const res = await this.$http.post(GET_COOP_AUTH_USER_POST, param)
        this.loading = false
        if (this.vmResponseHandler(res)) {
          res.data.data.map(val => {
            if (val.groupName) {
              val.groupName = val.groupName.join("、")
            }
          })
          this.tableData = res.data.data
          this.resData = res.data
          this.options = res.data.group
          this.total = res.data.total
        }
      } catch (error) {
        this.loading = false
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    },
    addUser: _.debounce(function () {
      try {
        this.$refs.AddForm.validate(async valid => {
          if (valid) {
            const param = this.createFormData(this.formAdd)
            const res = await this.$http.post(ADD_COOP_AUTH_USER_POST, param)
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess(this.$t("iot_plat_operating_success"))
              this.dialogVisible = false
              this.$refs.AddForm.resetFields()
              this.onSubmit()
            }
          }
        })
      } catch (error) {
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    }, this.DEBOUNCE_TIME),
    setUserGroup: _.debounce(function () {
      const loading = this.vmLoadingFull()
      try {
        this.$refs.AddForm.validate(async valid => {
          if (valid) {
            const param = this.createFormData({
              user_id: this.user_id,
              group  : JSON.stringify(this.groupForm.group)
            })
            const res = await this.$http.post(COOP_AUTH_SET, param)
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
    deleteUser (row) {
      const loading = this.vmLoadingFull()
      try {
        const param = this.createFormData({ user_name: row.user_name })
        this.vmConfirm({
          msg            : this.$t("iot_plat_confirm_delete_data"),
          confirmCallback: async () => {
            const res = await this.$http.post(COOP_USER_DELETE, param)
            loading.close()
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess(this.$t("iot_plat_delete_success"))
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
    addAdmin () {
      this.dialogVisible = true
    },
    editAdmin (row) {
      this.dialogVisible2 = true
      this.user_id = row.user_id
      this.alreadyExistGroup = row.groupId
    },
    resetPassword (row) {
      const loading = this.vmLoadingFull()
      try {
        const param = this.createFormData({ user_name: row.user_name })
        this.vmConfirm({
          msg            : this.$t("iot_plat_confirm_reset_pwd"),
          confirmCallback: async () => {
            const res = await this.$http.post(RESET_PWD_AUTH_POST, param)
            loading.close()
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess(this.$t("iot_plat_reset_pwd_success"))
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
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleClose (done) {
      this.$refs.AddForm.resetFields()
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
  .el-select /deep/ .el-tag__close.el-icon-close {
    display: none;
  }
</style>
<style>
  .admin /deep/ .el-dialog{
    width:54.17rem;
  }
</style>
