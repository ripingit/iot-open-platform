<template>
  <div class="content-container">
    <el-row>
      <el-col :span="24">
          <p class="title-cn">{{$t("iot_plat_review_manage_category")}}</p>
          <p class="title-en">AUDIT MANAGEMENT</p>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <div class="table">
          <el-row>
            <el-col :span="24">
              <!--<el-date-picker
                v-model="value"
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
              <el-button class="btn-search" type="primary" @click="searchData">查询</el-button>-->
              <el-button
                v-if="vmHasAuth(AdminPermissionsLib.DEL_AUDIT_CATEGORY, res)"
                @click="operationData('delete')"
                class="btn-circle-delete btn-circle-right" type="danger" icon="el-icon-delete" circle></el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-table
                v-loading="loading"
                :data="tableData"
                @selection-change="handleSelectionChange"
                style="width: 100%">
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
                  prop="prodt_name"
                  :label="$t('iot_plat_class_name')">
                </el-table-column>
                <el-table-column
                  prop="user_name"
                  :label="$t('iot_plat_submit_user')">
                </el-table-column>
                <el-table-column
                  prop="create_time"
                  :label="$t('iot_plat_submit_time')">
                </el-table-column>
                <el-table-column
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
                  prop="review_uid"
                  :label="$t('iot_plat_reviewer')">
                </el-table-column>
                <el-table-column
                  prop="review_time"
                  :label="$t('iot_plat_review_time')">
                </el-table-column>
                <el-table-column
                  min-width="120"
                  :label="$t('iot_plat_operate')">
                  <template slot-scope="scope">
                    <el-button
                      class="btn-circle"
                      size="mini"
                      icon="iconfont icon-gengduo"
                      circle
                      v-if="vmHasAuth(AdminPermissionsLib.REVIEW_AUDIT_CATEGORY, res)"
                      @click="operationData('select',scope.$index)"></el-button>
                    <!--<el-button
                      class="btn-circle"
                      size="mini"
                      icon="iconfont icon-shanchu"
                      circle
                      v-if="vmHasAuth(AdminPermissionsLib.DEL_AUDIT_CATEGORY, res)"
                      @click="operationData('delete',scope.$index)"></el-button>-->
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
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
        </div>
      </el-col>
    </el-row>
    <el-dialog :title="$t('iot_plat_category_detail')" :visible.sync="isDetailDialogVisible" center>
      <el-row class="label-row">
        <el-col :span="6" class="label-name">{{$t("iot_plat_class_name")}}</el-col>
        <el-col :span="18" class="label-value">
          {{detailData.prodt_name}}
        </el-col>
      </el-row>
      <el-row class="label-row">
        <el-col :span="6" class="label-name">{{$t("iot_plat_class_code")}}</el-col>
        <el-col :span="18" class="label-value">
          {{detailData.prodt_code}}
        </el-col>
      </el-row>
      <!--<el-row class="label-row">
        <el-col :span="2" :sm="3" class="label-name">配置参数</el-col>
        <el-col :span="22" :sm="21" class="label-value">
          多路摄像、云台机、组合开关、情景按钮
        </el-col>
      </el-row>-->
      <el-row class="label-sug">
        <el-col :span="24">
        <el-input
            type="textarea"
            resize="none"
            :readonly="detailData.is_review!==0"
            :rows="4"
            :placeholder="$t('iot_plat_explaine_please')"
            v-model="detailData.review_mark">
          </el-input>
        </el-col>
      </el-row>
      <el-row class="label-sug" v-show="detailData.is_review===0">
        <el-col :span="11">
          <el-button class="btn-reject" type="danger" @click="reviewCategory(2)">{{$t("iot_plat_reject")}}</el-button>
        </el-col>
        <el-col :span="2">&nbsp;</el-col>
        <el-col :span="11">
          <el-button class="btn-pass" type="success" @click="reviewCategory(1)">{{$t("iot_plat_pass")}}</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import "@/assets/css/content.css"
import { ADMIN_CATE_QUERY, REVIEW_AUDIT_CATEGORY_DEL, ADMIN_CATE_REVIEW } from "@/lib/api.js"

export default {
  data () {
    return {
      loading              : false,
      isDetailDialogVisible: false,
      options              : [],
      value                : "",
      value1               : "",
      tableData            : [],
      res                  : [],
      status               : null,
      selectParam          : {
        page     : 1,
        page_size: 20
      },
      totalAll    : 0,
      detailData  : {},
      selectedData: []
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    handleSelectionChange (val) {
      this.selectedData = val
    },
    searchData () {
      this.loadData()
    },
    operationData (type, idx) {
      let loading = null
      try {
        if (type === "select") {
          this.isDetailDialogVisible = true
          this.detailData = JSON.parse(JSON.stringify(this.tableData[idx]))
        } else {
          loading = this.vmLoadingFull()
          const data = this.createFormData({ prodt_code: JSON.stringify(this.selectedData.map(o => o.prodt_code)) })
          this.vmConfirm({
            msg            : this.$t("iot_plat_confirm_delete_data"),
            confirmCallback: async () => {
              const res = await this.$http.post(REVIEW_AUDIT_CATEGORY_DEL, data)
              loading.close()
              if (this.vmResponseHandler(res)) {
                this.vmMsgSuccess(this.$t("iot_plat_delete_success"))
                this.loadData()
              }
            },
            cancelCallback: () => {
              loading.close()
            }
          })
        }
      } catch (error) {
        loading.close()
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    },
    async reviewCategory (index) {
      const INDEX = 2
      if (index === INDEX && this.detailData.review_mark === "") {
        return this.vmMsgWarning(this.$t("iot_plat_reject_explaine_required"))
      }
      const loading = this.vmLoadingFull()
      try {      
        const data = this.createFormData({
          prodt_code : this.detailData.prodt_code,
          is_review  : index,
          review_mark: this.detailData.review_mark
        })
        const res = await this.$http.post(ADMIN_CATE_REVIEW, data)
        loading.close()
        if (this.vmResponseHandler(res)) {
          this.isDetailDialogVisible = false
          this.vmMsgSuccess()
          this.loadData()
        }
      } catch (error) {
        loading.close()
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    },
    handleCurrentChange (val) {
      this.selectParam.page = val
      this.loadData()
    },
    async loadData () {
      try {
        const data = this.createFormData(this.selectParam)
        this.loading = true
        const res = await this.$http.post(ADMIN_CATE_QUERY, data)
        if (this.vmResponseHandler(res)) {
          this.tableData = res.data.data
          this.totalAll = res.data.total
          this.res = res.data.res
          this.status = res.data.status
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
/** 定制 start */
.el-dialog__wrapper /deep/ .el-dialog{
  width: 54.17rem;
}
.content-container /deep/ .el-date-editor,.content-container /deep/ .el-select {
  border: none;
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
