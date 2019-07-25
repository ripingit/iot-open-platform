<template>
  <div class="container">
    <el-row class="app_nav">
      <h5>{{$t("iot_plat_app_version")}}</h5>
      <p>THE APP VERSION</p>
    </el-row>
    <el-row class="table">
      <el-row>
        <el-col :span="5">
          <!--<el-input
            placeholder="点击此处搜索"
            v-model="inputVal">
            <i slot="prefix" class="el-input__icon el-icon-search" @click="searchData()"></i>
          </el-input>-->
          <!-- <el-button
            icon="el-icon-plus"
            type="primary"
            circle
            v-if="vmHasAuth(CoopPermissionsLib.ADD_APP, tableData.res)"
            class="btn-circle-add" @click="onAddApp"></el-button> -->
          <!-- <el-button
            icon="el-icon-delete"
            type="danger"
            circle
            v-if="vmHasAuth(CoopPermissionsLib.DEL_APP, tableData.res)"
            class="btn-circle-delete" @click="onDeleteApp"></el-button> -->
        </el-col>
      </el-row>
      <el-row>
        <TableComponent class="sale-table"
            :options="tableOptions"
            :data="tableData.data"
            v-on:page-change="loadData"
            v-on:selection="handleSelectionChange">
          <template slot-scope="scope" slot="QrcodeUrl">
            <ScaleImgComponent :path="scope.row.QrcodeUrl" style="width:5rem;height:5rem" :alt="$t('iot_plat_qrcode')"></ScaleImgComponent>
            <p class="download" style="font-size: 12px; cursor: pointer" @click="download(scope.row.QrcodeUrl)">{{$t("iot_plat_download_qrcode")}}</p>
          </template>
          <template slot-scope="scope" slot="app_logo_url">
            <ScaleImgComponent :path="scope.row.app_logo_url" style="width:5rem;height:5rem" :alt="$t('iot_plat_logo')"></ScaleImgComponent>
          </template>
          <el-table-column :label="$t('iot_plat_operate')" width="150" slot="handler">
            <template slot-scope="scope">
              <el-button
                class="btn-circle"
                size="mini"
                icon="iconfont icon-bianji"
                circle
                v-if="vmHasAuth(CoopPermissionsLib.UPDATE_APP, tableData.res)"
                @click="updateApp(scope.row)"></el-button>
              <el-button
                class="btn-circle"
                size="mini"
                icon="iconfont icon-shengji"
                circle
                v-if="vmHasAuth(CoopPermissionsLib.ADD_APP, tableData.res)"
                @click="onUpgradeApp(scope.row)"></el-button>
              <el-button
                class="btn-circle"
                size="mini"
                icon="iconfont icon-gengduo"
                circle
                @click="onShowDetail(scope.$index)"></el-button>
            </template>
          </el-table-column>
        </TableComponent>
      </el-row>
    </el-row>
    <el-dialog
      :title="$t('iot_plat_app_upgrade')"
      center
      :visible.sync="dialogVisible"
      :close-on-click-modal="false">
      <el-form status-icon :model="ruleForm" :rules="rules" ref="ruleForm" label-position="right" label-width="140px" :hide-required-asterisk="true">
        <el-form-item :label="$t('iot_plat_app_name')" prop="app_name" class="form-row">
          <el-input v-model="ruleForm.app_name" readonly></el-input>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item :label="$t('iot_plat_app_id')" prop="client_id" class="form-row">
          <el-input v-model="ruleForm.client_id" readonly></el-input>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item :label="$t('iot_plat_version')" prop="ver" class="form-row">
          <el-input v-model="ruleForm.ver" :placeholder="$t('iot_plat_input_app_version')"></el-input>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item class="form-row" :label="$t('iot_plat_update_type')" prop="is_force_upd">
          <el-select v-model="ruleForm.is_force_upd" :placeholder="$t('iot_plat_select_update_type')" :no-data-text="$t('iot_plat_none_data')">
            <el-option :label="$t('iot_plat_force_update')" :value="1"></el-option>
            <el-option :label="$t('iot_plat_not_force_update')" :value="0"></el-option>
          </el-select>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item :label="$t('iot_plat_download_address')" prop="" class="form-row code-panel">
          <el-select v-model="storeName" :placeholder="$t('iot_plat_select_app_store')" :no-data-text="$t('iot_plat_none_data')" @change="appStoreChange">
            <el-option
              v-for="(item, index) in appStore"
              :key="index"
              :label="$t(item.name)"
              :value="item.id"></el-option>
          </el-select>
          <el-button @click="loadDownloadDialog" size="medium" type="primary">{{$t("iot_plat_more")}}</el-button>
          <div class="split-line"></div>
          <el-input v-model="storeUrl" :placeholder="$t('iot_plat_input_app_store')" @change="downloadUrlSet"></el-input>
          <UploadComponent
            v-if="vmHasAuth(CoopPermissionsLib.UPLOAD_APP, tableData.res)"
            class="uploader"
            ref="uploaderApp"
            :path="uploadPath"
            :accept="['application/vnd.android.package-archive']"
            :size="200"
            model="btn"
            :condition="$t('iot_plat_upload_apk_desc')" @response="getUploadResult"></UploadComponent>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item :label="$t('iot_plat_md5_value')" prop="md5" class="form-row">
          <el-input v-model="ruleForm.md5" :placeholder="$t('iot_plat_input_app_md5')"></el-input>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item :label="$t('iot_plat_upgrade_desc')" prop="change_log" class="form-row">
          <DescComponent v-model="ruleForm.change_log" :placeholder="$t('iot_plat_input_upgrade_desc')"></DescComponent>
        </el-form-item>
        <el-form-item class="form-row">
          <el-button type="primary" @click="submitForm" class="btn-submit">{{$t("iot_plat_submit")}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      :title="$t('iot_plat_app_upgrade_detail')"
      center
      :visible.sync="detailDialogVisible"
      :close-on-click-modal="false">
      <el-form label-width="100px">
        <el-form-item :label="$t('iot_plat_app_name')">
          <span class="detail_item">{{detailData.app_name}}</span>
        </el-form-item>
        <el-form-item :label="$t('iot_plat_version')">
          <span class="detail_item">{{detailData.ver}}</span>
        </el-form-item>
        <el-form-item :label="$t('iot_plat_md5_value')">
          <span class="detail_item">{{detailData.md5}}</span>
        </el-form-item>
        <!--<el-form-item label="升级描述">
          <span class="detail_item log-pre" v-html="vmEscapeToHTML(detailData.change_log)"></span>
        </el-form-item>-->
      </el-form>
    </el-dialog>

    <el-dialog
      center
      :title="$t('iot_plat_download_address')"
      width="56rem"
      :visible.sync="isDownloadDialogShow"
      :close-on-click-modal="false"
      :before-close="closeDownloadDialog">
      <el-form label-width="150px">
        <el-form-item v-for="(item, index) in appStore" :key="item.id" :label="$t(item.name)" class="form-row">
          <el-input v-model="ruleForm.url[index].url" :placeholder="$t('iot_plat_input_download_addr')"></el-input>
        </el-form-item>
        <el-form-item class="form-row">
          <el-button type="primary" @click="closeDownloadDialog" class="btn-submit">{{$t('iot_plat_confirm')}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <AppEditComponent :isVisible="isAppUpdateDialogVisible" :formData="updateData" @close="closeAppUpdateDialog"></AppEditComponent>
  </div>
</template>
<script>
import "@/assets/css/content.css"
import ScaleImgComponent from "@/components/preview-img/scale-img.vue"
import UploadComponent from "@/components/uploader/upload.vue"
import TableComponent from "@/components/table/table.vue";
import AppEditComponent from "./component/app-edit.vue"
import DescComponent from "@/components/multi-language-textarea/multi-language-textarea.vue"
import { APP_SELECT_POST, APP_ADD_POST, APP_DEL_POST, GET_CLIENT_NAME_POST, COOP_APP_UPLOAD_POST } from "@/lib/api.js"
import { appStore, noPicture } from "@/lib/const"
import _ from "lodash"
export default {
  components: { ScaleImgComponent, UploadComponent, TableComponent, AppEditComponent, DescComponent },
  data () {
    return {
      noPicturePath    : noPicture,
      appStore         : appStore,
      inputVal         : "",
      multipleSelection: [],
      tableData        : {
        data : [],
        res  : [],
        total: 0
      },
      tableOptions: {
        loading     : true,
        hasSelection: true,
        hasNumber   : true,
        pageOptions : {
          pageSize   : 10,
          total      : 0,
          currentPage: 1
        },
        columns: [
          {
            label: this.$t("iot_plat_app_name"),
            prop : "app_name",
            width: "120"
          },
          {
            label   : this.$t("iot_plat_logo"),
            prop    : "app_logo_url",
            slotName: "app_logo_url"
          },
          {
            prop : "ver",
            label: this.$t("iot_plat_version_number"),
            width: "130"
          },
          {
            prop : "add_time",
            label: this.$t("iot_plat_add_time"),
            width: 150
          },
          {
            prop : "client_id",
            label: this.$t("iot_plat_used_key"),
            width: "280"
          },
          {
            prop  : "is_force_upd",
            label : this.$t("iot_plat_update_type"),
            width : 120,
            render: value => {
              value === 0 ? this.$t("iot_plat_not_force_update") : this.$t("iot_plat_force_update");
            }
          },
          {
            prop    : "QrcodeUrl",
            label   : this.$t("iot_plat_qrcode"),
            slotName: "QrcodeUrl"
          }
        ]
      },
      uploadPath              : COOP_APP_UPLOAD_POST,
      storeName               : "",
      storeUrl                : "",
      loading                 : false,
      dialogVisible           : false,
      detailDialogVisible     : false,
      isDownloadDialogShow    : false,
      isAppUpdateDialogVisible: false,
      updateData              : {},
      ruleForm                : {
        client_id   : "",
        app_name    : "",
        ver         : "",
        change_log  : {},
        url         : appStore,
        md5         : "",
        is_force_upd: 0
      },

      bootAnimations: { pic1: "", url1: "", pic2: "", url2: "", pic3: "", url3: "" },
      updateStyle   : "update",
      rules         : {
        app_name: [
          { required: true, message: this.$t("iot_plat_input_app_name"), trigger: "input" }, { min: 3, max: 20, message: this.$t("iot_plat_str_length_limit_01"), trigger: "change" }
        ],
        change_log: [
          {
            validator: (rule, value, callback) => {
              if (!value.CN || !value.EN) {
                callback(new Error(this.$t("iot_plat_input_chinese_and_english_desc")))
              } else {
                callback()
              }
            },
            trigger: "input" 
          }
        ],
        client_id: [
          { required: true, message: this.$t("iot_plat_input_app_id"), trigger: "input" }
        ],
        ver: [
          { required: true, message: this.$t("iot_plat_input_version_number"), trigger: "input" }
        ],
        md5: [
          { required: true, message: this.$t("iot_plat_input_md5_value"), trigger: "input" }
        ]
      },
      detailData : {},
      clientNames: []
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    updateApp (row) {
      this.isAppUpdateDialogVisible = true;
      this.updateData = _.cloneDeep(row);
    },
    closeAppUpdateDialog (isToRefresh) {
      if (isToRefresh) {
        this.loadData()
      }
      this.isAppUpdateDialogVisible = false
    },
    getUploadResult (res) {
      if (res) {
        this.ruleForm.md5 = res.md5
        this.ruleForm.url[0].url = res.cn_url
        this.ruleForm.url[1].url = res.hk_url
        parseInt(this.storeName) === 0 && (this.storeUrl = res.cn_url)
        parseInt(this.storeName) === 1 && (this.storeUrl = res.hk_url)
      }
    },

    async getClientId () {
      try {
        const res = await this.$http.post(GET_CLIENT_NAME_POST)
        if (this.vmResponseHandler(res)) {
          this.clientNames = res.data.data
        }
      } catch (error) {
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    },
    searchData () {
      this.tableOptions.pageOptions.currentPage = 1
      this.loadData()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },

    onDeleteApp () {
      try {
        const ary = []
        for (const obj of this.multipleSelection) {
          ary.push(obj.client_id)
        }
        if (ary.length === 0) {
          return this.vmMsgWarning(this.$t("iot_plat_select_ready_delete_app"))
        }
        const data = this.createFormData({ client_id: ary })
        this.vmConfirm({
          msg            : this.$t("iot_plat_confirm_delete_data"),
          confirmCallback: async () => {
            const loading = this.vmLoadingFull()
            const res = await this.$http.post(APP_DEL_POST, data)
            loading.close()
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess(this.$t("iot_plat_delete_success"))
              this.loadData()
            }
          }
        })
      } catch (error) {
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    },

    onUpgradeApp (row) {
      this.dialogVisible = true
      this.ruleForm.app_name = row.app_name
      this.ruleForm.ver = row.ver
      this.ruleForm.change_log = !this.isJsonString(row.change_log) ? { CN: row.change_log } : JSON.parse(row.change_log)
      this.ruleForm.md5 = row.md5
      this.ruleForm.client_id = row.client_id
      this.ruleForm.is_force_upd = row.is_force_upd
      if (this.isJsonString(row.url)) {
        const parseObj = JSON.parse(row.url)
        for (const item of parseObj) {
          const tp = this.ruleForm.url.find(o => o.id === item.id)
          tp.url = item.url
        }
      } else {
        this.ruleForm.url[0].url = row.url
      }
      
      this.storeName = 0
      this.storeUrl = this.ruleForm.url[0].url
    },
    onShowDetail (ix) {
      this.detailDialogVisible = true
      this.detailData = JSON.parse(JSON.stringify(this.tableData.data[ix]))
    },

    downloadUrlSet () {
      const temp = this.ruleForm.url.find(o => o.id === parseInt(this.storeName))
      temp.url = this.storeUrl
    },

    appStoreChange () {
      const temp = this.ruleForm.url.find(o => o.id === parseInt(this.storeName))
      !temp ? this.storeUrl = "" : this.storeUrl = temp.url
    },

    changeClientId (val) {
      const temp = this.clientNames.find(o => o.app_name === val)
      this.ruleForm.client_id = temp.client_id
    },

    loadDownloadDialog () {
      this.isDownloadDialogShow = true
    },

    closeDownloadDialog () {
      this.storeUrl = this.ruleForm.url[0].url
      this.isDownloadDialogShow = false
    },

    submitForm: _.debounce(function () {
      if (!this.ruleForm.url[0].url) { this.vmMsgError(this.$t("iot_plat_android_universal_download_addr_required")); }
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          // 转成字符串传给后台
          const loading = this.vmLoadingFull()
          try {
            this.ruleForm.url = JSON.stringify(this.ruleForm.url)
            const data = this.createFormData(this.ruleForm)
            // 在转回数组以便前台显示
            this.ruleForm.url = JSON.parse(this.ruleForm.url)
            
            const res = await this.$http.post(APP_ADD_POST, data)
            loading.close()
            if (this.vmResponseHandler(res)) {
              this.dialogVisible = false
              this.$refs.ruleForm.resetFields()
              this.vmMsgSuccess(this.$t("iot_plat_operating_success"))
              this.loadData()
            }
          } catch (error) {
            loading.close()
            this.vmMsgError(this.$t("iot_plat_program_error"));
          }
        }
      })
    }, this.DEBOUNCE_TIME),
    loadData: _.debounce(async function () {
      try {
        const data = this.createFormData({
          page     : parseInt(this.tableOptions.pageOptions.currentPage),
          page_size: parseInt(this.tableOptions.pageOptions.pageSize)
        })
        this.tableOptions.loading = true
        const res = await this.$http.post(APP_SELECT_POST, data)
        if (this.vmResponseHandler(res)) {
          this.tableData = res.data
          this.tableData.data = this.tableData.data.map(o => {
            if (!o.app_logo_url) { o.app_logo_url = this.noPicturePath }
            return o
          })
          this.tableOptions.pageOptions.total = res.data.total
        }
        this.tableOptions.loading = false
      } catch (error) {
        this.tableOptions.loading = false
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    }, this.DEBOUNCE_TIME),

    // 下载图片
    download (data) {
      this.downloadFile(`${this.$t("iot_plat_qrcode")}.png`, data)
    },

    downloadFile (fileName, content) {
      const aLink = document.createElement("a")
      // new Blob([content]);
      const blob = this.base64ToBlob(content)

      const evt = document.createEvent("HTMLEvents")
      // initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
      evt.initEvent("click", true, true)
      aLink.download = fileName
      aLink.href = URL.createObjectURL(blob)

      // aLink.dispatchEvent(evt);
      aLink.click()
    },
    // base64转blob
    base64ToBlob (code) {
      const parts = code.split(";base64,")
      const contentType = parts[0].split(":")[1]
      const raw = window.atob(parts[1])
      const rawLength = raw.length

      const uInt8Array = new Uint8Array(rawLength)

      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i)
      }
      return new Blob([ uInt8Array ], { type: contentType })
    }
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
  .container /deep/ .el-dialog{
    width:54.17rem;
  }
  .download{
    color: #38a0f8;
  }
  .detail_item{
    color: #ffffff;
  }
  .split-line {
    width: 23rem;
    height: 1px;
    background: #797979;
    margin-left: 1rem;
    position: absolute;
    z-index: 1;
  }
  .code-panel .el-button {
    position: absolute;
    width: 5rem;
    height: 2.17rem;
    right: 12.5rem;
    top: 0.5rem;
    font-size: 1rem;
    background: #1f7ecf;
    border: none;
    padding: 0.56rem 0.83rem;
  }
  .code-panel .uploader {
    position: absolute;
    width: 5rem;
    height: 2.17rem;
    right: 12.5rem;
    top: 4rem;
    font-size: 1rem;
    border: none;
  }
  .uploader /deep/ .el-upload .only-btn {
    height: 2.17rem;
    width: 5rem;
    padding: 0.56rem 0.83rem;
    right: 0.3rem;
  }
  .uploader /deep/ .btn-progress {
    left: 0;
  }

  .el-dialog .form-btn-upload {
    display: inline-block;
    vertical-align: middle;
  }

  .start-boot .url {
    width: 12.5rem;
    vertical-align: top;
  }
  .start-boot .pic /deep/ .upload-left,
  .logo-pic /deep/ .upload-left {
    width: 8.33rem;
  }

</style>
