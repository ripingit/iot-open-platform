<template>
  <div class="content-container">
    <el-row>
      <el-col :span="24">
          <p class="title-cn">{{$t("iot_plat_review_manage_company")}}</p>
          <p class="title-en">AUDIT MANAGEMENT</p>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <div class="table">
          <el-row>
            <el-col :span="24">
              <!--<el-date-picker
                v-model="value1"
                type="date"
                placeholder="请选择提交时间">
              </el-date-picker>
              <el-select v-model="value1" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-button class="btn-search" type="primary" @click="search">查询</el-button>-->
              <el-button v-if="vmHasAuth(AdminPermissionsLib.DEL_AUDIT_COMPANY, tableData.res)" class="btn-circle-delete btn-circle-right" type="danger" icon="el-icon-delete" circle @click="deleteAudit"></el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-table
                v-loading="loading"
                :data="tableData.data"
                style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column
                  type="index"
                  :label="$t('iot_plat_number')"
                  width="80">
                </el-table-column>
                <el-table-column
                  prop="name"
                  :label="$t('iot_plat_company_name')"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="en_name"
                  :label="$t('iot_plat_company_english_name')"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="create_time"
                  :label="$t('iot_plat_submit_time')">
                </el-table-column>
                <el-table-column
                  prop="is_review"
                  :label="$t('iot_plat_state')">
                  <template slot-scope="scope">
                    <span :class="scope.row.is_review === 0 ? 'wait'
                    : scope.row.is_review === 1 ? 'pass'
                    : scope.row.is_review === 2 ? 'reject' : ''">
                    {{scope.row.is_review === 0 ? $t("iot_plat_wating_review")
                    : scope.row.is_review === 1 ? $t("iot_plat_already_pass")
                    : scope.row.is_review === 2 ? $t("iot_plat_already_reject") : ''}}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="review_mark"
                  :label="$t('iot_plat_explaine')"
                  :formatter="dataFormatter">
                </el-table-column>
                <el-table-column
                  prop="review_name"
                  :label="$t('iot_plat_reviewer')"
                  :formatter="dataFormatter">
                </el-table-column>
                <el-table-column
                  prop="review_time"
                  :label="$t('iot_plat_review_time')"
                  :formatter="dataFormatter">
                </el-table-column>
                <el-table-column :label="$t('iot_plat_operate')" v-if="vmHasAuth(AdminPermissionsLib.REVIEW_AUDIT_COMPANY, tableData.res)">
                  <template slot-scope="scope">
                    <el-button
                      class="btn-circle"
                      size="mini"
                      icon="iconfont icon-gengduo"
                      circle
                      @click="showDetailDialog(scope.$index, scope.row)"></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-pagination
                v-if="tableData.data.length !== 0"
                @size-change="getAuditList"
                @current-change="getAuditList"
                :page-size="10"
                layout="prev, pager, next, jumper"
                :total="tableData.total">
              </el-pagination>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>

    <el-dialog :title="$t('iot_plat_qualification_review')" :visible.sync="isDetailDialogVisible" center>
      <el-row class="label-row">
        <el-col :span="7" class="label-name">{{$t("iot_plat_company_name")}}：</el-col>
        <el-col :span="17" class="label-value">
          {{ reviewData.name }}
        </el-col>
      </el-row>
      <el-row class="label-row">
        <el-col :span="7" class="label-name">{{$t("iot_plat_credentials_number")}}：</el-col>
        <el-col :span="17" class="label-value">
          {{ reviewData.agencyCode }}
        </el-col>
      </el-row>
      <el-row class="label-row">
        <el-col :span="7" class="label-name">{{$t("iot_plat_mailing_address")}}：</el-col>
        <el-col :span="17" class="label-value">
          {{ reviewData.addr }}
        </el-col>
      </el-row>
      <el-row class="label-row">
        <el-col :span="7" class="label-name">{{$t("iot_plat_contact_number")}}：</el-col>
        <el-col :span="17" class="label-value">
          {{ reviewData.tel }}
        </el-col>
      </el-row>
      <el-row class="label-row">
        <el-col :span="7" class="label-name">{{$t("iot_plat_business_license")}}：</el-col>
        <el-col :span="17" class="label-value">
          <ScaleImgComponent :path="reviewData.filePath" class="cert" :alt="$t('iot_plat_business_license')"></ScaleImgComponent>
        </el-col>
      </el-row>
      <el-row class="label-row">
        <el-col :span="24">
        <el-input
            type="textarea"
            :rows="4"
            :placeholder="$t('iot_plat_input_reject_reason')"
            v-model="reviewData.reviewMark">
          </el-input>
        </el-col>
      </el-row>
      <el-row class="label-sug">
        <el-col :span="11">
          <el-button class="btn-reject" type="danger" @click="reviewAudit(2)">{{$t("iot_plat_reject")}}</el-button>
        </el-col>
        <el-col :span="2">&nbsp;</el-col>
        <el-col :span="11">
          <el-button class="btn-pass" type="success" @click="reviewAudit(1)">{{$t("iot_plat_pass")}}</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import "@/assets/css/content.css"
