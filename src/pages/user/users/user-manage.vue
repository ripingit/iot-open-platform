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
         <!-- <el-row>
            <el-col :span="24">
              <el-date-picker
                v-model="searchDate"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
              <el-input
                placeholder="请输入查询关键字"
                v-model="searchKeyWord"
                clearable>
              </el-input>
              <el-button class="btn-search" type="primary" @click="getUsersLists(1)">查询</el-button>
            </el-col>
          </el-row> -->
          <el-row>
            <el-col :span="24">
              <el-table
                v-loading="loading"
                :data="tableData.data"
                style="width: 100%">
                <el-table-column
                  type="index"
                  :label="$t('iot_plat_number')"
                  width="80">
                </el-table-column>
                <el-table-column
                  prop="user_name"
                  :label="$t('iot_plat_user')">
                </el-table-column>
                <el-table-column
                  prop="create_time"
                  :label="$t('iot_plat_registered_time')">
                </el-table-column>
                <el-table-column
                  prop="site_name"
                  :label="$t('iot_plat_area')">
                </el-table-column>
                <el-table-column
                  prop="login_device"
                  :label="$t('iot_plat_device')">
                </el-table-column>
                <el-table-column
                  prop="login_os"
                  :label="$t('iot_plat_operate_system')">
                </el-table-column>
                <el-table-column
                  prop="last_time"
                  :label="$t('iot_plat_last_login')">
                </el-table-column>
                <el-table-column
                  prop="device_num"
                  :label="$t('iot_plat_bind_device_number')">
                </el-table-column>
                <el-table-column :label="$t('iot_plat_operate')">
                  <template slot-scope="scope">
                    <el-button
                      class="btn-circle"
                      size="mini"
                      icon="iconfont icon-gengduo"
                      circle
                      @click="showListDialog(scope.$index, scope.row)"></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-pagination
                v-if="tableData.data.length !== 0"
                @size-change="getUsersLists"
                @current-change="getUsersLists"
                :page-size="20"
                layout="prev, pager, next, jumper"
                :total="tableData.total">
              </el-pagination>
            </el-col>
          </el-row>
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
import { COOP_USERS_GET } from "@/lib/api"
import { encryptUserName } from "@/lib/mixins";

// 定义在data中会出现死循环
let rowspanRange = ""

export default {
  mixins: [
    { methods: { encryptUserName: encryptUserName } }
  ],
  data () {
    return {
      loading            : false,
      isDialogVisibleList: false,
      searchDate         : [],
      searchKeyWord      : "",
      tableData          : {
        data   : [],
        page   : "1",
        pageAll: 1,
        total  : 1
      },
      ValueAddedServices: []
    }
  },
  created () {
    this.getUsersLists(1)
  },
  methods: {
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
    async getUsersLists (currentPage) {
      try {
        const data = this.createFormData({
          page     : currentPage,
          page_size: 20
        })
        this.loading = true
        const res = await this.$http.post(COOP_USERS_GET, data)
        if (this.vmResponseHandler(res)) {
          this.tableData = res.data

          this.tableData.data.map(value => { value.user_name = this.encryptUserName(value.user_name, true) })
        }
        this.loading = false
      } catch (error) {
        this.loading = false
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
      
    }
  }
}
</script>
<style scoped>
</style>
