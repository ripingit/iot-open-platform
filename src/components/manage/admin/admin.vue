<template>
  <div class="admin">
    <el-row>
      <el-col :span="24" style="position: relative">
        <el-col :span="21">
          <p class="admin-title-1">管理员</p>
          <p class="admin-title-2">ADMIN ISTRATORS</p>
        </el-col>
        <el-col :span="3" style="position: absolute;top: 2.1rem;right:0rem;z-index: 10">
          <el-button type="primary" style="width: 4.5rem;height: 4.5rem;" icon="el-icon-plus" circle @click="addAdmin()"></el-button>
          <el-button type="danger" style="width: 4.5rem;height: 4.5rem;" icon="el-icon-delete" circle @click="Delete()"></el-button>
        </el-col>
      </el-col>
    </el-row>
    <el-row class="admin-content">
      <el-col :span="10" style="margin-bottom: 2rem;width: 25rem;">
        <el-input
          style="background:transparent;border: 1px solid #808080;border-radius:4px;"
          placeholder="点击此处搜索"
          v-model="inputVal">
          <i slot="prefix" class="el-input__icon el-icon-search" @click="SearchData()"></i>
        </el-input>
      </el-col>
      <el-col :span="24" class="admin-table">
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
                <el-button type="primary"
                          style="background: rgb(94,94,94);border-color: rgb(94,94,94);"
                          icon="el-icon-edit" circle @click="editAdmin(scope.row)"></el-button>
                <el-button type="danger"
                          style="background: rgb(94,94,94);border-color: rgb(94,94,94);"
                          icon="el-icon-refresh" circle></el-button>
              </template>
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
          :title="dialogTitle"
          :visible.sync="dialogVisible"
          width="53rem"
          center
          :before-close="handleClose">
          <el-form label-width="100px" :model="formAdd">
                <el-form-item label="用户" class="form-row">
                  <el-select v-model="formAdd.name" placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="用户权限" class="form-row">
                  <el-select v-model="formAdd.name" placeholder="请选择">
                    <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" style="margin-top: 4rem;">
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
      inputVal: '',
      dialogTitle: '',
      formAdd: {
        name: ''
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
      currentPage: 1
    }
  },
  methods: {
    onSubmit () {
      console.log('submit!')
    },
    Delete () {

    },
    SearchData () {
      console.log('搜索')
    },
    addAdmin () {
      this.dialogVisible = true
      this.dialogTitle = '添加管理员'
    },
    editAdmin () {
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
  .admin-content{
    margin-top: 1rem;
    border-radius: .1rem;
    padding: 3rem;
    background-color:#36393E;
  }
  .admin-table{
    color: #ffffff;
    min-height:52rem;
  }
</style>
