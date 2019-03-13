<template>
  <div class="content-container">
    <el-row>
      <el-col :span="24">
          <p class="title-cn">审核管理-型号</p>
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
                  label="编号"
                  width="80">
                </el-table-column>
                <el-table-column
                  prop="product_name"
                  label="型号名称"
                  width="120">
                </el-table-column>
                <el-table-column
                  prop="product_code"
                  label="型号代码"
                  width="150">
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
                    <span :class="scope.row.is_review === 0 ? 'wait'
                    : scope.row.is_review === 1 ? 'pass'
                    : scope.row.is_review === 2 ? 'reject' : ''">
                    {{scope.row.is_review === 0 ? '待审核'
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
                <el-table-column label="操作"  v-if="vmHasAuth(AdminPermissionsLib.REVIEW_AUDIT_MODEL, tableData.res)">
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

    <el-dialog title="型号审核" :visible.sync="isDetailDialogVisible" center>
      <el-row class="label-row">
        <el-col :span="2" :sm="3" class="label-name">型号名称</el-col>
        <el-col :span="22" :sm="21" class="label-value">
          {{reviewData.product_name}}
        </el-col>
      </el-row>
      <el-row class="label-row">
        <el-col :span="2" :sm="3" class="label-name">型号代码</el-col>
        <el-col :span="22" :sm="21" class="label-value">
          {{reviewData.product_code}}
        </el-col>
      </el-row>
      <el-row class="label-row">
        <el-col :span="2" :sm="3" class="label-name">连接方式</el-col>
        <el-col :span="22" :sm="21" class="label-value">
          {{reviewData.nbi_code}}
        </el-col>
      </el-row>
      <el-row class="label-row">
        <el-col :span="2" :sm="3" class="label-name">设备类别</el-col>
        <el-col :span="22" :sm="21" class="label-value">
          {{reviewData.prodt_code}}
        </el-col>
      </el-row>
      <el-row class="label-row">
        <el-col :span="2" :sm="3" class="label-name">效果图</el-col>
        <el-col :span="22" :sm="21" class="label-value">
          <ScaleImgComponent v-for="(item, index) in reviewData.filePaths" :key="index" :path="item" class="cert" alt="效果图"></ScaleImgComponent>
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
import ScaleImgComponent from '@/components/_ui/scale-img.vue'
import { GET_ADMIN_AUDIT_MODEL_POST, DELETE_ADMIN_AUDIT_MODEL_POST, REVIEW_ADMIN_AUDIT_MODEL_POST } from '@/lib/api'

export default {
  components: { ScaleImgComponent },
  data () {
    return {
      loading: false,
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
        product_name: '',
        product_code: '',
        nbi_code: '',
        prodt_code: '',
        review_mark: '',
        filePaths: []
      },
      connectionMode: [],
      deviceCategory: [],
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
      let connect = row.nbi_code && row.nbi_code.reduce((accumulator, currentValue) => {
        return accumulator + this.connectionMode.find(o => o.nbi_code === currentValue).nbi_code_name + '；'
      }, '')
      let deviceCate = row.prodt_code && row.prodt_code.reduce((accumulator, currentValue) => {
        return accumulator + currentValue + '；'
      }, '')
      const tempPic = JSON.parse(row.pic1_fileid)
      this.reviewData.product_name = row.product_name
      this.reviewData.product_code = row.product_code
      this.reviewData.nbi_code = connect
      this.reviewData.prodt_code = deviceCate
      this.reviewData.review_mark = ''
      this.reviewData.filePaths = [tempPic.online, tempPic.reset, tempPic.thumb, tempPic.state]
      this.isDetailDialogVisible = true
    },
    getAuditList (currentPage) {
      let data = this.createFormData({
        page: currentPage,
        page_size: 20
      })
      this.loading = true
      this.$http.post(GET_ADMIN_AUDIT_MODEL_POST, data).then(res => {
        if (this.vmResponseHandler(res)) {
          this.tableData = res.data
          this.connectionMode = res.data.Nbi
          this.deviceCategory = res.data.prodtList
        }
        this.loading = false
      }).catch(e => {
        this.loading = false
        this.vmMsgError('程序错误！')
      })
    },
    deleteAudit () {
      if (this.selectedData.length <= 0) {
        this.vmMsgError('请选择需要删除的型号！'); return
      }
      let data = this.createFormData({
        product_code: JSON.stringify(this.selectedData.map(o => o.product_code))
      })
      this.vmConfirm({
        msg: '确认要删除选中记录吗？',
        confirmCallback: () => {
          let wait = this.vmLoadingFull()
          this.$http.post(DELETE_ADMIN_AUDIT_MODEL_POST, data).then(res => {
            if (this.vmResponseHandler(res)) {
              this.getAuditList(this.tableData.page)
              this.vmMsgSuccess('删除成功！')
            }
            wait.close()
          }).catch(e => {
            wait.close()
            this.vmMsgError('程序错误！')
          })
        }
      })
    },
    reviewAudit (review) {
      // review: 1通过 2未通过
      let data = this.createFormData({
        product_code: this.reviewData.product_code,
        is_review: review,
        review_mark: this.reviewData.review_mark || '无'
      })
      this.vmConfirm({
        msg: review === 1 ? '确认通过该设备型号的审核？' : '确认驳回该设备型号的审核？',
        confirmCallback: () => {
          let wait = this.vmLoadingFull()
          this.$http.post(REVIEW_ADMIN_AUDIT_MODEL_POST, data).then(res => {
            if (this.vmResponseHandler(res)) {
              this.getAuditList(this.tableData.page)
              this.isDetailDialogVisible = false
              this.vmMsgSuccess('提交成功！')
            }
            wait.close()
          }).catch(e => {
            wait.close()
            this.vmMsgError('程序错误！')
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
