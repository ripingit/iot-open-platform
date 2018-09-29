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
              <el-button
                @click="showAddDialog"
                class="btn-circle-delete"
                type="primary"
                v-if="vmHasAuth(CoopPermissionsLib.ADD_FIREWARE, tableData.res)"
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
                <!-- <el-table-column
                  prop="upload_status"
                  label="分发状态">
                  <template slot-scope="scope">
                    <span :class="scope.row.upload_status.join('') === '' ? 'wait' : scope.row.upload_status.join('') === 'success' ? 'pass' : 'reject'">
                       {{ scope.row.upload_status.join('') === '' ? '分发中' : scope.row.upload_status.join('') === 'success' ? '成功' : '失败' }}
                    </span>
                  </template>
                </el-table-column> -->
                <el-table-column label="操作" width="120"
                  v-if="vmHasAuth(CoopPermissionsLib.RECORD_UPDATE_FIREWARE, tableData.res) || vmHasAuth(CoopPermissionsLib.RELEASE_FIREWARE, tableData.res)">
                  <template slot-scope="scope">
                    <el-button
                      class="btn-circle"
                      size="mini"
                      icon="iconfont icon-gengduo"
                      circle
                      v-if="vmHasAuth(CoopPermissionsLib.RECORD_UPDATE_FIREWARE, tableData.res)"
                      @click="showListDialog(scope.$index, scope.row)"></el-button>
                    <el-button
                      class="btn-circle"
                      size="mini"
                      icon="iconfont icon-shengji"
                      circle
                      v-if="vmHasAuth(CoopPermissionsLib.RELEASE_FIREWARE, tableData.res)&&scope.row.is_review === 1"
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

    <el-dialog title="更新版本" :visible.sync="isDialogVisible" center class="update" :before-close="closeDialog">
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
          <el-input type="textarea" :rows="6" placeholder="请输入升级描述" wrap="hard" v-model="form.change_log"></el-input>
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
      <el-form label-position="right" status-icon label-width="140px" :model="formRelease" :rules="releaseRules" ref="releaseForm">
        <el-form-item class="form-row" label="本次版本">
          <span class="pTxt">{{formRelease.target_rom_ver}}</span>
        </el-form-item>
        <el-form-item class="form-row" label="升级类型">
          <span class="pTxt">{{ firmwareTypeCode[formRelease.pub_ver_type] || '未知'}}</span>
        </el-form-item>
        <el-form-item class="form-row" label="选择升级版本" v-if="formRelease.pub_ver_type !== firmwareTypeMap.GRAYSCALE">
          <el-select v-model="formRelease.rom_ver" multiple collapse-tags placeholder="请选择升级版本" no-data-text="无数据" @change="selectAllRom_ver">
            <el-option label="全选" value="all"></el-option>
            <el-option
              v-for="item in romVersion"
              :key="item.rom_ver"
              :label="item.rom_ver"
              :value="item.rom_ver"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="form-row code-panel" label="更新类型" prop="if_force_upd">
          <el-select v-model="formRelease.if_force_upd" placeholder="请选择更新类型" no-data-text="无数据">
            <el-option label="强制更新" :value="2"></el-option>
            <el-option label="非强制更新" :value="1"></el-option>
          </el-select>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item class="form-row number" prop="update_percent" :label="formRelease.pub_ver_type === firmwareTypeMap.GRAYSCALE ? '' : '升级百分比'">
          <el-input v-model="formRelease.update_percent" auto-complete="off" :style="{width: formRelease.pub_ver_type === firmwareTypeMap.FORMAL ? '25rem' : '18rem'  }" v-if="formRelease.pub_ver_type !== firmwareTypeMap.GRAYSCALE">
            <span slot="suffix">%</span>
          </el-input>
          <el-button @click="showDeviceID" class="btn-deviceid-add" size="medium" type="primary" v-if="formRelease.pub_ver_type !== firmwareTypeMap.FORMAL">设备ID</el-button>
          <el-button @click="cancelRelease" class="btn-deviceid-add" size="medium" type="primary" v-if="formRelease.pub_ver_type === firmwareTypeMap.GRAYSCALE">撤销</el-button>
          <!-- <span class="form-tip">*</span> -->
        </el-form-item>
        <el-form-item class="form-row" label="升级地区" v-if="formRelease.pub_ver_type !== firmwareTypeMap.GRAYSCALE">
          <el-select v-model="formRelease.country_id" multiple collapse-tags placeholder="请选择升级地区" @change="selectAllCountry_id" no-data-text="无数据">
            <el-option label="全选" value="all"></el-option>
            <el-option
              v-for="item in countryIds"
              :key="item.country_id"
              :label="item.name"
              :value="item.country_id"></el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item class="form-row code-panel" label="经销商" v-if="formRelease.pub_ver_type !== firmwareTypeMap.GRAYSCALE">
          <el-select v-model="formRelease.dealer" placeholder="请选择经销商" no-data-text="无数据" @change="selectAllDealer">
            <el-option label="全选" value="all"></el-option>
          </el-select>
          <span class="form-tip">*</span>
        </el-form-item>-->
        <el-form-item class="form-row" label="上次升级完成数量">
          <span class="pTxt">{{deviceIDForm.update_done_num}}</span>
        </el-form-item>
        <el-form-item class="form-row">
          <el-button class="btn-submit" type="primary" @click="addDeviceVersion">发布条件</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="设备ID" :visible.sync="deviceIdVisible" center>
      <el-form label-position="right" label-width="100px" :model="deviceIDForm" ref="deviceIDForm">
        <el-form-item class="form-row" label="设备ID">
          <el-input type="textarea" rows="6" resize="none" v-model="deviceIDForm.device_id" placeholder="设备ID，每行一个" @keyup.enter.native="testDeviceId" @keyup.delete.native="testDeviceId"></el-input>
        </el-form-item>
        <el-form-item class="form-row">
          <span class="pTxt">共：{{deviceIDForm.total}}</span>
          <span class="gap pTxt">重复：{{deviceIDForm.repeat}}</span>
          <span class="gap pTxt">成功：{{deviceIDForm.succeed}}</span>
        </el-form-item>
        <el-form-item class="form-row">
          <el-button class="btn-submit" type="primary" @click="addDeviceID">确定</el-button>
        </el-form-item>
      </el-form>
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
  GET_COOP_FIRMWARE_HISTORY_POST,
  GET_ROM_VER_POST,
  FIRMWARE_RELEASE_POST,
  COOP_CANCEL_RELEASE } from '@/lib/api'
