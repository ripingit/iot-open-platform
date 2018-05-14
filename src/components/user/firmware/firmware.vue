<template>
  <transition name="bounce" mode="out-in">
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
        <el-row class="form-row">
          <el-col :span="2" :sm="3" class="form-label">选择型号</el-col>
          <el-col :span="20" :sm="18" class="form-input">
            <el-select v-model="form.name" placeholder="请选择固件型号">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="2" :sm="3" class="form-tip">*</el-col>
        </el-row>
        <el-row class="form-row">
          <el-col :span="2" :sm="3" class="form-label">固件版本</el-col>
          <el-col :span="20" :sm="18" class="form-input">
            <el-input v-model="form.name" auto-complete="off" placeholder="请输入固件版本"></el-input>
          </el-col>
          <el-col :span="2" :sm="3" class="form-tip">*</el-col>
        </el-row>
        <el-row class="form-row">
          <el-col :span="2" :sm="3" class="form-label">固件上传</el-col>
          <el-col :span="20" :sm="18" class="form-input code-panel">
            <el-input v-model="form.name" auto-complete="off" placeholder="请上传固件"></el-input>
            <el-button type="primary" size="mini">上传</el-button>
          </el-col>
          <el-col :span="2" :sm="3" class="form-tip">*</el-col>
        </el-row>
        <el-row class="form-row">
          <el-col :span="2" :sm="3" class="form-label">MD5值</el-col>
          <el-col :span="20" :sm="18" class="form-input">
            <el-input v-model="form.name" auto-complete="off" placeholder="请输入MD5值"></el-input>
          </el-col>
          <el-col :span="2" :sm="3" class="form-tip">*</el-col>
        </el-row>
        <el-row class="form-row">
          <el-col :span="2" :sm="3" class="form-label">升级描述</el-col>
          <el-col :span="20" :sm="18" class="form-input">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入升级描述"
              v-model="form.name">
            </el-input>
          </el-col>
          <el-col :span="2" :sm="3" class="form-tip"></el-col>
        </el-row>
        <el-row class="form-row">
          <el-col :span="2" :sm="3" class="form-label">&nbsp;</el-col>
          <el-col :span="20" :sm="18" class="form-input">
            <el-button class="btn-submit" type="primary" >提交</el-button>
          </el-col>
          <el-col :span="2" :sm="3"></el-col>
        </el-row>
      </el-dialog>

      <el-dialog title="固件升级记录" :visible.sync="isDialogVisibleList" center>
        <TimeLineComponent data="遇到个鬼"></TimeLineComponent>
      </el-dialog>
    </div>
  </transition>
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
  width: 54rem;
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
  right: 0.67rem;
  top: 0.6rem;
  font-size: 1rem;
  background: #1f7ecf;
  border: none;
  padding: 0.56rem 0.83rem;
}
/** 本页定制 end */

/** 公用 start */
.el-dialog__wrapper /deep/ .el-dialog__header {
  padding-top: 2.5rem;
}
.el-dialog__wrapper /deep/ .el-dialog__body {
  padding-top: 2.08rem;
  padding-bottom: 6rem;
}
.el-dialog .form-label {
  line-height: 3rem;
  color: #fff;
  text-align: right;
  font-size: 1.17rem;
}
.el-dialog .form-input {
  padding-left: 1.92rem;
}
.el-dialog .form-row {
  margin-top: 0.5rem;
}
.el-dialog .form-tip {
  color: red;
  line-height: 3rem;
  padding-left: 1.5rem;
}
.el-dialog .btn-submit {
  width: 100%;
  border-radius: 0;
  background: #1f7ecf;
  border: none;
}

.el-dialog .el-input input,
.el-dialog .el-select,
.el-dialog__wrapper /deep/ .el-textarea .el-textarea__inner {
  border-radius: 0 !important;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: #fff;
  width: 100%;
}
/** 公用 end */
</style>
