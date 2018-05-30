<template>
  <div class="content-container">
    <el-row>
      <el-col :span="24">
          <p class="title-cn">审核管理-固件</p>
          <p class="title-en">AUDIT MANAGEMENT</p>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <div class="table">
          <el-row>
            <el-col :span="24">
              <el-date-picker
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
              <el-button class="btn-search" type="primary">查询</el-button>
              <el-button v-if="vmHasAuth(PermissionsLib.DEL_AUDIT_FIRMWARE, tableData.res)" class="btn-circle-delete" type="danger" icon="el-icon-delete" circle @click="deleteAudit"></el-button>
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
                  label="编号"
                  width="80">
                </el-table-column>
                <el-table-column
                  prop="product_code"
                  label="型号"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="rom_ver"
                  label="固件版本">
                </el-table-column>
                <el-table-column
                  prop="company_name"
                  label="归属公司">
                </el-table-column>
                <el-table-column
                  prop="upgrade_time"
                  label="提交时间">
                </el-table-column>
                <el-table-column
                  prop="is_review"
                  label="状态">
                  <template slot-scope="scope">
                    <span :class="scope.row.is_review === 9 ? 'wait'
                    : scope.row.is_review === 1 ? 'pass'
                    : scope.row.is_review === 2 ? 'reject' : ''">
                    {{scope.row.is_review === 9 ? '待审核'
                    : scope.row.is_review === 1 ? '已通过'
                    : scope.row.is_review === 2 ? '已驳回' : ''}}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="review_mark"
                  label="备注">
                </el-table-column>
                <el-table-column
                  prop="review_name"
                  label="审核人">
                </el-table-column>
                <el-table-column
                  prop="review_time"
                  label="审核时间">
                </el-table-column>
                <el-table-column label="操作" v-if="vmHasAuth(PermissionsLib.REVIEW_AUDIT_FIRMWARE, tableData.res)">
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

    <el-dialog title="固件更新" :visible.sync="isDetailDialogVisible" center>
      <el-row class="label-row">
        <el-col :span="2" :sm="3" class="label-name">提交公司</el-col>
        <el-col :span="22" :sm="21" class="label-value">
          {{reviewData.company_name}}
        </el-col>
      </el-row>
      <el-row class="label-row">
        <el-col :span="2" :sm="3" class="label-name">型号</el-col>
        <el-col :span="22" :sm="21" class="label-value">
          {{reviewData.product_code}}
        </el-col>
      </el-row>
      <el-row class="label-row">
        <el-col :span="2" :sm="3" class="label-name">提交版本</el-col>
        <el-col :span="22" :sm="21" class="label-value">
          {{reviewData.rom_ver}}
        </el-col>
      </el-row>
      <el-row class="label-row">
        <el-col :span="2" :sm="3" class="label-name">固件</el-col>
        <el-col :span="22" :sm="21" class="label-value">
          <a :href="reviewData.file_id" target="_blank" class="download">下载</a>
        </el-col>
      </el-row>
      <el-row class="label-row">
        <el-col :span="2" :sm="3" class="label-name">更新说明</el-col>
        <el-col :span="22" :sm="21" class="label-value">
          {{reviewData.change_log}}
        </el-col>
      </el-row>
      <el-row class="label-sug">
        <el-col :span="24">
        <el-input
            type="textarea"
            :rows="4"
            placeholder="请说明"
            v-model="reviewData.review_mark">
          </el-input>
        </el-col>
      </el-row>
      <el-row class="label-sug">
        <el-col :span="11">
          <el-button class="btn-reject" type="danger" @click="reviewAudit(2)">驳回</el-button>
        </el-col>
        <el-col :span="2">&nbsp;</el-col>
        <el-col :span="11">
          <el-button class="btn-pass" type="success" @click="reviewAudit(1)">通过</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import '@/assets/css/content.css'
import { GET_ADMIN_AUDIT_FIRMWARES_POST, REVIEW_ADMIN_AUDIT_FIRMWARE_POST, DELETE_ADMIN_AUDIT_FIRMWARE_POST } from '@/lib/api'

export default {
  data () {
    return {
      form: {
        name: '',
        region: '区域一'
      },
      isDetailDialogVisible: false,
      options: [],
      value1: '',
      tableData: {
        data: [],
        page: '1',
        pageAll: 1,
        total: 1
      },
      reviewData: {
        company_name: '',
        product_code: '',
        rom_ver: '',
        file_id: '',
        change_log: '',
        review_mark: ''
      },
      selectedData: []
    }
  },
  created () {
    this.getAuditList(1)
  },
  computed: {
    loading () {
      return this.tableData.data.length === 0 && this.tableData.status !== undefined
    }
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
      this.reviewData.change_log = row.change_log
      this.reviewData.review_mark = ''
      this.isDetailDialogVisible = true
    },
    getAuditList (currentPage) {
      let data = this.createFormData({
        page: currentPage,
        page_size: 10
      })
      this.$http.post(GET_ADMIN_AUDIT_FIRMWARES_POST, data).then(res => {
        if (this.vmResponseHandler(res)) {
          this.tableData = res.data
        }
      }).catch(e => {
        this.vmMsgError('网络错误！')
      })
    },
    deleteAudit () {
      if (this.selectedData.length <= 0) {
        this.vmMsgError('请选择需要删除的固件！'); return
      }
      let data = this.createFormData({
        product_code: this.selectedData[0].product_code,
        rom_ver: this.selectedData[0].rom_ver
      })
      this.vmConfirm({
        msg: '确认要删除选中记录吗？',
        confirmCallback: () => {
          this.$http.post(DELETE_ADMIN_AUDIT_FIRMWARE_POST, data).then(res => {
            if (this.vmResponseHandler(res)) {
              this.getAuditList(this.tableData.page)
              this.vmMsgSuccess('删除成功！')
            }
          }).catch(e => {
            this.vmMsgError('网络错误！')
          })
        }
      })
    },
    reviewAudit (review) {
      // review: 1通过 2未通过
      let data = this.createFormData({
        product_code: this.reviewData.product_code,
        is_review: review,
        review_mark: this.reviewData.review_mark || '无',
        rom_ver: this.reviewData.rom_ver
      })
      this.vmConfirm({
        msg: review === 1 ? '确认通过该固件的审核？' : '确认驳回该固件的审核？',
        confirmCallback: () => {
          this.$http.post(REVIEW_ADMIN_AUDIT_FIRMWARE_POST, data).then(res => {
            if (this.vmResponseHandler(res)) {
              this.getAuditList(this.tableData.page)
              this.isDetailDialogVisible = false
              this.vmMsgSuccess('提交成功！')
            }
          }).catch(e => {
            this.vmMsgError('网络错误！')
          })
        }
      })
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
