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
                    <a class="wait" href="javascript:void(0)" v-if="scope.row.notify_url" @click="setNotifyUrl(scope.row)"> {{ scope.row.notify_url }} </a>
                    <a class="success" href="javascript:void(0)" v-else @click="setNotifyUrl(scope.row)">设置回调</a>
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
          <el-input type="textarea" :rows="6" placeholder="请输入邮件模板内容" v-model="emailForm.mail_temp"></el-input>
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
      title="协议设置"
      :visible.sync="isShowProtocolSetting"
      width="50rem"
      center>
      <el-form label-width="120px" status-icon label-position="right" :model="protocolForm" ref="protocolForm" :rules="protocolFormRules">
        <el-form-item label="协议类型" class="form-row" prop="type">
          <el-select v-model="protocolForm.type" placeholder="请选择协议语言" no-data-text="无数据">
            <el-option
              v-for="item in protocolTemplate"
              :key="item.id"
              :label="item.name"
              :value="item.id"></el-option>
          </el-select>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item label="协议语言" class="form-row" prop="proto_lang">
          <el-select v-model="protocolForm.proto_lang" placeholder="请选择协议语言" no-data-text="无数据">
            <el-option
              v-for="item in protocolLangTemplate"
              :key="item.id"
              :label="item.name"
              :value="item.id"></el-option>
          </el-select>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item label="文件上传" class="form-row">
          <div class="form-btn-upload">
            <el-button type="primary">上传</el-button>
            <input type="file" accept=".html" ref="protocolFile" class="file_input" @change="sendFile" />
          </div>
          <span class="form-tip">*</span>
          <p class="picName">{{picName}}</p>
        </el-form-item>
        <el-form-item label="" style="margin-top: 4.33rem;">
          <el-button type="primary" class="btn-submit" @click="createProtocolSeting">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      :visible.sync="isShowmoreSetting"
      width="100rem"
      :before-close="beforeClose">
      <el-tabs v-model="tabName" @tab-click="tabChange">
        <el-tab-pane label="短信设置" name="first">
          <el-button
                @click="smsSetting"
                class="btn-circle-delete"
                type="primary"
                style="top: -6rem"
                icon="iconfont icon-tianjia" circle></el-button>
          <TableComponent :options="smsTableOptions" :data="smsTableData" v-on:page-change="getSmsLists">
            <!-- 操作按钮的注入 -->
            <el-table-column label="操作" width="80" slot="handler">
              <template slot-scope="scope">
                <el-button
                  class="btn-circle"
                  size="mini"
                  icon="iconfont icon-bianji"
                  circle
                  @click="updateSmsSetting(scope.row)"></el-button>
              </template>
            </el-table-column>
          </TableComponent>
        </el-tab-pane>
        <el-tab-pane label="邮件设置" name="second">
          <el-button
                @click="emialSetting"
                class="btn-circle-delete"
                type="primary"
                style="top: -6rem"
                icon="iconfont icon-tianjia" circle></el-button>
          <TableComponent :options="emailTableOptions" :data="smsTableData" v-on:page-change="getEmialLists">
            <el-table-column label="操作" width="80" slot="handler">
              <template slot-scope="scope">
                <el-button
                  class="btn-circle"
                  size="mini"
                  icon="iconfont icon-gengduo"
                  circle
                  @click="updateEmailSetting(scope.row)"></el-button>
              </template>
            </el-table-column>
          </TableComponent>
        </el-tab-pane>
        <el-tab-pane label="协议设置" name="third">
          <el-button
            @click="protocolSetting"
            class="btn-circle-delete"
            type="primary"
            style="top: -6rem"
            icon="iconfont icon-tianjia" circle></el-button>
          <TableComponent :options="protocolTableOptions" :data="smsTableData" v-on:page-change="getProtocolLists">
            <el-table-column label="操作" width="150" slot="handler">
              <template slot-scope="scope">
                <el-button
                  class="btn-circle"
                  size="mini"
                  icon="iconfont icon-bianji"
                  circle
                  @click="updateProtocolSetting(scope.row)"></el-button>
                <el-button
                  class="btn-circle"
                  size="mini"
                  icon="iconfont icon-gengduo"
                  circle
                  @click="jumpProtocolSetting(scope.row)"></el-button>
              </template>
            </el-table-column>
          </TableComponent>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

  </div>
</template>
<script>
import '@/assets/css/content.css'
import TableComponent from '@/components/_ui/table.vue'
import { GET_KEY_ID_POST, GENERATE_KEY_ID_POST, SET_NOTIFY_URL_POST, COOP_SMS_QUERY_POST, COOP_SMS_ADD_POST, COOP_SMS_UPDATE_POST,
  COOP_EMAIL_QUERY_POST, COOP_EMAIL_ADD_POST, COOP_EMAIL_UPDATE_POST, COOP_PROTOCOL_QUERY_POST, COOP_PROTOCOL_ADD_POST } from '@/lib/api'
import { langTemplate, typeTemplate, protocolLangTemplate, protocolTemplate } from '@/lib/const'
import _ from 'lodash'

