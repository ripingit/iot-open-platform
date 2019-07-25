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
                <el-option value="">{{$t("iot_plat_select_please")}}</el-option>
                <el-option
                  v-for="item in bindManagers"
                  :key="item.user_id"
                  :label="item.user_name"
                  :value="item.user_id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label>
              <el-input v-model="searchForm.deviceId" :placeholder="$t('iot_plat_input_device_id')"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button class="btn-search" type="primary" @click="getBindLists">{{$t("iot_plat_query")}}</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <TableComponent :options="tableOptions" :data="tableData.data" v-on:page-change="getBindLists"></TableComponent>
        </el-col>
      </el-row>
    </el-row>
  </div>
</template>
<script>
import "@/assets/css/content.css";
import TableComponent from "@/components/table/table.vue";
import { ADMIN_DEVICE_BIND_QUERY, ADMIN_MANAGER_QUERY } from "@/lib/api.js";

const MILL_SECOND = 1000

export default {
  components: { TableComponent },
  data() {
    return {
      bindManagers: [],
      searchForm  : {
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
            prop : "device_id"
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
            label: this.$t("iot_plat_bind")
          }
        ]
      }
    };
  },
  created() {
    this.getBindLists();
    this.getBindManger();
  },
  methods: {
    async getBindManger () {
      try {
        const res = await this.$http.post(ADMIN_MANAGER_QUERY)
        if (this.vmResponseHandler(res)) {
          this.bindManagers = res.data.data
        }
      } catch (error) {
        this.vmMsgError(this.$t("iot_plat_program_error")); 
      }
    },
    async getBindLists () {
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
        const res = await this.$http.post(ADMIN_DEVICE_BIND_QUERY, param)
        this.tableOptions.loading = false;
        if (this.vmResponseHandler(res)) {
          this.tableData = res.data
          this.tableOptions.pageOptions.total = res.data.total;
        }
      } catch (e) {
        this.tableOptions.loading = false;
        this.vmMsgError(this.$t("iot_plat_program_error")); 
      }
    }
  }
};
</script>
<style scoped>
.device-model-admin {
  padding: 1.67rem 2.5rem;
  color: #fff;
}
</style>
