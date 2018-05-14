<template>
  <transition name="bounce" mode="out-in">
    <div class="content-container">
      <el-row>
        <el-col :span="24">
            <p class="title-cn">审核管理-型号</p>
            <p class="title-en">AUDIT MANAGEMENT</p>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <div class="table">
            <el-row>
              <el-col :span="24">
                <el-date-picker
                  v-model="value1"
                  type="date"
                  placeholder="请选择提交时间">
                </el-date-picker>
                <el-select placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-button class="btn-search" type="primary">查询</el-button>
                <el-button class="btn-circle-delete" type="danger" icon="el-icon-delete" circle></el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-table
                  :data="tableData"
                  style="width: 100%">
                  <el-table-column
                    type="selection"
                    width="55">
                  </el-table-column>
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
                    label="归属公司">
                  </el-table-column>
                  <el-table-column
                    prop="address"
                    label="提交时间">
                  </el-table-column>
                  <el-table-column
                    prop="address"
                    label="状态">
                  </el-table-column>
                  <el-table-column
                    prop="address"
                    label="备注">
                  </el-table-column>
                  <el-table-column
                    prop="address"
                    label="审核人">
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
                        @click="showDetailDialog"></el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>

      <el-dialog title="型号审核" :visible.sync="isDetailDialogVisible" center>
        <el-row class="label-row">
          <el-col :span="2" :sm="3" class="label-name">型号名称</el-col>
          <el-col :span="22" :sm="21" class="label-value">
            NVR-13564
          </el-col>
        </el-row>
        <el-row class="label-row">
          <el-col :span="2" :sm="3" class="label-name">型号代码</el-col>
          <el-col :span="22" :sm="21" class="label-value">
            NVR21053
          </el-col>
        </el-row>
        <el-row class="label-row">
          <el-col :span="2" :sm="3" class="label-name">连接方式</el-col>
          <el-col :span="22" :sm="21" class="label-value">
            1.红外线；2.蓝牙；3.WIFI
          </el-col>
        </el-row>
        <el-row class="label-row">
          <el-col :span="2" :sm="3" class="label-name">设备类别</el-col>
          <el-col :span="22" :sm="21" class="label-value">
            1.摄像头；2.音箱；3.中控；4.烟感
          </el-col>
        </el-row>
        <el-row class="label-row">
          <el-col :span="2" :sm="3" class="label-name">效果图</el-col>
          <el-col :span="22" :sm="21" class="label-value">
            <img src="" alt="">
          </el-col>
        </el-row>
        <el-row class="label-sug">
          <el-col :span="24">
          <el-input
              type="textarea"
              :rows="4"
              placeholder="请说明"
              v-model="form.name">
            </el-input>
          </el-col>
        </el-row>
        <el-row class="label-sug">
          <el-col :span="11">
            <el-button class="btn-reject" type="danger" >驳回</el-button>
          </el-col>
          <el-col :span="2">&nbsp;</el-col>
          <el-col :span="11">
            <el-button class="btn-pass" type="success" >通过</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </transition>
</template>

<script>
import '@/assets/css/content.css'
export default {
  data () {
    return {
      form: {
        name: '',
        region: '区域一'
      },
      isDetailDialogVisible: false,
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
      value1: '',
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
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  methods: {
    showDetailDialog () {
      this.isDetailDialogVisible = true
    }
  }
}
</script>

<style scoped>

/** 定制 start */
.el-dialog__wrapper /deep/ .el-dialog{
  width: 54.17rem;
}
/** 定制 end */

/** 公用 start */
.el-dialog__wrapper /deep/ .el-dialog__header {
  padding-top: 2.5rem;
}
.el-dialog__wrapper /deep/ .el-dialog__body {
  padding-top: 2.08rem;
  padding-bottom: 6rem;
}
.el-dialog .label-name {
  color: #b6b6b6;
  text-align: right;
  font-size: 1.17rem;
}
.el-dialog .label-value {
  padding-left: 1.92rem;
  color: #ffffff
}
.el-dialog .label-sug {
  padding: 0 3rem;
}
.el-dialog .label-row {
  margin-top: 0.5rem;
  line-height: 3rem;
}
.el-dialog .btn-reject,
.el-dialog .btn-pass {
  width: 100%;
  border-radius: 0;
  border: none;
  margin-top: 5rem;
  height: 3.33rem;
}
.el-dialog .btn-reject {
  background: #ff5d66;
}
.el-dialog .btn-pass {
  background: #0fb691;
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
