<template>
  <div class="content-container">
    <el-row>
      <el-col :span="24">
        <p class="title-cn">{{$t("iot_plat_key_manage")}}</p>
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
                icon="iconfont icon-tianjia"
                circle
              ></el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <TableComponent :options="tableOptions" :data="tableData.data" v-on:page-change="getSmsLists">
                <template slot-scope="scope" slot="callbackAddr">
                  <a class="success" href="javascript:void(0)" @click="setNotifyUrl(scope.row)">{{$t("iot_plat_set_callback")}}</a>
                </template>
                <template slot-scope="scope" slot="bindManage">
                  <a class="success" href="javascript:void(0)" @click="createBind(scope.row)">{{$t("iot_plat_view")}}</a>
                </template>
                <!-- 操作按钮的注入 -->
                <el-table-column :label="$t('iot_plat_operate')" width="100" slot="handler" v-if="vmHasAuth(CoopPermissionsLib.ADD_NOTIFY_URL, tableData.res)">
                  <template slot-scope="scope">
                    <el-button
                      class="btn-circle"
                      size="mini"
                      icon="iconfont icon-gengduo"
                      circle
                      @click="settingMore(scope.row)"
                    ></el-button>
                  </template>
                </el-table-column>
              </TableComponent>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>

    <!-- 绑定管理 -->
    <BindListComponent ref="bindList" :clientId="clientId" :isVisible="isBindListVisible" @close="closeBindDialog"></BindListComponent>

    <!-- 回调设置 -->
    <CallBackComponent :isVisible="isToSetNotifyUrl" :data="notifyData" @close="closeCallbackDialog"></CallBackComponent>
    
    <!-- 生成KEY -->
    <KeyAddComponent :isVisible="createKeyDialog" @close="closeAddDialog"></KeyAddComponent>

    <el-dialog :title="$t('iot_plat_sms_set')" :visible.sync="isShowSmsSetting" width="51rem" center>
      <SmsSettingComponent :clientId="clientId" :formData="smsData" @close="closeSmsSetting"></SmsSettingComponent>
    </el-dialog>
    <el-dialog :title="$t('iot_plat_emial_set')" :visible.sync="isShowEmailSetting" width="51rem" center>
      <EmailSettingComponent :clientId="clientId" :formData="emailData" @close="closeEmailSetting"></EmailSettingComponent>
    </el-dialog>
    <el-dialog :title="$t('iot_plat_protocol_set')" :visible.sync="isShowProtocolSetting" width="51rem" center>
      <el-form
        label-width="150px"
        status-icon
        label-position="right"
        :model="protocolForm"
        ref="protocolForm"
        :rules="protocolFormRules"
      >
        <el-form-item :label="$t('iot_plat_protocol_type')" class="form-row" prop="type">
          <el-select v-model="protocolForm.type" :placeholder="$t('iot_plat_select_protocol_type')" :no-data-text="$t('iot_plat_none_data')">
            <el-option
              v-for="item in protocolTemplate"
              :key="item.id"
              :label="$t(item.name)"
              :value="item.id"
            ></el-option>
          </el-select>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item :label="$t('iot_plat_protocol_language')" class="form-row" prop="proto_lang">
          <el-select v-model="protocolForm.proto_lang" :placeholder="$t('iot_plat_select_protocol_language')" :no-data-text="$t('iot_plat_none_data')">
            <el-option
              v-for="item in multiLanguage"
              :key="item.language"
              :label="item.language_desc"
              :value="item.language"
            ></el-option>
          </el-select>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item :label="$t('iot_plat_file_upload')" class="form-row">
          <div class="form-btn-upload">
            <el-button type="primary">{{$t("iot_plat_upload")}}</el-button>
            <input
              type="file"
              accept=".html"
              ref="protocolFile"
              class="file_input"
              @change="sendFile"
            >
          </div>
          <span class="form-tip">*</span>
          <p class="picName">{{picName}}</p>
        </el-form-item>
        <el-form-item label style="margin-top: 4.33rem;">
          <el-button type="primary" class="btn-submit" @click="createProtocolSeting">{{$t("iot_plat_confirm")}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :visible.sync="isShowmoreSetting" width="100rem" :before-close="beforeClose">
      <el-tabs v-model="tabName" @tab-click="tabChange">
        <el-tab-pane :label="$t('iot_plat_sms_set')" name="first">
          <el-button
            @click="smsSetting"
            class="btn-circle-delete"
            type="primary"
            style="top: -6rem"
            icon="iconfont icon-tianjia"
            circle
          ></el-button>
          <TableComponent
            :options="smsTableOptions"
            :data="smsTableData"
            v-on:page-change="getSmsLists"
          >
            <!-- 操作按钮的注入 -->
            <el-table-column :label="$t('iot_plat_operate')" width="100" slot="handler">
              <template slot-scope="scope">
                <el-button
                  class="btn-circle"
                  size="mini"
                  icon="iconfont icon-bianji"
                  circle
                  @click="updateSmsSetting(scope.row)"
                ></el-button>
              </template>
            </el-table-column>
          </TableComponent>
        </el-tab-pane>
        <el-tab-pane :label="$t('iot_plat_emial_set')" name="second">
          <el-button
            @click="emialSetting"
            class="btn-circle-delete"
            type="primary"
            style="top: -6rem"
            icon="iconfont icon-tianjia"
            circle
          ></el-button>
          <TableComponent
            :options="emailTableOptions"
            :data="smsTableData"
            v-on:page-change="getEmialLists"
          >
            <el-table-column :label="$t('iot_plat_operate')" width="100" slot="handler">
              <template slot-scope="scope">
                <el-button
                  class="btn-circle"
                  size="mini"
                  icon="iconfont icon-gengduo"
                  circle
                  @click="updateEmailSetting(scope.row)"
                ></el-button>
              </template>
            </el-table-column>
          </TableComponent>
        </el-tab-pane>
        <el-tab-pane :label="$t('iot_plat_protocol_set')" name="third">
          <el-button
            @click="protocolSetting"
            class="btn-circle-delete"
            type="primary"
            style="top: -6rem"
            icon="iconfont icon-tianjia"
            circle
          ></el-button>
          <TableComponent
            :options="protocolTableOptions"
            :data="smsTableData"
            v-on:page-change="getProtocolLists"
          >
            <el-table-column :label="$t('iot_plat_operate')" width="150" slot="handler">
              <template slot-scope="scope">
                <el-button
                  class="btn-circle"
                  size="mini"
                  icon="iconfont icon-bianji"
                  circle
                  @click="updateProtocolSetting(scope.row)"
                ></el-button>
                <el-button
                  class="btn-circle"
                  size="mini"
                  icon="iconfont icon-gengduo"
                  circle
                  @click="jumpProtocolSetting(scope.row)"
                ></el-button>
              </template>
            </el-table-column>
          </TableComponent>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>
<script>
import "@/assets/css/content.css";
import TableComponent from "@/components/table/table.vue";
import CallBackComponent from "./component/callback.vue";
import BindListComponent from "./component/bind-list.vue";
import KeyAddComponent from "./component/add-key.vue";
import SmsSettingComponent from "./component/sms-setting.vue"
import EmailSettingComponent from "./component/email-setting.vue"
import {
  GET_KEY_ID_POST,
  COOP_SMS_QUERY_POST,
  COOP_EMAIL_QUERY_POST,
  COOP_PROTOCOL_QUERY_POST,
  COOP_PROTOCOL_ADD_POST
} from "@/lib/api";
import { protocolTemplate } from "@/lib/const";
import _ from "lodash";

export default {
  components: {
    TableComponent,
    CallBackComponent,
    BindListComponent,
    KeyAddComponent,
    SmsSettingComponent,
    EmailSettingComponent
  },
  data() {
    const validateProtocolIsEmpty = (rule, value, callback) => {
      if (value === "") {
        if (rule.field === "proto_lang") {
          callback(new Error(this.$t("iot_plat_select_protocol_language")));
        } else if (rule.field === "type") {
          callback(new Error(this.$t("iot_plat_select_protocol_type")));
        }
      }
      callback();
    };
    return {
      tableOptions: {
        loading     : true,
        hasSelection: false,
        hasNumber   : true,
        pageOptions : {
          currentPage: 1,
          pageSize   : 20,
          total      : 0
        },
        columns: [
          {
            label: this.$t("iot_plat_id"),
            prop : "client_id",
            width: 280
          },
          {
            prop : "client_secret",
            label: this.$t("iot_plat_key"),
            width: 280
          },
          {
            prop : "create_time",
            label: this.$t("iot_plat_generate_time"),
            width: 150
          },
          {
            prop : "app_name",
            label: this.$t("iot_plat_bind_app")
          },
          {
            prop    : "temp_type",
            label   : this.$t("iot_plat_callback_address"),
            slotName: "callbackAddr"
          },
          {
            prop    : "class",
            label   : this.$t("iot_plat_bind_manage"),
            slotName: "bindManage"
          }
        ]
      },
      smsTableOptions: {
        loading     : true,
        hasSelection: false,
        hasNumber   : true,
        pageOptions : {
          currentPage: 1,
          pageSize   : 20,
          total      : 0
        },
        columns: [
          {
            label: this.$t("iot_plat_aliyun_app_id"),
            prop : "app_id"
          },
          {
            prop : "app_seckey",
            label: this.$t("iot_plat_aliyun_app_seckey"),
            width: 280
          },
          {
            prop  : "class",
            label : this.$t("iot_plat_category"),
            render: value => this.$t(this.smsTemplateType[value])
          }
        ]
      },
      emailTableOptions: {
        loading     : true,
        hasSelection: false,
        hasNumber   : true,
        pageOptions : {
          currentPage: 1,
          pageSize   : 20,
          total      : 0
        },
        columns: [
          {
            label: this.$t("iot_plat_server"),
            prop : "smtp_server",
            width: 120
          },
          {
            prop : "smtp_port",
            label: this.$t("iot_plat_port"),
            width: 100
          },
          {
            prop  : "smtp_tls",
            label : this.$t("iot_plat_tls"),
            render: value => this.$t(this.tlsCode[value])
          },
          {
            prop : "smtp_account",
            label: this.$t("iot_plat_send_account")
          },
          {
            prop : "smtp_password",
            label: this.$t("iot_plat_send_password")
          },
          {
            prop  : "class",
            label : this.$t("iot_plat_template_type"),
            render: value => this.$t(this.smsTemplateType[value])
          }
        ]
      },
      protocolTableOptions: {
        loading     : true,
        hasSelection: false,
        hasNumber   : true,
        pageOptions : {
          pageSize: 20,
          total   : 0
        },
        columns: [
          {
            prop  : "proto_lang",
            label : this.$t("iot_plat_protocol_language"),
            render: value => {
              if (!value) { return }
              const pro = this.multiLanguage.find(o => o.language === (value === "zh" ? "CN" : value.toUpperCase()))
              if (pro) { return this.$t(pro.language_desc) }
            }
          },
          {
            prop  : "type",
            label : this.$t("iot_plat_protocol_type"),
            render: value => this.$t(this.protocolTemplateType[value])
          }
        ]
      },
      notifyData           : {},
      clientId             : "",
      smsData              : "",
      emailData            : {},
      tabName              : "first",
      loading              : false,
      isToSetNotifyUrl     : false,
      isBindListVisible    : false,
      isShowmoreSetting    : false,
      isShowSmsSetting     : false,
      isShowEmailSetting   : false,
      isShowProtocolSetting: false,
      addOrEditProtocol    : 0,
      createKeyDialog      : false,
      protocolTemplate     : protocolTemplate,
      multiLanguage        : this.$store.getters.getLanguages,
      protocolUrl          : "",
      picName              : "",
      tableData            : {
        data: [],
        res : []
      },
      smsTableData: [],

      protocolForm: {
        client_id : "",
        proto_lang: "",
        type      : "",
        photo     : "",
        url_old   : ""
      },
      
      protocolFormRules: {
        proto_lang: [ { validator: validateProtocolIsEmpty, trigger: "change" } ],
        type      : [ { validator: validateProtocolIsEmpty, trigger: "change" } ]
      }
    };
  },
  created() {
    this.getKeyLists();
  },
  methods: {
    closeCallbackDialog (isToFresh) {
      if (isToFresh) {
        this.getKeyLists()
      }
      this.isToSetNotifyUrl = false
    },

    closeBindDialog() {
      this.isBindListVisible = false
    },
    
    closeAddDialog (isToFresh) {
      if (isToFresh) {
        this.getKeyLists()
      }
      this.createKeyDialog = false
    },

    closeSmsSetting () {
      this.isShowSmsSetting = false;
      this.getSmsLists();
    },

    closeEmailSetting () {
      this.isShowEmailSetting = false;
      this.getEmialLists();
    },

    createBind (row) {
      this.clientId = row.client_id
      this.isBindListVisible = true
      // this.$refs.bindList.getBindLists()
    },
    settingMore(row) {
      this.isShowmoreSetting = true;
      this.clientId = row.client_id;
      this.getSmsLists(1);
    },

    tabChange(tab) {
      this.smsTableData = [];
      if (tab.name === "first") {
        this.getSmsLists();
      }
      if (tab.name === "second") {
        this.getEmialLists();
      }
      if (tab.name === "third") {
        this.getProtocolLists();
      }
    },

    smsSetting() {
      this.isShowSmsSetting = true;
      this.smsData = null
    },
    emialSetting() {
      this.isShowEmailSetting = true;
      this.emailData = null
    },
    protocolSetting() {
      this.isShowProtocolSetting = true;
      this.addOrEditProtocol = 1;
      this.protocolUrl = COOP_PROTOCOL_ADD_POST;
      this.protocolForm.client_id = this.clientId;
      setTimeout(() => this.$refs.protocolForm.resetFields());
    },
    setNotifyUrl(row) {
      this.notifyData = row
      this.isToSetNotifyUrl = true;
    },

    updateSmsSetting(row) {
      this.isShowSmsSetting = true;
      this.smsData = row
    },
    updateEmailSetting(row) {
      this.isShowEmailSetting = true;
      this.emailData = row
    },
    updateProtocolSetting(row) {
      this.isShowProtocolSetting = true;
      this.addOrEditProtocol = 0;
      this.protocolUrl = COOP_PROTOCOL_ADD_POST;
      this.protocolForm.client_id = row.client_id;
      this.protocolForm.proto_lang = row.proto_lang === "zh" ? "CN" : row.proto_lang.toUpperCase();
      this.protocolForm.type = row.type;
      this.protocolForm.url_old = row.url;
    },
    jumpProtocolSetting(row) {
      window.open(row.url);
    },
    beforeClose(done) {
      this.tabName = "first";
      if (this.smsTableData) {
        this.smsTableData.data = [];
      }
      done.apply(this, null);
    },
    
    createProtocolSeting: _.debounce(function() {
      const loading = this.vmLoadingFull();
      try {
        this.$refs.protocolForm.validate(async valid => {
          if (valid) {
            if (!this.protocolForm.photo) {
              this.vmMsgWarning(this.$t("iot_plat_select_upload_file"));
              loading.close();
              return false;
            }
            if (this.addOrEditProtocol === 1) {
              // 添加协议
              this.protocolForm.url_old = "";
              for (const obj of this.smsTableData) {
                if (
                  obj.proto_lang === this.protocolForm.proto_lang
                  && obj.type === this.protocolForm.type
                ) {
                  this.protocolForm.url_old = obj.url;
                }
              }
            }
            const param = this.createFormData(this.protocolForm);
            const res = await this.$http.post(this.protocolUrl, param)
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess(this.$t("iot_plat_set_success"));
              this.$refs.protocolForm.resetFields();
              this.isShowProtocolSetting = false;
              this.getProtocolLists();
            }
            loading.close();
          }
        });  
      } catch (error) {
        loading.close();
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    }, this.DEBOUNCE_TIME),
    getKeyLists: _.debounce(async function() {
      try {
        this.tableOptions.loading = true;
        const res = await this.$http.post(GET_KEY_ID_POST)
        if (this.vmResponseHandler(res)) {
          this.tableData = res.data;
        }
        this.tableOptions.loading = false;
      } catch (error) {
        this.tableOptions.loading = false;
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    }, this.DEBOUNCE_TIME),
    createKey: function() {
      this.createKeyDialog = true;
    },

    getSmsLists: _.debounce(async function() {
      try {
        this.smsTableOptions.loading = true;
        const data = this.createFormData({
          client_id: this.clientId,
          page     : this.smsTableOptions.pageOptions.currentPage,
          page_size: this.smsTableOptions.pageOptions.pageSize
        });
        const res = await this.$http.post(COOP_SMS_QUERY_POST, data)
        if (this.vmResponseHandler(res)) {
          this.smsTableData = res.data.data;
          this.smsTableOptions.pageOptions.total = res.data.total;
        }
        this.smsTableOptions.loading = false;
      } catch (error) {
        this.smsTableOptions.loading = false;
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    }, this.DEBOUNCE_TIME),

    getEmialLists: _.debounce(async function() {
      try {
        this.emailTableOptions.loading = true;
        const data = this.createFormData({
          client_id: this.clientId,
          page     : this.emailTableOptions.pageOptions.currentPage,
          page_size: this.emailTableOptions.pageOptions.pageSize
        });
        const res = await this.$http.post(COOP_EMAIL_QUERY_POST, data)
        if (this.vmResponseHandler(res)) {
          this.smsTableData = res.data.data;
          this.emailTableOptions.pageOptions.total = res.data.total;
        }
        this.emailTableOptions.loading = false;
      } catch (error) {
        this.emailTableOptions.loading = false;
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    }),
    getProtocolLists: _.debounce(async function() {
      try {
        this.protocolTableOptions.loading = true;
        const data = this.createFormData({
          client_id: this.clientId,
          page     : this.protocolTableOptions.pageOptions.currentPage,
          page_size: this.protocolTableOptions.pageOptions.pageSize
        });
        const res = await this.$http.post(COOP_PROTOCOL_QUERY_POST, data)
        if (this.vmResponseHandler(res)) {
          this.smsTableData = res.data.data;
          this.protocolTableOptions.pageOptions.total = res.data.total;
        }
        this.protocolTableOptions.loading = false;
      } catch (error) {
        this.protocolTableOptions.loading = false;
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    }),
    //  文件上传
    sendFile() {
      const file = this.$refs.protocolFile.files[0];
      if (!file) { return false; }
      const suffixAry = file.name.split(".");
      const suffix = suffixAry[suffixAry.length - 1];
      if (suffix !== "html") {
        this.vmMsgError(this.$t("iot_plat_only_upload_html_file"));
        return false;
      }
      this.protocolForm.photo = file;
      this.picName = file.name;
    }
  }
};
</script>
<style scoped>
.picName {
  color: #ffffff;
  word-break: break-all;
}
.form-btn-upload {
  position: relative;
  display: inline-block;
  width: 8rem;
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
  filter: alpha(
    opacity=0
  ); /*兼容IE8及以下--filter属性是IE特有的，它还有很多其它滤镜效果，而filter: alpha(opacity=0); 兼容IE8及以下的IE浏览器(如果你的电脑IE是8以下的版本，使用某些效果是可能会有一个允许ActiveX的提示,注意点一下就ok啦)*/
  cursor: pointer;
}
</style>
<style>
.el-tabs {
  padding: 0 18px;
}
</style>
