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
              <el-input
                placeholder="请输入内容">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>
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
                  prop="product_code"
                  label="型号"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="rom_ver"
                  label="固件版本">
                </el-table-column>
                <el-table-column
                  prop="upgrade_time"
                  label="最近一次更新">
                </el-table-column>
                <el-table-column
                  prop="is_review"
                  label="状态">
                  <template slot-scope="scope">
                    <span :class="scope.row.is_review === 9 ? 'wait'
                    : scope.row.is_review === 1 ? 'pass'
                    : scope.row.is_review === 2 ? 'reject' : ''">
                    {{scope.row.is_review === 9 ? '待审核'
                    : scope.row.is_review === 1 ? '已通过'
                    : scope.row.is_review === 2 ? '已驳回' : ''}}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="review_time"
                  label="审核时间">
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button
                      class="btn-circle"
                      size="mini"
                      icon="iconfont icon-gengduo"
                      circle
                      @click="showListDialog(scope.$index, scope.row)"></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-pagination
                @size-change="getFirmwareLists"
                @current-change="getFirmwareLists"
                :page-size="10"
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
              :label="item.product_name"
              :value="item.product_code">
            </el-option>
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
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入升级描述"
            v-model="form.change_log">
          </el-input>
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
  </div>
</template>

<script>
import '@/assets/css/content.css'
import TimeLineComponent from '../../_ui/time-line.vue'
import {
  GET_COOP_FIRMWARES_POST,
  COOP_FIRMWARES_UPLOAD_POST,
  COOP_FIRMWARES_ADD_POST,
  GET_COOP_FIRMWARE_HISTORY_POST } from '@/lib/api'

export default {
  components: { TimeLineComponent },
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
        }
      }
      callback()
    }
    return {
      form: {
        product_code: '',
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
      }
    }
  },
  created () {
    this.getFirmwareLists(1)
  },
  computed: {
    loading () {
      return this.tableData.data.length === 0 && this.tableData.status !== undefined
    }
  },
  methods: {
    getFirmwareLists (currentPage) {
      let data = this.createFormData({
        page: currentPage,
        page_size: 10
      })
      this.$http.post(GET_COOP_FIRMWARES_POST, data).then(res => {
        if (this.vmResponseHandler(res)) {
          this.tableData = res.data
          this.productCodes = res.data.product
        }
      }).catch(e => {
        this.vmMsgError('网络错误！')
      })
    },
    onBeforeUpload (file) {
      let sizeM = file.size / 1024 / 1024
      if (sizeM > 90) {
        this.vmMsgError('固件大小不能超过 90 M！')
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
      this.form.rom = event.percent + '%'
    },
    onUploadError (err, file, fileList) {
      this.isRomploading = false
      this.form.rom = ''
      this.vmMsgError(err)
    },

    submitFirmware () {
      this.$refs['updateForm'].validate((valid) => {
        if (valid) {
          this.$http.post(COOP_FIRMWARES_ADD_POST, this.createFormData(this.form)).then(res => {
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess('提交成功！')
              this.isDialogVisible = false
              this.getFirmwareLists(this.tableData.page)
              this.$refs['updateForm'].resetFields()
            }
          }).catch(() => {
            this.vmMsgError('网络错误！')
          })
        }
      })
    },
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
    }
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
/** 本页定制 end */
</style>