import { countrys } from '@/lib/const'
import _ from 'lodash'
export default {
  components: { TimeLineComponent },
  data () {
    let reg = /^[0-9]*$/
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
    let releaseIsEmpty = (rule, value, callback) => {
      if (value === '') {
        if (rule.field === 'if_force_upd') {
          callback(new Error('请选择更新类型'))
        }
      } else {
        if (rule.field === 'update_percent') {
          if (!reg.test(value) || (parseInt(value) < 0 || parseInt(value) > 100)) {
            callback(new Error('只能输入0-100的数字'))
          }
        }
      }
      callback()
    }
    return {
      loading: false,
      countrys: countrys,
      form: {
        product_code: '',
        rom_type: '',
        rom_ver: '',
        rom: '',
        md5: '',
        change_log: ''
      },
      deviceIDForm: {
        update_done_num: '',
        device_id: '',
        total: 0,
        repeat: 0,
        succeed: 0
      },
      formRelease: {
        product_code: '',
        country_id: [],
        dealer: '',
        device_id: '',
        rom_ver: [],
        target_rom_ver: '',
        update_percent: '',
        if_force_upd: [],
        pub_ver_type: ''
      },
      releaseTargetVer: '',
      isGetHistory: false,
      historyRecord: [],
      productCodes: [],
      uploadPath: COOP_FIRMWARES_UPLOAD_POST,
      deviceIdVisible: false,
      isRomploading: false,
      isDialogVisible: false,
      isDialogVisibleList: false,
      isDialogVisibleRelease: false,
      tableData: {
        data: [],
        page: '1',
        pageAll: 1,
        product: [],
        total: 1,
        res: []
      },
      romVersion: [],
      countryIds: [{
        country_id: 'CN',
        name: '中国'
      }, {
        country_id: 'US',
        name: '美国'
      }, {
        country_id: 'BR',
        name: '巴西'
      }, {
        country_id: 'AE',
        name: '阿联酋'
      }, {
        country_id: 'DZ',
        name: '阿尔及利亚'
      }],
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
      releaseRules: {
        update_percent: [
          { validator: releaseIsEmpty, trigger: 'change' }
        ],
        if_force_upd: [
          { validator: releaseIsEmpty, trigger: 'change' }
        ]
      }
    }
  },
  created () {
    this.getFirmwareLists(1)
  },
  beforeDestroy () {
  },
  methods: {
    showAddDialog () {
      this.isDialogVisible = true
    },
    showListDialog (index, row) {
      this.isDialogVisibleList = true
      this.isGetHistory = true
      let data = this.createFormData({
        product_code: row.product_code,
        rom_type: row.rom_type
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
            wait.close()
          }).catch(() => {
            wait.close()
            this.vmMsgError('网络错误！')
          })
        }
      })
    }, 300),
    showReleaseDialog (row) {
      setTimeout(() => this.$refs['releaseForm'].resetFields(), 300)
      this.isDialogVisibleRelease = true
      this.getRomVer(row.product_code, row.rom_ver, row.rom_type)
    },

    getRomVer (code, ver, type) {
      this.formRelease.product_code = code
      this.formRelease.target_rom_ver = ver
      this.formRelease.pub_ver_type = type
      this.$http.post(GET_ROM_VER_POST, this.createFormData({product_code: code, rom_ver: ver, rom_type: type})).then(res => {
        if (this.vmResponseHandler(res)) {
          this.releaseTargetVer = res.data.data.target_rom_ver
          this.romVersion = res.data.romver
          this.formRelease.rom_ver = res.data.data.rom_ver
          this.formRelease.update_percent = res.data.data.update_percent
          this.formRelease.country_id = res.data.data.country_id
          this.formRelease.if_force_upd = res.data.data.if_force_upd
          this.formRelease.device_id = res.data.data.device_id.join('\n')
          this.deviceIDForm.update_done_num = res.data.data.update_done_num
        }
      }).catch(() => {
        this.vmMsgError('网络错误！')
      })
    },
    selectAllRom_ver (val) {
      let allValues = ['all']
      if (val.includes('all')) {
        // 保留所有版本值
        for (let item of this.romVersion) {
          allValues.push(item.rom_ver)
        }
        this.formRelease.rom_ver = allValues
      }
    },
    selectAllCountry_id (val) {
      let allValues = []
      if (val.includes('all')) {
        // 保留所有版本值
        for (let item of this.countryIds) {
          allValues.push(item.country_id)
        }
        this.formRelease.country_id = allValues
      }
    },
    selectAllDealer (val) {
    },
    showDeviceID () {
      this.deviceIdVisible = true
      this.deviceIDForm.device_id = this.formRelease.device_id
      this.testDeviceId()
    },
    testDeviceId () {
      let ary = this.deviceIDForm.device_id.split(/[\n,]/g)
      let nAry = ary.filter(function (val) {
        return val !== ''
      })
      let succeedAry = new Set(nAry)
      this.deviceIDForm.total = nAry.length
      this.deviceIDForm.succeed = succeedAry.size
      this.deviceIDForm.repeat = this.deviceIDForm.total - this.deviceIDForm.succeed
    },
    addDeviceID () {
      this.deviceIdVisible = false
      this.formRelease.device_id = this.deviceIDForm.device_id
    },

    addDeviceVersion: _.debounce(function () {
      this.$refs['releaseForm'].validate((valid) => {
        if (valid) {
          // 临时版本，如果填写了设备ID，而升级版本、升级百分比、升级地区填写错误或不完整，提示仅升级设备ID内的设备
          if (this.formRelease.device_id && this.formRelease.pub_ver_type === this.firmwareTypeMap.TEMP &&
          (!this.formRelease.update_percent || this.formRelease.rom_ver.length === 0 || this.formRelease.country_id.length === 0)) {
            this.vmConfirm({
              msg: '升级条件中：升级版本、升级百分比、升级地区中填写错误或不完整，仅会升级设备ID内的设备。需要继续吗？',
              confirmCallback: this.releaseVerRequest
            })
          } else {
            this.releaseVerRequest()
          }
        }
      })
    }, 300),

    releaseVerRequest () {
      let wait = this.vmLoadingFull()
      let data = Object.assign({}, this.formRelease)
      if (data.rom_ver.includes('all')) { data.rom_ver = ['all'] }
      this.$http.post(FIRMWARE_RELEASE_POST, this.createFormData(data)).then(res => {
        if (this.vmResponseHandler(res)) {
          this.vmMsgSuccess('提交成功！')
          this.isDialogVisibleRelease = false
          this.getFirmwareLists(this.tableData.page)
        }
        wait.close()
      }).catch(() => {
        wait.close()
        this.vmMsgError('网络错误！')
      })
    },

    closeDialog (done) {
      if (this.isRomploading) { return false } else { done() }
    },

    // 撤销发布条件
    cancelRelease: _.debounce(function () {
      if (!this.formRelease.device_id) { this.vmMsgError('无发布条件，无法撤销'); return }
      if (!this.releaseTargetVer) { this.vmMsgWarning('请稍后再试！'); return }
      let wait = this.vmLoadingFull()
      let data = {
        product_code: this.formRelease.product_code,
        target_rom_ver: this.releaseTargetVer
      }
      this.$http.post(COOP_CANCEL_RELEASE, this.createFormData(data)).then(res => {
        if (this.vmResponseHandler(res)) {
          this.vmMsgSuccess('撤销成功！')
          this.getRomVer(this.formRelease.product_code, this.formRelease.target_rom_ver, this.formRelease.pub_ver_type)
        }
        wait.close()
      }).catch(() => {
        wait.close()
        this.vmMsgError('网络错误！')
      })
    }, 300)
  }
}
</script>

<style scoped>
/** 本页定制 start */
.el-dialog__wrapper /deep/ .el-dialog{
  width: 51rem;
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
  right: 7.5rem;
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
.btn-deviceid-add {
  width: 6.7rem;
  height: 3.33rem;
}
.gap {
  margin-left: 1rem;
}
.pTxt{
  color: #ffffff;
}
/** 本页定制 end */
</style>
