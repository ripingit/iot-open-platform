<template>
  <div class="device-model-admin">
    <el-row>
      <el-col :span="24" style="position: relative">
        <el-col :span="21">
          <p class="device-model-admin-title-1">设备型号</p>
          <p class="device-model-admin-title-2">UNIT TYPE</p>
        </el-col>
        <el-col :span="3" style="position: absolute;top: 2.1rem;right:0rem;z-index: 10">
          <el-button type="danger" style="width: 4.5rem;height: 4.5rem;" icon="el-icon-delete" circle @click="Delete()"></el-button>
        </el-col>
      </el-col>
    </el-row>
    <el-row class="device-model-admin-content">
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
      <el-col :span="24" class="device-model-admin-table">
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
              label="型号">
            </el-table-column>
            <el-table-column
              prop="address"
              label="型号代码">
            </el-table-column>
            <el-table-column
              prop="address"
              label="连接方式">
            </el-table-column>
            <el-table-column
              prop="address"
              label="图1">
            </el-table-column>
            <el-table-column
              prop="address"
              label="图2">
            </el-table-column>
            <el-table-column
              prop="address"
              label="固件版本">
            </el-table-column>
            <el-table-column
              prop="address"
              label="所属公司">
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
  .device-model-admin{
    color: #ffffff;
    padding:1.8rem 2rem;
  }
  .device-model-admin-title-1{
    font-size: 1.8rem;
  }
  .device-model-admin-title-2{
    padding-top: 0.35rem;
    font-size: 1rem;
    color: #808080;
  }
  .device-model-admin-content{
    margin-top: 1rem;
    border-radius: .1rem;
    padding: 3rem;
    background-color:#36393E;
  }
  .device-model-admin-table{
    color: #ffffff;
    min-height:52rem;
  }
</style>
