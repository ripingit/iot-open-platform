<template>
  <div class="content-container">
    <el-row>
      <el-col :span="24">
          <p class="title-cn">固件管理</p>
          <p class="title-en">THE FRIMWARE MANAGEMENT</p>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <div class="table">
          <el-row>
            <el-col :span="5">
              <!--<el-input
                placeholder="请输入内容">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>-->
              <el-button @click="showAddDialog" class="btn-circle-delete" type="primary" icon="iconfont icon-tianjia" circle></el-button>
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
                  prop="product_name"
                  label="型号名称"
                  width="200">
                </el-table-column>
                <el-table-column
                  prop="product_code"
                  label="型号代码"
                  width="150">
                </el-table-column>
                <el-table-column
                  prop="rom_ver"
                  label="固件版本">
                </el-table-column>
                <el-table-column
                  prop="rom_type"
                  label="固件类型">
                  <template slot-scope="scope">
                  {{ firmwareTypeCode[scope.row.rom_type] }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="upgrade_time"
                  label="最近一次更新">
                </el-table-column>
                <el-table-column
                  prop="is_review"
                  label="状态">
                  <template slot-scope="scope">
                    <span :class="scope.row.is_review === 0 ? 'wait'
                    : scope.row.is_review === 1 ? 'pass'
                    : scope.row.is_review === 2 ? 'reject' : ''">
                    {{scope.row.is_review === 0 ? '待审核'
                    : scope.row.is_review === 1 ? '已通过'
                    : scope.row.is_review === 2 ? '已驳回' : ''}}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="review_time"
                  label="审核时间">
                </el-table-column>
                <el-table-column
                  prop="upload_status"
                  label="上传状态">
                  <template slot-scope="scope">
                    {{ scope.row.upload_status ? scope.row.upload_status.join('') : '' }}
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <el-button
                      class="btn-circle"
                      size="mini"
                      icon="iconfont icon-gengduo"
                      circle
                      @click="showListDialog(scope.$index, scope.row)"></el-button>
                    <el-button
                      class="btn-circle"
                      size="mini"
                      icon="el-icon-upload"
                      circle
                      @click="showReleaseDialog(scope.row)"></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-pagination
                v-if="tableData.data.length !== 0"
                @size-change="getFirmwareLists"
                @current-change="getFirmwareLists"
                :page-size="20"
                layout="prev, pager, next, jumper"
                :total="tableData.total">
              </el-pagination>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>

    <el-dialog title="更新版本" :visible.sync="isDialogVisible" center>
      <el-form label-position="right" status-icon label-width="100px" :model="form" :rules="rules" ref="updateForm">
        <el-form-item class="form-row" label="选择型号" prop="product_code">
          <el-select v-model="form.product_code" placeholder="请选择固件型号" no-data-text="请先添加设备型号">
            <el-option
              v-for="item in productCodes"
              :key="item.product_code"
              :label="item.product_code"
              :value="item.product_code">
            </el-option>
          </el-select>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item class="form-row" label="固件类型" prop="rom_type">
          <el-select v-model="form.rom_type" placeholder="请选择固件类型" no-data-text="无数据">
            <el-option label="正式" :value="1"></el-option>
            <el-option label="临时" :value="2"></el-option>
            <el-option label="灰度" :value="3"></el-option>
          </el-select>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item class="form-row" label="固件版本" prop="rom_ver">
          <el-input v-model="form.rom_ver" auto-complete="off" placeholder="请输入固件版本"></el-input>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item class="form-row code-panel" label="固件上传" prop="rom">
          <el-input v-model="form.rom" auto-complete="off" placeholder="请上传固件"></el-input>
          <div class="form-btn-upload">
            <i class='el-icon-loading' v-if="isRomploading"></i>
            <el-upload v-else
                :action="uploadPath"
                name="photo"
                :before-upload="onBeforeUpload"
                :on-success="onUploadSuccess"
                :on-progress="onUploadProgress"
                :on-error="onUploadError"
                :show-file-list="false">
              <el-button class="btn-upload" size="small" type="primary">上传</el-button>
            </el-upload>
          </div>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item class="form-row" label="MD5值" prop="md5">
          <el-input v-model="form.md5" auto-complete="off" readonly placeholder="固件上传后自动填写"></el-input>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item class="form-row" label="升级描述" prop="change_log">
          <quill-editor ref="myTextEditor"
                        v-model="form.change_log"
                        :options="editorOption">
          </quill-editor>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item class="form-row">
          <el-button class="btn-submit" type="primary" @click="submitFirmware">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="固件升级记录" :visible.sync="isDialogVisibleList" center>
      <TimeLineComponent :data="historyRecord" :loading="isGetHistory"></TimeLineComponent>
    </el-dialog>

    <el-dialog title="发布条件" :visible.sync="isDialogVisibleRelease" center>
      <el-form label-position="right" status-icon label-width="100px" :model="formRelease" :rules="rules" ref="releaseForm">
        <el-form-item class="form-row" label="升级地区" prop="country_id">
          <el-select v-model="formRelease.country_id" placeholder="请选择升级地区" no-data-text="无数据">
            <el-option
              v-for="item in countrys"
              :key="item.code"
              :label="item.name"
              :value="item.code"></el-option>
          </el-select>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item class="form-row" label="经销商" prop="dealer">
          <el-select v-model="formRelease.dealer" placeholder="请选择经销商" no-data-text="无数据">
            <el-option label="正式" :value="1"></el-option>
            <el-option label="临时" :value="2"></el-option>
            <el-option label="灰度" :value="3"></el-option>
          </el-select>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item class="form-row" label="升级版本" prop="rom_ver">
          <el-select v-model="formRelease.rom_ver" placeholder="请选择升级版本" no-data-text="无数据">
            <el-option
              v-for="item in romVersion"
              :key="item.rom_ver"
              :label="item.rom_ver"
              :value="item.rom_ver"></el-option>
          </el-select>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item class="form-row code-panel" label="升级到版本" prop="target_rom_ver">
          <el-select v-model="formRelease.target_rom_ver" @change="romVersionChange" placeholder="请选择升级到版本" no-data-text="无数据">
            <el-option
              v-for="item in romVersion"
              :key="item.rom_ver"
              :label="item.rom_ver"
              :value="item.rom_ver"></el-option>
          </el-select>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item class="form-row" label="选择的版本为" prop="pub_ver_type">
          <el-input v-model="formRelease.pub_ver_type" disabled auto-complete="off" readonly placeholder="自动填写"></el-input>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item class="form-row" label="升级数量" prop="update_percent">
          <el-input v-model="formRelease.update_percent" auto-complete="off" placeholder="固件上传后自动填写"></el-input>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item class="form-row code-panel" label="更新类型" prop="if_force_upd">
          <el-select v-model="formRelease.if_force_upd" placeholder="请选择更新类型" no-data-text="无数据">
            <el-option label="强制更新" :value="1"></el-option>
            <el-option label="非强制更新" :value="2"></el-option>
          </el-select>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item class="form-row" label="上次升级数量" prop="md5">
          <el-input v-model="form.md5" auto-complete="off" placeholder="固件上传后自动填写"></el-input>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item class="form-row">
          <el-button class="btn-submit" type="primary" @click="submitFirmware">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import '@/assets/css/content.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import TimeLineComponent from '../../_ui/time-line.vue'
import { quillEditor } from 'vue-quill-editor'
import {
  GET_COOP_FIRMWARES_POST,
  COOP_FIRMWARES_UPLOAD_POST,
  COOP_FIRMWARES_ADD_POST,
  GET_COOP_FIRMWARE_HISTORY_POST,
  GET_ROM_VER_POST,
  FIRMWARE_RELEASE_POST } from '@/lib/api'
import { country } from '@/lib/const'
import _ from 'lodash'
export default {
  components: { TimeLineComponent, quillEditor },
  data () {
    let validateIsEmpty = (rule, value, callback) => {
      if (value === '') {
        if (rule.field === 'product_code') {
          callback(new Error('请选择固件型号'))
        } else if (rule.field === 'rom_ver') {
          callback(new Error('请输入固件版本'))
        } else if (rule.field === 'rom') {
          callback(new Error('请上传固件'))
        } else if (rule.field === 'md5') {
          callback(new Error('请输入MD5值'))
        } else if (rule.field === 'change_log') {
          callback(new Error('请输入升级描述'))
        } else if (rule.field === 'rom_type') {
          callback(new Error('请选择固件类型'))
        }
      }
      callback()
    }
    return {
      loading: false,
      countrys: country,
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
        placeholder: '请输入升级描述'
      },
      form: {
        product_code: '',
        rom_type: '',
        rom_ver: '',
        rom: '',
        md5: '',
        change_log: ''
      },
      isGetHistory: false,
      historyRecord: [],
      productCodes: [],
      uploadPath: COOP_FIRMWARES_UPLOAD_POST,
      isRomploading: false,
      isDialogVisible: false,
      isDialogVisibleList: false,
      isDialogVisibleRelease: false,
      tableData: {
        data: [],
        page: '1',
        pageAll: 1,
        product: [],
        total: 1
      },
      rules: {
        product_code: [
          { validator: validateIsEmpty, trigger: 'change' }
        ],
        rom_type: [
          { validator: validateIsEmpty, trigger: 'change' }
        ],
        rom_ver: [
          { validator: validateIsEmpty, trigger: 'change' }
        ],
        rom: [
          { validator: validateIsEmpty, trigger: 'change' }
        ],
        md5: [
          { validator: validateIsEmpty, trigger: 'change' }
        ],
        change_log: [
          { validator: validateIsEmpty, trigger: 'change' }
        ]
      },
      formRelease: {
        country_id: '',
        dealer: '',
        device_id: '',
        rom_ver: '',
        target_rom_ver: '',
        update_percent: '',
        if_force_upd: '',
        pub_ver_type: ''
      },
      romVersion: []
    }
  },
  created () {
    this.getFirmwareLists(1)
    document.body.addEventListener('keydown', this.keyCodeDown, false)
  },
  beforeDestroy () {
    document.body.removeEventListener('keydown', this.keyCodeDown, false)
  },
  methods: {
    keyCodeDown (e) {
      if (e.keyCode === 13) {
        this.submitFirmware()
      }
    },
    getFirmwareLists: _.debounce(function (currentPage) {
      let data = this.createFormData({
        page: currentPage,
        page_size: 20
      })
      this.loading = true
      this.$http.post(GET_COOP_FIRMWARES_POST, data).then(res => {
        if (this.vmResponseHandler(res)) {
          this.tableData = res.data
          this.productCodes = res.data.product
        }
        this.loading = false
      }).catch(e => {
        this.loading = false
        this.vmMsgError('网络错误！')
      })
    }, 300),
    onBeforeUpload (file) {
      let sizeM = file.size / 1024 / 1024
      if (sizeM > 80) {
        this.vmMsgError('固件大小不能超过 80 M！')
        return false
      }
    },
    onUploadSuccess (response, file, fileList) {
      this.isRomploading = false
      // 上传
      if (response.statu === 0) {
        this.$router.push('/signin'); return
      }

      if (!response.status) {
        this.form.rom = ''
        this.vmMsgError(response.msg); return
      }
      this.form.rom = file.name
      this.form.md5 = response.md5
    },
    onUploadProgress (event, file, fileList) {
      this.isRomploading = true
      this.form.rom = Math.ceil(event.percent) + '%'
    },
    onUploadError (err, file, fileList) {
      this.isRomploading = false
      this.form.rom = ''
      this.vmMsgError(err)
    },
    // codeChange (args) {
    //   let temp = this.productCodes.find(o => o.product_code === args)
    //   if (temp) {
    //     if (temp.prodt_code.includes('YHUB')) { this.isShow = true } else { this.isShow = false }
    //     this.form.rom_ver = temp.rom_ver
    //   }
    // },
    romVersionChange (value) {
      let romType = this.romVersion.find(o => o.rom_ver === value).rom_type
      let verType = this.firmwareVerCode[romType]
      this.formRelease.pub_ver_type = verType || '未知'
    },
    submitFirmware: _.debounce(function () {
      this.$refs['updateForm'].validate((valid) => {
        if (valid) {
          let wait = this.vmLoadingFull()
          this.$http.post(COOP_FIRMWARES_ADD_POST, this.createFormData(this.form)).then(res => {
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess('提交成功！')
              this.isDialogVisible = false
              this.getFirmwareLists(this.tableData.page)
              this.$refs['updateForm'].resetFields()
            }
            this.isShow = false
            wait.close()
          }).catch(() => {
            wait.close()
            this.isShow = false
            this.vmMsgError('网络错误！')
          })
        }
      })
    }, 300),
    showAddDialog () {
      this.isDialogVisible = true
    },
    showListDialog (index, row) {
      this.isDialogVisibleList = true
      this.isGetHistory = true
      let data = this.createFormData({
        product_code: row.product_code
      })
      this.$http.post(GET_COOP_FIRMWARE_HISTORY_POST, data).then(res => {
        this.isGetHistory = false
        if (this.vmResponseHandler(res)) {
          this.historyRecord = res.data.data
        }
      }).catch(() => {
        this.isGetHistory = false
        this.vmMsgError('网络错误！')
      })
    },
    showReleaseDialog (row) {
      this.isDialogVisibleRelease = true
      this.getRomVer(row.product_code)
    },

    getRomVer (code) {
      this.$http.post(GET_ROM_VER_POST, this.createFormData({product_code: code})).then(res => {
        if (this.vmResponseHandler(res)) {
          this.romVersion = res.data.data
        }
      }).catch(() => {
        this.vmMsgError('网络错误！')
      })
    },

    addDeviceVersion: _.debounce(function () {
      this.$refs['updateForm'].validate((valid) => {
        if (valid) {
          let wait = this.vmLoadingFull()
          this.$http.post(FIRMWARE_RELEASE_POST, this.createFormData(this.form)).then(res => {
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess('提交成功！')
              this.isDialogVisible = false
              this.getFirmwareLists(this.tableData.page)
              this.$refs['updateForm'].resetFields()
            }
            this.isShow = false
            wait.close()
          }).catch(() => {
            wait.close()
            this.isShow = false
            this.vmMsgError('网络错误！')
          })
        }
      })
    }, 300)
  }
}
</script>

<style scoped>
/** 本页定制 start */
.el-dialog__wrapper /deep/ .el-dialog{
  width: 50rem;
}
.el-dialog .btn-submit {
  margin-top: 4.33rem;
}
.code-panel{
  position: relative;
}
.code-panel .form-btn-upload {
  display: inline-block;
  vertical-align: middle;
}
.code-panel .el-icon-loading {
  position: absolute;
  right: 6.67rem;
  color: #fff;
  top: 1.1rem;
}
.code-panel .el-button {
  position: absolute;
  width: 5rem;
  height: 2.17rem;
  right: 6.5rem;
  top: 0.6rem;
  font-size: 1rem;
  background: #1f7ecf;
  border: none;
  padding: 0.56rem 0.83rem;
}

.wait {
  color: #b3b3b3;
}
.pass {
  color: #2acba7;
}
.reject {
  color: #ff5d66;
}

.el-radio /deep/ .el-radio__label {
  color: #fff;
}
/** 本页定制 end */
</style>
