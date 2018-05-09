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
            <el-row type="flex" align="bottom" class="item_tip">
              <span>今日注册用户</span>
            </el-row>
            <el-row type="flex" justify="center" align="middle" class="item_text">
              <span>2521</span>
            </el-row>
          </div>
        </div>
        <div class="item_section_box">
          <div>
            <el-row type="flex" align="bottom" class="item_tip">
              <span>总注册用户</span>
            </el-row>
            <el-row type="flex" justify="center" align="middle" class="item_text">
              <span>2521</span>
            </el-row>
          </div>
        </div>
        <div class="item_section_box">
          <div>
            <el-row type="flex" align="bottom" class="item_tip">
              <span>在线设备</span>
            </el-row>
            <el-row type="flex" justify="center" align="middle" class="item_text">
              <span>2521</span>
            </el-row>
          </div>
        </div>
        <div class="item_section_box">
          <div>
            <el-row type="flex" align="bottom" class="item_tip">
              <span>设备总数</span>
            </el-row>
            <el-row type="flex" justify="center" align="middle" class="item_text">
              <span>2521</span>
            </el-row>
          </div>
        </div>
        <div class="item_section_box">
          <div>
            <el-row type="flex" align="bottom" class="item_tip">
              <span>今日下载数</span>
            </el-row>
            <el-row type="flex" justify="center" align="middle" class="item_text">
              <span>2521</span>
            </el-row>
          </div>
        </div>
        <div class="item_section_box">
          <div>
            <el-row type="flex" align="bottom" class="item_tip">
              <span>APP总下载数</span>
            </el-row>
            <el-row type="flex" justify="center" align="middle" class="item_text">
              <span>2521</span>
            </el-row>
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
        <el-row type="flex" align="middle" justify="center" class="item_chart_label">
          <span>设备在线：1252202（2018-02-05 08:00-09:00）</span>
          <span>打开APP：1252202（2018-02-05 08:00-09:00）</span>
        </el-row>
        <el-row class="item_chart_content">
          <chart :options="polar" style="width:100%;height: 100%"></chart>
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
          min-width="160">
        </el-table-column>
        <el-table-column
          prop="name"
          label="新增用户"
          min-width="160">
        </el-table-column>
        <el-table-column
          prop="address"
          label="用户总数"
          min-width="160">
        </el-table-column>
        <el-table-column
          prop="address"
          label="新增设备"
          min-width="160">
        </el-table-column>
        <el-table-column
          prop="address"
          label="设备总数"
          min-width="160">
        </el-table-column>
        <el-table-column
          prop="address"
          label="活跃用户"
          min-width="160">
        </el-table-column>
        <el-table-column
          prop="address"
          label="增值服务"
          min-width="160">
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>
<script>
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'

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
      }],
      polar: {
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          textStyle: {
            color: '#b3b3b3'
          },
          data: ['今日注册', '今日下载', 'IP']
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLabel: {
              show: true,
              textStyle: {
                color: '#b3b3b3'
              }
            },
            data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00']
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              show: true,
              textStyle: {
                color: '#b3b3b3'
              }
            },
            splitLine: {
              lineStyle: {
                color: '#848484',
                width: '2'
              }
            }
          }
        ],
        series: [
          {
            name: '今日注册',
            type: 'line',
            stack: '总量',
            symbol: 'circle', // 小圆点形状
            symbolSize: '6', // 小圆点大小
            itemStyle: { // 小圆点颜色
              color: '#3da0f4'
            },
            areaStyle: { // 折线图区域颜色
              color: '#3da0f4',
              opacity: '0.2'
            },
            lineStyle: { // 折线图的线条颜色
              color: '#3da0f4',
              width: '1'
            },
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: '今日下载',
            type: 'line',
            stack: '总量',
            symbol: 'circle',
            symbolSize: '6',
            itemStyle: {
              color: '#fa77a3'
            },
            areaStyle: {
              color: '#fa77a3',
              opacity: '0.2'
            },
            lineStyle: {
              color: '#fa77a3',
              width: '1'
            },
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: 'IP',
            type: 'line',
            stack: '总量',
            symbol: 'circle',
            symbolSize: '6',
            itemStyle: {
              color: '#2acba7'
            },
            areaStyle: {
              color: '#2acba7',
              opacity: '0.2'
            },
            lineStyle: {
              color: '#2acba7',
              width: '1'
            },
            data: [150, 232, 201, 154, 190, 330, 410]
          }]
      }
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
    height: 46rem;
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
    border-radius: .6rem;
    height: 100%;
  }

  .item_tip {
    padding-left: 1.5rem;
    height:18%;
    color: #b3b3b3;
    font-size: 1.2rem;
  }

  .item_text {
    height:82%;
    font-size: 3.4rem;
    font-weight:bolder;
  }

  .item_section_box:nth-child(1) .item_text, .item_section_box:nth-child(2) .item_text {
    color: #17a5ff;
  }

  .item_section_box:nth-child(3) .item_text, .item_section_box:nth-child(4) .item_text {
    color: #2acba7;
  }

  .item_section_box:nth-child(5) .item_text, .item_section_box:nth-child(6) .item_text {
    color: #fa77a3;
  }

  .item_chart {
    height: 44.3rem;
    margin-top: 1.7rem;
    background-color: #36393e;
  }

  .item_chart_head {
    padding: 2rem;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .item_chart_label{
    height:3rem;
    color: #ffffff;
    font-size:1.2rem;
    padding:0 2rem;
  }
  .item_chart_label>span{
    position: relative;
    padding-left: 2.4rem;
  }
  .item_chart_label>span:last-child{
    margin-left:10%;
  }
  .item_chart_label>span:before{
    position: absolute;
    bottom:0;
    left:0;
    top:50%;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
    content: '';
    display: inline-block;
    width: 1.2rem;
    height: 1.2rem;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    border-radius: 100%;
  }
  .item_chart_label>span:first-child:before{
    background-color: #3da0f4;
  }
  .item_chart_label>span:last-child:before{
    border: .2rem solid #3da0f4;
  }
  .item_chart_content {
    height: 34.7rem;
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
    padding: .5rem 5rem;
    background-color: #36393e;
  }
</style>