export default {
  components: { TableComponent },
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
    let validateProtocolIsEmpty = (rule, value, callback) => {
      if (value === '') {
        if (rule.field === 'proto_lang') {
          callback(new Error('请选择协议语言'))
        } else if (rule.field === 'type') {
          callback(new Error('请选择协议类型'))
        }
      }
      callback()
    }
    return {
      smsTableOptions: {
        loading: true,
        hasSelection: false,
        hasNumber: true,
        pageOptions: {
          pageSize: 20,
          total: 0
        },
        columns: [
          {
            label: '阿里云APP-ID',
            prop: 'app_id'
          }, {
            prop: 'app_seckey',
            label: '阿里云APP-Seckey',
            width: 280
          }, {
            prop: 'sms_sign',
            label: '阿里云签名'
          }, {
            prop: 'sms_temp',
            label: '模版编号'
          }, {
            prop: 'temp_type',
            label: '语言',
            render: value => this.langTemplateType[value]
          }, {
            prop: 'class',
            label: '类型',
            render: value => this.smsTemplateType[value]
          }
        ]
      },
      emailTableOptions: {
        loading: true,
        hasSelection: false,
        hasNumber: true,
        pageOptions: {
          pageSize: 20,
          total: 0
        },
        columns: [
          {
            label: '服务器',
            prop: 'smtp_server',
            width: 120
          }, {
            prop: 'smtp_port',
            label: '端口',
            width: 50
          }, {
            prop: 'sms_sign',
            label: '阿里云签名'
          }, {
            prop: 'smtp_tls',
            label: 'TLS',
            render: value => this.tlsCode[value]
          }, {
            prop: 'smtp_account',
            label: '发送账号'
          }, {
            prop: 'smtp_password',
            label: '发送密码'
          }, {
            prop: 'temp_type',
            label: '模板语言',
            render: value => this.langTemplateType[value]
          }, {
            prop: 'class',
            label: '模版类型',
            render: value => this.smsTemplateType[value]
          }, {
            prop: 'smtp_password',
            label: '发送密码'
          }, {
            prop: 'mail_temp',
            label: '模板内容',
            width: 150
          }
        ]
      },
      protocolTableOptions: {
        loading: true,
        hasSelection: false,
        hasNumber: true,
        pageOptions: {
          pageSize: 20,
          total: 0
        },
        columns: [
          {
            prop: 'proto_lang',
            label: '协议语言',
            render: value => this.protocolLangTemplateType[value]
          }, {
            prop: 'type',
            label: '协议类型',
            render: value => this.protocolTemplateType[value]
          }
        ]
      },

      clientId: '',
      tabName: 'first',
      loading: false,
      isToSetNotifyUrl: false,
      isShowmoreSetting: false,
      isShowSmsSetting: false,
      isShowEmailSetting: false,
      isShowProtocolSetting: false,
      addOrEditProtocol: 0,
      createKeyDialog: false,
      langTemplate: langTemplate,
      typeTemplate: typeTemplate,
      protocolTemplate: protocolTemplate,
      protocolLangTemplate: protocolLangTemplate,
      smsUpdateUrl: COOP_SMS_UPDATE_POST,
      emailUpdateUrl: COOP_EMAIL_UPDATE_POST,
      smsUrl: '',
      emailUrl: '',
      protocolUrl: '',
      picName: '',
      tableData: {
        data: [],
        res: []
      },
      smsTableData: [],
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
      protocolForm: {
        client_id: '',
        proto_lang: '',
        type: '',
        photo: '',
        url_old: ''
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
      },
      protocolFormRules: {
        proto_lang: [
          { validator: validateProtocolIsEmpty, trigger: 'change' }
        ],
        type: [
          { validator: validateProtocolIsEmpty, trigger: 'change' }
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
      this.getSmsLists(1)
    },
    tabChange (tab, event) {
      this.smsTableData = []
      if (tab.name === 'first') { this.getSmsLists() }
      if (tab.name === 'second') { this.getEmialLists() }
      if (tab.name === 'third') { this.getProtocolLists() }
    },

    smsSetting () {
      this.isShowSmsSetting = true
      this.smsUrl = COOP_SMS_ADD_POST
      this.smsForm.client_id = this.clientId
      setTimeout(() => this.$refs['smsForm'].resetFields())
      // for (const key in this.smsForm) {
      //   if (key !== 'client_id') { this.smsForm[key] = '' }
      // }
    },
    emialSetting () {
      this.isShowEmailSetting = true
      this.emailUrl = COOP_EMAIL_ADD_POST
      this.emailForm.client_id = this.clientId
      setTimeout(() => this.$refs['emailForm'].resetFields())
      // for (const key in this.emailForm) {
      //   if (key !== 'client_id') { this.emailForm[key] = '' }
      // }
    },
    protocolSetting () {
      this.isShowProtocolSetting = true
      this.addOrEditProtocol = 1
      this.protocolUrl = COOP_PROTOCOL_ADD_POST
      this.protocolForm.client_id = this.clientId
      setTimeout(() => this.$refs['protocolForm'].resetFields())
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
    updateProtocolSetting (row) {
      this.isShowProtocolSetting = true
      this.addOrEditProtocol = 0
      this.protocolUrl = COOP_PROTOCOL_ADD_POST
      this.protocolForm.client_id = row.client_id
      this.protocolForm.proto_lang = row.proto_lang
      this.protocolForm.type = row.type
      this.protocolForm.url_old = row.url
    },
    jumpProtocolSetting (row) {
      window.open(row.url)
    },
    beforeClose (done) {
      this.tabName = 'first'
      if (this.smsTableData) {
        this.smsTableData.data = []
      }
      done.apply(this, null)
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
              this.getEmialLists()
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
              this.getSmsLists()
            }
            loading.close()
          }).catch(e => {
            loading.close()
            this.vmMsgError('网络错误！')
          })
        }
      })
    }, 300),
    createProtocolSeting: _.debounce(function () {
      this.$refs['protocolForm'].validate((valid) => {
        if (valid) {
          let loading = this.vmLoadingFull()
          if (!this.protocolForm.photo) {
            this.vmMsgWarning('请选择上传文件！')
            loading.close()
            return false
          }
          if (this.addOrEditProtocol === 1) { // 添加协议
            this.protocolForm.url_old = ''
            for (let obj of this.smsTableData) {
              if (obj.proto_lang === this.protocolForm.proto_lang && obj.type === this.protocolForm.type) {
                this.protocolForm.url_old = obj.url
              }
            }
          }
          let param = this.createFormData(this.protocolForm)
          this.$http.post(this.protocolUrl, param).then(res => {
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess('设置成功')
              this.$refs['protocolForm'].resetFields()
              this.isShowProtocolSetting = false
              this.getProtocolLists()
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

    getSmsLists: _.debounce(function (page) {
      this.smsTableOptions.loading = true
      let data = this.createFormData({
        client_id: this.clientId,
        page: page,
        page_size: this.smsTableOptions.pageOptions.pageSize
      })
      this.$http.post(COOP_SMS_QUERY_POST, data).then(res => {
        if (this.vmResponseHandler(res)) {
          this.smsTableData = res.data.data
          this.smsTableOptions.pageOptions.total = res.data.total
        }
        this.smsTableOptions.loading = false
      }).catch(e => {
        this.smsTableOptions.loading = false
        this.vmMsgError('网络错误！')
      })
    }, 300),

    getEmialLists: _.debounce(function (page) {
      this.emailTableOptions.loading = true
      let data = this.createFormData({
        client_id: this.clientId,
        page: page,
        page_size: this.emailTableOptions.pageOptions.pageSize
      })
      this.$http.post(COOP_EMAIL_QUERY_POST, data).then(res => {
        if (this.vmResponseHandler(res)) {
          this.smsTableData = res.data.data
          this.emailTableOptions.pageOptions.total = res.data.total
        }
        this.emailTableOptions.loading = false
      }).catch(e => {
        this.emailTableOptions.loading = false
        this.vmMsgError('网络错误！')
      })
    }),
    getProtocolLists: _.debounce(function (page) {
      this.protocolTableOptions.loading = true
      let data = this.createFormData({
        client_id: this.clientId,
        page: page,
        page_size: this.protocolTableOptions.pageOptions.pageSize
      })
      this.$http.post(COOP_PROTOCOL_QUERY_POST, data).then(res => {
        if (this.vmResponseHandler(res)) {
          this.smsTableData = res.data.data
          this.protocolTableOptions.pageOptions.total = res.data.total
        }
        this.protocolTableOptions.loading = false
      }).catch(e => {
        this.protocolTableOptions.loading = false
        this.vmMsgError('网络错误！')
      })
    }),
    //  文件上传
    sendFile () {
      let file = this.$refs['protocolFile'].files[0]
      let suffixAry
      let suffix
      if (!file) return false
      suffixAry = file.name.split('.')
      suffix = suffixAry[suffixAry.length - 1]
      if (suffix !== 'html') {
        this.vmMsgError('只能上传html文件！')
        return false
      }
      this.protocolForm.photo = file
      this.picName = file.name
    }
  }
}
</script>
<style scoped>
  .picName{
    color: #ffffff;
    word-break: break-all;
  }
  .form-btn-upload{
    position: relative;
    display: inline-block;
    width:8rem;
  }
  .form-btn-upload .file_input {
    width: 100%;
    height: 36px;
    border-radius: 1.125rem;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 1;
    -moz-opacity: 0;
    -ms-opacity: 0;
    -webkit-opacity: 0;
    opacity: 0; /*css属性——opcity不透明度，取值0-1*/
    filter: alpha(opacity=0); /*兼容IE8及以下--filter属性是IE特有的，它还有很多其它滤镜效果，而filter: alpha(opacity=0); 兼容IE8及以下的IE浏览器(如果你的电脑IE是8以下的版本，使用某些效果是可能会有一个允许ActiveX的提示,注意点一下就ok啦)*/
    cursor: pointer;
  }
</style>
<style>
.el-tabs {
  padding: 0 18px;
}
</style>
