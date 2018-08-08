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
              <el-button
                @click="generateKey"
                class="btn-circle-delete"
                type="primary"
                v-if="vmHasAuth(CoopPermissionsLib.GENERATE_KEY, tableData.res)"
                icon="iconfont icon-tianjia" circle></el-button>
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
                  prop="client_id"
                  width="300"
                  label="ID">
                </el-table-column>
                <el-table-column
                  prop="client_secret"
                  width="300"
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
                <el-table-column
                  prop="notify_url"
                  width="450"
                  label="回调地址">
                </el-table-column>
                <el-table-column label="操作" v-if="vmHasAuth(CoopPermissionsLib.ADD_NOTIFY_URL, tableData.res)">>
                  <template slot-scope="scope">
                    <el-button
                      class="btn-circle"
                      size="mini"
                      icon="iconfont icon-tianjia"
                      circle
                      @click="setNotifyUrl(scope.row)"></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>

    <el-dialog
      title="设置回调"
      :visible.sync="isToSetNotifyUrl"
      width="50rem"
      center>
      <el-form label-width="100px" status-icon :model="notifyForm" ref="notifyForm" :rules="rules">
        <el-form-item label="ID" class="form-row" prop="client_id">
          <el-input v-model="notifyForm.client_id" readonly></el-input>
        </el-form-item>
        <el-form-item label="回调URL" class="form-row" prop="notify_url">
          <el-input v-model="notifyForm.notify_url" placeholder="请输入支持post请求的URL"></el-input>
        </el-form-item>
        <el-form-item label="" style="margin-top: 4.33rem;">
          <el-button type="primary" class="btn-submit" @click="submitNotifyUrl()">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import '@/assets/css/content.css'
import { GET_KEY_ID_POST, GENERATE_KEY_ID_POST, SET_NOTIFY_URL_POST } from '@/lib/api'
import _ from 'lodash'

export default {
  data () {
    let validateIsEmpty = (rule, value, callback) => {
      if (value === '') {
        if (rule.field === 'client_id') {
          callback(new Error('请输入ID'))
        } else if (rule.field === 'notify_url') {
          callback(new Error('请输入回调URL'))
        }
      }
      callback()
    }
    return {
      loading: false,
      isToSetNotifyUrl: false,
      tableData: {
        data: [],
        res: []
      },
      notifyForm: {
        client_id: '',
        notify_url: ''
      },
      rules: {
        client_id: [
          { validator: validateIsEmpty, trigger: 'change' }
        ],
        notify_url: [
          { validator: validateIsEmpty, trigger: 'change' }
        ]
      }
    }
  },
  created () {
    this.getKeyLists()
  },
  methods: {
    setNotifyUrl (row) {
      this.notifyForm.client_id = row.client_id
      this.isToSetNotifyUrl = true
    },
    submitNotifyUrl: _.debounce(function () {
      this.$refs['notifyForm'].validate((valid) => {
        if (valid) {
          let param = this.createFormData(this.notifyForm)
          let loading = this.vmLoadingFull()
          this.$http.post(SET_NOTIFY_URL_POST, param).then(res => {
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess('设置成功')
              this.notifyForm.notify_url = ''
              this.isToSetNotifyUrl = false
              this.getKeyLists()
            }
            loading.close()
          }).catch(e => {
            loading.close()
            this.vmMsgError('网络错误！')
          })
        }
      })
    }, 300),
    getKeyLists: _.debounce(function () {
      this.loading = true
      this.$http.post(GET_KEY_ID_POST).then(res => {
        if (this.vmResponseHandler(res)) {
          this.tableData = res.data
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
