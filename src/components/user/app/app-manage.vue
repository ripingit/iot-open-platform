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
          <el-button
            icon="el-icon-plus"
            type="primary"
            circle
            v-if="vmHasAuth(CoopPermissionsLib.ADD_APP, tableData.res)"
            class="btn-circle-add" @click="operationData('add')"></el-button>
          <el-button
            icon="el-icon-delete"
            type="danger"
            circle
            v-if="vmHasAuth(CoopPermissionsLib.DEL_APP, tableData.res)"
            class="btn-circle-delete" @click="operationData('delete')"></el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-table
          v-loading="loading"
          :data="tableData.data"
          @selection-change="handleSelectionChange"
          style="width: 100%;">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            type="index"
            min-width="100"
            label="编号">
          </el-table-column>
          <el-table-column
            prop="app_name"
            min-width="120"
            label="APP名称">
          </el-table-column>
          <el-table-column
            prop="ver"
            min-width="120"
            label="版本号">
          </el-table-column>
          <el-table-column
            prop="review_time"
            min-width="150"
            label="时间">
          </el-table-column>
          <el-table-column
            prop="client_id"
            min-width="200"
            label="使用KEY">
          </el-table-column>
          <el-table-column
            prop="QrcodeUrl"
            min-width="120"
            label="二维码">
            <template slot-scope="scope">
              <ScaleImgComponent :path="scope.row.QrcodeUrl" style="width:5rem;height:5rem" alt="图2"></ScaleImgComponent>
              <p class="download" style="font-size: 12px; cursor: pointer" @click="download(scope.row.QrcodeUrl)">下载二维码</p>
            </template>
          </el-table-column>
          <el-table-column
            prop=""
            label="操作"
            min-width="80">
            <template slot-scope="scope">
              <el-button
                class="btn-circle"
                size="mini"
                icon="iconfont icon-shengji"
                circle
                v-if="vmHasAuth(CoopPermissionsLib.ADD_APP, tableData.res)"
                @click="operationData('edit',scope.$index)"></el-button>
              <el-button
                class="btn-circle"
                size="mini"
                icon="iconfont icon-gengduo"
                circle
                @click="operationData('select',scope.$index)"></el-button>
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
      :title="updateStyle==='add' ? 'APP添加' : 'APP升级'"
      center
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :before-close="handleClose">
      <el-form status-icon :model="ruleForm" :rules="rules" ref="ruleForm" label-position="right" label-width="100px">
        <el-form-item label="升级方式" class="form-row">
          <span class="detail_item" v-show="updateStyle==='update'">更新</span>
          <span class="detail_item" v-show="updateStyle==='add'">添加</span>
        </el-form-item>
        <el-form-item label="APP名称" prop="app_name" class="form-row">
          <el-select v-model="ruleForm.app_name" placeholder="请选择app名称" no-data-text="无数据" v-show="updateStyle==='add'">
            <el-option
              v-for="(item, index) in clientNames"
              :key="index"
              :label="item"
              :value="item"></el-option>
          </el-select>
          <el-input v-model="ruleForm.app_name" readonly v-show="updateStyle==='update'"></el-input>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item label="APP ID" prop="client_id" class="form-row" v-if="updateStyle==='update'">
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
          <el-input type="textarea" :rows="6" placeholder="请输入升级描述" v-model="ruleForm.change_log"></el-input>
          <span class="form-tip">*</span>
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
      :close-on-click-modal="false"
      :before-close="handleClose">
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
        <el-form-item label="升级描述">
          <span class="detail_item log-pre" v-html="vmEscapeToHTML(detailData.change_log)"></span>
        </el-form-item>
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
  </div>
