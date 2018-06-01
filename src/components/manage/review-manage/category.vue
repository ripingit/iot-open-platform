<template>
  <div class="content-container">
    <el-row>
      <el-col :span="24">
          <p class="title-cn">审核管理-类别</p>
          <p class="title-en">AUDIT MANAGEMENT</p>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <div class="table">
          <el-row>
            <el-col :span="24">
              <el-date-picker
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
              <el-button class="btn-search" type="primary" @click="searchData">查询</el-button>
              <el-button
                v-if="vmHasAuth(PermissionsLib.DEL_AUDIT_CATEGORY, res)"
                @click="operationData('delete')"
                class="btn-circle-delete" type="danger" icon="el-icon-delete" circle></el-button>
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
                  label="编号"
                  min-width="100">
                </el-table-column>
                <el-table-column
                  prop="prodt_name"
                  label="类别名称">
                </el-table-column>
                <el-table-column
                  prop="user_name"
                  label="提交用户">
                </el-table-column>
                <el-table-column
                  prop="create_time"
                  label="提交时间">
                </el-table-column>
                <el-table-column
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
                  prop="review_uid"
                  label="审核人">
                </el-table-column>
                <el-table-column
                  prop="review_time"
                  label="审核时间">
                </el-table-column>
                <el-table-column
                  min-width="120"
                  label="操作">
                  <template slot-scope="scope">
                    <el-button
                      class="btn-circle"
                      size="mini"
                      icon="iconfont icon-gengduo"
                      circle
                      v-if="vmHasAuth(PermissionsLib.REVIEW_AUDIT_CATEGORY, res)"
                      @click="operationData('select',scope.$index)"></el-button>
                    <!--<el-button
                      class="btn-circle"
                      size="mini"
                      icon="iconfont icon-shanchu"
                      circle
                      v-if="vmHasAuth(PermissionsLib.DEL_AUDIT_CATEGORY, res)"
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
    <el-dialog title="类别详情" :visible.sync="isDetailDialogVisible" center>
      <el-row class="label-row">
        <el-col :span="2" :sm="3" class="label-name">类别名称</el-col>
        <el-col :span="22" :sm="21" class="label-value">
          {{detailData.prodt_name}}
        </el-col>
      </el-row>
      <el-row class="label-row">
        <el-col :span="2" :sm="3" class="label-name">类别代码</el-col>
        <el-col :span="22" :sm="21" class="label-value">
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
            :readonly="detailData.is_review!==9"
            :rows="4"
            placeholder="请说明"
            v-model="detailData.review_mark">
          </el-input>
        </el-col>
      </el-row>
      <el-row class="label-sug" v-show="detailData.is_review===9">
        <el-col :span="11">
          <el-button class="btn-reject" type="danger" @click="reviewCategory(2)">驳回</el-button>
        </el-col>
        <el-col :span="2">&nbsp;</el-col>
        <el-col :span="11">
          <el-button class="btn-pass" type="success" @click="reviewCategory(1)">通过</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import '@/assets/css/content.css'
import { REVIEW_AUDIT_CATEGORY_SELECT, REVIEW_AUDIT_CATEGORY_DEL, REVIEW_AUDIT_CATEGORY_REVIEW } from '@/lib/api.js'

export default {
  data () {
    return {
      isDetailDialogVisible: false,
      options: [],
      value: '',
      value1: '',
      tableData: [],
      res: [],
      selectParam: {
        page: 1,
        page_size: 10
      },
      totalAll: 0,
      detailData: {},
      selectedData: []
    }
  },
  created () {
    this.loadData()
  },
  computed: {
    loading () {
      return this.tableData.length === 0 && this.tableData.status !== undefined
    }
  },
  methods: {
    handleSelectionChange (val) {
      this.selectedData = val
    },
    searchData () {
      this.loadData()
    },
    operationData (type, idx) {
      if (type === 'select') {
        this.isDetailDialogVisible = true
        this.detailData = JSON.parse(JSON.stringify(this.tableData[idx]))
      } else {
        let data = this.createFormData({
          prodt_code: JSON.stringify(this.selectedData.map(o => o.prodt_code))
        })
        this.vmConfirm({
          msg: '确定删除该记录？',
          confirmCallback: () => {
            let loading = this.vmLoadingFull()
            this.$http.post(REVIEW_AUDIT_CATEGORY_DEL, data).then(res => {
              loading.close()
              if (this.vmResponseHandler(res)) {
                this.vmMsgSuccess('删除成功！')
                this.loadData()
              }
            }).catch(e => {
              loading.close()
              this.vmMsgError('网络错误！')
            })
          }
        })
      }
    },
    reviewCategory (index) {
      let data, loading
      if (index === 2) {
        if (this.detailData.review_mark === '') {
          this.vmMsgWarning('驳回时说明为必填项！')
          return false
        }
      }
      data = this.createFormData({
        prodt_code: this.detailData.prodt_code,
        is_review: index,
        review_mark: this.detailData.review_mark
      })
      loading = this.vmLoadingFull()
      this.$http.post(REVIEW_AUDIT_CATEGORY_REVIEW, data).then(res => {
        loading.close()
        if (this.vmResponseHandler(res)) {
          this.isDetailDialogVisible = false
          this.vmMsgSuccess()
          this.loadData()
        }
      }).catch(e => {
        loading.close()
        this.vmMsgError('网络错误！')
      })
    },
    handleCurrentChange (val) {
      this.selectParam.page = val
      this.loadData()
    },
    loadData () {
      let data = this.createFormData(this.selectParam)
      this.$http.post(REVIEW_AUDIT_CATEGORY_SELECT, data).then(res => {
        if (this.vmResponseHandler(res)) {
          this.tableData = res.data.data
          this.totalAll = res.data.total
          this.res = res.data.res
        }
      }).catch(e => {
        this.vmMsgError('网络错误！')
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
