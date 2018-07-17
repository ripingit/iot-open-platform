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
          prop="device"
          label="设备">
        </el-table-column>
        <el-table-column
          prop="name"
          label="服务">
        </el-table-column>
        <el-table-column
          prop="time"
          label="到期时间">
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import '@/assets/css/content.css'
import { ADMIN_USERS_GET } from '@/lib/api'
import _ from 'lodash'
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
      ValueAddedServices: [
        {
          device: 'KGB9982',
          name: '云存储',
          time: '2018-09-12'
        },
        {
          device: 'KGB9982',
          name: '短信',
          time: '2018-09-12'
        },
        {
          device: 'SB0082',
          name: '短信',
          time: '2018-09-12'
        }
      ]
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
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    showListDialog (index, row) {
      this.isDialogVisibleList = true
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
