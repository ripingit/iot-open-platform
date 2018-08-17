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
                @click="createKey"
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
                <el-table-column
                  prop="notify_url"
                  label="回调地址">
                  <template slot-scope="scope">
                    <a class="wait" href="javascript:void" v-if="scope.row.notify_url" @click="setNotifyUrl(scope.row)"> {{ scope.row.notify_url }} </a>
                    <a class="success" href="javascript:void" v-else @click="setNotifyUrl(scope.row)">设置回调</a>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="100" v-if="vmHasAuth(CoopPermissionsLib.ADD_NOTIFY_URL, tableData.res)">
                  <template slot-scope="scope">
                    <el-button
                      class="btn-circle"
                      size="mini"
                      icon="iconfont icon-gengduo"
                      circle
                      @click="settingMore(scope.row)"></el-button>
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
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item label="" style="margin-top: 4.33rem;">
          <el-button type="primary" class="btn-submit" @click="submitNotifyUrl()">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="创建KEY"
      :visible.sync="createKeyDialog"
      width="50rem"
      center>
      <el-form label-width="100px" status-icon label-position="right" :model="keyForm" ref="keyForm" :rules="keyFormRules">
        <el-form-item label="APP名称" class="form-row" prop="app_name">
          <el-input v-model="keyForm.app_name"></el-input>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item label="" style="margin-top: 4.33rem;">
          <el-button type="primary" class="btn-submit" @click="generateKey">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="短信设置"
      :visible.sync="isShowSmsSetting"
      width="50rem"
      center>
      <el-form label-width="120px" status-icon label-position="right" :model="smsForm" ref="smsForm" :rules="smsFormRules">
        <el-form-item label="阿里云APP-ID" class="form-row" prop="app_id">
          <el-input v-model="smsForm.app_id" placeholder="请输入app Id"></el-input>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item label="APP-Seckey" class="form-row" prop="app_seckey">
          <el-input v-model="smsForm.app_seckey" placeholder="请输入app key"></el-input>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item label="阿里云签名" class="form-row" prop="sms_sign">
          <el-input v-model="smsForm.sms_sign" placeholder="请输入阿里云签名"></el-input>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item label="模板编号" class="form-row" prop="sms_temp">
          <el-input v-model="smsForm.sms_temp" placeholder="请输入模板编号"></el-input>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item label="模板语言" class="form-row" prop="temp_type">
          <el-select v-model="smsForm.temp_type" placeholder="请选择模板语言" no-data-text="无数据" :disabled="smsUrl === smsUpdateUrl">
            <el-option
              v-for="item in langTemplate"
              :key="item.id"
              :label="item.name"
              :value="item.id"></el-option>
          </el-select>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item label="模板类型" class="form-row" prop="class">
          <el-select v-model="smsForm.class" placeholder="请选择模板类型" no-data-text="无数据" :disabled="smsUrl === smsUpdateUrl">
            <el-option
              v-for="item in typeTemplate"
              :key="item.id"
              :label="item.name"
              :value="item.id"></el-option>
          </el-select>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item label="" style="margin-top: 4.33rem;">
          <el-button type="primary" class="btn-submit" @click="createSmsSeting">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="邮件设置"
      :visible.sync="isShowEmailSetting"
      width="50rem"
      center>
      <el-form label-width="120px" status-icon label-position="right" :model="emailForm" ref="emailForm" :rules="emailFormRules">
        <el-form-item label="服务器" class="form-row" prop="smtp_server">
          <el-input v-model="emailForm.smtp_server" placeholder="请输入邮件服务器"></el-input>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item label="端口" class="form-row" prop="smtp_port">
          <el-input v-model="emailForm.smtp_port" placeholder="请输入邮件服务器端口"></el-input>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item label="发送账号" class="form-row" prop="smtp_account">
          <el-input v-model="emailForm.smtp_account" placeholder="请输入邮件发送账号"></el-input>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item label="发送密码" class="form-row" prop="smtp_password">
          <el-input v-model="emailForm.smtp_password" placeholder="请输入邮件发送密码"></el-input>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item label="模板语言" class="form-row" prop="temp_type">
          <el-select v-model="emailForm.temp_type" placeholder="请选择模板语言" no-data-text="无数据" :disabled="emailUrl === emailUpdateUrl">
            <el-option
              v-for="item in langTemplate"
              :key="item.id"
              :label="item.name"
              :value="item.id"></el-option>
          </el-select>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item label="模板类型" class="form-row" prop="class">
          <el-select v-model="emailForm.class" placeholder="请选择模板类型" no-data-text="无数据" :disabled="emailUrl === emailUpdateUrl">
            <el-option
              v-for="item in typeTemplate"
              :key="item.id"
              :label="item.name"
              :value="item.id"></el-option>
          </el-select>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item label="邮件模板内容" class="form-row" prop="mail_temp">
          <quill-editor ref="myTextEditor"
                        v-model="emailForm.mail_temp"
                        :options="editorOption">
          </quill-editor>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item label="" prop="smtp_tls">
          <el-checkbox label="使用TLS" name="smtp_tls" v-model="emailForm.smtp_tls"></el-checkbox>
        </el-form-item>
        <el-form-item label="" style="margin-top: 4.33rem;">
          <el-button type="primary" class="btn-submit" @click="createEmailSeting">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      :visible.sync="isShowmoreSetting"
      width="100rem">
      <el-tabs v-model="tabName" @tab-click="tabChange">
        <el-tab-pane label="短信设置" name="first">
          <el-button
                @click="smsSetting"
                class="btn-circle-delete"
                type="primary"
                style="top: -6rem"
                icon="iconfont icon-tianjia" circle></el-button>
          <el-table
            v-loading="smsLoading"
            :data="smsTableData.data"
            style="width: 100%">
            <el-table-column
              type="index"
              label="编号"
              width="80">
            </el-table-column>
            <el-table-column
              prop="app_id"
              label="阿里云APP-ID">
            </el-table-column>
            <el-table-column
              prop="app_seckey"
              width="280"
              label="阿里云APP-Seckey">
            </el-table-column>
            <el-table-column
              prop="sms_sign"
              label="阿里云签名">
            </el-table-column>
            <el-table-column
              prop="sms_temp"
              label="模版编号">
            </el-table-column>
            <el-table-column
              prop="temp_type"
              label="语言">
              <template slot-scope="scope">{{ langTemplateType[scope.row.temp_type] }}</template>
            </el-table-column>
            <el-table-column
              prop="class"
              label="类型">
              <template slot-scope="scope">{{ smsTemplateType[scope.row.class] }}</template>
            </el-table-column>
            <el-table-column label="操作" width="80">
              <template slot-scope="scope">
                <el-button
                  class="btn-circle"
                  size="mini"
                  icon="iconfont icon-bianji"
                  circle
                  @click="updateSmsSetting(scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- <el-pagination
            v-if="smsTableData.data.length !== 0"
            @size-change="getSmsLists"
            @current-change="getSmsLists"
            :page-size="20"
            layout="prev, pager, next, jumper"
            :total="smsTableData.total">
          </el-pagination> -->
        </el-tab-pane>
        <el-tab-pane label="邮件设置" name="second">
          <el-button
                @click="emialSetting"
                class="btn-circle-delete"
                type="primary"
                style="top: -6rem"
                icon="iconfont icon-tianjia" circle></el-button>
          <el-table
            v-loading="smsLoading"
            :data="smsTableData.data"
            style="width: 100%">
            <el-table-column
              type="index"
              label="编号"
              width="80">
            </el-table-column>
            <el-table-column
              prop="smtp_server"
              label="服务器">
            </el-table-column>
            <el-table-column
              prop="smtp_port"
              label="端口">
            </el-table-column>
            <el-table-column
              prop="smtp_tls"
              label="TLS">
              <template slot-scope="scope">{{ tlsCode[scope.row.smtp_tls] }}</template>
            </el-table-column>
            <el-table-column
              prop="smtp_account"
              label="发送账号">
            </el-table-column>
            <el-table-column
              prop="smtp_password"
              label="发送密码">
            </el-table-column>
            <el-table-column
              prop="temp_type"
              label="模板语言">
              <template slot-scope="scope">{{ langTemplateType[scope.row.temp_type] }}</template>
            </el-table-column>
            <el-table-column
              prop="class"
              label="模版类型">
              <template slot-scope="scope">{{ smsTemplateType[scope.row.temp_type] }}</template>
            </el-table-column>
            <el-table-column
              prop="mail_temp"
              label="模板内容">
            </el-table-column>
            <el-table-column label="操作" width="80">
              <template slot-scope="scope">
                <el-button
                  class="btn-circle"
                  size="mini"
                  icon="iconfont icon-gengduo"
                  circle
                  @click="updateEmailSetting(scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- <el-tab-pane label="支付设置" name="third">角色管理</el-tab-pane> -->
      </el-tabs>
    </el-dialog>

  </div>
