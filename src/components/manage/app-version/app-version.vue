<template>
  <div class="container">
    <el-row class="app_nav">
      <h5>APP版本</h5>
      <p>THE APP VERSION</p>
    </el-row>
    <el-row class="table">
      <el-row>
        <el-date-picker
          v-model="inputVal1"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-input v-model="selectParam.query_by_name" placeholder="请输入"></el-input>
        <el-button class="btn-search" type="primary" @click="searchData">查询</el-button>
        <el-button icon="el-icon-delete" v-if="vmHasAuth(PermissionsLib.DEL_APP, res)" type="danger" circle class="btn-circle-delete btn-circle-right" @click="operationData('delete')"></el-button>
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
            min-width="100"
            label="编号">
          </el-table-column>
          <el-table-column
            prop="app_name"
            min-width="150"
            label="APP名称">
          </el-table-column>
          <el-table-column
            prop="company_name"
            min-width="240"
            label="所属公司">
          </el-table-column>
          <el-table-column
            prop="ver"
            min-width="150"
            label="版本号">
          </el-table-column>
          <el-table-column
            prop="review_time"
            min-width="180"
            label="更新时间">
          </el-table-column>
          <el-table-column
            prop="QrcodeUrl"
            min-width="200"
            label="二维码">
            <template slot-scope="scope">
              <ScaleImgComponent :path="scope.row.QrcodeUrl" style="width:5rem;height:5rem" alt="图2"></ScaleImgComponent>
              <p class="download" style="font-size: 12px; cursor: pointer" @click="download(scope.row.QrcodeUrl)">下载二维码</p>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            label="操作"
            min-width="100">
            <template slot-scope="scope">
              <el-button
                class="btn-circle"
                size="mini"
                icon="iconfont icon-gengduo"
                circle
                @click="operationData('select',scope.$index)"></el-button>
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
      title="APP升级详情"
      center
      :visible.sync="detailDialogVisible"
      :close-on-click-modal="false"
      :before-close="handleClose">
      <el-form label-width="100px">
        <el-form-item label="APP名称">
          <span class="detail_item">{{detailData.app_name}}</span>
        </el-form-item>
        <el-form-item label="版本">
          <span class="detail_item">{{detailData.ver}}</span>
        </el-form-item>
        <el-form-item label="MD5值">
          <span class="detail_item">{{detailData.md5}}</span>
        </el-form-item>
        <el-form-item label="升级描述">
          <span class="detail_item">{{detailData.change_log}}</span>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import '@/assets/css/content.css'
import ScaleImgComponent from '@/components/_ui/scale-img.vue'
import { APP_MANAGE_SELECT_POST, APP_MANAGE_DEL_POST } from '@/lib/api.js'
import _ from 'lodash'
export default {
  components: { ScaleImgComponent },
  data () {
    return {
      loading: false,
      inputVal1: '',
      options: [],
      multipleSelection: [],
      tableData: [],
      res: [],
      selectParam: {
        page: 1,
        page_size: 20,
        query_by_name: '',
        start_time: '',
        end_time: ''
      },
      totalAll: 0,
      detailDialogVisible: false,
      rules: {
        url: [
          {required: true, message: '请输入下载地址', trigger: 'blur'}
        ],
        change_log: [
          {required: true, message: '请输入升级描述', trigger: 'blur'}
        ]
      },
      detailData: {}
    }
  },
  created () {
    this.loadData()
    document.body.addEventListener('keydown', this.keyCodeDown, false)
  },
  beforeDestroy () {
    document.body.removeEventListener('keydown', this.keyCodeDown, false)
  },
  methods: {
    keyCodeDown (e) {
      if (e.keyCode === 13) {
        this.searchData()
      }
    },
    searchData () {
      this.selectParam.page = 1
      this.selectParam.start_time = this.inputVal1 ? this.inputVal1[0] : ''
      this.selectParam.end_time = this.inputVal1 ? this.inputVal1[1] : ''
      this.loadData()
    },
    handleCurrentChange (val) {
      this.selectParam.page = val
      this.loadData()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    operationData (type, ix) {
      if (type === 'select') {
        this.detailDialogVisible = true
        this.detailData = JSON.parse(JSON.stringify(this.tableData[ix]))
      } else {
        let data
        let ary = []
        for (let obj of this.multipleSelection) {
          ary.push(obj.app_name)
        }
        data = this.createFormData({
          app_name: JSON.stringify(ary)
        })
        this.vmConfirm({
          msg: '确定删除该记录？',
          confirmCallback: () => {
            let loading = this.vmLoadingFull()
            this.$http.post(APP_MANAGE_DEL_POST, data).then(res => {
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
    handleClose (done) {
      done()
    },
    loadData: _.debounce(function () {
      let data = this.createFormData(this.selectParam)
      this.loading = true
      this.$http.post(APP_MANAGE_SELECT_POST, data).then(res => {
        if (this.vmResponseHandler(res)) {
          this.tableData = res.data.data
          this.totalAll = res.data.total
          this.res = res.data.res
        }
        this.loading = false
      }).catch(e => {
        this.loading = false
        this.vmMsgError('网络错误！')
      })
    }, 300)
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