</template>
<script>
import '@/assets/css/content.css'
import ScaleImgComponent from '@/components/_ui/scale-img.vue'
import UploadComponent from '@/components/_ui/upload.vue'
import { APP_SELECT_POST, APP_ADD_POST, APP_DEL_POST, GET_CLIENT_NAME_POST, COOP_APP_UPLOAD_POST } from '@/lib/api.js'
import { appStore } from '@/lib/const'
import _ from 'lodash'
export default {
  components: { ScaleImgComponent, UploadComponent },
  data () {
    let validateIsEmpty = (rule, value, callback) => {
      if (value === '') {
        if (rule.field === 'app_name') {
          callback(new Error('请输入app名称'))
        } else if (rule.field === 'ver') {
          callback(new Error('请输入版本号'))
        } else if (rule.field === 'change_log') {
          callback(new Error('请输入升级描述'))
        } else if (rule.field === 'md5') {
          callback(new Error('请输入md5值'))
        } else if (rule.field === 'client_id') {
          callback(new Error('请输入App ID'))
        }
      }
      callback()
    }
    return {
      appStore: appStore,
      inputVal: '',
      multipleSelection: [],
      tableData: {
        data: [],
        res: []
      },
      selectParam: {
        page: 1,
        page_size: 20
      },
      uploadPath: COOP_APP_UPLOAD_POST,
      storeName: '',
      storeUrl: '',
      totalAll: 0,
      loading: false,
      dialogVisible: false,
      detailDialogVisible: false,
      isDownloadDialogShow: false,
      ruleForm: {
        client_id: '',
        app_name: '',
        ver: '',
        change_log: '',
        url: appStore,
        md5: ''
      },
      updateStyle: 'update',
      rules: {
        app_name: [
          { validator: validateIsEmpty, trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        client_id: [
          { validator: validateIsEmpty, trigger: 'blur' }
        ],
        ver: [
          { validator: validateIsEmpty, trigger: 'blur' }
        ],
        change_log: [
          { validator: validateIsEmpty, trigger: 'blur' }
        ],
        md5: [
          { validator: validateIsEmpty, trigger: 'blur' }
        ]
      },
      detailData: {},
      clientNames: []
    }
  },
  created () {
    this.loadData()
    document.body.addEventListener('keydown', this.keyCodeDown, false)
  },
  beforeDestroy () {
    document.body.removeEventListener('keydown', this.keyCodeDown, false)
  },
  methods: {
    keyCodeDown (e) {
      if (e.keyCode === 13) {
        if (this.updateStyle !== 'add') { return }
        this.submitForm()
      }
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

    getClientId () {
      this.$http.post(GET_CLIENT_NAME_POST).then(res => {
        if (this.vmResponseHandler(res)) {
          this.clientNames = res.data.data
        }
      }).catch(e => {
        this.vmMsgError('网络错误！')
      })
    },
    searchData () {
      this.selectParam.page = 1
      this.loadData()
    },
    handleCurrentChange (val) {
      this.selectParam.page = val
      this.loadData()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    operationData (type, ix) {
      if (type === 'select') {
        this.detailDialogVisible = true
        this.detailData = JSON.parse(JSON.stringify(this.tableData.data[ix]))
      } else if (type === 'add') {
        if (this.clientNames.length === 0) { this.getClientId() }
        this.updateStyle = 'add'
        this.dialogVisible = true
        for (let key in this.ruleForm) {
          key !== 'url' && (this.ruleForm[key] = '')
          if (key === 'url') {
            this.ruleForm.url.forEach(o => { o.url = '' })
          }
          this.storeName = this.appStore[0].id
          this.storeUrl = ''
        }
      } else if (type === 'edit') {
        this.updateStyle = 'update'
        this.dialogVisible = true
        for (let key in this.ruleForm) {
          let value = this.tableData.data[ix][key]
          // 存在老数据app下载地址为字符串的，需要将其转换成现在的数组格式
          if (key === 'change_log') {
            this.ruleForm[key] = this.vmEscapeToHTML(value)
          } else if (key === 'url') {
            if (this.isJsonString(value)) {
              let parseObj = JSON.parse(value)
              for (let item of parseObj) {
                let tp = this.ruleForm.url.find(o => o.id === item.id)
                tp.url = item.url
              }
            } else {
              this.ruleForm[key][0].url = value
            }
          } else {
            this.ruleForm[key] = value
          }
        }
        this.storeName = 0
        this.storeUrl = this.ruleForm.url[0].url
      } else {
        let data
        let ary = []
        for (let obj of this.multipleSelection) {
          ary.push(obj.app_name)
        }
        data = this.createFormData({
          app_name: JSON.stringify(ary)
        })
        this.vmConfirm({
          msg: '确定删除该记录？',
          confirmCallback: () => {
            let loading = this.vmLoadingFull()
            this.$http.post(APP_DEL_POST, data).then(res => {
              loading.close()
              if (this.vmResponseHandler(res)) {
                this.vmMsgSuccess('删除成功！')
                this.loadData()
              }
            }).catch(e => {
              loading.close()
              this.vmMsgError('网络错误！')
            })
          }
        })
      }
    },
    handleClose (done) {
      done()
    },

    downloadUrlSet () {
      let temp = this.ruleForm.url.find(o => o.id === parseInt(this.storeName))
      temp.url = this.storeUrl
    },

    appStoreChange () {
      let temp = this.ruleForm.url.find(o => o.id === parseInt(this.storeName))
      !temp ? (this.storeUrl = '') : (this.storeUrl = temp.url)
    },

    loadDownloadDialog () {
      this.isDownloadDialogShow = true
    },

    closeDownloadDialog () {
      this.storeUrl = this.ruleForm.url[0].url
      this.isDownloadDialogShow = false
    },

    submitForm: _.debounce(function () {
      if (!this.ruleForm.url[0].url) { this.vmMsgError('安卓通用下载地址为必填！'); return }
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.ruleForm.url = JSON.stringify(this.ruleForm.url) // 转成字符串传给后台
          let data = this.createFormData(this.ruleForm)
          this.ruleForm.url = JSON.parse(this.ruleForm.url) // 在转回数组以便前台显示
          let loading = this.vmLoadingFull()
          this.$http.post(APP_ADD_POST, data).then(res => {
            loading.close()
            if (this.vmResponseHandler(res)) {
              if (this.updateStyle === 'add') {
                this.selectParam.page = 1
              }
              this.dialogVisible = false
              this.vmMsgSuccess()
              this.loadData()
            }
          }).catch(e => {
            loading.close()
            this.vmMsgError('网络错误！')
          })
        } else {
          return false
        }
      })
    }, 300),
    loadData: _.debounce(function () {
      let data = this.createFormData(this.selectParam)
      this.loading = true
      this.$http.post(APP_SELECT_POST, data).then(res => {
        if (this.vmResponseHandler(res)) {
          this.tableData = res.data
          this.totalAll = res.data.total
        }
        this.loading = false
      }).catch(e => {
        this.loading = false
        this.vmMsgError('网络错误！')
      })
    }, 300),

    // 下载图片
    download (data) {
      this.downloadFile('二维码.png', data)
    },

    downloadFile (fileName, content) {
      let aLink = document.createElement('a')
      let blob = this.base64ToBlob(content) // new Blob([content]);

      let evt = document.createEvent('HTMLEvents')
      evt.initEvent('click', true, true) // initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
      aLink.download = fileName
      aLink.href = URL.createObjectURL(blob)

      // aLink.dispatchEvent(evt);
      aLink.click()
    },
    // base64转blob
    base64ToBlob (code) {
      let parts = code.split(';base64,')
      let contentType = parts[0].split(':')[1]
      let raw = window.atob(parts[1])
      let rawLength = raw.length

      let uInt8Array = new Uint8Array(rawLength)

      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i)
      }
      return new Blob([uInt8Array], {type: contentType})
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
</style>
