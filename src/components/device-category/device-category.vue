<template>
  <div class="device-category">
    <el-row>
      <el-col :span="24" style="position: relative">
        <el-col :span="21">
          <p class="device-category-title-1">设备类别</p>
          <p class="device-category-title-2">EQUIPMENT CATEGORY</p>
        </el-col>
        <el-col :span="3" style="position: absolute;top: 2.3rem;right:0rem;z-index: 10">
          <el-button type="primary" icon="el-icon-plus" circle @click="addDevice()"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle @click="Delete()"></el-button>
        </el-col>
      </el-col>
    </el-row>
    <el-row class="device-category-content">
      <el-col :span="24">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="">
            <el-date-picker
              class="time"
              v-model="formInline.ChoiceTime"
              type="daterange"
              :editable="false"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="formInline.company" placeholder="请选择">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="24" class="device-category-table">
        <el-col :span="24">
          <el-table
            v-loading="isLoading"
            element-loading-text="拼命加载中"
            ref="multipleTable"
            :data="tableData"
            style="width: 100%;"
            @selection-change="handleSelectionChange">
            <el-table-column
              v-if="isActive"
              type="selection">
            </el-table-column>
            <el-table-column
              prop="date"
              label="编号">
            </el-table-column>
            <el-table-column
              prop="name"
              label="类别名称">
            </el-table-column>
            <el-table-column
              prop="address"
              label="类别代码">
            </el-table-column>
            <el-table-column
              prop="address"
              label="添加时间">
            </el-table-column>
            <el-table-column
              prop="address"
              label="提交人">
            </el-table-column>
            <el-table-column
              prop="address"
              label="审核人">
            </el-table-column>
          </el-table>
        </el-col>
      </el-col>
      <el-col :span="24" style="text-align: center">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="100"
          layout="prev, pager, next, jumper"
          :total="1000">
        </el-pagination>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-dialog
          title="添加类别"
          :visible.sync="dialogVisible"
          width="32%"
          center
          :before-close="handleClose">
          <el-form label-width="80px" :model="formAdd">
            <el-form-item label="类别名称">
              <el-input v-model="formAdd.name"></el-input>
            </el-form-item>
            <el-form-item label="类别代码">
              <el-input v-model="formAdd.name1"></el-input>
            </el-form-item>
            <el-form-item label="" style="margin-top: 4rem;">
              <el-button type="primary" style="width: 100%;" @click="dialogVisible = false">确 定</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data () {
    return {
      isLoading: false,
      isActive: false,
      dialogVisible: false,
      formInline: {
        ChoiceTime: '',
        company: ''
      },
      formAdd: {
        name: '',
        name1: ''
      },
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
      currentPage: 1
    }
  },
  methods: {
    onSubmit () {
      console.log('submit!')
    },
    addDevice () {
      this.dialogVisible = true
    },
    Delete () {
      this.isActive = !this.isActive
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
  .device-category{
    color: #ffffff;
    padding:1.8rem 2rem;
  }
  .device-category-title-1{
    font-size: 1.8rem;
  }
  .device-category-title-2{
    padding-top: 0.35rem;
    font-size: 1rem;
    color: #808080;
  }
  .device-category-content{
    margin-top: 1rem;
    border-radius: .1rem;
    padding: 3rem;
    background-color:#36393E;
  }
  .device-category-table{
    color: #ffffff;
    min-height:52rem;
  }
</style>
<style>
  .device-category .el-input__inner, .el-date-editor .el-range-input{
    background: #5E6165;
    color: #ffffff;
  }
  .device-category .el-table th,.device-category .el-table tr{
    background-color:#36393E;
    color: #b3b3b3;
  }
  .device-category .el-pager li:hover,.device-category .el-pager li.active{
    color: #ffffff;
    background-color: #1f7ecf;
  }
  .device-category .el-pager li,.device-category .el-pagination .btn-next,.device-category .el-pagination .btn-prev{
    background-color:#36393E;
    color: #b3b3b3;
  }
  .device-category .el-button.is-circle{
    padding: 16px;
  }
  .device-category .el-table td,.device-category .el-table th.is-leaf{
    border-bottom:1px solid #4C4C4C;
  }
  .device-category .el-table--border::after,.device-category .el-table--group::after, .device-category .el-table::before{
    background-color:transparent;
  }
</style>
