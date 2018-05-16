<template>
  <div class="container">
    <el-row class="app_nav">
      <h5>APP版本</h5>
      <p>THE APP VERSION</p>
    </el-row>
    <el-row class="table">
      <el-row>
        <el-col :span="5">
          <el-input
            placeholder="点击此处搜索"
            v-model="inputVal">
            <i slot="prefix" class="el-input__icon el-icon-search" @click="searchData()"></i>
          </el-input>
          <el-button icon="el-icon-plus" type="primary" circle class="btn-circle-add" @click="operationData('add')"></el-button>
          <el-button icon="el-icon-delete" type="danger" circle class="btn-circle-delete" @click="operationData('delete')"></el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-table
          element-loading-text="拼命加载中"
          :data="tableData"
          @selection-change="handleSelectionChange"
          style="width: 100%;">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="date"
            min-width="180"
            label="编号">
          </el-table-column>
          <el-table-column
            prop="name"
            min-width="150"
            label="APP名称">
          </el-table-column>
          <el-table-column
            prop="address"
            min-width="150"
            label="版本号">
          </el-table-column>
          <el-table-column
            prop="address"
            min-width="200"
            label="URL">
          </el-table-column>
          <el-table-column
            prop="address"
            min-width="180"
            label="时间">
          </el-table-column>
          <el-table-column
            prop=""
            label="操作"
            min-width="100">
            <template slot-scope="scope">
              <el-button
                class="btn-circle"
                size="mini"
                icon="iconfont icon-gengduo"
                circle
                @click="showDetail(scope.row.idx)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row type="flex" justify="center">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="100"
          layout="prev, pager, next, jumper"
          :total="1000">
        </el-pagination>
      </el-row>
    </el-row>
    <el-dialog
      title="APP升级"
      center
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :before-close="handleClose">
      <el-form status-icon :model="ruleForm" :rules="rules" ref="ruleForm" label-position="right" label-width="100px">
        <el-form-item label="升级方式" prop="style" class="form-row">
          <el-select v-model="ruleForm.style" placeholder="请选择升级方式">
            <el-option label="更新" value="update"></el-option>
            <el-option label="添加" value="add"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="APP名称" prop="name" class="form-row">
          <el-input v-model="ruleForm.name" placeholder="请输入" v-show="ruleForm.style==='add'"></el-input>
          <el-select v-model="ruleForm.name" placeholder="请选择" v-show="ruleForm.style==='update'">
            <el-option label="啦啦啦" value="update"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="版本" prop="desc" class="form-row">
          <el-input v-model="ruleForm.desc" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="下载地址" prop="desc" class="form-row">
          <el-input v-model="ruleForm.desc" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="MD5值" prop="desc" class="form-row">
          <el-input v-model="ruleForm.desc" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="升级描述" prop="desc" class="form-row">
          <el-input type="textarea" resize="none" v-model="ruleForm.desc" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item class="form-row" style="margin-top: 4.33rem">
          <el-button type="primary" @click="submitForm" class="btn-submit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="APP升级详情"
      center
      :visible.sync="detailDialogVisible"
      :close-on-click-modal="false"
      :before-close="handleClose">
      <el-form label-width="100px">
        <el-form-item label="升级方式">
          <span>{{detailData.name}}</span>
        </el-form-item>
        <el-form-item label="APP名称">
          <span>{{detailData.name}}</span>
        </el-form-item>
        <el-form-item label="版本">
          <span>{{detailData.name}}</span>
        </el-form-item>
        <el-form-item label="下载地址">
          <span class="download">{{detailData.name}}</span>
        </el-form-item>
        <el-form-item label="MD5值">
          <span>{{detailData.name}}</span>
        </el-form-item>
        <el-form-item label="升级描述">
          <span>{{detailData.name}}</span>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import '@/assets/css/content.css'

export default {
  data () {
    return {
      inputVal: '',
      multipleSelection: [],
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
      currentPage: 1,
      dialogVisible: false,
      detailDialogVisible: false,
      ruleForm: {
        name: '',
        style: 'update',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        style: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        date1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
      },
      detailData: {
        name: ''
      }
    }
  },
  methods: {
    searchData () {
      console.log(this.inputVal)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    operationData (type) {
      if (type === 'add') {
        this.dialogVisible = true
      } else {
        if (this.multipleSelection.length <= 0) {
          this.vmMsgWarning('请选择记录！')
          return false
        } else {
          console.log(this.multipleSelection)
        }
      }
    },
    handleClose (done) {
      done()
    },
    submitForm () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
        } else {
          return false
        }
      })
    },
    showDetail (ix) {
      console.log(ix)
      // this.detailData = this.tableData[ix]
      this.detailDialogVisible = true
    },
    loadData () {
      this.$http.get()
    }
  }
}
</script>
<style scoped>
  .container {
    margin: 1.67rem 2.5rem;
  }

  .app_nav h5 {
    font-size: 1.5rem;
    color: #fff;
  }

  .app_nav p {
    font-size: .83rem;
    color: #808080;
    margin-top: .33rem;
  }
  .container /deep/ .el-dialog{
    width:54.17rem;
  }
  .container /deep/ .el-textarea__inner{
    font-family:inherit;
    height:10rem;
  }
  .download{
    color: #38a0f8;
  }
</style>
