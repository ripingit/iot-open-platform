<template>
  <div class="device-model-admin">
    <el-row>
      <el-col :span="24">
        <p class="title-cn">{{$t("iot_plat_order_manage")}}</p>
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
                :range-separator="$t('iot_plat_to')"
                :start-placeholder="$t('iot_plat_pay_time')"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label>
              <el-select v-model="searchForm.networkNode" :placeholder="$t('iot_plat_select_please')">
                <el-option v-for="item in networkNodes" :key="item.value" :label="$t(item.label)" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label>
              <el-input v-model="searchForm.key" :placeholder="$t('iot_plat_input_order_number_or_username')"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="btn-search" type="primary" @click="getOrderLists">{{$t("iot_plat_query")}}</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <TableComponent
            :options="tableOptions"
            :data="tableData.data"
            v-on:page-change="getOrderLists"
          >
            <el-table-column prop :label="$t('iot_plat_operate')" slot="handler">
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.refund_status === 0 && vmHasAuth(CoopPermissionsLib.ORDER_REFUND, tableData.res)"
                  class="btn-circle"
                  icon="iconfont icon-tuikuan"
                  size="mini"
                  circle
                  @click="refund(scope.row)"
                ></el-button>
              </template>
            </el-table-column>
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

import {
  COOP_ORDER_QUERY,
  COOP_REFUND
} from "../../../lib/api.js";

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
      searchForm: {
        key        : "",
        networkNode: "2",
        time       : ""
      },
      tableData: {
        data: [],
        res : []
      },
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
            label: this.$t("iot_plat_order_number"),
            prop : "order_id",
            width: 220
          },
          {
            prop : "class_desc",
            label: this.$t("iot_plat_goods_type")
          },
          {
            prop : "goods_name",
            label: this.$t("iot_plat_goods_name"),
            width: 100
          },
          {
            prop  : "goods_lasteddate",
            label : this.$t("iot_plat_duration"),
            render: value => {
              const result = value >= MONTH_DAY ? `${value / MONTH_DAY}${this.$t("iot_plat_month")}` : `${value}${this.$t("iot_plat_day")}`
              return result
            }
          },
          {
            prop  : "pay_type",
            label : this.$t("iot_plat_pay_type"),
            width : 100,
            render: value => this.$t(this.payType[value])
          },
          {
            prop : "unit",
            label: this.$t("iot_plat_currency_type")
          },
          {
            prop  : "pay_amount",
            label : this.$t("iot_plat_payment_amount"),
            render: value => `${value / PRICE}`
          },
          {
            prop : "payment_time",
            label: this.$t("iot_plat_pay_time"),
            width: 150
          },
          {
            prop : "user_name",
            label: this.$t("iot_plat_user_name"),
            width: 140
          },
          {
            prop : "device_id",
            label: this.$t("iot_plat_device_id"),
            width: 240
          },
          {
            prop  : "refund_status",
            label : this.$t("iot_plat_refund_state"),
            render: value => { 
              const result = value === 1 ? this.$t("iot_plat_already_refund") : ""
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
      const MILL_SECOND = 1000
      try {
        const param = this.createFormData({
          page      : parseInt(this.tableOptions.pageOptions.currentPage),
          page_size : parseInt(this.tableOptions.pageOptions.pageSize),
          query_name: this.searchForm.key,
          statr_time: this.searchForm.time ? (new Date(this.searchForm.time[0]).getTime() / MILL_SECOND).toFixed() : "",
          end_time  : this.searchForm.time ? (new Date(this.searchForm.time[1]).getTime() / MILL_SECOND).toFixed() : "",
          aid       : this.searchForm.networkNode
        });
        this.tableOptions.loading = true;
        const res = await this.$http.post(COOP_ORDER_QUERY, param)
        this.tableOptions.loading = false;
        if (this.vmResponseHandler(res)) {
          this.tableData = res.data
          this.tableData.data.map(value => { value.user_name = this.encryptUserName(value.user_name, true) })
          this.tableOptions.pageOptions.total = res.data.total;
        }
      } catch (e) {
        this.tableOptions.loading = false;
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    }, this.DEBOUNCE_TIME),

    refund: _.debounce(function(row) {
      const wait = this.vmLoadingFull();
      try {
        this.vmConfirm({
          msg            : this.$t("iot_plat_confirm_apply_refund"),
          confirmCallback: async () => {
            const data = this.createFormData({
              order_id     : row.order_id,
              refund_status: 1,
              aid          : this.searchForm.networkNode
            });
            const res = await this.$http.post(COOP_REFUND, data)

            wait.close();
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess(this.$t("iot_plat_apply_refund_success"));
              this.tableData.data.find(o => o.order_id === row.order_id).refund_status = 1
            }
          }
        });
      } catch (e) {
        wait.close();
        this.vmMsgError(this.$t("iot_plat_program_error"));
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
