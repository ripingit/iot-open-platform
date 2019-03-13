<template>
  <div class="admin">
    <el-row>
      <el-col :span="24">
        <p class="title-cn">管理员-用户信息</p>
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
            label="编号">
          </el-table-column>
          <el-table-column
            prop="user_name"
            label="姓名">
          </el-table-column>
          <el-table-column
            prop="groupName"
            label="角色">
          </el-table-column>
          <el-table-column
            prop="create_time"
            label="创建时间">
          </el-table-column>
          <el-table-column
            prop="last_time"
            label="最后一次登录">
          </el-table-column>
          <el-table-column
            prop=""
            label="操作"
            width="180">
            <template slot-scope="scope">
              <el-button icon="iconfont icon-bianji"
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
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="page"
          layout="prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-row>
    </el-row>
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      center
      :before-close="handleClose">
      <el-form label-width="100px" status-icon :model="formAdd" ref="AddForm" :rules="rules">
        <el-form-item label="用户名" class="form-row" prop="user_name">
          <el-input v-model="formAdd.user_name"></el-input>
        </el-form-item>
        <el-form-item label="密码" class="form-row" prop="password">
          <el-input v-model="formAdd.password"></el-input>
        </el-form-item>
        <el-form-item label="" style="margin-top: 4.33rem;">
          <el-button type="primary" class="btn-submit" @click="addUser()">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="添加用户组"
      :visible.sync="dialogVisible2"
      center
      :before-close="handleClose">
      <el-form label-width="100px" status-icon :model="groupForm" ref="AddForm" :rules="rules">
        <el-form-item label="用户组" class="form-row" prop="group">
          <el-select v-model="groupForm.group" multiple placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.group_id"
              :label="item.group_name"
              :value="item.group_id"
              :disabled="item.disabled">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" style="margin-top: 4.33rem;">
          <el-button type="primary" class="btn-submit" @click="setUserGroup()">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import '@/assets/css/content.css'
import { GET_COOP_AUTH_USER_POST,
  ADD_COOP_AUTH_USER_POST,
  DELETE_COOP_AUTH_USER_POST,
  SET_COOP_AUTH_USERGROUP_POST,
  RESET_PWD_AUTH_POST
} from '../../../lib/api.js'
import _ from 'lodash'
export default {
  data () {
    let validateIsEmpty = (rule, value, callback) => {
      if (value === '') {
        if (rule.field === 'user_name') {
          callback(new Error('请输入用户名'))
        } else if (rule.field === 'password') {
          callback(new Error('请输入密码'))
        } else if (rule.field === 'group') {
          callback(new Error('请选择用户组'))
        }
      }
      callback()
    }
    return {
      rules: {
        user_name: [
          { validator: validateIsEmpty, trigger: 'blur' }
        ],
        password: [
          { validator: validateIsEmpty, trigger: 'blur' }
        ],
        group: [
          { validator: validateIsEmpty, trigger: 'change' }
        ]
      },
      dialogVisible: false,
      dialogVisible2: false,
      inputVal: '',
      user_id: '',
      formAdd: {
        user_name: '',
        password: ''
      },
      groupForm: {
        group: []
      },
      options: [],
      tableData: [],
      resData: [],
      multipleSelection: [],
      currentPage: 1,
      total: 0,
      page: 20,
      loading: false
    }
  },
  created () {
    this.onSubmit()
    document.body.addEventListener('keydown', this.keyCodeDown, false)
  },
  beforeDestroy () {
    document.body.removeEventListener('keydown', this.keyCodeDown, false)
  },
  methods: {
    keyCodeDown (e) {
      if (e.keyCode === 13) {
        if (this.dialogVisible) {
          this.addUser()
        }
        if (this.dialogVisible2) {
          this.setUserGroup()
        }
      }
    },
    onSubmit () {
      this.loading = true
      let param = this.createFormData({
        page: parseInt(this.currentPage),
        page_size: parseInt(this.page)
      })
      this.$http.post(GET_COOP_AUTH_USER_POST, param).then(res => {
        this.loading = false
        if (this.vmResponseHandler(res)) {
          res.data.data.map(val => {
            if (val.groupName) {
              val.groupName = val.groupName.join('、')
            }
          })
          this.tableData = res.data.data
          this.resData = res.data
          this.options = res.data.group
          this.total = res.data.total
        }
      }
      ).catch(() => {
        this.loading = false
        this.vmMsgError('程序错误！')
      })
    },
    addUser: _.debounce(function () {
      this.$refs['AddForm'].validate((valid) => {
        if (valid) {
          let param = this.createFormData(this.formAdd)
          this.$http.post(ADD_COOP_AUTH_USER_POST, param).then(res => {
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess('操作成功！')
              this.dialogVisible = false
              this.$refs['AddForm'].resetFields()
              this.onSubmit()
            }
          }).catch(() => {
            this.vmMsgError('程序错误！')
          })
        }
      })
    }, 300),
    setUserGroup: _.debounce(function () {
      this.$refs['AddForm'].validate((valid) => {
        console.log(valid)
        if (valid) {
          let param = this.createFormData({
            user_id: this.user_id,
            group: JSON.stringify(this.groupForm.group)
          })
          let loading = this.vmLoadingFull()
          this.$http.post(SET_COOP_AUTH_USERGROUP_POST, param).then(res => {
            loading.close()
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess('操作成功！')
              this.dialogVisible2 = false
              this.$refs['AddForm'].resetFields()
              this.onSubmit()
            }
          }).catch(() => {
            loading.close()
            this.vmMsgError('程序错误！')
          })
        }
      })
    }, 300),
    deleteUser (row) {
      let param = this.createFormData({
        user_name: row.user_name
      })
      this.vmConfirm({
        msg: '确定删除该记录？',
        confirmCallback: () => {
          let loading = this.vmLoadingFull()
          this.$http.post(DELETE_COOP_AUTH_USER_POST, param).then(res => {
            loading.close()
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess('删除成功！')
              this.onSubmit()
            }
          }).catch(() => {
            loading.close()
            this.vmMsgError('程序错误！')
          })
        }
      })
    },
    addAdmin () {
      this.dialogVisible = true
    },
    editAdmin (row) {
      this.dialogVisible2 = true
      this.user_id = row.user_id
    },
    resetPassword (row) {
      let param = this.createFormData({
        user_name: row.user_name
      })
      this.vmConfirm({
        msg: '确定重置该用户密码？',
        confirmCallback: () => {
          let loading = this.vmLoadingFull()
          this.$http.post(RESET_PWD_AUTH_POST, param).then(res => {
            loading.close()
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess('重置密码成功！')
              this.onSubmit()
            }
          }).catch(() => {
            loading.close()
            this.vmMsgError('程序错误！')
          })
        }
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
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
</style>
<style>
  .admin /deep/ .el-dialog{
    width:54.17rem;
  }
</style>