import ScaleImgComponent from "@/components/preview-img/scale-img.vue"
import { GET_AUDIT_COMPANY_POST, DELETE_AUDIT_COMPANY_POST, REVIEW_AUDIT_COMPANY_POST } from "@/lib/api"

export default {
  components: { ScaleImgComponent },
  data () {
    return {
      loading   : false,
      reviewData: {
        name       : "",
        addr       : "",
        agencyCode : "",
        tel        : "",
        filePath   : "",
        reviewMark : "",
        companyCode: ""
      },
      isDetailDialogVisible: false,
      options              : [],
      value1               : "",
      tableData            : {
        data   : [],
        page   : "1",
        pageAll: 1,
        total  : 1
      },
      selectedData: []
    }
  },
  created () {
    this.getAuditList(1)
  },
  methods: {
    handleSelectionChange (val) {
      this.selectedData = val
    },
    dataFormatter (row, column, cellValue) {
      return row.is_review === this.authCode.WAIT ? "" : cellValue
    },
    showDetailDialog (index, row) {
      this.reviewData.reviewMark = ""
      this.reviewData.name = row.name
      this.reviewData.addr = row.addr
      this.reviewData.agencyCode = row.agency_code
      this.reviewData.tel = row.tel
      this.reviewData.filePath = row.file_ids
      this.reviewData.companyCode = row.company_code
      this.isDetailDialogVisible = true
    },
    async getAuditList (currentPage) {
      try {
        const data = this.createFormData({
          page     : currentPage,
          page_size: 20
        })
        this.loading = true
        const res = await this.$http.post(GET_AUDIT_COMPANY_POST, data)
        if (this.vmResponseHandler(res)) {
          this.tableData = res.data
        }
        this.loading = false
      } catch (error) {
        this.loading = false
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    },
    deleteAudit () {
      if (this.selectedData.length <= 0) {
        return this.vmMsgError(this.$t("iot_plat_select_ready_delete_company")); 
      }
      const wait = this.vmLoadingFull()

      try {
        const data = this.createFormData({ company_code: this.selectedData[0].company_code })
        this.vmConfirm({
          msg            : this.$t("iot_plat_confirm_delete_select_record"),
          confirmCallback: async () => {
            const res = await this.$http.post(DELETE_AUDIT_COMPANY_POST, data)
            if (this.vmResponseHandler(res)) {
              this.getAuditList(this.tableData.page)
              this.vmMsgSuccess(this.$t("iot_plat_delete_success"))
            }
            wait.close()
          }
        }) 
      } catch (error) {
        wait.close()
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    },
    reviewAudit (review) {
      // review: 1通过 2未通过
      const wait = this.vmLoadingFull()
      try {
        const data = this.createFormData({
          company_code: this.reviewData.companyCode,
          is_review   : review,
          review_mark : this.reviewData.reviewMark || this.$t("iot_plat_none")
        })
        this.vmConfirm({
          msg            : review === 1 ? this.$t("iot_plat_confirm_pass_company_cert") : this.$t("iot_plat_confirm_reject_company_cert"),
          confirmCallback: async () => {
            const res = await this.$http.post(REVIEW_AUDIT_COMPANY_POST, data)
            if (this.vmResponseHandler(res)) {
              this.getAuditList(this.tableData.page)
              this.isDetailDialogVisible = false
              this.vmMsgSuccess(this.$t("iot_plat_submit_success"))
            }
            wait.close()
          },
          cancelCallback: () => wait.close()
        }) 
      } catch (error) {
        wait.close()
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    }
  }
}
</script>

<style scoped>

/** 定制 start */
.el-dialog__wrapper /deep/ .el-dialog{
  width: 54.17rem;
}
.cert {
  width: 12rem;
  height: 8.33rem;
}
.wait {
  color: #b3b3b3;
}
.pass {
  color: #2acba7;
}
.reject {
  color: #ff5d66;
}
/** 定制 end */
</style>
