<template>
  <div class="content-container">
    <el-row>
      <el-col :span="24">
          <p class="title-cn">固件管理</p>
          <p class="title-en">THE FRIMWARE MANAGEMENT</p>
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
                  prop="product_code"
                  label="型号"
                  width="120">
                </el-table-column>
                <el-table-column
                  prop="rom_ver"
                  label="固件版本">
                </el-table-column>
                <el-table-column
                  prop="upgrade_time"
                  label="更新时间">
                </el-table-column>
                <el-table-column
                  prop="company_name"
                  label="提交公司">
                </el-table-column>
                <el-table-column
                  prop="file_id"
                  label="下载">
                  <template slot-scope="scope">
                    <a :href="scope.row.file_id" target="_blank" class="download">下载</a>
                  </template>
                </el-table-column>
                <el-table-column label="操作" v-if="vmHasAuth(PermissionsLib.FIRMWARE_HISTORY, tableData.res)">
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
                @size-change="getFirmwareLists"
                @current-change="getFirmwareLists"
                :page-size="10"
                layout="prev, pager, next, jumper"
                :total="tableData.total">
              </el-pagination>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>

    <el-dialog title="固件升级记录" :visible.sync="isDialogVisibleList" center>
      <TimeLineComponent :data="historyRecord" :loading="isGetHistory"></TimeLineComponent>
    </el-dialog>
  </div>
</template>

<script>
import '@/assets/css/content.css'
import TimeLineComponent from '../../_ui/time-line.vue'
import { GET_ADMIN_FIRMWARES_POST, GET_ADMIN_FIRMWARE_HISTORY_POST } from '@/lib/api'

export default {
  components: { TimeLineComponent },
  data () {
    return {
      isDialogVisibleList: false,
      options: [],
      isGetHistory: false,
      historyRecord: [],
      value6: '',
      tableData: {
        data: [],
        page: '1',
        res: [],
        pageAll: 1,
        product: [],
        total: 1
      }
    }
  },
  created () {
    this.getFirmwareLists(1)
  },
  computed: {
    loading () {
      return this.tableData.data.length === 0 && this.tableData.status !== undefined
    }
  },
  methods: {
    showListDialog (index, row) {
      this.isDialogVisibleList = true
      this.isGetHistory = true
      let data = this.createFormData({
        product_code: row.product_code
      })
      this.$http.post(GET_ADMIN_FIRMWARE_HISTORY_POST, data).then(res => {
        this.isGetHistory = false
        if (this.vmResponseHandler(res)) {
          this.historyRecord = res.data.data
        }
      }).catch(() => {
        this.isGetHistory = false
        this.vmMsgError('网络错误！')
      })
    },
    getFirmwareLists (currentPage) {
      let data = this.createFormData({
        page: currentPage,
        page_size: 10
      })
      this.$http.post(GET_ADMIN_FIRMWARES_POST, data).then(res => {
        if (this.vmResponseHandler(res)) {
          this.tableData = res.data
        }
      }).catch(e => {
        this.vmMsgError('网络错误！')
      })
    }
  }
}
</script>
<style scoped>
.download {
  font-size: 1.17rem;
  color: #2acba7;
}
.content-container /deep/ .el-dialog {
  width: 54rem;
}
</style>
