<template>
  <div class="device-model-admin">
    <el-row>
      <el-col :span="24">
        <p class="title-cn">{{$t("iot_plat_device_bind")}}</p>
        <p class="title-en">THE DEVICE BINDING</p>
      </el-col>
    </el-row>
    <el-row class="table">
      <el-row>
        <el-col :span="24">
          <el-form :inline="true" :model="searchForm" class="demo-form-inline">
            <!-- <el-form-item label>
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
            </el-form-item> -->
            <el-form-item>
              <el-select v-model="searchForm.userId" :placeholder="$t('iot_plat_select_user')">
                <el-option value="">{{$t("iot_plat_all")}}</el-option>
                <el-option
                  v-for="item in bindManagers"
                  :key="item.user_id"
                  :label="item.user_name"
                  :value="item.user_id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="searchForm.deviceId" :placeholder="$t('iot_plat_input_device_id')"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="btn-search" type="primary" @click="getBindLists">{{$t("iot_plat_query")}}</el-button>
            </el-form-item>
          </el-form>
          <el-button
            icon="el-icon-plus"
            type="primary"
            circle
            class="btn-circle-add"
            v-if="vmHasAuth(CoopPermissionsLib.ADD_DEVICE_BIND, tableData.res)"
            @click="addDeviceBind"></el-button>
          <el-button
            icon="iconfont icon-jiebang"
            type="danger"
            circle
            class="btn-circle-delete btn-circle-right"
            v-if="vmHasAuth(CoopPermissionsLib.DEL_DEVICE_BIND, tableData.res)"
            @click="UntieDeviceBind"></el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <TableComponent
            :options="tableOptions"
            :data="tableData.data"
            v-on:page-change="getBindLists"
          >
            <el-table-column 
                :label="$t('iot_plat_operate')" 
                slot="handler" 
                width="120px"
                v-if="vmHasAuth(CoopPermissionsLib.DEL_DEVICE_BIND, tableData.res) || vmHasAuth(CoopPermissionsLib.DEVICE_LOG_REPORT, tableData.res)">
              <template slot-scope="scope">
                <el-button
                  class="btn-circle"
                  icon="iconfont icon-jiebang"
                  size="mini"
                  circle
                  @click="untied(scope.row)"
                ></el-button>
                <el-button
                  v-if="vmHasAuth(CoopPermissionsLib.DEVICE_LOG_REPORT, tableData.res)"
                  class="btn-circle"
                  icon="iconfont icon-rizhi"
                  size="mini"
                  circle
                  @click="logReport(scope.row)"
                ></el-button>
              </template>
            </el-table-column>
          </TableComponent>
        </el-col>
      </el-row>
    </el-row>

    <el-dialog :title="$t('iot_plat_log_report')" width="50rem" :visible.sync="isLogReportVisible" center>
      <LogReportComponent :deviceId="deviceId" :data="LogData" @close="onCloseLogReport"></LogReportComponent>
    </el-dialog>

    <AddDeviceBindComponent 
      :isVisible="isAddDeviceBindVisible" 
      @close="closeAddDialog" 
      :bindManagers="bindManagers" 
      :model="bindModel">
    </AddDeviceBindComponent>
  </div>
</template>
<script>
import "@/assets/css/content.css";
import { logLevels, protocols } from "@/lib/mixins"
import _ from "lodash";
import TableComponent from "@/components/table/table.vue";
import AddDeviceBindComponent from "./component/add-device-bind"
import LogReportComponent from "./component/log-report-setting"
import {
  COOP_DEVICE_BIND_QUERY,
  COOP_DEL_DEVICE_BIND,
  COOP_MANAGER_QUERY
} from "@/lib/api.js";

// 一秒等于一千毫秒
const MILL_SECOND = 1000

