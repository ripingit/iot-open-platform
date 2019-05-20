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
              <el-button class="btn-search" type="primary" @click="getCoopLists()">查询</el-button>
              <el-button v-if="vmHasAuth(AdminPermissionsLib.DEL_COOP, tableData.res)" class="btn-circle-delete btn-circle-right" type="danger" icon="el-icon-delete" circle @click="deleteCoop"></el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <TableComponent :options="tableOptions" :data="tableData.data" v-on:page-change="getCoopLists" v-on:selection="handleSelectionChange">
                <el-table-column
                  label="key"
                  width="120" slot="handler">
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
              </TableComponent>
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
import "@/assets/css/content.css"
import { GET_COOP_COMPANY_POST, DELETE_COOP_COMPANY_POST, GET_COOP_COMPANYKEY_POST } from "@/lib/api"
import _ from "lodash"
import TableComponent from "@/components/table/table.vue"
export default {
  components: { TableComponent },
  data () {
    return {
      loading      : false,
      loadingKey   : false,
      searchDate   : null,
      searchKeyWord: "",
      tableData    : {
        data   : [],
        res    : [],
        page   : "1",
        pageAll: 1,
        total  : 1
      },
      selectedData: [],
      keyVisible  : false,
      keyData     : []
    }
  },
  computed: {
    tableOptions () {
      return {
        loading     : true,
        hasSelection: true,
        hasNumber   : true,
        pageOptions : {
          pageSize   : 10,
          total      : this.tableData.total,
          currentPage: 1
        },
        columns: [
          {
            label: "公司名称",
            prop : "name",
            width: "100"
          },
          {
            prop : "tel",
            label: "联系方式",
            width: "180"
          },
          {
            prop  : "addr",
            label : "地址",
            render: value => value === 1 ? '成功' : '失败'
          },
          {
            prop : "create_time",
            label: "注册时间",
            width: "180"
          }
        ]
      }
    }
  },
  created () {
    this.getCoopLists()
    document.body.addEventListener("keydown", this.keyCodeDown, false)
  },
  beforeDestroy () {
    document.body.removeEventListener("keydown", this.keyCodeDown, false)
  },
  methods: {
    keyCodeDown (e) {
      if (e.keyCode === this.ENTER_KEY_CODE) {
        this.getCoopLists()
      }
    },
    handleSelectionChange (val) {
      this.selectedData = val
    },
    getCoopLists: _.debounce(function () {
      const data = this.createFormData({
        page         : parseInt(this.tableOptions.pageOptions.currentPage),
        page_size    : 20,
        query_by_name: this.searchKeyWord,
        start_time   : this.searchDate ? this.searchDate[0] : "",
        end_time     : this.searchDate ? this.searchDate[1] : ""
      })
      this.tableOptions.loading = true
      this.$http.post(GET_COOP_COMPANY_POST, data).then(res => {
        if (this.vmResponseHandler(res)) {
          this.tableData = res.data
        }
        this.tableOptions.loading = false
      })
        ["catch"](e => {
          this.tableOptions.loading = false
          this.vmMsgError("程序错误！")
        })
    }, this.DEBOUNCE_TIME),
    deleteCoop () {
      if (this.selectedData.length <= 0) {
        this.vmMsgError("请选择需要删除的合作商！"); return
      }
      const data = this.createFormData({ company_code: this.selectedData[0].company_code })
      this.vmConfirm({
        msg            : "确认要删除选中记录吗？",
        confirmCallback: () => {
          const wait = this.vmLoadingFull()
          this.$http.post(DELETE_COOP_COMPANY_POST, data).then(res => {
            if (this.vmResponseHandler(res)) {
              this.getCoopLists(this.tableOptions.pageOptions.currentPage)
              this.vmMsgSuccess("删除成功！")
            }
            wait.close()
          })
            ["catch"](e => {
              wait.close()
              this.vmMsgError("程序错误！")
            })
        }
      })
    },
    showKeyDialog (id) {
      this.keyVisible = true
      this.getKeyLists(id)
    },
    getKeyLists: _.debounce(function (id) {
      const data = this.createFormData({ client_id: id })
      this.loadingKey = true
      this.keyData = []
      this.$http.post(GET_COOP_COMPANYKEY_POST, data).then(res => {
        if (this.vmResponseHandler(res)) {
          this.keyData = res.data.data
        }
        this.loadingKey = false
      })
        ["catch"](e => {
          this.loadingKey = false
          this.vmMsgError("程序错误！")
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
