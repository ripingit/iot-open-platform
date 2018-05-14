<template>
  <transition name="bounce" mode="out-in">
    <div class="container">
      <el-row class="app_nav">
        <h5>APP版本</h5>
        <p>THE APP VERSION</p>
      </el-row>
      <el-row class="app_content">
        <el-row class="app_operationBtn">
          <el-button icon="el-icon-delete" type="primary" circle class="app_delete" @click="operationData"></el-button>
        </el-row>
        <el-row>
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
          </el-row>
        </el-row>
        <el-row class="app_table">
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
                <el-button type="primary"
                          style="background: rgb(94,94,94);border-color: rgb(94,94,94);"
                          icon="el-icon-more" circle @click="showDetail(scope.row.idx)"></el-button>
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
        title=""
        :visible.sync="detailDialogVisible"
        :close-on-click-modal="false"
        :before-close="handleClose">
        <el-row class="dialog_content">
          <el-row type="flex" justify="center">
            <h3>APP升级详情</h3>
          </el-row>
          <el-row type="flex" justify="center">
            <el-col :span="17">
              <el-form :model="detailData" :rules="rules" ref="ruleForm" label-width="80px">
                <el-form-item label="升级方式">
                  <span>{{detailData.name}}</span>
                </el-form-item>
                <el-form-item label="APP名称">
                  <span>{{detailData.name}}</span>
                </el-form-item>
                <el-form-item label="版本">
                  <span>{{detailData.name}}</span>
                </el-form-item>
                <el-form-item label="下载地址" prop="name">
                  <el-input v-model="detailData.name" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="MD5值">
                  <span>{{detailData.name}}</span>
                </el-form-item>
                <el-form-item label="升级描述" prop="name">
                  <el-input type="textarea" resize="none" v-model="detailData.name" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitForm" style="width: 100%;">确定</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-row>
      </el-dialog>
    </div>
  </transition>
</template>
<script>
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

  .app_content {
    background-color: #36393E;
    margin-top: 1.5rem;
    padding: 0 4.5rem 2.5rem 4.5rem;
  }

  .app_operationBtn {
    position: relative;
    height: 2.5rem;
  }

  .app_delete {
    position: absolute;
    width: 4.5rem;
    height: 4.5rem;
    top: -2.25rem;
    font-size: 1.5rem;
    color: #ffffff;
  }

  .app_delete {
    right: 7rem;
    background-color: #ff5d66;
    border-color: #ff5d66;
  }
  .el-select, .btn-search {
    margin-left: 1.5rem;
  }
  .app_table {
    margin: 3rem 0 2rem;
    min-height: 52rem;
  }

  .dialog_content h3 {
    color: #ffffff;
    margin-bottom: 3rem;
  }

  .container /deep/ .el-dialog {
    width: 54.17rem;
  }

  .container /deep/ .el-select {
    border: solid 1px rgba(255, 255, 255, 0.2);
  }

  .container /deep/ .el-textarea__inner {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    font-family: inherit;
    color: #fff;
    height:10rem;
  }
  .container /deep/ .el-form-item__content{
    color: #ffffff;
  }
</style>
