<template>
  <div class="device-category">
    <el-row>
      <el-col :span="24" style="position: relative">
        <el-col :span="21">
          <p class="device-category-title-1">设备类别</p>
          <p class="device-category-title-2">EQUIPMENT CATEGORY</p>
        </el-col>
        <el-col :span="3" style="position: absolute;top: 2.1rem;right:0rem;z-index: 10">
          <el-button type="primary" style="width: 4.5rem;height: 4.5rem;" icon="el-icon-plus" circle @click="addDevice()"></el-button>
          <el-button type="danger" style="width: 4.5rem;height: 4.5rem;" icon="el-icon-delete" circle @click="Delete()"></el-button>
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
          width="53rem"
          center
          :before-close="handleClose">
          <el-form label-width="100px" :model="formAdd">
            <el-form-item label="类别名称" class="form-row">
              <el-input v-model="formAdd.name"></el-input>
            </el-form-item>
            <el-form-item label="类别代码" class="form-row">
              <el-input v-model="formAdd.name1"></el-input>
            </el-form-item>
            <el-form-item style="margin-top: 4rem;" class="form-row">
              <el-button type="primary" class="btn-submit" @click="dialogVisible = false">确 定</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import '@/assets/css/content.css'

export default {
  data () {
    return {
      isLoading: false,
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
