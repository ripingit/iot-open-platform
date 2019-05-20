<template>
  <div class="container">
    <el-row class="app_nav">
      <h5>APP版本</h5>
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
            <ScaleImgComponent :path="scope.row.QrcodeUrl" style="width:5rem;height:5rem" alt="二维码"></ScaleImgComponent>
            <p class="download" style="font-size: 12px; cursor: pointer" @click="download(scope.row.QrcodeUrl)">下载二维码</p>
          </template>
          <template slot-scope="scope" slot="app_logo_url">
            <ScaleImgComponent :path="scope.row.app_logo_url" style="width:5rem;height:5rem" alt="logo"></ScaleImgComponent>
          </template>
          <el-table-column label="操作" width="150" slot="handler">
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
      title="APP升级"
      center
      :visible.sync="dialogVisible"
      :close-on-click-modal="false">
      <el-form status-icon :model="ruleForm" :rules="rules" ref="ruleForm" label-position="right" label-width="100px" :hide-required-asterisk="true">
        <el-form-item label="APP名称" prop="app_name" class="form-row">
          <el-input v-model="ruleForm.app_name" readonly></el-input>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item label="APP ID" prop="client_id" class="form-row">
          <el-input v-model="ruleForm.client_id" readonly></el-input>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item label="版本" prop="ver" class="form-row">
          <el-input v-model="ruleForm.ver" placeholder="请输入app版本"></el-input>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item label="下载地址" prop="" class="form-row code-panel">
          <el-select v-model="storeName" placeholder="请选择应用商店" no-data-text="无数据" @change="appStoreChange">
            <el-option
              v-for="(item, index) in appStore"
              :key="index"
              :label="item.name"
              :value="item.id"></el-option>
          </el-select>
          <el-button @click="loadDownloadDialog" size="medium" type="primary">更多</el-button>
          <div class="split-line"></div>
          <el-input v-model="storeUrl" placeholder="请输入app下载地址" @change="downloadUrlSet"></el-input>
          <UploadComponent
            v-if="vmHasAuth(CoopPermissionsLib.UPLOAD_APP, tableData.res)"
            class="uploader"
            ref="uploaderApp"
            :path="uploadPath"
            :accept="['.apk']"
            :size="200"
            model="btn"
            condition="请上传小于200M的apk文件" @response="getUploadResult"></UploadComponent>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item label="MD5值" prop="md5" class="form-row">
          <el-input v-model="ruleForm.md5" placeholder="请输入app MD5值"></el-input>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item label="升级描述" prop="change_log" class="form-row">
          <DescComponent v-model="ruleForm.change_log" placeholder="请输入升级描述"></DescComponent>
        </el-form-item>
        <el-form-item class="form-row">
          <el-button type="primary" @click="submitForm" class="btn-submit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="APP升级详情"
      center
      :visible.sync="detailDialogVisible"
      :close-on-click-modal="false">
      <el-form label-width="100px">
        <el-form-item label="APP名称">
          <span class="detail_item">{{detailData.app_name}}</span>
        </el-form-item>
        <el-form-item label="版本">
          <span class="detail_item">{{detailData.ver}}</span>
        </el-form-item>
        <el-form-item label="MD5值">
          <span class="detail_item">{{detailData.md5}}</span>
        </el-form-item>
        <!--<el-form-item label="升级描述">
          <span class="detail_item log-pre" v-html="vmEscapeToHTML(detailData.change_log)"></span>
        </el-form-item>-->
      </el-form>
    </el-dialog>

    <el-dialog
      center
      title="下载地址"
      width="56rem"
      :visible.sync="isDownloadDialogShow"
      :close-on-click-modal="false"
      :before-close="closeDownloadDialog">
      <el-form label-width="150px">
        <el-form-item v-for="(item, index) in appStore" :key="item.id" :label="item.name" class="form-row">
          <el-input v-model="ruleForm.url[index].url" placeholder="请输入下载地址"></el-input>
        </el-form-item>
        <el-form-item class="form-row">
          <el-button type="primary" @click="closeDownloadDialog" class="btn-submit">确定</el-button>
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
import { appStore } from "@/lib/const"
import _ from "lodash"
export default {
  components: { ScaleImgComponent, UploadComponent, TableComponent, AppEditComponent, DescComponent },
  data () {
    return {
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
            label: "APP名称",
            prop : "app_name",
            width: "120"
          },
          {
            label   : "LOGO",
            prop    : "app_logo_url",
            slotName: "app_logo_url"
          },
          {
            prop : "ver",
            label: "版本号",
            width: "120"
          },
          {
            prop : "add_time",
            label: "添加时间",
            width: 150
          },
          {
            prop : "client_id",
            label: "使用KEY",
            width: "200"
          },
          {
            prop    : "QrcodeUrl",
            label   : "二维码",
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
        client_id : "",
        app_name  : "",
        ver       : "",
        change_log: {},
        url       : appStore,
        md5       : ""
      },

      bootAnimations: { pic1: "", url1: "", pic2: "", url2: "", pic3: "", url3: "" },
      updateStyle   : "update",
      rules         : {
        app_name: [
          { required: true, message: "请输入APP名称", trigger: "input" }, { min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "change" }
        ],
        change_log: [
          {
            validator: (rule, value, callback) => {
              if (!value.CN || !value.EN) {
                callback(new Error("请输入中文和英文描述"))
              } else {
                callback()
              }
            },
            trigger: "input" 
          }
        ],
        client_id: [
          { required: true, message: "请输入APP ID", trigger: "input" }
        ],
        ver: [
          { required: true, message: "请输入版本号", trigger: "input" }
        ],
        md5: [
          { required: true, message: "请输入MD5值", trigger: "input" }
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
        this.vmMsgError("程序错误！")
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
          return this.vmMsgWarning("请选择需要删除的app！")
        }
        const data = this.createFormData({ client_id: ary })
        this.vmConfirm({
          msg            : "确定删除该记录？",
          confirmCallback: async () => {
            const loading = this.vmLoadingFull()
            const res = await this.$http.post(APP_DEL_POST, data)
            loading.close()
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess("删除成功！")
              this.loadData()
            }
          }
        })
      } catch (error) {
        this.vmMsgError("程序错误！")
      }
    },

    onUpgradeApp (row) {
      this.dialogVisible = true
      this.ruleForm.app_name = row.app_name
      this.ruleForm.ver = row.ver
      this.ruleForm.change_log = !this.isJsonString(row.change_log) ? { CN: row.change_log } : JSON.parse(row.change_log)
      this.ruleForm.md5 = row.md5
      this.ruleForm.client_id = row.client_id
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
      if (!this.ruleForm.url[0].url) { this.vmMsgError("安卓通用下载地址为必填！"); }
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
              this.vmMsgSuccess("操作成功！")
              this.loadData()
            }
          } catch (error) {
            loading.close()
            this.vmMsgError("程序错误！")
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
          this.tableOptions.pageOptions.total = res.data.total
        }
        this.tableOptions.loading = false
      } catch (error) {
        this.tableOptions.loading = false
        this.vmMsgError("程序错误！")
      }
    }, this.DEBOUNCE_TIME),

    // 下载图片
    download (data) {
      this.downloadFile("二维码.png", data)
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
