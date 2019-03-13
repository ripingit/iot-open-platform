<template>
  <div class="content-container">
    <el-row>
      <el-col :span="24">
          <p class="title-cn">合作</p>
          <p class="title-en">COOPERATION</p>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="table">
          <el-row>
            <el-col :span="24">
              <el-date-picker
                v-model="searchDate"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
              <el-input
                placeholder="请输入查询关键字"
                v-model="searchKeyWord"
                clearable>
              </el-input>
              <el-button class="btn-search" type="primary" @click="getCoopLists(1)">查询</el-button>
              <el-button v-if="vmHasAuth(AdminPermissionsLib.DEL_COOP, tableData.res)" class="btn-circle-delete btn-circle-right" type="danger" icon="el-icon-delete" circle @click="deleteCoop"></el-button>
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
                  prop="name"
                  label="公司名称"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="en_name"
                  label="公司英文名称"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="tel"
                  label="联系方式"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="file_ids"
                  label="营业执照"
                  width="100">
                  <template slot-scope="scope">
                    <ScaleImgComponent :path="scope.row.file_ids" style="width:5rem;height:5rem" alt="营业执照"></ScaleImgComponent>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="addr"
                  label="地址">
                </el-table-column>
                <el-table-column
                  prop="create_time"
                  label="注册时间"
                  width="180">
                </el-table-column>
                <el-table-column
                  label="key"
                  width="120">
                  <template slot-scope="scope">
                    <el-button
                      class="btn-circle"
                      size="mini"
                      icon="iconfont icon-gengduo"
                      circle
                      v-if="vmHasAuth(AdminPermissionsLib.PERMISSION_COOP, tableData.res)"
                      @click="showKeyDialog(scope.row.client_id)"></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-pagination
                v-if="tableData.data.length !== 0"
                @size-change="getCoopLists"
                @current-change="getCoopLists"
                :page-size="10"
                layout="prev, pager, next, jumper"
                :total="tableData.total">
              </el-pagination>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="合作key" :visible.sync="keyVisible" center>
      <el-table
        v-loading="loadingKey"
        :data="keyData"
        max-height="300"
        style="width: 100%">
        <el-table-column
          prop="client_id"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="client_secret"
          label="key">
        </el-table-column>
        <el-table-column
          prop="app_name"
          label="绑定APP">
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="创建时间">
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import '@/assets/css/content.css'
import { GET_COOP_COMPANY_POST, DELETE_COOP_COMPANY_POST, GET_COOP_COMPANYKEY_POST } from '@/lib/api'
import ScaleImgComponent from '@/components/_ui/scale-img.vue'
import _ from 'lodash'
export default {
  components: { ScaleImgComponent },
  data () {
    return {
      loading: false,
      loadingKey: false,
      searchDate: null,
      searchKeyWord: '',
      tableData: {
        data: [],
        res: [],
        page: '1',
        pageAll: 1,
        total: 1
      },
      selectedData: [],
      keyVisible: false,
      keyData: []
    }
  },
  created () {
    this.getCoopLists(1)
    document.body.addEventListener('keydown', this.keyCodeDown, false)
  },
  beforeDestroy () {
    document.body.removeEventListener('keydown', this.keyCodeDown, false)
  },
  methods: {
    keyCodeDown (e) {
      if (e.keyCode === 13) {
        this.getCoopLists(1)
      }
    },
    handleSelectionChange (val) {
      this.selectedData = val
    },
    getCoopLists: _.debounce(function (currentPage) {
      let data = this.createFormData({
        page: currentPage,
        page_size: 20,
        query_by_name: this.searchKeyWord,
        start_time: this.searchDate ? this.searchDate[0] : '',
        end_time: this.searchDate ? this.searchDate[1] : ''
      })
      this.loading = true
      this.$http.post(GET_COOP_COMPANY_POST, data).then(res => {
        if (this.vmResponseHandler(res)) {
          this.tableData = res.data
        }
        this.loading = false
      }).catch(e => {
        this.loading = false
        this.vmMsgError('程序错误！')
      })
    }, 300),
    deleteCoop () {
      if (this.selectedData.length <= 0) {
        this.vmMsgError('请选择需要删除的合作商！'); return
      }
      let data = this.createFormData({
        company_code: this.selectedData[0].company_code
      })
      this.vmConfirm({
        msg: '确认要删除选中记录吗？',
        confirmCallback: () => {
          let wait = this.vmLoadingFull()
          this.$http.post(DELETE_COOP_COMPANY_POST, data).then(res => {
            if (this.vmResponseHandler(res)) {
              this.getCoopLists(this.tableData.page)
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
    showKeyDialog (id) {
      this.keyVisible = true
      this.getKeyLists(id)
    },
    getKeyLists: _.debounce(function (id) {
      let data = this.createFormData({
        client_id: id
      })
      this.loadingKey = true
      this.keyData = []
      this.$http.post(GET_COOP_COMPANYKEY_POST, data).then(res => {
        if (this.vmResponseHandler(res)) {
          this.keyData = res.data.data
        }
        this.loadingKey = false
      }).catch(e => {
        this.loadingKey = false
        this.vmMsgError('程序错误！')
      })
    })
  }
}
</script>
<style scoped>
  .el-dialog__wrapper /deep/ .el-dialog{
    width: 51rem;
  }
</style>
