<template>
  <div class="content-container">
    <el-row>
      <el-col :span="24">
          <p class="title-cn">固件管理</p>
          <p class="title-en">THE FRIMWARE MANAGEMENT</p>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <div class="table">
          <el-row>
            <el-col :span="5">
              <el-input
                placeholder="请输入内容">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>
              <el-button @click="showAddDialog" class="btn-circle-delete" type="primary" icon="iconfont icon-tianjia" circle></el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-table
                :data="tableData"
                style="width: 100%">
                <el-table-column
                  prop="date"
                  label="编号"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="型号"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="固件版本">
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="最近一次更新">
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="状态">
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="审核时间">
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button
                      class="btn-circle"
                      size="mini"
                      icon="iconfont icon-gengduo"
                      circle
                      @click="showListDialog"></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>

    <el-dialog title="更新版本" :visible.sync="isDialogVisible" center>
      <el-form label-position="right" label-width="100px">
        <el-form-item class="form-row" label="选择型号" prop="name">
          <el-select v-model="form.name" placeholder="请选择固件型号">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item class="form-row" label="固件版本" prop="name">
          <el-input v-model="form.name" auto-complete="off" placeholder="请输入固件版本"></el-input>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item class="form-row code-panel" label="固件上传" prop="name">
          <el-input v-model="form.name" auto-complete="off" placeholder="请上传固件"></el-input>
          <el-button type="primary" size="mini">上传</el-button>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item class="form-row" label="MD5值" prop="name">
          <el-input v-model="form.name" auto-complete="off" placeholder="请输入MD5值"></el-input>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item class="form-row" label="升级描述" prop="name">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入升级描述"
            v-model="form.name">
          </el-input>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item class="form-row">
          <el-button class="btn-submit" type="primary" >提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="固件升级记录" :visible.sync="isDialogVisibleList" center>
      <TimeLineComponent data="遇到个鬼"></TimeLineComponent>
    </el-dialog>
  </div>
</template>

<script>
import '@/assets/css/content.css'
import TimeLineComponent from '../../_ui/time-line.vue'

export default {
  components: { TimeLineComponent },
  data () {
    return {
      form: {
        name: '',
        region: '区域一'
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
      value6: '',
      isDialogVisible: false,
      isDialogVisibleList: false,
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  methods: {
    showAddDialog () {
      this.isDialogVisible = true
    },
    showListDialog () {
      this.isDialogVisibleList = true
    }
  }
}
</script>

<style scoped>
/** 本页定制 start */
.el-dialog__wrapper /deep/ .el-dialog{
  width: 50rem;
}
.el-dialog .btn-submit {
  margin-top: 4.33rem;
}
.code-panel{
  position: relative;
}

.code-panel .el-button {
  position: absolute;
  width: 5rem;
  height: 2.17rem;
  right: 5.67rem;
  top: 0.6rem;
  font-size: 1rem;
  background: #1f7ecf;
  border: none;
  padding: 0.56rem 0.83rem;
}
/** 本页定制 end */
</style>
