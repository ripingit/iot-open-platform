<template>
  <div class="content-container">
    <el-row>
      <el-col :span="24">
          <p class="title-cn">{{$t("iot_plat_review_manage_model")}}</p>
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
              <el-button v-if="vmHasAuth(AdminPermissionsLib.DEL_AUDIT_MODEL, tableData.res)"
                        class="btn-circle-delete btn-circle-right"
                        type="danger"
                        icon="el-icon-delete"
                        circle
                        @click="deleteAudit"></el-button>
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
                  width="120">
                </el-table-column>
                <el-table-column
                  prop="product_code"
                  :label="$t('iot_plat_model_code')"
                  width="150">
                </el-table-column>
                <el-table-column
                  prop="company_name"
                  :label="$t('iot_plat_belong_company')">
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
                <el-table-column :label="$t('iot_plat_operate')"  v-if="vmHasAuth(AdminPermissionsLib.REVIEW_AUDIT_MODEL, tableData.res)">
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

    <el-dialog :title="$t('iot_plat_model_review')" :visible.sync="isDetailDialogVisible" center>
      <el-row class="label-row">
        <el-col :span="4" class="label-name">{{$t("iot_plat_model_name")}}:</el-col>
        <el-col :span="20" class="label-value">
          {{reviewData.product_name}}
        </el-col>
      </el-row>
      <el-row class="label-row">
        <el-col :span="4" class="label-name">{{$t("iot_plat_model_code")}}:</el-col>
        <el-col :span="20" class="label-value">
          {{reviewData.product_code}}
        </el-col>
      </el-row>
      <el-row class="label-row">
        <el-col :span="4" class="label-name">{{$t("iot_plat_connection_way")}}:</el-col>
        <el-col :span="20" class="label-value">
          {{reviewData.nbi_code}}
        </el-col>
      </el-row>
      <el-row class="label-row">
        <el-col :span="4" class="label-name">{{$t("iot_plat_device_class")}}:</el-col>
        <el-col :span="20" class="label-value">
          {{reviewData.prodt_code}}
        </el-col>
      </el-row>
      <el-row class="label-row">
        <el-col :span="4" class="label-name">{{$t("iot_plat_reset_note")}}:</el-col>
        <el-col :span="20" class="label-value">
          <pre>{{reviewData.reset_code}}</pre>
        </el-col>
      </el-row>
      <el-row class="label-row">
        <el-col :span="4" class="label-name">{{$t("iot_plat_rendering")}}:</el-col>
        <el-col :span="20" class="label-value">
          <ScaleImgComponent v-for="(item, index) in reviewData.filePaths" :key="index" :path="item || noPicturePath" class="cert" :alt="$t('iot_plat_rendering')"></ScaleImgComponent>
        </el-col>
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
import { noPicture } from "@/lib/const"
import ScaleImgComponent from "@/components/preview-img/scale-img.vue"
import { ADMIN_MODEL_AUDIT_QUERY, ADMIN_MODEL_AUDIT_DEL, ADMIN_MODEL_REVIEW } from "@/lib/api"

export default {
  components: { ScaleImgComponent },
  data () {
    return {
      noPicturePath        : noPicture,
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
        product_name: "",
        product_code: "",
        reset_code  : "",
        nbi_code    : "",
        prodt_code  : "",
        review_mark : "",
        filePaths   : []
      },
      reset         : [],
      connectionMode: [],
      deviceCategory: [],
      selectedData  : []
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
      const connect = row.nbi_code && row.nbi_code.reduce((accumulator, currentValue) => `${accumulator + this.connectionMode.find(o => o.nbi_code === currentValue).nbi_code_name}；`, "")
      const deviceCate = row.prodt_code && row.prodt_code.reduce((accumulator, currentValue) => `${accumulator + currentValue}；`, "")
      const resetName = []
      this.reset.forEach(item => {
        if (row.reset_code.includes(Number(item.str_id.replace("Resetcode_value", "")))) {
          resetName.push(JSON.parse(item.str_translation)[localStorage.getItem("lang") || "CN"])
        }
      });
      const tempPic = JSON.parse(row.pic1_fileid)
      this.reviewData.product_name = row.product_name
      this.reviewData.product_code = row.product_code
      this.reviewData.reset_code = resetName.join("\n")
      this.reviewData.nbi_code = connect
      this.reviewData.prodt_code = deviceCate
      this.reviewData.review_mark = ""
      this.reviewData.filePaths = [ tempPic.online, tempPic.reset, tempPic.thumb, tempPic.state ]
      this.isDetailDialogVisible = true
    },
    async getAuditList (currentPage) {
      try {
        const data = this.createFormData({
          page     : currentPage,
          page_size: 20
        })
        this.loading = true
        const res = await this.$http.post(ADMIN_MODEL_AUDIT_QUERY, data)
        if (this.vmResponseHandler(res)) {
          this.tableData = res.data
          this.reset = res.data.Reset
          this.connectionMode = res.data.Nbi
          this.deviceCategory = res.data.prodtList
        }
        this.loading = false  
      } catch (error) {
        this.loading = false
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    },
    deleteAudit () {
      if (this.selectedData.length <= 0) {
        this.vmMsgError(this.$t("iot_plat_select_ready_delete_model")); return
      }
      const wait = this.vmLoadingFull()
      try {
        const data = this.createFormData({ product_code: JSON.stringify(this.selectedData.map(o => o.product_code)) })
        this.vmConfirm({
          msg            : this.$t("iot_plat_confirm_delete_select_record"),
          confirmCallback: async () => {
            const res = await this.$http.post(ADMIN_MODEL_AUDIT_DEL, data)
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
          product_code: this.reviewData.product_code,
          is_review   : review,
          review_mark : this.reviewData.review_mark || this.$t("iot_plat_none")
        })
        this.vmConfirm({
          msg            : review === 1 ? this.$t("iot_plat_confrim_pass_model_review") : this.$t("iot_plat_confirm_reject_model_review"),
          confirmCallback: async () => {
            const res = await this.$http.post(ADMIN_MODEL_REVIEW, data)
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
.cert {
  width: 12rem;
  height: 8.33rem;
  margin-right: 1rem;
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
