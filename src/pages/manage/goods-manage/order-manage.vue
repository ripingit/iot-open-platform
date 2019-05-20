<template>
  <div class="device-model-admin">
    <el-row>
      <el-col :span="24">
        <p class="title-cn">订单管理</p>
        <p class="title-en">THE ORDER MANAGEMENT</p>
      </el-col>
    </el-row>
    <el-row class="table">
      <el-row>
        <el-col :span="24">
          <el-form :inline="true" :model="searchForm" class="demo-form-inline">
            <el-form-item label>
              <el-date-picker
                class="time"
                v-model="searchForm.time"
                type="daterange"
                value-format="yyyy-MM-dd"
                :editable="false"
                range-separator="至"
                start-placeholder="支付时间"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label>
              <el-select v-model="searchForm.networkNode" placeholder="请选择">
                <el-option v-for="item in networkNodes" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label>
              <el-select v-model="searchForm.company" placeholder="请选择">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in companyLists" :key="item.company_code" :label="item.name" :value="item.company_code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label>
              <el-input v-model="searchForm.key" placeholder="请输入订单号或用户名"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="btn-search" type="primary" @click="getOrderLists">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <TableComponent
            :options="tableOptions"
            :data="tableData"
            v-on:page-change="getOrderLists"
          >
          </TableComponent>
        </el-col>
      </el-row>
    </el-row>
  </div>
</template>
<script>
import "@/assets/css/content.css";
import _ from "lodash";
import { networkNodes, encryptUserName } from "@/lib/mixins";
import TableComponent from "@/components/table/table.vue";
import { ADMIN_ORDER_QUERY } from "../../../lib/api.js";

const MILL_SECOND = 1000
const PRICE = 100
const MONTH_DAY = 30

export default {
  components: { TableComponent },
  mixins    : [
    {
      data() {
        return { networkNodes: networkNodes };
      },
      methods: { encryptUserName: encryptUserName }
    }
  ],
  data() {
    return {
      companyLists: [],
      searchForm  : {
        company    : "",
        key        : "",
        networkNode: "2",
        time       : ""
      },
      tableData   : [],
      tableOptions: {
        loading     : true,
        hasSelection: false,
        hasNumber   : true,
        pageOptions : {
          pageSize   : 20,
          total      : 0,
          currentPage: 1
        },
        columns: [
          {
            label: "订单号",
            prop : "order_id",
            width: 220
          },
          {
            prop : "class_desc",
            label: "商品类型"
          },
          {
            prop : "goods_name",
            label: "商品名称",
            width: 100
          },
          {
            prop  : "goods_lasteddate",
            label : "持续时间",
            render: value => {
              const result = value >= MONTH_DAY ? `${value / MONTH_DAY}月` : `${value}天`
              return result
            }
          },
          {
            prop  : "pay_type",
            label : "支付类型",
            width : 100,
            render: value => this.payType[value]
          },
          {
            prop : "unit",
            label: "货币类型"
          },
          {
            prop  : "pay_amount",
            label : "支付金额",
            render: value => `${value / PRICE}`
          },
          {
            prop : "payment_time",
            label: "支付时间",
            width: 150
          },
          {
            prop : "user_name",
            label: "用户名",
            width: 140
          },
          {
            prop : "device_id",
            label: "设备ID",
            width: 240
          },
          {
            prop  : "refund_status",
            label : "退款状态",
            render: value => {
              const result = value === 1 ? "已退款" : ""
              return result
            }
            
          }
        ]
      }
    };
  },
  created() {
    this.getOrderLists();
    document.body.addEventListener("keydown", this.keyCodeDown, false);
  },
  beforeDestroy() {
    document.body.removeEventListener("keydown", this.keyCodeDown, false);
  },
  methods: {
    keyCodeDown(e) {
      if (e.keyCode === this.ENTER_KEY_CODE) {
        this.getOrderLists();
      }
    },

    getOrderLists: _.debounce(async function() {
      try {
        const param = this.createFormData({
          page        : parseInt(this.tableOptions.pageOptions.currentPage),
          page_size   : parseInt(this.tableOptions.pageOptions.pageSize),
          query_name  : this.searchForm.key,
          company_code: this.searchForm.company,
          statr_time  : this.searchForm.time ? (new Date(this.searchForm.time[0]).getTime() / MILL_SECOND).toFixed() : "",
          end_time    : this.searchForm.time ? (new Date(this.searchForm.time[1]).getTime() / MILL_SECOND).toFixed() : "",
          aid         : this.searchForm.networkNode
        });
        this.tableOptions.loading = true;
        const res = await this.$http.post(ADMIN_ORDER_QUERY, param)
        this.tableOptions.loading = false;
        if (this.vmResponseHandler(res)) {
          this.tableData = res.data.data
          this.tableData.map(value => { value.user_name = this.encryptUserName(value.user_name) })
          this.tableOptions.pageOptions.total = res.data.total;
          // TODO: 是否是每一次获取订单列表都重新渲染公司下拉选择框
          this.companyLists = res.data.company
        }
      } catch (e) {
        this.tableOptions.loading = false;
        this.vmMsgError("程序错误");
      }
    }, this.DEBOUNCE_TIME)
  }
};
</script>
<style scoped>
.device-model-admin {
  padding: 1.67rem 2.5rem;
  color: #fff;
}
</style>
