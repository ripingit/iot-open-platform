<template>
  <div class="content-container">
    <el-row>
      <el-col :span="24">
          <p class="title-cn">审核管理-公司</p>
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
              <el-select v-model="value1" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-button class="btn-search" type="primary" @click="search">查询</el-button>
              <el-button v-if="vmHasAuth(PermissionsLib.DEL_AUDIT_COMPANY, tableData.res)" class="btn-circle-delete" type="danger" icon="el-icon-delete" circle @click="deleteAudit"></el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <my-table
                :data="tableData.data"
                :options="colConfigs">
                <!-- slot="del" 不能省略，需要与下面配置项中的对应 -->
                <el-table-column slot="review" v-if="vmHasAuth(PermissionsLib.REVIEW_AUDIT_COMPANY, tableData.res)">
                  <el-button
                      class="btn-circle"
                      size="mini"
                      icon="iconfont icon-gengduo"
                      circle
                      slot-scope="{ row }"
                      @click="showDetailDialog(0, row)"></el-button>
                </el-table-column>
              </my-table>

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
                  prop="name"
                  label="公司名称"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="create_time"
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
                  label="说明"
                  :formatter="dataFormatter">
                </el-table-column>
                <el-table-column
                  prop="review_name"
                  label="审核人"
                  :formatter="dataFormatter">
                </el-table-column>
                <el-table-column
                  prop="review_time"
                  label="审核时间"
                  :formatter="dataFormatter">
                </el-table-column>
                <el-table-column label="操作" v-if="vmHasAuth(PermissionsLib.REVIEW_AUDIT_COMPANY, tableData.res)">
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

    <el-dialog title="资质审核" :visible.sync="isDetailDialogVisible" center>
      <el-row class="label-row">
        <el-col :span="2" :sm="3" class="label-name">公司名称</el-col>
        <el-col :span="22" :sm="21" class="label-value">
          {{ reviewData.name }}
        </el-col>
      </el-row>
      <el-row class="label-row">
        <el-col :span="2" :sm="3" class="label-name">证件号</el-col>
        <el-col :span="22" :sm="21" class="label-value">
          {{ reviewData.agencyCode }}
        </el-col>
      </el-row>
      <el-row class="label-row">
        <el-col :span="2" :sm="3" class="label-name">通讯地址</el-col>
        <el-col :span="22" :sm="21" class="label-value">
          {{ reviewData.addr }}
        </el-col>
      </el-row>
      <el-row class="label-row">
        <el-col :span="2" :sm="3" class="label-name">联系电话</el-col>
        <el-col :span="22" :sm="21" class="label-value">
          {{ reviewData.tel }}
        </el-col>
      </el-row>
      <el-row class="label-row">
        <el-col :span="2" :sm="3" class="label-name">营业执照</el-col>
        <el-col :span="22" :sm="21" class="label-value">
          <ScaleImgComponent :path="reviewData.filePath" class="cert" alt="营业执照"></ScaleImgComponent>
        </el-col>
      </el-row>
      <el-row class="label-row">
        <el-col :span="24">
        <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入驳回理由"
            v-model="reviewData.reviewMark">
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
import ScaleImgComponent from '@/components/_ui/scale-img.vue'
import MyTable from '@/components/_ui/table.vue'
import { GET_AUDIT_COMPANY_POST, DELETE_AUDIT_COMPANY_POST, REVIEW_AUDIT_COMPANY_POST } from '@/lib/api'

// 审核状态
var reviewStatuComponent = {
  // template: `<span :class="row.is_review === ${authCode.WAIT} ? 'wait'
  //                   : row.is_review === ${authCode.PASS} ? 'pass'
  //                   : row.is_review === ${authCode.REJECT} ? 'reject' : ''">
  //                   {{row.is_review === ${authCode.WAIT} ? '待审核'
  //                   : row.is_review === ${authCode.PASS} ? '已通过'
  //                   : row.is_review === ${authCode.REJECT} ? '已驳回' : ''}}
  //                   </span>`,
  template: `<el-table-column v-bind="config">
              <template slot-scope="{ row }">
                <span :class="row.is_review === 9 ? 'wait'
                    : row.is_review === 1 ? 'pass'
                    : row.is_review === 2 ? 'reject' : ''">
                    {{row.is_review === 9? '待审核'
                    : row.is_review === 1 ? '已通过'
                    : row.is_review === 2 ? '已驳回' : ''}}
                </span>
              </template>
            </el-table-column>`,
  props: ['config']
}

export default {
  components: { ScaleImgComponent, MyTable },
  data () {
    this.colConfigs = {
      columns: [
        { prop: 'name', label: '公司名称' },
        { prop: 'create_time', label: '提交时间' },
        { prop: 'is_review', label: '状态', component: reviewStatuComponent },
        { prop: 'review_mark', label: '说明' },
        { prop: 'review_name', label: '审核人' },
        { prop: 'review_time', label: '审核时间' }
      ], // 通用列数据
      hasNumber: true, // 是否有序号列
      hasSelection: true, // 是否有选择列
      slot: { // 操作占位
        del: 'del',
        edit: 'review'
      }
    }
    return {
      reviewData: {
        name: '',
        addr: '',
        agencyCode: '',
        tel: '',
        filePath: '',
        reviewMark: '',
        companyCode: ''
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
    dataFormatter (row, column, cellValue, index) {
      return row.is_review === this.authCode.WAIT ? '' : cellValue
    },
    search () {
    },
    showDetailDialog (index, row) {
      this.reviewData.reviewMark = ''
      this.reviewData.name = row.name
      this.reviewData.addr = row.addr
      this.reviewData.agencyCode = row.agency_code
      this.reviewData.tel = row.tel
      this.reviewData.filePath = row.file_ids
      this.reviewData.companyCode = row.company_code
      this.isDetailDialogVisible = true
    },
    getAuditList (currentPage) {
      let data = this.createFormData({
        page: currentPage,
        page_size: 10
      })
      this.$http.post(GET_AUDIT_COMPANY_POST, data).then(res => {
        if (this.vmResponseHandler(res)) {
          this.tableData = res.data
        }
      }).catch(e => {
        this.vmMsgError('网络错误！')
      })
    },
    deleteAudit () {
      if (this.selectedData.length <= 0) {
        this.vmMsgError('请选择需要删除的公司！'); return
      }
      let data = this.createFormData({
        company_code: this.selectedData[0].company_code
      })
      this.vmConfirm({
        msg: '确认要删除选中记录吗？',
        confirmCallback: () => {
          this.$http.post(DELETE_AUDIT_COMPANY_POST, data).then(res => {
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
        company_code: this.reviewData.companyCode,
        is_review: review,
        review_mark: this.reviewData.reviewMark || '无'
      })
      this.vmConfirm({
        msg: review === 1 ? '确认通过该公司的认证？' : '确认驳回该公司的认证？',
        confirmCallback: () => {
          this.$http.post(REVIEW_AUDIT_COMPANY_POST, data).then(res => {
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
.cert {
  width: 12rem;
  height: 8.33rem;
}

/** 定制 end */
</style>
