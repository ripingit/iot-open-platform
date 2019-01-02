<template>
  <div class="content-container">
    <el-row>
      <el-col :span="24">
          <p class="title-cn">用户管理</p>
          <p class="title-en">THE USER MANAGEMENT</p>
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
              <el-button class="btn-search" type="primary" @click="getUsersLists(1)">查询</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-table
                v-loading="loading"
                :data="tableData.data"
                style="width: 100%">
                <el-table-column
                  type="index"
                  label="编号"
                  width="80">
                </el-table-column>
                <el-table-column
                  prop="user_name"
                  label="用户"
                  width="200">
                </el-table-column>
                <el-table-column
                  prop="create_time"
                  label="注册时间">
                </el-table-column>
                <el-table-column
                  prop="site_name"
                  label="地区">
                </el-table-column>
                <el-table-column
                  prop="login_device"
                  label="设备">
                </el-table-column>
                <el-table-column
                  prop="login_os"
                  label="操作系统">
                </el-table-column>
                <el-table-column
                  prop="last_time"
                  label="最后一次登录">
                </el-table-column>
                <el-table-column
                  prop="company_name"
                  label="所属公司"
                  width="300">
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button
                      class="btn-circle"
                      size="mini"
                      icon="iconfont icon-gengduo"
                      circle
                      @click="showListDialog(scope.$index, scope.row)"></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-pagination
                v-if="tableData.data.length !== 0"
                @size-change="getUsersLists"
                @current-change="getUsersLists"
                :page-size="20"
                layout="prev, pager, next, jumper"
                :total="tableData.total">
              </el-pagination>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>

    <el-dialog title="用户增值服务" :visible.sync="isDialogVisibleList" center>
      <el-table
        :data="ValueAddedServices"
        :span-method="spanMethod"
        style="width: 100%">
        <el-table-column
          prop="product_name"
          label="设备"
          width="300">
        </el-table-column>
        <el-table-column
          prop="add_service"
          label="服务">
        </el-table-column>
        <el-table-column
          prop="open_cycle"
          label="开通周期">
        </el-table-column>
        <el-table-column
          prop="end_of_time"
          label="到期时间">
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import '@/assets/css/content.css'
import { ADMIN_USERS_GET } from '@/lib/api'
import { validatePhone, validateEmail } from '@/lib/validate.js'
import _ from 'lodash'

// 定义在data中会出现死循环
let rowspanRange = ''

export default {
  data () {
    return {
      loading: false,
      isDialogVisibleList: false,
      searchDate: null,
      searchKeyWord: '',
      tableData: {
        data: [],
        page: '1',
        pageAll: 1,
        total: 1
      },
      ValueAddedServices: []
    }
  },
  created () {
    this.getUsersLists(1)
    document.body.addEventListener('keydown', this.keyCodeDown, false)
  },
  beforeDestroy () {
    document.body.removeEventListener('keydown', this.keyCodeDown, false)
  },
  methods: {
    keyCodeDown (e) {
      if (e.keyCode === 13) {
        this.getUsersLists(1)
      }
    },
    spanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        let data = this.ValueAddedServices.filter(o => o.product_name === row.product_name)
        if (rowspanRange === row.product_name) {
          return {
            rowspan: 0,
            colspan: 0
          }
        } else {
          rowspanRange = row.product_name
          return {
            rowspan: data.length,
            colspan: 1
          }
        }
      }
    },
    showListDialog (index, row) {
      this.isDialogVisibleList = true
      this.ValueAddedServices = row.userServiceInfo
    },
    getUsersLists: _.debounce(function (currentPage) {
      let data = this.createFormData({
        page: currentPage,
        page_size: 20,
        query_by_name: this.searchKeyWord,
        start_time: this.searchDate ? this.searchDate[0] : '',
        end_time: this.searchDate ? this.searchDate[1] : ''
      })
      this.loading = true
      this.$http.post(ADMIN_USERS_GET, data).then(res => {
        if (this.vmResponseHandler(res)) {
          this.tableData = res.data
          // 下列代码待封装
          this.tableData.data.map(value => {
            let account = value.user_name
            if (validateEmail(account)) {
              let start = account.slice(0, 3)
              let index = account.indexOf('@')
              let end = account.slice(index)
              let length = account.slice(3, index).length
              value.user_name = start + ('*'.repeat(length)) + end
            } else if (account.indexOf('-') !== -1) {
              account = account.split('-')
              let start = account[1].slice(0, 3)
              let end = account[1].slice(8)
              value.user_name = account[0] + '-' + start + '****' + end
            } else if (validatePhone(account)) {
              let start = account.slice(0, 3)
              let end = account.slice(8)
              value.user_name = start + '****' + end
            } else {
              let start = account.slice(0, 3)
              value.user_name = start + '****'
            }
          })
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
</style>
