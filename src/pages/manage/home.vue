<template>
  <div class="container">
    <el-row class="h_nav">
      <h5>{{$t("iot_plat_overview")}}</h5>
      <p>SURVEY</p>
    </el-row>
    <el-row class="company_name">
      <el-form :inline="true">
        <el-form-item :label="$t('iot_plat_company')">
          <el-select v-model="selectParam.query_by_name" :placeholder="$t('iot_plat_select_company')" @change="updateData">
            <el-option :label="$t('iot_plat_all')" value="all"></el-option>
            <el-option :label="obj.name" :value="obj.company_code" :key="ix" v-for="(obj,ix) in companyList"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="item_content">
      <el-col :span="8" class="item_section">
        <div class="item_section_box">
          <div>
            <el-row type="flex" align="bottom" class="item_tip">
              <span>{{$t("iot_plat_registered_users_today")}}</span>
            </el-row>
            <el-row type="flex" justify="center" align="middle" class="item_text">
              <span>{{headerData.reg_today}}</span>
            </el-row>
          </div>
        </div>
        <div class="item_section_box">
          <div>
            <el-row type="flex" align="bottom" class="item_tip">
              <span>{{$t("iot_plat_registered_users_total")}}</span>
            </el-row>
            <el-row type="flex" justify="center" align="middle" class="item_text">
              <span>{{headerData.all_reg}}</span>
            </el-row>
          </div>
        </div>
        <div class="item_section_box">
          <div>
            <el-row type="flex" align="bottom" class="item_tip">
              <span>{{$t("iot_plat_device_online")}}</span>
            </el-row>
            <el-row type="flex" justify="center" align="middle" class="item_text">
              <span>{{headerData.online_device}}</span>
            </el-row>
          </div>
        </div>
        <div class="item_section_box">
          <div>
            <el-row type="flex" align="bottom" class="item_tip">
              <span>{{$t("iot_plat_device_total_number")}}</span>
            </el-row>
            <el-row type="flex" justify="center" align="middle" class="item_text">
              <span>{{headerData.all_device}}</span>
            </el-row>
          </div>
        </div>
        <div class="item_section_box">
          <div>
            <el-row type="flex" align="bottom" class="item_tip">
              <span>{{$t("iot_plat_download_number_today")}}</span>
            </el-row>
            <el-row type="flex" justify="center" align="middle" class="item_text">
              <span>0</span>
            </el-row>
          </div>
        </div>
        <div class="item_section_box">
          <div>
            <el-row type="flex" align="bottom" class="item_tip">
              <span>{{$t("iot_plat_app_download_total_number")}}</span>
            </el-row>
            <el-row type="flex" justify="center" align="middle" class="item_text">
              <span>0</span>
            </el-row>
          </div>
        </div>
      </el-col>
      <el-col :span="16" class="item_section item_chart">
        <el-row type="flex" align="middle" class="item_chart_head">
          <el-col :span="5">
            <el-date-picker
              style="width: 100%"
              v-model="selectParam.start_time"
              type="date"
              value-format="yyyy-MM-dd"
              :placeholder="$t('iot_plat_select_date')"
              @change="loadData">
            </el-date-picker>
          </el-col>
          <!--<el-col :span="5" :offset="1">
            <el-select v-model="selectParam.type" placeholder="选择指标">
              <el-option
                v-for="item in indicators"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>-->
          <el-col :offset="1" :span="13">
            <el-radio-group v-model="selectParam.type" @change="loadData">
              <el-radio label="yesterday">{{$t("iot_plat_preview_day")}}</el-radio>
              <el-radio label="week">{{$t("iot_plat_last_week")}}</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
        <!--<el-row type="flex" align="middle" justify="center" class="item_chart_label">
          <span>设备在线：1252202（2018-02-05 08:00-09:00）</span>
          <span>打开APP：1252202（2018-02-05 08:00-09:00）</span>
        </el-row>-->
        <el-row class="item_chart_content">
          <chart :options="polar" style="width:100%;height: 100%"></chart>
        </el-row>
      </el-col>
    </el-row>
    <el-row class="item_table">
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="create_time"
          :label="$t('iot_plat_time')"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="new_users"
          :label="$t('iot_plat_new_add_user')"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="all_users"
          :label="$t('iot_plat_user_total_number')"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="new_device"
          :label="$t('iot_plat_new_add_device')"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="all_device"
          :label="$t('iot_plat_device_total_number')"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="active_users"
          :label="$t('iot_plat_active_user')"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="service_num"
          :label="$t('iot_plat_value_added_services')"
          min-width="100">
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>
<script>
import "echarts/lib/chart/line"
import "echarts/lib/component/tooltip"
import "echarts/lib/component/title"
import "echarts/lib/component/legend"
import { ADMIN_HOMEDATA_QUERY } from "@/lib/api.js"

import "@/assets/css/content.css"

