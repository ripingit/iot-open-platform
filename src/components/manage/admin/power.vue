<template>
  <div class="admin">
    <el-row>
      <el-col :span="24">
        <p class="title-cn">管理员-权限管理</p>
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
            v-if="vmHasAuth(AdminPermissionsLib.ADD_USER_GROUP, resData.res)"
            @click="addAdmin()"></el-button>
          <el-button
            icon="el-icon-delete"
            type="danger" circle
            class="btn-circle-delete btn-circle-right"
            v-if="vmHasAuth(AdminPermissionsLib.DEL_USER_GROUP, resData.res)"
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
            align="center"
            label="编号">
          </el-table-column>
          <el-table-column
            prop="group_name"
            align="center"
            label="角色">
          </el-table-column>
          <el-table-column
            prop=""
            align="center"
            label="授权">
            <template slot-scope="scope">
              <span class="admin-power"
                    v-if="vmHasAuth(AdminPermissionsLib.ADD_USER_GROUP_AUTH, resData.res)"
                    @click="VisitPower(scope.row)">访问授权</span>
              <span class="admin-power"
                    style="margin-left: 1rem;"
                    v-if="vmHasAuth(AdminPermissionsLib.DEL_USER_GROUP_USER, resData.res)"
                    @click="memberPower(scope.row)">成员授权</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="enable"
            align="center"
            label="当前状态">
            <template slot-scope="scope">
              <span v-if="scope.row.enable===1" style="color: #2acba7">可用</span>
              <span v-if="scope.row.enable===2" style="color: #ff5d66">禁用</span>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            align="center"
            label="操作"
            width="180">
            <template slot-scope="scope">
              <el-button icon="iconfont icon-bianji"
                         class="btn-circle"
                         size="mini"
                         circle
                         v-if="vmHasAuth(AdminPermissionsLib.EDIT_USER_GROUP, resData.res)"
                         @click="editAdmin(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row v-if="total>page" type="flex" justify="center">
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
      title="添加用户组"
      :visible.sync="dialogVisible"
      center
      :before-close="handleClose">
      <el-form label-width="100px" status-icon :model="formAdd" ref="AddForm" :rules="rules">
        <el-form-item label="用户组" class="form-row" prop="group_name">
          <el-input v-model="formAdd.group_name"></el-input>
        </el-form-item>
        <el-form-item label="" style="margin-top: 4.33rem;">
          <el-button type="primary" class="btn-submit" @click="EnsureSubmit()">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="编辑用户组"
      :visible.sync="dialogVisible2"
      center
      :before-close="handleClose">
      <el-form label-width="100px" status-icon :model="formAdd2" ref="AddForm" :rules="rules">
        <el-form-item label="当前状态" class="form-row" prop="enable">
          <el-select v-model="formAdd2.enable" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
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
import { ADMIN_POWER_QUERY,
  ADMIN_POWER_ADD,
  ADMIN_POWER_EDIT,
  ADMIN_POWER_DEL
} from '../../../lib/api.js'
import _ from 'lodash'
export default {
  data () {
    let validateIsEmpty = (rule, value, callback) => {
      if (value === '') {
        if (rule.field === 'group_name') {
          callback(new Error('请输入用户组'))
        } else if (rule.field === 'enable') {
          callback(new Error('请选择当前状态'))
        }
      }
      callback()
    }
    return {
      rules: {
        group_name: [
          { validator: validateIsEmpty, trigger: 'blur' }
        ],
        enable: [
          { validator: validateIsEmpty, trigger: 'change' }
        ]
      },
      dialogVisible: false,
      dialogVisible2: false,
      inputVal: '',
      group_id: '',
      group_name: '',
      formAdd: {
        group_name: ''
      },
      formAdd2: {
        enable: ''
      },
      options: [{
        value: 1,
        label: '可用'
      }, {
        value: 2,
        label: '禁用'
      }],
      tableData: [],
      resData: [],
      multipleSelection: [],
      currentPage: 1,
      total: 0,
      page: 20
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
      this.$http.post(ADMIN_POWER_QUERY, param).then(res => {
        this.loading = false
        if (this.vmResponseHandler(res)) {
          this.tableData = res.data.data
          this.resData = res.data
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
          this.$http.post(ADMIN_POWER_ADD, param).then(res => {
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
            group_id: this.group_id,
            group_name: this.group_name,
            enable: this.formAdd2.enable
          })
          this.$http.post(ADMIN_POWER_EDIT, param).then(res => {
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
      let codeArr2 = ''
      this.multipleSelection.forEach(val => {
        codeArr = val.group_name
        codeArr2 = val.group_id
      })
      let param = this.createFormData({
        group_id: codeArr2,
        group_name: codeArr
      })
      this.vmConfirm({
        msg: '确定删除该记录？',
        confirmCallback: () => {
          let loading = this.vmLoadingFull()
          this.$http.post(ADMIN_POWER_DEL, param).then(res => {
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
      this.group_id = row.group_id
      this.group_name = row.group_name
    },
    VisitPower (row) {
      this.$router.push({name: 'VisitPower', params: { group_id: row.group_id }})
    },
    memberPower (row) {
      this.$router.push({name: 'memberPower', params: { group_id: row.group_id }})
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
