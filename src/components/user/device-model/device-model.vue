<template>
  <transition name="bounce" mode="out-in">
    <div class="device-model">
      <el-row>
        <el-col :span="24" style="position: relative">
          <el-col :span="21">
            <p class="device-model-title-1">设备型号</p>
            <p class="device-model-title-2">UNIT TYPE</p>
          </el-col>
          <el-col :span="3" style="position: absolute;top: 2.1rem;right:0rem;z-index: 10">
            <el-button type="primary" style="width: 4.5rem;height: 4.5rem;" icon="el-icon-plus" circle @click="addDevice()"></el-button>
          </el-col>
        </el-col>
      </el-row>
      <el-row class="device-model-content">
        <el-col :span="10" class="device-model-Search" style="margin-bottom: 2rem;width: 25rem;">
          <el-input
            placeholder="点击此处搜索"
            v-model="inputVal">
            <i slot="prefix" class="el-input__icon el-icon-search" @click="SearchData()"></i>
          </el-input>
        </el-col>
        <el-col :span="24" class="device-model-table">
          <el-col :span="24">
            <el-table
              v-loading="isLoading"
              element-loading-text="拼命加载中"
              :data="tableData"
              style="width: 100%;">
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
                label="审核状态">
              </el-table-column>
              <el-table-column
                prop="address"
                label="配置状态">
              </el-table-column>
              <el-table-column
                prop=""
                label="操作"
                width="180">
                <template slot-scope="scope">
                  <el-button type="primary"
                            style="background: rgb(94,94,94);border-color: rgb(94,94,94);"
                            icon="el-icon-edit" circle @click="editDevice(scope.row)"></el-button>
                  <el-button type="danger"
                            style="background: rgb(94,94,94);border-color: rgb(94,94,94);"
                            icon="el-icon-delete" circle></el-button>
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
              <el-form-item label="型号名称" class="form-row">
                <el-input v-model="formAdd.name"></el-input>
                <span class="form-tip">*</span>
              </el-form-item>
              <el-form-item label="型号代码" class="form-row">
                <el-input v-model="formAdd.name1"></el-input>
                <span class="form-tip">*</span>
              </el-form-item>
              <el-form-item label="连接方式" class="form-row">
                <el-select v-model="formAdd.name1" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <span class="form-tip">*</span>
              </el-form-item>
              <el-form-item label="设备类别" class="form-row">
                <el-select v-model="formAdd.name1" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <span class="form-tip">*</span>
              </el-form-item>
              <el-form-item label="效果图1" class="form-row" >
                <el-col :span="24" style="line-height:1">
                  <div class="device-model-uploadImg"></div>
                  <div style="display: inline-block;vertical-align: top">
                    <el-upload
                      action="https://jsonplaceholder.typicode.com/posts/">
                      <el-button class="btn-upload" size="small" type="primary">上传</el-button>
                    </el-upload>
                  </div>
                  <div style="display: inline-block;color: #cecece;margin-left:.5rem;text-align: left">
                    <p>底色：白色</p>
                    <p style="margin-top: 1.5rem">尺寸：210*180</p>
                    <p style="margin-top: 1.3rem">图片大小不超过2M</p>
                  </div>
                </el-col>
              </el-form-item>
              <el-form-item label="效果图2" class="form-row">
                <el-col :span="24">
                  <div class="device-model-uploadImg"></div>
                  <div style="display: inline-block;vertical-align: top">
                    <el-upload
                      action="https://jsonplaceholder.typicode.com/posts/">
                      <el-button class="btn-upload" size="small" type="primary">上传</el-button>
                    </el-upload>
                  </div>
                  <div style="display: inline-block;color: #cecece;margin-left: .5rem;text-align: left">
                    <p>底色：白色</p>
                    <p style="margin-top: -1.5rem">尺寸：388*250</p>
                    <p style="margin-top: -1.3rem">图片大小不超过2M</p>
                  </div>
                </el-col>
              </el-form-item>
              <el-form-item style="margin-top: 4rem;">
                <el-button type="primary" class="btn-submit" @click="dialogVisible = false">提 交</el-button>
              </el-form-item>
            </el-form>
          </el-dialog>
        </el-col>
      </el-row>
      <el-row>
        <el-dialog
          title="型号配置"
          :visible.sync="editDialog"
          width="53rem"
          center
          style="margin-top: -6vh;"
          :before-close="handleClose">
          <el-row class="device-model-editdialog">
            <el-col :span="24" style="padding:0 0 1rem 2.5rem;">
              <div>型号名称：K258</div>
              <div>连接方式：蓝牙、红外、中控</div>
            </el-col>
            <el-col :span="24" class="device-model-editdialog-title">1.IPC分类</el-col>
            <el-col :span="24">
              <el-form label-width="100px" :model="formAdd">
                <el-form-item label="设备分类" class="form-row">
                  <el-select v-model="formAdd.name1" placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="解码方式" class="form-row">
                  <el-select v-model="formAdd.name1" placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="设备通道数" class="form-row">
                  <el-input v-model="formAdd.name"></el-input>
                </el-form-item>
                <el-form-item label="校正解码" class="form-row">
                  <el-select v-model="formAdd.name1" placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="音频模式" class="form-row">
                  <el-select v-model="formAdd.name1" placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="24" class="device-model-editdialog-title">2.情景按钮</el-col>
            <el-col :span="24">
              <el-form label-width="100px" :model="formAdd">
                <el-form-item label="按钮数量" class="form-row">
                  <el-input v-model="formAdd.name"></el-input>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="24" class="device-model-editdialog-title">3.组合开关</el-col>
            <el-col :span="24">
              <el-form label-width="100px" :model="formAdd">
                <el-form-item label="开关数量" class="form-row">
                  <el-input v-model="formAdd.name"></el-input>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="24">
              <el-form label-width="100px" :model="formAdd">
                <el-form-item label="">
                  <el-button type="primary" class="btn-submit" style="margin-top: 4.33rem" @click="dialogVisible = false">提 交</el-button>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-dialog>
      </el-row>
    </div>
  </transition>
