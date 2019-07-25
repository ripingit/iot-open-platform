<template>
  <div class="content-container">
    <el-row>
      <el-col :span="24">
          <p class="title-cn">{{$t("iot_plat_user_manage")}}</p>
          <p class="title-en">THE USER MANAGEMENT</p>
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
              <el-button class="btn-search" type="primary" @click="getUsersLists()">{{$t('iot_plat_query')}}</el-button>
            </el-col>
          </el-row>
          <!-- 搜索栏结束 -->

          <!-- 表格开始 -->
          <el-row>
            <el-col :span="24">
              <TableComponent
                :options="tableOptions"
                :data="tableData"
                v-on:page-change="getUsersLists"
              >
                <el-table-column prop :label="$t('iot_plat_operate')" slot="handler">
                  <template slot-scope="scope">
                    <el-button
                      class="btn-circle"
                      size="mini"
                      icon="iconfont icon-gengduo"
                      circle
                      @click="showListDialog(scope.$index, scope.row)"></el-button>
                  </template>
                </el-table-column>
              </TableComponent>
            </el-col>
          </el-row>
          <!-- 表格结束 -->
        </div>
      </el-col>
    </el-row>

    <el-dialog :title="$t('iot_plat_value_added_services_user')" :visible.sync="isDialogVisibleList" center>
      <el-table
        :data="ValueAddedServices"
        :span-method="spanMethod"
        style="width: 100%">
        <el-table-column
          prop="product_name"
          :label="$t('iot_plat_device')"
          width="300">
        </el-table-column>
        <el-table-column
          prop="add_service"
          :label="$t('iot_plat_service')">
        </el-table-column>
        <el-table-column
          prop="open_cycle"
          :label="$t('iot_plat_opening_cycle')">
        </el-table-column>
        <el-table-column
          prop="end_of_time"
          :label="$t('iot_plat_expire_date')">
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import "@/assets/css/content.css"
import { ADMIN_USERS_GET } from "@/lib/api"
import { encryptUserName } from "@/lib/mixins";
import TableComponent from "@/components/table/table.vue";
import _ from "lodash"

// 定义在data中会出现死循环
let rowspanRange = ""

export default {
  mixins: [
    { methods: { encryptUserName: encryptUserName } }
  ],
  components: { TableComponent },
  data () {
    return {
      isDialogVisibleList: false,
      searchDate         : null,
      searchKeyWord      : "",
      tableData          : [],
      ValueAddedServices : [],
      tableOptions       : {
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
            label: this.$t("iot_plat_user"),
            prop : "user_name",
            width: 200
          },
          {
            prop : "create_time",
            label: this.$t("iot_plat_registered_time")
          },
          {
            prop : "site_name",
            label: this.$t("iot_plat_area")
          },
          {
            prop : "login_device",
            label: this.$t("iot_plat_device")
          },
          {
            prop : "login_os",
            label: this.$t("iot_plat_operate_system")
          },
          {
            prop : "last_time",
            label: this.$t("iot_plat_last_login")
          },
          {
            prop : "company_name",
            label: this.$t("iot_plat_own_company"),
            width: 300
          }
        ]
      }
    }
  },
  created () {
    this.getUsersLists()
    document.body.addEventListener("keydown", this.keyCodeDown, false)
  },
  beforeDestroy () {
    document.body.removeEventListener("keydown", this.keyCodeDown, false)
  },
  methods: {
    keyCodeDown (e) {
      if (e.keyCode === this.ENTER_KEY_CODE) {
        this.getUsersLists()
      }
    },
    spanMethod ({ row, columnIndex }) {
      if (columnIndex === 0) {
        const data = this.ValueAddedServices.filter(o => o.product_name === row.product_name)
        if (rowspanRange === row.product_name) {
          return {
            rowspan: 0,
            colspan: 0
          }
        } 
        rowspanRange = row.product_name
        return {
          rowspan: data.length,
          colspan: 1
        }
        
      }
    },
    showListDialog (index, row) {
      this.isDialogVisibleList = true
      this.ValueAddedServices = row.userServiceInfo
    },
    getUsersLists: _.debounce(async function () {
      try {
        const data = this.createFormData({
          page         : this.tableOptions.pageOptions.currentPage,
          page_size    : this.tableOptions.pageOptions.pageSize,
          query_by_name: this.searchKeyWord,
          start_time   : this.searchDate ? this.searchDate[0] : "",
          end_time     : this.searchDate ? this.searchDate[1] : ""
        })
        this.tableOptions.loading = true
        const res = await this.$http.post(ADMIN_USERS_GET, data)
        if (this.vmResponseHandler(res)) {
          this.tableData = res.data.data
          this.tableData.map(value => { value.user_name = this.encryptUserName(value.user_name, true) })
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
