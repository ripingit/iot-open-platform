<template>
  <div class="content-container">
    <el-row>
      <el-col :span="24">
          <p class="title-cn">{{$t("iot_plat_review_manage_fireware")}}</p>
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
              <el-select placeholder="请选择" v-model="value1">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-button class="btn-search" type="primary">查询</el-button>-->
              <el-button v-if="vmHasAuth(AdminPermissionsLib.DEL_AUDIT_FIRMWARE, tableData.res)" class="btn-circle-delete btn-circle-right" type="danger" icon="el-icon-delete" circle @click="deleteAudit"></el-button>
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
                  prop="product_name"
                  :label="$t('iot_plat_model_name')"
                  width="200">
                </el-table-column>
                <el-table-column
                  prop="product_code"
                  :label="$t('iot_plat_model_code')"
                  width="150">
                </el-table-column>
                <el-table-column
                  prop="rom_ver"
                  :label="$t('iot_plat_fireware_version')"
                  width="150">
                </el-table-column>
                <el-table-column
                  prop="company_name"
                  :label="$t('iot_plat_belong_company')"
                  width="150">
                </el-table-column>
                <el-table-column
                  prop="upgrade_time"
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
                  :label="$t('iot_plat_marks')">
                </el-table-column>
                <el-table-column
                  prop="review_name"
                  :label="$t('iot_plat_reviewer')">
                </el-table-column>
                <el-table-column
                  prop="review_time"
                  :label="$t('iot_plat_review_time')">
                </el-table-column>
                <el-table-column :label="$t('iot_plat_operate')" v-if="vmHasAuth(AdminPermissionsLib.REVIEW_AUDIT_FIRMWARE, tableData.res)">
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

    <el-dialog :title="$t('iot_plat_fireware_update')" :visible.sync="isDetailDialogVisible" center>
      <el-row class="label-row">
        <el-col :span="2" :sm="3" class="label-name">{{$t("iot_plat_submit_company")}}</el-col>
        <el-col :span="22" :sm="21" class="label-value">
          {{reviewData.company_name}}
        </el-col>
      </el-row>
      <el-row class="label-row">
        <el-col :span="2" :sm="3" class="label-name">{{$t("iot_plat_model")}}</el-col>
        <el-col :span="22" :sm="21" class="label-value">
          {{reviewData.product_code}}
        </el-col>
      </el-row>
      <el-row class="label-row">
        <el-col :span="2" :sm="3" class="label-name">{{$t("iot_plat_submit_version")}}</el-col>
        <el-col :span="22" :sm="21" class="label-value">
          {{reviewData.rom_ver}}
        </el-col>
      </el-row>
      <el-row class="label-row">
        <el-col :span="2" :sm="3" class="label-name">{{$t("iot_plat_fireware")}}</el-col>
        <el-col :span="22" :sm="21" class="label-value">
          <a :href="reviewData.file_id" target="_blank" class="download">{{$t("iot_plat_download")}}</a>
        </el-col>
      </el-row>
      <el-row class="label-row">
        <el-col :span="2" :sm="3" class="label-name">{{$t("iot_plat_fireware_class")}}</el-col>
        <el-col :span="22" :sm="21" class="label-value">{{reviewData.rom_type}}</el-col>
      </el-row>
      <el-row class="label-row">
        <el-col :span="2" :sm="3" class="label-name">{{$t("iot_plat_update_explaine")}}</el-col>
        <el-col :span="22" :sm="21" class="label-value log-pre">{{reviewData.change_log}}</el-col>
      </el-row>
      <el-row class="label-sug">
        <el-col :span="24">
        <el-input
            type="textarea"
            :rows="4"
            :placeholder="$t('iot_plat_explaine_please')"
            v-model="reviewData.review_mark">
          </el-input>
        </el-col>
      </el-row>
      <!--<el-row class="label-row">
        <el-col :span="2" :sm="3" class="label-name">提示</el-col>
        <el-col :span="22" :sm="21" class="label-value">
        {{ reviewData.upload_status }}
        </el-col>
      </el-row>-->
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
import { ADMIN_FIRE_AUDIT_QUERY, ADMIN_FIREWARE_AUDIT, ADMIN_FIREWARE_AUDIT_DEL } from "@/lib/api"

export default {
  data () {
    return {
      loading              : false,
      isDetailDialogVisible: false,
      options              : [],
      value1               : "",
      tableData            : {
        data   : [],
        page   : "1",
        pageAll: 1,
        total  : 1
      },
      reviewData: {
        company_name : "",
        product_code : "",
        rom_ver      : "",
        file_id      : "",
        change_log   : "",
        review_mark  : "",
        state        : false,
        upload_status: "",
        rom_type     : ""
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
    showDetailDialog (index, row) {
      this.reviewData.company_name = row.company_name
      this.reviewData.product_code = row.product_code
      this.reviewData.rom_ver = row.rom_ver
      this.reviewData.file_id = row.file_id
      this.reviewData.change_log = this.isJsonString(row.change_log) ? JSON.parse(row.change_log).CN : row.change_log
      this.reviewData.review_mark = ""
      this.reviewData.state = row.state
      this.reviewData.upload_status = row.upload_status
      this.reviewData.rom_type = this.$t(this.firmwareTypeCode[row.rom_type])
      this.isDetailDialogVisible = true
    },
    async getAuditList (currentPage) {
      try {
        const data = this.createFormData({
          page     : currentPage,
          page_size: 20
        })
        this.loading = true
        const res = await this.$http.post(ADMIN_FIRE_AUDIT_QUERY, data)
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
        this.vmMsgError(this.$t("iot_plat_select_ready_delete_fireware")); return
      }
      const wait = this.vmLoadingFull()
      try {
        const data = this.createFormData({
          product_code: this.selectedData[0].product_code,
          rom_ver     : this.selectedData[0].rom_ver
        })
        this.vmConfirm({
          msg            : this.$t("iot_plat_confirm_delete_select_record"),
          confirmCallback: async () => {
            const res = await this.$http.post(ADMIN_FIREWARE_AUDIT_DEL, data)
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
      /*
       * review: 1通过 2未通过
       * if (!this.reviewData.state) {
       *   this.vmMsgWarning('不能进行审核，原因：' + this.reviewData.upload_status + '！'); return
       * }
       */
      const wait = this.vmLoadingFull()
      try {
        const data = this.createFormData({
          product_code: this.reviewData.product_code,
          is_review   : review,
          review_mark : this.reviewData.review_mark || this.$t("iot_plat_none"),
          rom_ver     : this.reviewData.rom_ver
        })
        this.vmConfirm({
          msg            : review === 1 ? this.$t("iot_plat_confirm_pass_fireware_review") : this.$t("iot_plat_confirm_reject_fireware_review"),
          confirmCallback: async () => {
            const res = await this.$http.post(ADMIN_FIREWARE_AUDIT, data)
            if (this.vmResponseHandler(res)) {
              this.getAuditList(this.tableData.page)
              this.isDetailDialogVisible = false
              this.vmMsgSuccess(this.$t("iot_plat_submit_success"))
            }
            wait.close()
          }
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
.wait {
  color: #b3b3b3;
}
.pass {
  color: #2acba7;
}
.reject {
  color: #ff5d66;
}
.download {
  color: #38a0f8
}
/** 定制 end */
</style>
