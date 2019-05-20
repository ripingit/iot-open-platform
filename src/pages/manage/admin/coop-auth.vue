<template>
  <div class="container">
    <el-row class="app_nav">
      <h5>合作权限</h5>
      <p>COOPERATION RIGHTS</p>
    </el-row>
    <el-row class="table">
      <el-row>
        <el-input v-model="selectParam.query_by_name" placeholder="请输入"></el-input>
        <el-button class="btn-search" type="primary" @click="searchData">查询</el-button>
      </el-row>
      <el-row>
        <el-table
          v-loading="loading"
          :data="tableData.data"
          style="width: 100%;">
          <el-table-column
            type="index"
            min-width="100"
            label="编号">
          </el-table-column>
          <el-table-column
            prop="name"
            min-width="150"
            label="名称">
          </el-table-column>
          <el-table-column
            prop="tel"
            min-width="240"
            label="联系电话">
          </el-table-column>
          <el-table-column
            min-width="150"
            label="身份">
            <template slot-scope="scope">
              <span v-if="scope.row.role===1">合作商</span>
              <span v-else-if="scope.row.role===2">经销商</span>
              <span v-else>经销商合作商</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="create_time"
            min-width="180"
            label="注册时间">
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
                v-if="vmHasAuth(AdminPermissionsLib.COOP_AUTH_SELECT, tableData.res)"
                @click="operationData(scope.$index)"></el-button>
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
      title="权限列表"
      center
      width="70rem"
      :visible.sync="detailDialogVisible"
      :close-on-click-modal="false"
      :before-close="handleClose">
      <el-row class="VisitPower" v-loading="loadingAuth">
        <el-col :span="24" class="VisitPower-checkbox" v-for="group in groupData" :key="group.cmd_id">
          <el-checkbox v-model="group.checked" @change="confirm(group)" :disabled="!group.edit" :label="group.label">{{group.label}}</el-checkbox>
          <div style="margin: .5rem 0;"></div>
          <el-checkbox class="el-checkbox-child" v-model="item.checked" :disabled="!item.edit" @change="confirm(item)" v-for="item in group.child" :label="item.label" :key="item.id">{{item.label}}</el-checkbox>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import "@/assets/css/content.css"
import { COOP_AUTH_USER_LIST, COOP_AUTH_USER_EDIT, COOP_USER_AUTH } from "@/lib/api.js"
import _ from "lodash"
export default {
  data () {
    return {
      loading    : false,
      loadingAuth: false,
      inputVal1  : "",
      options    : [],
      tableData  : {
        data: [],
        res : []
      },
      groupData  : [],
      selectParam: {
        page         : 1,
        page_size    : 20,
        query_by_name: ""
      },
      totalAll           : 0,
      user_id            : "",
      detailDialogVisible: false
    }
  },
  created () {
    this.loadData()
    document.body.addEventListener("keydown", this.keyCodeDown, false)
  },
  beforeDestroy () {
    document.body.removeEventListener("keydown", this.keyCodeDown, false)
  },
  methods: {
    keyCodeDown (e) {
      if (e.keyCode === this.ENTER_KEY_CODE) {
        this.searchData()
      }
    },
    searchData () {
      this.selectParam.page = 1
      this.loadData()
    },
    handleCurrentChange (val) {
      this.selectParam.page = val
      this.loadData()
    },
    operationData (ix) {
      this.detailDialogVisible = true
      this.user_id = this.tableData.data[ix].user_id
      this.getAuthList()
    },
    handleClose (done) {
      done()
    },
    async getAuthList () {
      try {
        this.loadingAuth = true
        const param = this.createFormData({ user_id: parseInt(this.user_id) })
        const res = await this.$http.post(COOP_USER_AUTH, param)
        this.loadingAuth = false
        if (this.vmResponseHandler(res)) {
          const treeData = []
          if (res.data.data && Array.isArray(res.data.data)) {
            res.data.data.forEach(val => {
              const node = {
                label       : val.method,
                id          : val.cmd_id,
                child       : [],
                checked     : val.status,
                childChecked: [],
                edit        : val.edit
              }
              if (val.child && Array.isArray(val.child)) {
                val.child.forEach(subVal => {
                  node.child.push({
                    checked: subVal.status,
                    label  : subVal.method,
                    id     : subVal.cmd_id,
                    edit   : subVal.edit
                  })
                  if (subVal.status) {
                    node.childChecked.push(subVal)
                  }
                })
              }
              treeData.push(node)
            })
          }
          this.groupData = treeData
        }
      } catch (error) {
        this.loadingAuth = false
        this.vmMsgError("程序错误！")
      }
    },
    confirm (val) {
      const loading = this.vmLoadingFull()
      try {
        const param = this.createFormData({
          user_id: this.user_id,
          cmd_id : val.id,
          checked: val.checked
        })
        this.vmConfirm({
          msg            : "确定修改此用户权限？",
          confirmCallback: async () => {
            const res = await this.$http.post(COOP_AUTH_USER_EDIT, param)
            loading.close()
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess("操作成功！")
              this.getAuthList()
            }
          },
          cancelCallback: () => {
            loading.close()
            val.checked = !val.checked
          }
        })
      } catch (error) {
        loading.close()
        this.vmMsgError("程序错误！")
      }
    },
    loadData: _.debounce(async function () {
      try {
        const data = this.createFormData(this.selectParam)
        this.loading = true
        const res = await this.$http.post(COOP_AUTH_USER_LIST, data)
        if (this.vmResponseHandler(res)) {
          this.tableData = res.data
          this.totalAll = res.data.total
        }
        this.loading = false
      } catch (error) {
        this.loading = false
        this.vmMsgError("程序错误！")
      }
    }, this.DEBOUNCE_TIME)
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
    margin-left:0;
  }
  .VisitPower{
    min-height: 20rem;
    max-height: 30rem;
    overflow-y: auto;
    color: #fff;
  }
  .tName{
    color: #ffffff;
  }
  .VisitPower-checkbox:first-child{
    margin-top: 0;
  }
  .VisitPower-checkbox{
    margin-top: 2rem;
    color: #808080;
    padding-bottom: 1rem;
    border-bottom: 1px solid #808080;
  }
  .el-checkbox-child {
    margin-left: 25px;
    margin-top: 10px;
  }
</style>
<style>
  .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{
  }
</style>
