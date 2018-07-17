<template>
  <div class="device-category">
    <el-row>
      <el-col :span="24">
        <p class="title-cn">设备类别</p>
        <p class="title-en">EQUIPMENT CATEGORY</p>
      </el-col>
    </el-row>
    <el-row class="table">
     <el-row>
       <el-col :span="24">
         <el-form :inline="true" :model="formInline" class="demo-form-inline">
           <el-form-item label="">
             <el-date-picker
               class="time"
               v-model="formInline.ChoiceTime"
               type="daterange"
               value-format="yyyy-MM-dd"
               :editable="false"
               range-separator="至"
               start-placeholder="开始日期"
               end-placeholder="结束日期">
             </el-date-picker>
           </el-form-item>
           <el-form-item label="">
             <el-input v-model="formInline.query_by_name"></el-input>
           </el-form-item>
           <el-form-item>
             <el-button type="primary" @click="onSubmit">查询</el-button>
           </el-form-item>
         </el-form>
         <el-button
           icon="el-icon-plus"
           type="primary"
           circle
           class="btn-circle-add"
           v-if="vmHasAuth(PermissionsLib.ADD_DEVICE_CATE, resData.res)"
           @click="addDevice()"></el-button>
         <el-button
           icon="el-icon-delete"
           type="danger"
           circle
           class="btn-circle-delete btn-circle-right"
           v-if="vmHasAuth(PermissionsLib.DEL_DEVICE_CATE, resData.res)"
           @click="Delete()"></el-button>
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
            prop="prodt_name"
            label="类别名称">
          </el-table-column>
          <el-table-column
            prop="prodt_code"
            label="类别代码">
          </el-table-column>
          <el-table-column
            prop="create_time"
            label="添加时间">
          </el-table-column>
          <el-table-column
            prop="user_name"
            label="提交人">
          </el-table-column>
          <el-table-column
            prop="review_name"
            label="审核人">
          </el-table-column>
        </el-table>
      </el-row>
      <el-col v-if="total>page" :span="24" style="text-align: center">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="page"
          layout="prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-col>
    </el-row>
    <el-dialog
      title="添加类别"
      :visible.sync="dialogVisible"
      center
      :before-close="handleClose">
      <el-form label-width="100px" status-icon :model="formAdd" ref="AddForm" :rules="rules">
        <el-form-item label="类别名称" class="form-row" prop="prodt_name">
          <el-input v-model="formAdd.prodt_name"></el-input>
        </el-form-item>
        <el-form-item label="类别代码" class="form-row" prop="prodt_code">
          <el-input v-model="formAdd.prodt_code"></el-input>
        </el-form-item>
        <el-form-item style="margin-top: 4rem;" class="form-row">
          <el-button type="primary" class="btn-submit" @click="EnsureAdd()">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import '@/assets/css/content.css'
import { EQUIPMENT_CATEGORY_QUERY, EQUIPMENT_CATEGORY_ADD, EQUIPMENT_CATEGORY_DELETE } from '../../../lib/api.js'
export default {
  data () {
    let validateIsEmpty = (rule, value, callback) => {
      if (value === '') {
        if (rule.field === 'prodt_name') {
          callback(new Error('请输入类别名称'))
        } else if (rule.field === 'prodt_code') {
          callback(new Error('请输入类别代码'))
        }
      }
      callback()
    }
    return {
      rules: {
        prodt_name: [
          { validator: validateIsEmpty, trigger: 'blur' }
        ],
        prodt_code: [
          { validator: validateIsEmpty, trigger: 'blur' }
        ]
      },
      dialogVisible: false,
      formInline: {
        ChoiceTime: '',
        query_by_name: ''
      },
      formAdd: {
        prodt_name: '',
        prodt_code: ''
      },
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
        if (this.dialogVisible) { this.EnsureAdd(); return }
        this.onSubmit()
      }
    },
    onSubmit () {
      let loading = this.vmLoadingFull()
      let param = this.createFormData({
        page: parseInt(this.currentPage),
        page_size: parseInt(this.page),
        query_by_name: this.formInline.query_by_name,
        start_time: this.formInline.ChoiceTime ? this.formInline.ChoiceTime[0] : '',
        end_time: this.formInline.ChoiceTime ? this.formInline.ChoiceTime[1] : ''
      })
      this.$http.post(EQUIPMENT_CATEGORY_QUERY, param).then(res => {
        loading.close()
        if (res.data.statu === 0) {
          this.$router.push('/login')
          return false
        }
        if (this.vmResponseHandler(res)) {
          this.tableData = res.data.data
          this.resData = res.data
          this.total = res.data.total
        }
      }
      ).catch(() => {
        loading.close()
        this.vmMsgError('网络错误！')
      })
    },
    addDevice () {
      this.dialogVisible = true
    },
    EnsureAdd () {
      this.$refs['AddForm'].validate((valid) => {
        if (valid) {
          let param = this.createFormData(this.formAdd)
          this.$http.post(EQUIPMENT_CATEGORY_ADD, param).then(res => {
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
      let codeArr = []
      this.multipleSelection.forEach(val => {
        codeArr.push(val.prodt_code)
      })
      let param = this.createFormData({
        prodt_code: JSON.stringify(codeArr)
      })
      this.vmConfirm({
        msg: '确定删除该记录？',
        confirmCallback: () => {
          let loading = this.vmLoadingFull()
          this.$http.post(EQUIPMENT_CATEGORY_DELETE, param).then(res => {
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
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.onSubmit(val)
    },
    handleClose (done) {
      done()
    }
  }
}
</script>
<style scoped>
  .device-category{
    padding: 1.67rem 2.5rem;
    color: #fff;
  }
</style>
<style>
  .device-category .el-dialog{
    width:54.17rem;
  }
</style>