export default {
  components: { TableComponent, AddDeviceBindComponent, LogReportComponent },
  data() {
    return {
      isAddDeviceBindVisible: false,
      isLogReportVisible    : false,
      bindManagers          : [],
      bindModel             : 0,
      deviceId              : "",
      LogData               : {},
      searchForm            : {
        userId  : "",
        deviceId: ""
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
            label: this.$t("iot_plat_device_id"),
            prop : "device_id",
            width: 280
          },
          {
            prop  : "create_time",
            label : this.$t("iot_plat_bind_time"),
            render: value => {
              if (value !== 0) {
                return this.formatDate(new Date(value * MILL_SECOND), "yyyy-MM-dd hh:mm:ss")
              }
            }
          },
          {
            prop : "user_name",
            label: this.$t("iot_plat_bind"),
            width: 150
          },
          {
            prop  : "log_level",
            label : this.$t("iot_plat_log_report_level"),
            render: val => {
              const level = logLevels.find(o => o.id === val)
              return level ? this.$t(level.label) : ""
            }
          },
          {
            prop  : "transfer_proto",
            label : this.$t("iot_plat_log_report_way"),
            render: val => {
              const protocol = protocols.find(o => o.id === val)
              return protocol ? this.$t(protocol.label) : ""
            }
          }
        ]
      }
    };
  },
  created() {
    this.getBindLists();
    this.getBindManger();
    document.body.addEventListener("keydown", this.keyCodeDown, false);
  },
  beforeDestroy() {
    document.body.removeEventListener("keydown", this.keyCodeDown, false);
  },
  methods: {
    keyCodeDown(e) {
      if (e.keyCode === this.ENTER_KEY_CODE) {
        this.getBindLists();
      }
    },

    addDeviceBind () {
      this.bindModel = 0
      this.isAddDeviceBindVisible = true
    },

    UntieDeviceBind () {
      this.bindModel = 1
      this.isAddDeviceBindVisible = true
    },

    closeAddDialog (isToRefresh) {
      if (isToRefresh) {
        this.getBindLists()
      }
      this.isAddDeviceBindVisible = false
    },

    onCloseLogReport (isToRefresh) {
      if (isToRefresh) {
        this.getBindLists()
      }
      this.isLogReportVisible = false 
    },

    logReport (row) {
      this.isLogReportVisible = true
      this.deviceId = row.device_id
      this.LogData = row
    },

    async getBindManger () {
      try {
        const res = await this.$http.post(COOP_MANAGER_QUERY)
        if (this.vmResponseHandler(res)) {
          this.bindManagers = res.data.data
        }
      } catch (error) {
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    },

    getBindLists: _.debounce(async function() {
      // const MILL_SECOND = 1000
      if (this.searchForm.userId && this.searchForm.deviceId) {
        return this.vmMsgWarning(this.$t("iot_plat_unable_query_user_and_deviceid"));
      }
      try {
        const param = this.createFormData({
          page     : parseInt(this.tableOptions.pageOptions.currentPage),
          page_size: parseInt(this.tableOptions.pageOptions.pageSize),
          /*
           * query_name: this.searchForm.key,
           * statr_time: this.searchForm.time ? (new Date(this.searchForm.time[0]).getTime() / MILL_SECOND).toFixed() : "",
           * end_time  : this.searchForm.time ? (new Date(this.searchForm.time[1]).getTime() / MILL_SECOND).toFixed() : "",
           */
          user_id  : this.searchForm.userId,
          device_id: this.searchForm.deviceId
        });
        this.tableOptions.loading = true;
        const res = await this.$http.post(COOP_DEVICE_BIND_QUERY, param)
        this.tableOptions.loading = false;
        if (this.vmResponseHandler(res)) {
          this.tableData = res.data
          this.tableOptions.pageOptions.total = res.data.total;
        }
      } catch (e) {
        this.tableOptions.loading = false;
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    }, this.DEBOUNCE_TIME),

    untied: _.debounce(function (row) {
      if (row.create_time === 0) {
        return this.vmMsgWarning(this.$t("iot_plat_device_not_bind"))
      }
      const loading = this.vmLoadingFull()
      try {
        this.vmConfirm({
          msg            : this.$t("iot_plat_confirm_unbind_device"),
          confirmCallback: async () => {
            const data = this.createFormData({
              user_id   : row.user_id,
              device_ids: [ row.device_id ],
              path      : ""
            })
            const res = await this.$http.post(COOP_DEL_DEVICE_BIND, data)
            loading.close()
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess(this.$t("iot_plat_unbind_success"))
              this.getBindLists()
            }
          },
          cancelCallback: () => {
            loading.close()
          }
        })
      } catch (error) {
        loading.close();
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
