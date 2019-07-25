<template>
  <div class="content-container">
    <el-row>
      <el-col :span="24">
          <p class="title-cn">{{$t("iot_plat_fireware_manage")}}</p>
          <p class="title-en">THE FRIMWARE MANAGEMENT</p>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <div class="table">
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
              <el-button class="btn-search" type="primary" @click="getFirmwareLists(1)">{{$t('iot_plat_query')}}</el-button>
            </el-col>
          </el-row>
          <!-- 搜索栏结束 -->
          
          <el-row>
            <el-col :span="24">
              <TableComponent :options="tableOptions" :data="tableData.data" v-on:page-change="getFirmwareLists">
                <el-table-column
                  :label="$t('iot_plat_operate')"
                  width="120"
                  slot="handler"
                  v-if="vmHasAuth(AdminPermissionsLib.FIRMWARE_HISTORY, tableData.res)">
                  <template slot-scope="scope">
                    <el-button
                      class="btn-circle"
                      size="mini"
                      icon="iconfont icon-gengduo"
                      circle
                      @click="showListDialog(scope.$index, scope.row)"></el-button>
                  </template>
                </el-table-column>
                <template slot-scope="scope" slot="download">
                  <a :href="scope.row.file_id" target="_blank" class="download">{{$t('iot_plat_download')}}</a>
                </template>
              </TableComponent>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>

    <!-- 固件升级记录 -->
    <el-dialog :title="$t('iot_plat_fireware_upgrade_record')" :visible.sync="isDialogVisibleList" center>
      <TimeLineComponent :data="historyRecord" :loading="isGetHistory"></TimeLineComponent>
    </el-dialog>
  </div>
</template>
<script>
import "@/assets/css/content.css"
import TimeLineComponent from "@/components/time-line/time-line.vue"
import TableComponent from "@/components/table/table.vue"
import { GET_ADMIN_FIRMWARES_POST, ADMIN_FIRE_HISTORY_QUERY } from "@/lib/api"
import _ from "lodash"

export default {
  components: { TimeLineComponent, TableComponent },
  data () {
    return {
      isDialogVisibleList: false,
      isGetHistory       : false,
      historyRecord      : [],
      searchDate         : null,
      searchKeyWord      : "",
      tableData          : {
        data   : [],
        res    : [],
        product: []
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
            label: this.$t("iot_plat_model_name"),
            prop : "product_name",
            width: 200
          },
          {
            prop : "product_code",
            label: this.$t("iot_plat_model_code"),
            width: "150"
          },
          {
            prop : "rom_ver",
            label: this.$t("iot_plat_fireware_version")
          },
          {
            prop  : "rom_type",
            label : this.$t("iot_plat_fireware_class"),
            render: value => this.$t(this.firmwareTypeCode[value])
          },
          {
            prop : "upgrade_time",
            label: this.$t("iot_plat_upgrade_time")
          },
          {
            prop : "company_name",
            label: this.$t("iot_plat_submit_company"),
            width: 200
          },
          {
            prop    : "file_id",
            label   : this.$t("iot_plat_download"),
            slotName: "download"
          }
        ]
      }
    }
  },
  created () {
    this.getFirmwareLists()
    document.body.addEventListener("keydown", this.keyCodeDown, false)
  },
  beforeDestroy () {
    document.body.removeEventListener("keydown", this.keyCodeDown, false)
  },
  methods: {
    keyCodeDown (e) {
      if (e.keyCode === this.ENTER_KEY_CODE) {
        this.getFirmwareLists()
      }
    },
    async showListDialog (index, row) {
      try {
        this.isDialogVisibleList = true
        this.isGetHistory = true
        const data = this.createFormData({ product_code: row.product_code })
        const res = await this.$http.post(ADMIN_FIRE_HISTORY_QUERY, data)
        this.isGetHistory = false
        if (this.vmResponseHandler(res)) {
          this.historyRecord = res.data.data
        }
      } catch (error) {
        this.isGetHistory = false
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    },
    getFirmwareLists: _.debounce(async function () {
      try {
        const data = this.createFormData({
          page         : this.tableOptions.pageOptions.currentPage,
          page_size    : this.tableOptions.pageOptions.pageSize,
          query_by_name: this.searchKeyWord,
          start_time   : this.searchDate ? this.searchDate[0] : "",
          end_time     : this.searchDate ? this.searchDate[1] : ""
        })
        this.tableOptions.loading = true
        const res = await this.$http.post(GET_ADMIN_FIRMWARES_POST, data)
        if (this.vmResponseHandler(res)) {
          this.tableData = res.data
          this.tableOptions.pageOptions.total = res.data.total
        }
        this.tableOptions.loading = false
      } catch (error) {
        this.tableOptions.loading = false
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    }, this.DEBOUNCE_TIME)
  }
}
</script>
<style scoped>
.download {
  font-size: 1.17rem;
  color: #2acba7;
}
.content-container /deep/ .el-dialog {
  width: 54rem;
}
</style>
