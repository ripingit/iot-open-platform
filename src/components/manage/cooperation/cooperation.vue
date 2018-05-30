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
                v-model="value6"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
              <el-select v-model="value6" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-button class="btn-search" type="primary">查询</el-button>
              <el-button v-if="vmHasAuth(PermissionsLib.DEL_COOP, tableData.res)" class="btn-circle-delete" type="danger" icon="el-icon-delete" circle @click="deleteCoop"></el-button>
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
                  prop="tel"
                  label="联系方式"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="client_id"
                  label="认证ID">
                </el-table-column>
                <el-table-column
                  prop="client_secret"
                  label="认证KEY">
                </el-table-column>
                <el-table-column
                  prop="create_time"
                  label="注册时间"
                  width="180">
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-pagination
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
  </div>
</template>

<script>
import '@/assets/css/content.css'
import { GET_COOP_COMPANY_POST, DELETE_COOP_COMPANY_POST } from '@/lib/api'

export default {
  data () {
    return {
      options: [],
      value6: '',
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
    this.getCoopLists(1)
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
    getCoopLists (currentPage) {
      let data = this.createFormData({
        page: currentPage,
        page_size: 10
      })
      this.$http.post(GET_COOP_COMPANY_POST, data).then(res => {
        if (this.vmResponseHandler(res)) {
          this.tableData = res.data
        }
      }).catch(e => {
        this.vmMsgError('网络错误！')
      })
    },
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
          this.$http.post(DELETE_COOP_COMPANY_POST, data).then(res => {
            if (this.vmResponseHandler(res)) {
              this.getCoopLists(this.tableData.page)
              this.vmMsgSuccess('删除成功！')
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
