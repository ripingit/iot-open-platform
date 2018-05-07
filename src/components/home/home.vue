<template>
  <div class="container">
    <el-row class="h_nav">
      <h5>概况</h5>
      <p>SURVEY</p>
    </el-row>
    <el-row class="item_content">
      <el-col :span="8" class="item_section">
        <div class="item_section_box">
          <div>
            <p>今日注册用户</p>
            <p>2521</p>
          </div>
        </div>
        <div class="item_section_box">
          <div>
            <p>总注册用户</p>
            <p>2521</p>
          </div>
        </div>
        <div class="item_section_box">
          <div>
            <p>在线设备</p>
            <p>2521</p>
          </div>
        </div>
        <div class="item_section_box">
          <div>
            <p>设备总数</p>
            <p>2521</p>
          </div>
        </div>
        <div class="item_section_box">
          <div>
            <p>APP今日下载数</p>
            <p>2521</p>
          </div>
        </div>
        <div class="item_section_box">
          <div>
            <p>APP总下载数</p>
            <p>2521</p>
          </div>
        </div>
      </el-col>
      <el-col :span="16" class="item_section item_chart">
        <el-row type="flex" align="middle" class="item_chart_head">
          <el-col :span="5">
            <el-date-picker
              style="width: 100%"
              v-model="timeValue"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-col>
          <el-col :span="5" :offset="1">
            <el-select v-model="selectValue" placeholder="选择指标">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :offset="1" :span="13">
            <el-checkbox-group v-model="checkList">
              <el-checkbox label="前一日"></el-checkbox>
              <el-checkbox label="上周同期"></el-checkbox>
            </el-checkbox-group>
          </el-col>
        </el-row>
        <el-row class="item_chart_content">
        </el-row>
      </el-col>
    </el-row>
    <el-row class="item_table">
      <el-table
        :data="tableData2"
        max-height="330"
        style="width: 100%">
        <el-table-column
          prop="date"
          label="时间"
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="新增用户"
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="用户总数"
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="新增设备"
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="设备总数"
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="活跃用户"
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="增值服务"
          min-width="180">
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>
<script>
export default {
  data () {
    return {
      timeValue: '',
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
      selectValue: '',
      checkList: [],
      tableData2: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }]
    }
  },
  methods: {}
}
</script>
<style scoped>
  .container {
    margin: 2rem;
  }

  .h_nav h5 {
    font-size: 1.8rem;
    color: #fff;
  }

  .h_nav p {
    font-size: 1rem;
    color: #808080;
    margin-top: .4rem;
  }

  .item_content {
    width: 100%;
    height: 51.6rem;
  }

  .item_section {
    height: inherit;
  }

  .item_section_box {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    width: 50%;
    height: 33.3333%;
    float: left;
    padding: 1.7rem 1.7rem 0 0;
  }

  .item_section_box > div {
    background-color: #36393e;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    height: 100%;
  }

  .item_section_box > div > p:first-child {
    padding: 1.5rem;
    color: #b3b3b3;
    font-size: 1.2rem;
  }

  .item_section_box > div > p:last-child {
    font-size: 3.4rem;
    text-align: center;
  }

  .item_section_box:nth-child(1) > div > p:last-child, .item_section_box:nth-child(2) > div > p:last-child {
    color: #17a5ff;
  }

  .item_section_box:nth-child(3) > div > p:last-child, .item_section_box:nth-child(4) > div > p:last-child {
    color: #2acba7;
  }

  .item_section_box:nth-child(5) > div > p:last-child, .item_section_box:nth-child(6) > div > p:last-child {
    color: #fa77a3;
  }

  .item_chart {
    height: 49.9rem;
    margin-top: 1.7rem;
    background-color: #36393e;
  }

  .item_chart_head {
    padding: 2rem;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .item_chart_content {
    height: 43.3rem;
    border: 1px solid red;
  }

  .el-checkbox__label {
    color: #fffffe;
    font-size: 1.2rem;
  }

  .el-input /deep/ .el-input__icon {
    line-height: 1;
  }

  .el-input /deep/ input, .el-select /deep/ input {
    height: 2.6rem;
    background: none;
    border: solid 1px rgba(255, 255, 255, 0.4);
  }

  .item_table {
    margin-top: 1.7rem;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: .5rem 5.4rem;
    background-color: #36393e;
  }

  .el-table /deep/ thead {
    color: #ffffff;
  }

  .el-table /deep/ th, .el-table /deep/ tr {
    background: none;
  }

  .el-table /deep/ {
    background: none;
    color: #b3b3b3;
  }

  .el-table /deep/ td, .el-table /deep/ th.is-leaf {
    border-bottom: 1px solid #4c4c4c;
  }

  .el-table--enable-row-hover /deep/ .el-table__body tr:hover > td {
    background: none;
  }
</style>