</template>
<script>
export default {
  data () {
    return {
      isLoading: false,
      dialogVisible: false,
      editDialog: false,
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
      currentPage: 1
    }
  },
  methods: {
    addDevice () {
      this.dialogTitle = '添加型号'
      this.dialogVisible = true
      this.formAdd = {}
    },
    editDevice (row) {
      this.editDialog = true
    },
    SearchData () {
      console.log('搜索')
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
  .device-model{
    color: #ffffff;
    padding:1.8rem 2rem;
  }
  .device-model-title-1{
    font-size: 1.8rem;
  }
  .device-model-title-2{
    padding-top: 0.35rem;
    font-size: 1rem;
    color: #808080;
  }
  .device-model-content{
    margin-top: 1rem;
    border-radius: .1rem;
    padding: 3rem;
    background-color:#36393E;
  }
  .device-model-table{
    color: #ffffff;
    min-height:52rem;
  }
 .device-model-editdialog{
   color: #b3b3b3;
   font-size: 14px;
 }
  .device-model-editdialog-title{
    border-top: 1px solid #808080;
    padding:1rem 0;
    margin: 1rem 0;
  }
  .device-model-uploadImg{
    display: inline-block;
    width:8rem;
    height: 6rem;
    background:rgba(255, 255, 255, 0.2);
  }
  .el-dialog .btn-upload {
    height: 6rem;
    width: 3rem;
    border-radius: 0;
    padding: 0;
    font-size: 1.2rem;
    background: #1f7ecf;
    border: none;
    margin-left: .4rem;
  }
</style>
<style>
  .device-model .required{
    position: relative;
  }
  .device-model .required > .el-form-item__label:before{
    content: '*';
    color: red;
    font-size:1.8rem;
    top:.2rem;
    right:1rem;
    z-index: 9;
    position: absolute;
  }
  .device-model .device-model-Search .el-input input{
    background:transparent;border: 1px solid #808080;border-radius:4px;
  }
</style>
