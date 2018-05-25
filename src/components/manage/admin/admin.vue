<template>
  <div class="admin">
    <el-row>
      <el-col :span="24">
        <el-col :span="21">
          <p class="admin-title-1">管理员</p>
          <p class="admin-title-2">ADMIN ISTRATORS</p>
        </el-col>
      </el-col>
    </el-row>
    <el-row class="table">
      <el-row>
        <el-col :span="5">
          <el-input
            placeholder="点击此处搜索"
            v-model="inputVal">
            <i slot="prefix" class="el-input__icon el-icon-search" @click="SearchData()"></i>
          </el-input>
          <el-button icon="el-icon-plus" type="primary" circle class="btn-circle-add" @click="addAdmin()"></el-button>
          <el-button icon="el-icon-delete" type="danger" circle class="btn-circle-delete btn-circle-right" @click="Delete()"></el-button>
        </el-col>
      </el-row>
     <el-row>
       <el-table
         ref="multipleTable"
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
           prop="name"
           label="姓名">
         </el-table-column>
         <el-table-column
           prop="address"
           label="角色">
         </el-table-column>
         <el-table-column
           prop="address"
           label="创建时间">
         </el-table-column>
         <el-table-column
           prop="address"
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
                        @click="editAdmin(scope.row)"></el-button>
             <el-button icon="iconfont icon-zhongzhi"
                        size="mini"
                        class="btn-circle"
                        circle></el-button>
           </template>
         </el-table-column>
       </el-table>
     </el-row>
      <el-row type="flex" justify="center">
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
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      center
      :before-close="handleClose">
      <el-form label-width="100px" status-icon :model="formAdd" ref="AddForm" :rules="rules">
        <el-form-item label="用户" class="form-row" prop="name">
          <el-select v-model="formAdd.name" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户权限" class="form-row" prop="name">
          <el-select v-model="formAdd.name" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" style="margin-top: 4.33rem;">
          <el-button type="primary" class="btn-submit" @click="EnsureSubmit()">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import '@/assets/css/content.css'
import { EQUIPMENT_MODEL_QUERY } from '../../../lib/api.js'
export default {
  data () {
    let validateIsEmpty = (rule, value, callback) => {
      if (value === '') {
        if (rule.field === 'name') {
          callback(new Error('请选择用户'))
        } else if (rule.field === 'name1') {
          callback(new Error('请选择用户权限'))
        }
      }
      callback()
    }
    return {
      rules: {
        name: [
          { validator: validateIsEmpty, trigger: 'change' }
        ],
        name1: [
          { validator: validateIsEmpty, trigger: 'change' }
        ]
      },
      dialogVisible: false,
      inputVal: '',
      dialogTitle: '',
      formAdd: {
        name: '',
        name1: ''
      },
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市'
      }],
      multipleSelection: [],
      currentPage: 1,
      total: 0,
      page: 10
    }
  },
  methods: {
    onSubmit () {
      let loading = this.vmLoadingFull()
      let param = this.createFormData({
        page: parseInt(this.currentPage),
        page_size: parseInt(this.page)
      })
      this.$http.post(EQUIPMENT_MODEL_QUERY, param).then(res => {
        loading.close()
        if (res.data.statu === 0) {
          this.$router.push('/login')
          return false
        }
        if (this.vmResponseHandler(res)) {
          this.tableData = res.data.data
          this.total = res.data.total
          this.isLoading = false
        }
      }
      ).catch(() => {
        loading.close()
        this.vmMsgError('网络错误！')
      })
    },
    EnsureSubmit () {
      this.$refs['AddForm'].validate((valid) => {
        if (valid) {
          let param = this.createFormData(this.formAdd)
          this.$http.post(EQUIPMENT_MODEL_QUERY, param).then(res => {
            if (res.data.statu === 0) {
              this.$router.push('/login')
              return false
            }
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
    },
    Delete () {
      if (!this.multipleSelection.length) {
        this.vmMsgWarning('请选择记录')
        return
      }
      let codeArr = ''
      this.multipleSelection.forEach(val => {
        codeArr = val.prodt_code
      })
      let param = this.createFormData({
        prodt_code: codeArr
      })
      this.vmConfirm({
        msg: '确定删除该记录？',
        confirmCallback: () => {
          let loading = this.vmLoadingFull()
          this.$http.post(EQUIPMENT_MODEL_QUERY, param).then(res => {
            if (res.data.statu === 0) {
              this.$router.push('/login')
              return false
            }
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
      this.dialogTitle = '添加管理员'
    },
    editAdmin (row) {
      this.dialogVisible = true
      this.dialogTitle = '编辑管理员'
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
    color: #ffffff;
    padding:1.8rem 2rem;
  }
  .admin-title-1{
    font-size: 1.8rem;
  }
  .admin-title-2{
    padding-top: 0.35rem;
    font-size: 1rem;
    color: #808080;
  }
</style>
<style>
  .admin /deep/ .el-dialog{
    width:54.17rem;
  }
</style>
