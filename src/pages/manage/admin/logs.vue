<template>
  <div class="admin">
    <el-row>
      <el-col :span="24">
        <p class="title-cn">{{$t("iot_plat_operation_log")}}</p>
        <p class="title-en">OPERATION LOG</p>
      </el-col>
    </el-row>
    <el-row class="table">
      <!-- 搜索栏开始 -->
      <el-row>
        <el-col :span="24">
          <el-date-picker
            v-model="searchDate"
            type="daterange"
            value-format="yyyy-MM-dd"
            :range-separator="$t('iot_plat_to')"
            :start-placeholder="$t('iot_plat_start_date')"
            :end-placeholder="$t('iot_plat_end_date')">
          </el-date-picker>
          <el-input
            :placeholder="$t('iot_plat_key_value_of_query')"
            v-model="searchKeyWord"
            clearable>
          </el-input>
          <el-button class="btn-search" type="primary" @click="queryLogs">{{$t("iot_plat_query")}}</el-button>
        </el-col>
      </el-row>
      <!-- 搜索栏结束 -->

      <el-row>
        <el-col>
          <TableComponent :options="tableOptions" :data="tableData.data" v-on:page-change="queryLogs">
            <el-table-column
              :label="$t('iot_plat_operate')"
              width="100"
              slot="handler">
              <template slot-scope="scope">
                <el-button
                  class="btn-circle"
                  size="mini"
                  icon="iconfont icon-gengduo"
                  circle
                  @click="showDetailDialog(scope.row)"></el-button>
              </template>
            </el-table-column>
          </TableComponent>
        </el-col>
      </el-row>
    </el-row>


    <el-dialog :title="$t('iot_plat_detail')" :visible.sync="isDetailDialogVisible" center>
      <el-row class="label-row">
        <el-col :span="4" class="label-name">{{$t("iot_plat_request_data")}}：</el-col>
        <el-col :span="20" class="label-value">
          {{ logDetail.request }}
        </el-col>
      </el-row>
      <el-row class="label-row">
        <el-col :span="4" class="label-name">{{$t("iot_plat_request_response_data")}}：</el-col>
        <el-col :span="20" class="label-value">
          {{ logDetail.response }}
        </el-col>
      </el-row>
      <el-row class="label-sug">
        <!-- <el-col :span="24">
          <el-button class="btn-reject" type="danger" @click="reviewAudit(2)">{{$t("iot_plat_confirm")}}</el-button>
        </el-col> -->
      </el-row>
    </el-dialog>


  </div>
</template>
<script>
import "@/assets/css/content.css";
import TableComponent from "@/components/table/table.vue"
import { ADMIN_OPERATION_LOG_QUERY } from "@/lib/api.js";

export default {
  components: { TableComponent },
  data() {
    return {
      isDetailDialogVisible: false,
      searchKeyWord        : "",
      searchDate           : "",
      tableOptions         : {
        loading    : true,
        hasNumber  : true,
        pageOptions: {
          pageSize   : 20,
          total      : 0,
          currentPage: 1
        },
        columns: [
          {
            label: this.$t("iot_plat_operate"),
            prop : "operation"
          },
          {
            prop : "ip",
            label: this.$t("iot_plat_login_ip")
          },
          {
            prop : "user",
            label: this.$t("iot_plat_user")
          },
          {
            prop : "time",
            label: this.$t("iot_plat_time")
          }
        ]
      },
      tableData: [],
      logDetail: {
        request : "",
        response: ""
      }
    };
  },
  created() {
    this.queryLogs();
    document.body.addEventListener("keydown", this.keyCodeDown, false);
  },
  beforeDestroy() {
    document.body.removeEventListener("keydown", this.keyCodeDown, false);
  },
  methods: {
    keyCodeDown(e) {
      if (e.keyCode === this.ENTER_KEY_CODE) {
        this.queryLogs()
      }
    },
    showDetailDialog (row) {
      this.isDetailDialogVisible = true
      this.logDetail.request = row.data
      this.logDetail.response = row["return"]
    },
    async queryLogs() {
      try {
        const param = this.createFormData({
          page     : this.tableOptions.pageOptions.currentPage,
          page_size: this.tableOptions.pageOptions.pageSize,
          start    : this.searchDate ? this.searchDate[0] : "",
          end      : this.searchDate ? this.searchDate[1] : "",
          grep     : this.searchKeyWord
        });
        const res = await this.$http.post(ADMIN_OPERATION_LOG_QUERY, param)
        this.tableOptions.loading = false
        if (this.vmResponseHandler(res)) {
          this.tableData = res.data
          this.tableOptions.pageOptions.total = res.data.total
        }
      } catch (error) {
        this.loading = false;
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    }
  }
};
</script>
<style scoped>
.admin {
  padding: 1.67rem 2.5rem;
  color: #fff;
}
</style>
