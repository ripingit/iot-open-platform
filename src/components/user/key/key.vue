<template>
  <div class="content-container">
    <el-row>
      <el-col :span="24">
          <p class="title-cn">KEY 管理</p>
          <p class="title-en">THE KEY MANAGEMENT</p>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <div class="table">
          <el-row>
            <el-col :span="5">
              <el-button @click="generateKey" class="btn-circle-delete" type="primary" icon="iconfont icon-tianjia" circle></el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-table
                v-loading="loading"
                :data="tableData"
                style="width: 100%">
                <el-table-column
                  type="index"
                  label="编号"
                  width="80">
                </el-table-column>
                <el-table-column
                  prop="client_id"
                  label="ID">
                </el-table-column>
                <el-table-column
                  prop="client_secret"
                  label="KEY">
                </el-table-column>
                <el-table-column
                  prop="create_time"
                  width="150"
                  label="生成时间">
                </el-table-column>
                <el-table-column
                  prop="app_name"
                  width="150"
                  label="绑定App">
                </el-table-column>
                <!--<el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button
                      class="btn-circle"
                      size="mini"
                      icon="iconfont icon-shanchu"
                      circle
                      @click="deleteKey(scope.row)"></el-button>
                  </template>
                </el-table-column>-->
              </el-table>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import '@/assets/css/content.css'
import { GET_KEY_ID_POST, GENERATE_KEY_ID_POST } from '@/lib/api'
import _ from 'lodash'

export default {
  data () {
    return {
      loading: false,
      tableData: []
    }
  },
  created () {
    this.getKeyLists()
  },
  methods: {
    // deleteKey: _.debounce(function (row) {
    //   if (row.app_name) { this.vmMsgError('已绑定App，不能删除！'); return }
    //   this.vmConfirm({
    //     msg: '确定删除该记录？',
    //     confirmCallback: () => {
    //       let data = this.createFormData({
    //         client_id: row.client_id
    //       })
    //       let loading = this.vmLoadingFull()
    //       this.$http.post(COOP_DELETE_KEY_POST, data).then(res => {
    //         loading.close()
    //         if (this.vmResponseHandler(res)) {
    //           this.vmMsgSuccess('删除成功！')
    //           this.loadData()
    //         }
    //       }).catch(e => {
    //         loading.close()
    //         this.vmMsgError('网络错误！')
    //       })
    //     }
    //   })
    // }, 300),
    getKeyLists: _.debounce(function () {
      this.loading = true
      this.$http.post(GET_KEY_ID_POST).then(res => {
        if (this.vmResponseHandler(res)) {
          this.tableData = res.data.data
        }
        this.loading = false
      }).catch(e => {
        this.loading = false
        this.vmMsgError('网络错误！')
      })
    }, 300),

    generateKey: _.debounce(function () {
      let loading = this.vmLoadingFull()
      this.$http.post(GENERATE_KEY_ID_POST).then(res => {
        if (this.vmResponseHandler(res)) {
          this.getKeyLists()
        }
        loading.close()
      }).catch(e => {
        loading.close()
        this.vmMsgError('网络错误！')
      })
    })
  }
}
</script>
