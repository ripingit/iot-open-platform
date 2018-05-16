<template>
  <div class="container">
    <el-row class="app_nav">
      <h5>APP版本</h5>
      <p>THE APP VERSION</p>
    </el-row>
    <el-row class="table">
      <el-row>
        <el-date-picker
          v-model="inputVal1"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-select v-model="inputVal2" placeholder="请选择公司">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button class="btn-search" type="primary">查询</el-button>
        <el-button icon="el-icon-delete" type="danger" circle class="btn-circle-delete" @click="operationData"></el-button>
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
            label="所属公司">
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
            label="更新时间">
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
      title="APP升级详情"
      center
      :visible.sync="detailDialogVisible"
      :close-on-click-modal="false"
      :before-close="handleClose">
      <el-form status-icon :model="detailData" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="升级方式" class="form-row">
          <span>{{detailData.name}}</span>
        </el-form-item>
        <el-form-item label="APP名称" class="form-row">
          <span>{{detailData.name}}</span>
        </el-form-item>
        <el-form-item label="版本" class="form-row">
          <span>{{detailData.name}}</span>
        </el-form-item>
        <el-form-item label="下载地址" prop="name" class="form-row">
          <el-input v-model="detailData.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="MD5值" class="form-row">
          <span>{{detailData.name}}</span>
        </el-form-item>
        <el-form-item label="升级描述" prop="name" class="form-row">
          <el-input type="textarea" resize="none" v-model="detailData.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item class="form-row" style="margin-top: 4.33rem">
          <el-button type="primary" @click="submitForm">确定</el-button>
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
      inputVal1: '',
      inputVal2: '',
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
      detailDialogVisible: false,
      rules: {
        name: [
          {required: true, message: '请输入活动名称', trigger: 'blur'},
          {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
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
      if (this.multipleSelection.length <= 0) {
        this.vmMsgWarning('请选择记录！')
        return false
      } else {
        console.log(this.multipleSelection)
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

  .dialog_content h3 {
    color: #ffffff;
    margin-bottom: 3rem;
  }

  .container /deep/ .el-dialog {
    width: 54.17rem;
  }

  .container /deep/ .el-select {
    border: none;
  }

  .container /deep/ .el-textarea__inner {
    font-family: inherit;
    height:10rem;
  }
</style>