</template>
<script>
import '@/assets/css/content.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
import { GET_KEY_ID_POST, GENERATE_KEY_ID_POST, SET_NOTIFY_URL_POST, COOP_SMS_QUERY_POST, COOP_SMS_ADD_POST, COOP_SMS_UPDATE_POST,
  COOP_EMAIL_QUERY_POST, COOP_EMAIL_ADD_POST, COOP_EMAIL_UPDATE_POST} from '@/lib/api'
import { langTemplate, typeTemplate } from '@/lib/const'
import _ from 'lodash'

export default {
  components: { quillEditor },
  data () {
    let validateIsEmpty = (rule, value, callback) => {
      if (value === '') {
        if (rule.field === 'client_id') {
          callback(new Error('请输入ID'))
        } else if (rule.field === 'notify_url') {
          callback(new Error('请输入回调URL'))
        } else if (rule.field === 'app_name') {
          callback(new Error('请输入APP名称'))
        }
      }
      callback()
    }
    let validateSmsIsEmpty = (rule, value, callback) => {
      if (value === '') {
        if (rule.field === 'app_id') {
          callback(new Error('请输入App ID'))
        } else if (rule.field === 'app_seckey') {
          callback(new Error('请输入App key'))
        } else if (rule.field === 'sms_sign') {
          callback(new Error('请输入阿里云签名'))
        } else if (rule.field === 'sms_temp') {
          callback(new Error('请输入模板编号'))
        } else if (rule.field === 'temp_type') {
          callback(new Error('请选择模板语言'))
        } else if (rule.field === 'class') {
          callback(new Error('请选择模板类型'))
        }
      }
      callback()
    }
    let validateEmailIsEmpty = (rule, value, callback) => {
      if (value === '') {
        if (rule.field === 'smtp_server') {
          callback(new Error('请输入邮件服务器'))
        } else if (rule.field === 'smtp_port') {
          callback(new Error('请输入邮件服务器端口'))
        } else if (rule.field === 'smtp_account') {
          callback(new Error('请输入邮件发送账号'))
        } else if (rule.field === 'smtp_password') {
          callback(new Error('请输入邮件发送密码'))
        } else if (rule.field === 'temp_type') {
          callback(new Error('请选择模板语言'))
        } else if (rule.field === 'class') {
          callback(new Error('请选择模板类型'))
        } else if (rule.field === 'mail_temp') {
          callback(new Error('请输入邮件模板内容'))
        }
      }
      callback()
    }
    return {
      clientId: '',
      tabName: 'first',
      editorOption: {
        modules: {
          toolbar: '',
          clipboard: {
            matchers: [
              // 去除quill编辑器粘贴剪切板信息时的格式，仅保留纯文本
              [Node.ELEMENT_NODE, (node, delta) => {
                let ops = []
                delta.ops.forEach(op => {
                  if (op.insert && typeof op.insert === 'string') {
                    ops.push({
                      insert: op.insert
                    })
                  }
                })
                delta.ops = ops
                return delta
              }]
            ]
          }
        },
        placeholder: '请输入邮件模板内容'
      },
      loading: false,
      smsLoading: false,
      isToSetNotifyUrl: false,
      isShowmoreSetting: false,
      isShowSmsSetting: false,
      isShowEmailSetting: false,
      createKeyDialog: false,
      langTemplate: langTemplate,
      typeTemplate: typeTemplate,
      smsUpdateUrl: COOP_SMS_UPDATE_POST,
      emailUpdateUrl: COOP_EMAIL_UPDATE_POST,
      smsUrl: '',
      emailUrl: '',
      tableData: {
        data: [],
        res: []
      },
      smsTableData: {
        data: []
      },
      notifyForm: {
        client_id: '',
        notify_url: ''
      },
      keyForm: {
        app_name: ''
      },

      smsForm: {
        client_id: '',
        app_id: '',
        app_seckey: '',
        sms_sign: '',
        sms_temp: '',
        temp_type: '',
        class: ''
      },
      emailForm: {
        client_id: '',
        smtp_server: '',
        smtp_port: '',
        smtp_tls: '',
        smtp_account: '',
        smtp_password: '',
        temp_type: '',
        mail_temp: '',
        class: ''
      },
      rules: {
        client_id: [
          { validator: validateIsEmpty, trigger: 'change' }
        ],
        notify_url: [
          { validator: validateIsEmpty, trigger: 'blur' }
        ]
      },
      keyFormRules: {
        app_name: [
          { validator: validateIsEmpty, trigger: 'blur' }
        ]
      },
      smsFormRules: {
        app_id: [
          { validator: validateSmsIsEmpty, trigger: 'change' }
        ],
        app_seckey: [
          { validator: validateSmsIsEmpty, trigger: 'change' }
        ],
        sms_sign: [
          { validator: validateSmsIsEmpty, trigger: 'change' }
        ],
        sms_temp: [
          { validator: validateSmsIsEmpty, trigger: 'change' }
        ],
        temp_type: [
          { validator: validateSmsIsEmpty, trigger: 'change' }
        ],
        class: [
          { validator: validateSmsIsEmpty, trigger: 'change' }
        ]
      },
      emailFormRules: {
        smtp_server: [
          { validator: validateEmailIsEmpty, trigger: 'change' }
        ],
        smtp_port: [
          { validator: validateEmailIsEmpty, trigger: 'change' }
        ],
        smtp_tls: [
          { validator: validateEmailIsEmpty, trigger: 'change' }
        ],
        smtp_account: [
          { validator: validateEmailIsEmpty, trigger: 'change' }
        ],
        smtp_password: [
          { validator: validateEmailIsEmpty, trigger: 'change' }
        ],
        temp_type: [
          { validator: validateEmailIsEmpty, trigger: 'change' }
        ],
        mail_temp: [
          { validator: validateEmailIsEmpty, trigger: 'change' }
        ],
        class: [
          { validator: validateEmailIsEmpty, trigger: 'change' }
        ]
      }
    }
  },
  created () {
    this.getKeyLists()
  },
  methods: {
    settingMore (row) {
      this.isShowmoreSetting = true
      this.clientId = row.client_id
      this.getSmsLists(row.client_id)
    },
    tabChange (tab, event) {
      this.smsTableData.data = []
      if (tab.name === 'first') { this.getSmsLists(this.clientId) }
      if (tab.name === 'second') { this.getEmialLists(this.clientId) }
    },

    smsSetting () {
      this.isShowSmsSetting = true
      this.smsUrl = COOP_SMS_ADD_POST
      this.smsForm.client_id = this.clientId
      setTimeout(() => this.$refs['smsForm'].resetFields())
      for (const key in this.smsForm) {
        if (key !== 'client_id') { this.smsForm[key] = '' }
      }
    },
    emialSetting () {
      this.isShowEmailSetting = true
      this.emailUrl = COOP_EMAIL_ADD_POST
      this.emailForm.client_id = this.clientId
      setTimeout(() => this.$refs['emailForm'].resetFields())
      for (const key in this.emailForm) {
        if (key !== 'client_id') { this.emailForm[key] = '' }
      }
    },

    setNotifyUrl (row) {
      this.notifyForm.client_id = row.client_id
      this.isToSetNotifyUrl = true
    },

    updateSmsSetting (row) {
      this.isShowSmsSetting = true
      this.smsUrl = COOP_SMS_UPDATE_POST
      let temp = Object.assign({}, row)
      delete temp.id
      this.smsForm = temp
    },
    updateEmailSetting (row) {
      this.isShowEmailSetting = true
      this.emailUrl = COOP_EMAIL_UPDATE_POST
      let temp = Object.assign({}, row)
      delete temp.id
      this.emailForm = temp
    },
    createEmailSeting: _.debounce(function () {
      this.$refs['emailForm'].validate((valid) => {
        if (valid) {
          this.emailForm.smtp_tls = Number(this.emailForm.smtp_tls)
          let param = this.createFormData(this.emailForm)
          let loading = this.vmLoadingFull()
          this.$http.post(this.emailUrl, param).then(res => {
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess('设置成功')
              this.$refs['emailForm'].resetFields()
              this.isShowEmailSetting = false
              this.getEmialLists(this.clientId)
            }
            loading.close()
          }).catch(e => {
            loading.close()
            this.vmMsgError('网络错误！')
          })
        }
      })
    }, 300),
    createSmsSeting: _.debounce(function () {
      this.$refs['smsForm'].validate((valid) => {
        if (valid) {
          let param = this.createFormData(this.smsForm)
          let loading = this.vmLoadingFull()
          this.$http.post(this.smsUrl, param).then(res => {
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess('设置成功')
              this.$refs['smsForm'].resetFields()
              this.isShowSmsSetting = false
              this.getSmsLists(this.clientId)
            }
            loading.close()
          }).catch(e => {
            loading.close()
            this.vmMsgError('网络错误！')
          })
        }
      })
    }, 300),

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
    createKey: function () {
      this.createKeyDialog = true
    },
    generateKey: _.debounce(function () {
      this.$refs['keyForm'].validate((valid) => {
        if (valid) {
          let param = this.createFormData(this.keyForm)
          let loading = this.vmLoadingFull()
          this.$http.post(GENERATE_KEY_ID_POST, param).then(res => {
            if (this.vmResponseHandler(res)) {
              this.keyForm.app_name = ''
              this.createKeyDialog = false
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

    getSmsLists: _.debounce(function () {
      this.smsLoading = true
      this.$http.post(COOP_SMS_QUERY_POST, this.createFormData({ client_id: this.clientId })).then(res => {
        if (this.vmResponseHandler(res)) {
          this.smsTableData = res.data
        }
        this.smsLoading = false
      }).catch(e => {
        this.smsLoading = false
        this.vmMsgError('网络错误！')
      })
    }, 300),

    getEmialLists: _.debounce(function () {
      this.smsLoading = true
      this.$http.post(COOP_EMAIL_QUERY_POST, this.createFormData({ client_id: this.clientId })).then(res => {
        if (this.vmResponseHandler(res)) {
          this.smsTableData = res.data
        }
        this.smsLoading = false
      }).catch(e => {
        this.smsLoading = false
        this.vmMsgError('网络错误！')
      })
    })
  }
}
</script>

<style>
.el-tabs {
  padding: 0 18px;
}
</style>
