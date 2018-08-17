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
            v-if="vmHasAuth(AdminPermissionsLib.ADD_USER, resData.res)"
            @click="addAdmin()"></el-button>
          <el-button
            icon="el-icon-delete"
            type="danger" circle
            class="btn-circle-delete btn-circle-right"
            v-if="vmHasAuth(AdminPermissionsLib.DEL_USER, resData.res)"
            @click="Delete()"></el-button>
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
                        v-if="vmHasAuth(AdminPermissionsLib.ADD_USER_TO_GROUP, resData.res)"
                        @click="editAdmin(scope.row)"></el-button>
             <el-button icon="iconfont icon-zhongzhi"
                        size="mini"
                        class="btn-circle"
                        circle
                        v-if="vmHasAuth(AdminPermissionsLib.RESET_USER_PASS, resData.res)"
                        @click="Resetpwd(scope.row)"></el-button>
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
          <el-button type="primary" class="btn-submit" @click="EnsureSubmit()">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="添加用户组"
      :visible.sync="dialogVisible2"
      center
      :before-close="handleClose">
      <el-form label-width="100px" status-icon :model="formAdd2" ref="AddForm" :rules="rules">
        <el-form-item label="用户组" class="form-row" prop="group">
          <el-select v-model="formAdd2.group" multiple placeholder="请选择">
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
          <el-button type="primary" class="btn-submit" @click="EnsureSubmit2()">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import '@/assets/css/content.css'
import { ADMIN_USER_QUERY,
  ADMIN_USER_ADD,
  ADMIN_USER_DEL,
  ADMIN_USER_POWER_ADD,
  ADMIN_USER_RESET_PWD
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
      formAdd2: {
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
          this.EnsureSubmit()
        }
        if (this.dialogVisible2) {
          this.EnsureSubmit2()
        }
      }
    },
    onSubmit () {
      this.loading = true
      let param = this.createFormData({
        page: parseInt(this.currentPage),
        page_size: parseInt(this.page)
      })
      this.$http.post(ADMIN_USER_QUERY, param).then(res => {
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
        this.vmMsgError('网络错误！')
      })
    },
    EnsureSubmit: _.debounce(function () {
      this.$refs['AddForm'].validate((valid) => {
        if (valid) {
          let param = this.createFormData(this.formAdd)
          this.$http.post(ADMIN_USER_ADD, param).then(res => {
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess('操作成功！')
              this.dialogVisible = false
              this.$refs['AddForm'].resetFields()
              this.onSubmit()
            }
          }).catch(() => {
            this.vmMsgError('网络错误！')
          })
        }
      })
    }, 300),
    EnsureSubmit2: _.debounce(function () {
      this.$refs['AddForm'].validate((valid) => {
        if (valid) {
          let param = this.createFormData({
            user_id: this.user_id,
            group: JSON.stringify(this.formAdd2.group)
          })
          this.$http.post(ADMIN_USER_POWER_ADD, param).then(res => {
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess('操作成功！')
              this.dialogVisible2 = false
              this.$refs['AddForm'].resetFields()
              this.onSubmit()
            }
          }).catch(() => {
            this.vmMsgError('网络错误！')
          })
        }
      })
    }, 300),
    Delete () {
      if (!this.multipleSelection.length) {
        this.vmMsgWarning('请选择记录')
        return
      }
      let codeArr = ''
      this.multipleSelection.forEach(val => {
        codeArr = val.user_name
      })
      let param = this.createFormData({
        user_name: codeArr
      })
      this.vmConfirm({
        msg: '确定删除该记录？',
        confirmCallback: () => {
          let loading = this.vmLoadingFull()
          this.$http.post(ADMIN_USER_DEL, param).then(res => {
            loading.close()
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess('删除成功！')
              this.onSubmit()
            }
          }).catch(() => {
            loading.close()
            this.vmMsgError('网络错误！')
          })
        }
      })
    },
    SearchData () {
      console.log('搜索')
    },
    addAdmin () {
      this.dialogVisible = true
    },
    editAdmin (row) {
      this.dialogVisible2 = true
      this.user_id = row.user_id
    },
    Resetpwd (row) {
      let param = this.createFormData({
        user_name: row.user_name
      })
      this.vmConfirm({
        msg: '确定重置该用户密码？',
        confirmCallback: () => {
          let loading = this.vmLoadingFull()
          this.$http.post(ADMIN_USER_RESET_PWD, param).then(res => {
            loading.close()
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess('重置密码成功！')
              this.onSubmit()
            }
          }).catch(() => {
            loading.close()
            this.vmMsgError('网络错误！')
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
