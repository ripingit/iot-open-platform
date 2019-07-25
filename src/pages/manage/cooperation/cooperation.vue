<template>
  <div class="content-container">
    <el-row>
      <el-col :span="24">
          <p class="title-cn">{{$t("iot_plat_coop")}}</p>
          <p class="title-en">COOPERATION</p>
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
              <el-button class="btn-search" type="primary" @click="getCoopLists()">{{$t("iot_plat_query")}}</el-button>
              <el-button v-if="vmHasAuth(AdminPermissionsLib.DEL_COOP, tableData.res)" class="btn-circle-delete btn-circle-right" type="danger" icon="el-icon-delete" circle @click="deleteCoop"></el-button>
            </el-col>
          </el-row>
          <!-- 搜索栏结束 -->

          <el-row>
            <el-col :span="24">
              <!-- 表格开始 -->
              <TableComponent :options="tableOptions" :data="tableData.data" v-on:page-change="getCoopLists" v-on:selection="handleSelectionChange">
                <el-table-column
                  label="key"
                  width="120" slot="handler">
                  <template slot-scope="scope">
                    <el-button
                      class="btn-circle"
                      size="mini"
                      icon="iconfont icon-gengduo"
                      circle
                      v-if="vmHasAuth(AdminPermissionsLib.PERMISSION_COOP, tableData.res)"
                      @click="showKeyDialog(scope.row.client_id)"></el-button>
                  </template>
                </el-table-column>
                <template slot-scope="scope" slot="fileId">
                  <ScaleImgComponent :path="scope.row.file_ids" style="width:5rem;height:5rem" :alt="$t('iot_plat_business_license')"></ScaleImgComponent>
                </template>
              </TableComponent>
              <!-- 表格结束 -->
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-dialog :title="$t('iot_plat_partner_key')" :visible.sync="keyVisible" center>
      <el-table
        v-loading="loadingKey"
        :data="keyData"
        max-height="300"
        style="width: 100%">
        <el-table-column
          prop="client_id"
          :label="$t('iot_plat_id')">
        </el-table-column>
        <el-table-column
          prop="client_secret"
          :label="$t('iot_plat_key')">
        </el-table-column>
        <el-table-column
          prop="app_name"
          :label="$t('iot_plat_bind_app')">
        </el-table-column>
        <el-table-column
          prop="create_time"
          :label="$t('iot_plat_create_time')">
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import "@/assets/css/content.css"
import { GET_COOP_COMPANY_POST, DELETE_COOP_COMPANY_POST, GET_COOP_COMPANYKEY_POST } from "@/lib/api"
import ScaleImgComponent from "@/components/preview-img/scale-img.vue"
import TableComponent from "@/components/table/table.vue"
import _ from "lodash"
export default {
  components: { ScaleImgComponent, TableComponent },
  data () {
    return {
      loadingKey   : false,
      searchDate   : null,
      searchKeyWord: "",
      tableData    : {
        data: [],
        res : []
      },
      selectedData: [],
      keyVisible  : false,
      keyData     : [],
      tableOptions: {
        loading     : true,
        hasSelection: true,
        hasNumber   : true,
        pageOptions : {
          pageSize   : 20,
          total      : 0,
          currentPage: 1
        },
        columns: [
          {
            label: this.$t("iot_plat_company_name"),
            prop : "name",
            width: 180
          },
          {
            prop : "en_name",
            label: this.$t("iot_plat_company_english_name"),
            width: "180"
          },
          {
            prop : "tel",
            label: this.$t("iot_plat_contact_details"),
            width: 180
          },
          {
            prop    : "file_ids",
            label   : this.$t("iot_plat_business_license"),
            width   : 160,
            slotName: "fileId"
          },
          {
            prop : "addr",
            label: this.$t("iot_plat_address")
          },
          {
            prop : "create_time",
            label: this.$t("iot_plat_registered_time"),
            width: 180
          }
        ]
      }
    }
  },
  created () {
    this.getCoopLists()
    document.body.addEventListener("keydown", this.keyCodeDown, false)
  },
  beforeDestroy () {
    document.body.removeEventListener("keydown", this.keyCodeDown, false)
  },
  methods: {
    keyCodeDown (e) {
      if (e.keyCode === this.ENTER_KEY_CODE) {
        this.getCoopLists()
      }
    },
    handleSelectionChange (val) {
      this.selectedData = val
    },
    getCoopLists: _.debounce(async function () {
      try {
        const data = this.createFormData({
          page         : this.tableOptions.pageOptions.currentPage,
          page_size    : this.tableOptions.pageOptions.pageSize,
          query_by_name: this.searchKeyWord,
          start_time   : this.searchDate ? this.searchDate[0] : "",
          end_time     : this.searchDate ? this.searchDate[1] : ""
        })
        this.tableOptions.loading = true
        const res = await this.$http.post(GET_COOP_COMPANY_POST, data)
        if (this.vmResponseHandler(res)) {
          this.tableData = res.data
          this.tableOptions.pageOptions.total = res.data.total
        }
        this.tableOptions.loading = false
      } catch (error) {
        this.tableOptions.loading = false
        this.vmMsgError(this.$t("iot_plat_program_error")); 
      }
    }, this.DEBOUNCE_TIME),
    deleteCoop () {
      if (this.selectedData.length <= 0) {
        return this.vmMsgError(this.$t("iot_plat_select_delete_parnter")); 
      }
      const wait = this.vmLoadingFull()
      try {
        const data = this.createFormData({ company_code: this.selectedData[0].company_code })
        this.vmConfirm({
          msg            : this.$t("iot_plat_confirm_delete_select_record"),
          confirmCallback: async () => {
            const res = await this.$http.post(DELETE_COOP_COMPANY_POST, data)
            if (this.vmResponseHandler(res)) {
              this.getCoopLists(this.tableData.page)
              this.vmMsgSuccess(this.$t("iot_plat_delete_success"))
            }
            wait.close()
          },
          cancelCallback: () => {
            wait.close()
          }
        })
      } catch (error) {
        wait.close()
        this.vmMsgError(this.$t("iot_plat_program_error")); 
      }
    },
    showKeyDialog (id) {
      this.keyVisible = true
      this.getKeyLists(id)
    },
    getKeyLists: _.debounce(async function (id) {
      try {
        const data = this.createFormData({ client_id: id })
        this.loadingKey = true
        this.keyData = []
        const res = await this.$http.post(GET_COOP_COMPANYKEY_POST, data)
        if (this.vmResponseHandler(res)) {
          this.keyData = res.data.data
        }
        this.loadingKey = false
      } catch (error) {
        this.loadingKey = false
        this.vmMsgError(this.$t("iot_plat_program_error")); 
      }
    })
  }
}
</script>
<style scoped>
  .el-dialog__wrapper /deep/ .el-dialog{
    width: 51rem;
  }
</style>
