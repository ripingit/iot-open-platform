<template>
  <div class="container">
    <el-row class="app_nav">
      <h5>{{$t("iot_plat_app_version")}}</h5>
      <p>THE APP VERSION</p>
    </el-row>
    <el-row class="table">
      <el-row>
        <el-date-picker
          v-model="inputVal1"
          type="daterange"
          value-format="yyyy-MM-dd"
          :range-separator="$t('iot_plat_to')"
          :start-placeholder="$t('iot_plat_start_date')"
          :end-placeholder="$t('iot_plat_end_date')">
        </el-date-picker>
        <el-input v-model="selectParam.query_by_name" :placeholder="$t('iot_plat_input_value_please')"></el-input>
        <el-button class="btn-search" type="primary" @click="searchData">{{$t("iot_plat_query")}}</el-button>
<!--         <el-button icon="el-icon-delete" v-if="vmHasAuth(AdminPermissionsLib.DEL_APP, res)" type="danger" circle class="btn-circle-delete btn-circle-right" @click="operationData('delete')"></el-button> -->
      </el-row>
      <el-row>
        <el-table
          v-loading="loading"
          :data="tableData"
          @selection-change="handleSelectionChange"
          style="width: 100%;">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            type="index"
            width="80"
            :label="$t('iot_plat_number')">
          </el-table-column>
          <el-table-column
            prop="app_name"
            min-width="150"
            :label="$t('iot_plat_app_name')">
          </el-table-column>
          <el-table-column
            prop="app_logo_url"
            min-width="150"
            :label="$t('iot_plat_logo')">
            <template slot-scope="scope">
              <ScaleImgComponent :path="scope.row.app_logo_url" style="width:5rem;height:5rem" alt="图2"></ScaleImgComponent>
            </template>
          </el-table-column>
          <el-table-column
            prop="company_name"
            min-width="240"
            :label="$t('iot_plat_own_company')">
          </el-table-column>
          <el-table-column
            prop="ver"
            min-width="150"
            :label="$t('iot_plat_version_number')">
          </el-table-column>
          <el-table-column
            prop="add_time"
            min-width="180"
            :label="$t('iot_plat_add')">
          </el-table-column>
          <el-table-column
            prop="is_force_upd"
            min-width="120"
            :label="$t('iot_plat_update_type')">
            <template slot-scope="scope">
              {{ scope.row.is_force_upd === 0 ? $t("iot_plat_not_force_update") : $t("iot_plat_force_update") }}
            </template>
          </el-table-column>
          <el-table-column
            prop="QrcodeUrl"
            min-width="200"
            :label="$t('iot_plat_qrcode')">
            <template slot-scope="scope">
              <ScaleImgComponent :path="scope.row.QrcodeUrl" style="width:5rem;height:5rem" alt="图2"></ScaleImgComponent>
              <p class="download" style="font-size: 12px; cursor: pointer" @click="download(scope.row.QrcodeUrl)">{{$t("iot_plat_download_qrcode")}}</p>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            :label="$t('iot_plat_operate')"
            min-width="100">
            <template slot-scope="scope">
              <el-button
                class="btn-circle"
                size="mini"
                icon="iconfont icon-gengduo"
                circle
                @click="onShowDetail(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row type="flex" justify="center" v-if="totalAll!=0">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="selectParam.page"
          :page-size="selectParam.page_size"
          layout="prev, pager, next, jumper"
          :total="totalAll">
        </el-pagination>
      </el-row>
    </el-row>
    <el-dialog
      :title="$t('iot_plat_app_upgrade_detail')"
      center
      :visible.sync="detailDialogVisible"
      :close-on-click-modal="false"
      :before-close="handleClose">
      <el-form label-width="170px">
        <el-form-item :label="$t('iot_plat_app_name')">
          <span class="detail_item">{{detailData.app_name}}</span>
        </el-form-item>
        <el-form-item :label="$t('iot_plat_version')">
          <span class="detail_item">{{detailData.ver}}</span>
        </el-form-item>
        <el-form-item :label="$t('iot_plat_md5_value')">
          <span class="detail_item">{{detailData.md5}}</span>
        </el-form-item>
        <el-form-item :label="$t('iot_plat_upgrade_desc')">
          <span class="detail_item log-pre">{{detailData.change_log}}</span>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import "@/assets/css/content.css"