export default {
  data () {
    return {
      companyList: [],
      indicators : [],
      tableData  : [],
      selectParam: {
        start_time   : "",
        type         : "",
        query_by_name: "all"
      },
      headerData: {},
      polar     : {
        title  : { text: "" },
        tooltip: {
          trigger    : "axis",
          axisPointer: {
            type : "cross",
            label: { backgroundColor: "#6a7985" }
          }
        },
        legend: {
          textStyle: { color: "#b3b3b3" },
          data     : [ this.$t("iot_plat_device_to_online"), this.$t("iot_plat_registered_today") ]
        },
        toolbox: { feature: { saveAsImage: {} } },
        grid   : {
          left        : "3%",
          right       : "4%",
          bottom      : "3%",
          containLabel: true
        },
        xAxis: [
          {
            type       : "category",
            boundaryGap: false,
            axisLabel  : {
              show     : true,
              textStyle: { color: "#b3b3b3" }
            },
            data: [ "00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00" ]
          }
        ],
        yAxis: [
          {
            type     : "value",
            axisLabel: {
              show     : true,
              textStyle: { color: "#b3b3b3" }
            },
            splitLine: {
              lineStyle: {
                color: "#848484",
                width: "2"
              }
            }
          }
        ],
        series: [
          {
            name      : this.$t("iot_plat_device_to_online"),
            type      : "line",
            // 小圆点形状
            symbol    : "circle",
            // 小圆点大小
            symbolSize: "6",
            itemStyle : {
              // 小圆点颜色
              color: "#3da0f4"
            },
            areaStyle: {
              // 折线图区域颜色
              color  : "#3da0f4",
              opacity: "0.2"
            },
            lineStyle: {
              // 折线图的线条颜色
              color: "#3da0f4",
              width: "1"
            },
            data: []
          },
          {
            name      : this.$t("iot_plat_registered_today"),
            type      : "line",
            symbol    : "circle",
            symbolSize: "6",
            itemStyle : { color: "#fa77a3" },
            areaStyle : {
              color  : "#fa77a3",
              opacity: "0.2"
            },
            lineStyle: {
              color: "#fa77a3",
              width: "1"
            },
            data: []
          } ]
      }
    }
  },
  created () {
    this.loadData()
    // 一天24小时
    const ONE_DAY = 24
    // 一小时 60 分，一分 60 秒
    const SIXTY = 60
    // 一秒为 1000 毫秒
    const MILL_SECOND = 1000
    setInterval(this.loadData, ONE_DAY * SIXTY * SIXTY * MILL_SECOND)
  },
  methods: {
    updateData () {
      this.selectParam.start_time = ""
      this.selectParam.type = ""
      this.loadData()
    },
    async loadData () {
      try {
        const data = this.createFormData(this.selectParam)
        const res = await this.$http.post(ADMIN_HOMEDATA_QUERY, data)
        if (this.vmResponseHandler(res)) {
          this.companyList = res.data.companyList
          this.tableData = res.data.data.historyRec
          this.headerData = res.data.data.header
          this.polar.series[0].data = res.data.graph.online_device
          this.polar.series[1].data = res.data.graph.reg_today
        }
      } catch (error) {
        this.vmMsgError(this.$t("iot_plat_program_error")); 
      }
    }
  }
}
</script>
<style scoped>
  .container {
    margin: 1.67rem 2.5rem;
  }

  .h_nav h5 {
    font-size: 1.5rem;
    color: #fff;
  }

  .h_nav p {
    font-size: .83rem;
    color: #808080;
    margin-top: .33rem;
  }
  .el-form-item{
    margin-bottom:0;
  }
  .company_name{
    margin-top:1rem;
  }
  .item_content {
    width: 100%;
    height: 44.41rem;
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
    padding: 1.5rem 1.5rem 0 0;
  }

  .item_section_box > div {
    background-color: #36393e;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    border-radius: .5rem;
    height: 100%;
  }

  .item_tip {
    padding-left: 1.33rem;
    height:18%;
    color: #b3b3b3;
    font-size: 1rem;
  }

  .item_text {
    height:82%;
    font-size: 2.83rem;
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
    height: 42.91rem;
    margin-top: 1.5rem;
    border-radius: .5rem;
    background-color: #36393e;
  }

  .item_chart_head {
    padding: 2rem;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .item_chart .el-input /deep/ .el-input__icon {
    line-height: 1;
  }

  .item_chart .el-input /deep/ input,.item_chart .el-select /deep/ input {
    height: 2.17rem;
  }
  .item_chart_label{
    height:3rem;
    color: #ffffff;
    font-size:1rem;
    padding:0 1rem;
  }
  .item_chart_label>span{
    position: relative;
    padding-left: 2.17rem;
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
    width: 1rem;
    height: 1rem;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    border-radius: 100%;
  }
  .item_chart_label>span:first-child:before{
    background-color: #3da0f4;
  }
  .item_chart_label>span:last-child:before{
    border: .16rem solid #3da0f4;
  }
  .item_chart_content {
    height: 33.7rem;
  }
  .item_table {
    margin-top: 1.5rem;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 2rem 4.5rem;
    background-color: #36393e;
  }
  .el-radio{
    color: #ffffff;
  }
</style>