import { noPicture } from "@/lib/const"
import ScaleImgComponent from "@/components/preview-img/scale-img.vue"
import { APP_MANAGE_SELECT_POST, APP_MANAGE_DEL_POST } from "@/lib/api.js"
import _ from "lodash"
export default {
  components: { ScaleImgComponent },
  data () {
    return {
      noPicturePath    : noPicture,
      loading          : false,
      inputVal1        : "",
      options          : [],
      multipleSelection: [],
      tableData        : [],
      res              : [],
      selectParam      : {
        page         : 1,
        page_size    : 20,
        query_by_name: "",
        start_time   : "",
        end_time     : ""
      },
      totalAll           : 0,
      detailDialogVisible: false,
      rules              : {
        url: [
          { required: true, message: this.$t("iot_plat_input_download_addr"), trigger: "blur" }
        ],
        change_log: [
          { required: true, message: this.$t("iot_plat_input_upgrade_desc"), trigger: "blur" }
        ]
      },
      detailData: {}
    }
  },
  created () {
    this.loadData()
    document.body.addEventListener("keydown", this.keyCodeDown, false)
  },
  beforeDestroy () {
    document.body.removeEventListener("keydown", this.keyCodeDown, false)
  },
  methods: {
    keyCodeDown (e) {
      if (e.keyCode === this.ENTER_KEY_CODE) {
        this.searchData()
      }
    },
    searchData () {
      this.selectParam.page = 1
      this.selectParam.start_time = this.inputVal1 ? this.inputVal1[0] : ""
      this.selectParam.end_time = this.inputVal1 ? this.inputVal1[1] : ""
      this.loadData()
    },
    handleCurrentChange (val) {
      this.selectParam.page = val
      this.loadData()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },

    onShowDetail (row) {
      this.detailDialogVisible = true
      this.detailData = row
      this.detailData.change_log = this.isJsonString(row.change_log) ? JSON.parse(row.change_log).CN : row.change_log
    },

    operationData () {
      const loading = this.vmLoadingFull()
      try {
        const ary = []
        for (const obj of this.multipleSelection) {
          ary.push(obj.app_name)
        }
        const data = this.createFormData({ app_name: JSON.stringify(ary) })
        this.vmConfirm({
          msg            : this.$t("iot_plat_confirm_delete_data"),
          confirmCallback: async () => {
            const res = await this.$http.post(APP_MANAGE_DEL_POST, data)
            loading.close()
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess(this.$t("iot_plat_delete_success"))
              this.loadData()
            }
          }
        })
      } catch (error) {
        loading.close()
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    },
    handleClose (done) {
      done()
    },
    loadData: _.debounce(async function () {
      try {
        const data = this.createFormData(this.selectParam)
        this.loading = true
        const res = await this.$http.post(APP_MANAGE_SELECT_POST, data)
        if (this.vmResponseHandler(res)) {
          this.tableData = res.data.data.map(o => {
            if (!o.app_logo_url) { o.app_logo_url = this.noPicturePath }
            return o
          })
          this.totalAll = res.data.total
          this.res = res.data.res
        }
        this.loading = false
      } catch (error) {
        this.loading = false
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    }, this.DEBOUNCE_TIME)
  }
}
</script>
<style scoped>
  .container {
    margin: 1.67rem 2.5rem;
  }

  .app_nav h5 {
    font-size: 1.5rem;
    color: #fff;
  }

  .app_nav p {
    font-size: .83rem;
    color: #808080;
    margin-top: .33rem;
  }

  .container /deep/ .el-dialog {
    width: 54.17rem;
  }

  .container /deep/ .table .el-input {
    width:auto;
    margin-left:1.5rem;
  }

  .detail_item{
    color: #ffffff;
  }
  .download{
    color: #38a0f8;
  }
</style>
