<template>
  <div class="content-container">
    <el-row>
      <el-col :span="24">
          <p class="title-cn">{{$t("iot_plat_fireware_manage")}}</p>
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
                  :label="$t('iot_plat_number')"
                  width="80">
                </el-table-column>
                <el-table-column
                  prop="product_name"
                  :label="$t('iot_plat_model_name')"
                  width="200">
                </el-table-column>
                <el-table-column
                  prop="product_code"
                  :label="$t('iot_plat_model_code')"
                  width="150">
                </el-table-column>
                <el-table-column
                  prop="rom_ver"
                  :label="$t('iot_plat_fireware_version')">
                </el-table-column>
                <el-table-column
                  prop="rom_type"
                  :label="$t('iot_plat_fireware_class')">
                  <template slot-scope="scope">
                  {{ $t(firmwareTypeCode[scope.row.rom_type]) }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="upgrade_time"
                  :label="$t('iot_plat_latest_update')">
                </el-table-column>
                <el-table-column
                  prop="is_review"
                  :label="$t('iot_plat_state')">
                  <template slot-scope="scope">
                    <span :class="scope.row.is_review === 0 ? 'wait'
                    : scope.row.is_review === 1 ? 'pass'
                    : scope.row.is_review === 2 ? 'reject' : ''">
                    {{scope.row.is_review === 0 ? $t("iot_plat_wating_review")
                    : scope.row.is_review === 1 ? $t("iot_plat_already_pass")
                    : scope.row.is_review === 2 ? $t("iot_plat_already_reject") : ''}}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="review_time"
                  :label="$t('iot_plat_review_time')">
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
                <el-table-column :label="$t('iot_plat_operate')" width="120"
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

    <el-dialog :title="$t('iot_plat_update_version')" :visible.sync="isDialogVisible" center class="update" :before-close="closeDialog">
      <el-form label-position="right" status-icon label-width="160px" :model="form" :rules="rules" ref="updateForm">
        <el-form-item class="form-row" :label="$t('iot_plat_select_model')" prop="product_code">
          <el-select v-model="form.product_code" :placeholder="$t('iot_plat_select_fireware_model')" :no-data-text="$t('iot_plat_add_device_model')">
            <el-option
              v-for="item in productCodes"
              :key="item.product_code"
              :label="item.product_code"
              :value="item.product_code">
            </el-option>
          </el-select>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item class="form-row" :label="$t('iot_plat_fireware_class')" prop="rom_type">
          <el-select v-model="form.rom_type" :placeholder="$t('iot_plat_select_fireware_type')" :no-data-text="$t('iot_plat_none_data')">
            <el-option :label="$t('iot_plat_formal')" :value="1"></el-option>
            <el-option :label="$t('iot_plat_temporary')" :value="2"></el-option>
            <el-option :label="$t('iot_plat_grayscale')" :value="3"></el-option>
          </el-select>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item class="form-row" :label="$t('iot_plat_fireware_version')" prop="rom_ver">
          <el-input v-model="form.rom_ver" auto-complete="off" :placeholder="$t('iot_plat_input_fireware_version')"></el-input>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item class="form-row code-panel" :label="$t('iot_plat_fireware_upload')" prop="rom">
          <el-input v-model="form.rom" auto-complete="off" :placeholder="$t('iot_plat_upload_fireware')"></el-input>
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
              <el-button class="btn-upload" size="small" type="primary">{{$t("iot_plat_upload")}}</el-button>
            </el-upload>
          </div>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item class="form-row" :label="$t('iot_plat_md5_value')" prop="md5">
          <el-input v-model="form.md5" auto-complete="off" readonly :placeholder="$t('iot_plat_after_fireware_upload_auto_input')"></el-input>
          <span class="form-tip">*</span>
        </el-form-item>
        
        <el-form-item class="form-row" :label="$t('iot_plat_upgrade_desc')" prop="change_log">
          <DescComponent v-model="form.change_log" :placeholder="$t('iot_plat_input_upgrade_desc')"></DescComponent>
          <!-- <el-input type="textarea" :rows="6" placeholder="请输入升级描述" wrap="hard" v-model="form.change_log"></el-input>
          <span class="form-tip">*</span> -->
        </el-form-item>
        <el-form-item class="form-row">
          <el-button class="btn-submit" type="primary" @click="submitFirmware">{{$t("iot_plat_submit")}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :title="$t('iot_plat_fireware_upgrade_record')" :visible.sync="isDialogVisibleList" center>
      <TimeLineComponent :data="historyRecord" :loading="isGetHistory"></TimeLineComponent>
    </el-dialog>

    <el-dialog :title="$t('iot_plat_publish_condition')" :visible.sync="isDialogVisibleRelease" center>
      <el-form label-position="right" status-icon label-width="175px" :model="formRelease" :rules="releaseRules" ref="releaseForm">
        <el-form-item class="form-row" :label="$t('iot_plat_currect_version')">
          <span class="pTxt">{{formRelease.target_rom_ver}}</span>
        </el-form-item>
        <el-form-item class="form-row" :label="$t('iot_plat_upgrade_type')">
          <span class="pTxt">{{ $t(firmwareTypeCode[formRelease.pub_ver_type]) || $t("iot_plat_unknow")}}</span>
        </el-form-item>
        <el-form-item class="form-row" :label="$t('iot_plat_select_upgrade_version')" v-if="formRelease.pub_ver_type !== firmwareTypeMap.GRAYSCALE">
          <el-select v-model="formRelease.rom_ver" multiple collapse-tags :placeholder="$t('iot_plat_select_upgrade_vesion_please')" :no-data-text="$t('iot_plat_none_data')" @change="selectAllRom_ver">
            <el-option :label="$t('iot_plat_select_all')" value="all"></el-option>
            <el-option
              v-for="item in romVersion"
              :key="item.rom_ver"
              :label="item.rom_ver"
              :value="item.rom_ver"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="form-row code-panel" :label="$t('iot_plat_update_type')" prop="if_force_upd">
          <el-select v-model="formRelease.if_force_upd" :placeholder="$t('iot_plat_select_update_type')" :no-data-text="$t('iot_plat_none_data')">
            <el-option :label="$t('iot_plat_force_update')" :value="2"></el-option>
            <el-option :label="$t('iot_plat_not_force_update')" :value="1"></el-option>
          </el-select>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item class="form-row number" prop="update_percent" :label="formRelease.pub_ver_type === firmwareTypeMap.GRAYSCALE ? '' : $t('iot_plat_upgrade_percent')">
          <el-input v-model="formRelease.update_percent" auto-complete="off" :style="{width: formRelease.pub_ver_type === firmwareTypeMap.FORMAL ? '25rem' : '11rem'  }" v-if="formRelease.pub_ver_type !== firmwareTypeMap.GRAYSCALE">
            <span slot="suffix">%</span>
          </el-input>
          <el-button @click="showDeviceID" class="btn-deviceid-add" size="medium" type="primary" v-if="formRelease.pub_ver_type !== firmwareTypeMap.FORMAL">{{$t("iot_plat_device_id")}}</el-button>
          <el-button @click="cancelRelease" class="btn-deviceid-add" size="medium" type="primary" v-if="formRelease.pub_ver_type !== firmwareTypeMap.FORMAL && vmHasAuth(CoopPermissionsLib.RELEASE_FIREWARE_CANCEL, tableData.res)" style="margin-left:0">{{$t("iot_plat_undo")}}</el-button>
          <!-- <span class="form-tip">*</span> -->
        </el-form-item>
        <el-form-item class="form-row" :label="$t('iot_plat_upgrade_area')" v-if="formRelease.pub_ver_type !== firmwareTypeMap.GRAYSCALE">
          <el-select v-model="formRelease.country_id" filterable multiple collapse-tags :placeholder="$t('iot_plat_select_upgrade_area')" @change="selectAllCountry_id" :no-data-text="$t('iot_plat_none_data')">
            <el-option
              v-for="item in countrys"
              :key="item.code"
              :label="$t(item.name)"
              :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item class="form-row code-panel" label="经销商" v-if="formRelease.pub_ver_type !== firmwareTypeMap.GRAYSCALE">
          <el-select v-model="formRelease.dealer" placeholder="请选择经销商" no-data-text="无数据" @change="selectAllDealer">
            <el-option label="全选" value="all"></el-option>
          </el-select>
          <span class="form-tip">*</span>
        </el-form-item>-->
        <el-form-item class="form-row" :label="$t('iot_plat_upgrade_number_last_time')">
          <span class="pTxt">{{deviceIDForm.update_done_num}}</span>
        </el-form-item>
        <el-form-item class="form-row">
          <el-button class="btn-submit" type="primary" @click="addDeviceVersion">{{$t("iot_plat_publish_condition")}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :title="$t('iot_plat_device_id')" :visible.sync="deviceIdVisible" center>
      <el-form label-position="right" label-width="100px" :model="deviceIDForm" ref="deviceIDForm">
        <el-form-item class="form-row" :label="$t('iot_plat_device_id')">
          <el-input type="textarea" rows="6" resize="none" v-model="deviceIDForm.device_id" :placeholder="$t('iot_plat_input_device_id_one_line')" @keyup.enter.native="testDeviceId" @keyup.delete.native="testDeviceId"></el-input>
        </el-form-item>
        <el-form-item class="form-row">
          <span class="pTxt">{{$t("iot_plat_total")}}：{{deviceIDForm.total}}</span>
          <span class="gap pTxt">{{$t("iot_plat_repeat")}}：{{deviceIDForm.repeat}}</span>
          <span class="gap pTxt">{{$t("iot_plat_success")}}：{{deviceIDForm.succeed}}</span>
        </el-form-item>
        <el-form-item class="form-row">
          <el-button class="btn-submit" type="primary" @click="addDeviceID">{{$t("iot_plat_confirm")}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import "@/assets/css/content.css"
import TimeLineComponent from "@/components/time-line/time-line.vue"
import DescComponent from "@/components/multi-language-textarea/multi-language-textarea.vue"
import {
  GET_COOP_FIRMWARES_POST,
  COOP_FIRE_UPLOAD,
  COOP_FIRMWARES_ADD_POST,
  COOP_FIRE_HISTORY_QUERY,
  GET_ROM_VER_POST,
  FIRMWARE_RELEASE_POST,
  COOP_CANCEL_RELEASE 
} from "@/lib/api"
import { countrys } from "@/lib/const"
import _ from "lodash"
export default {
  components: { TimeLineComponent, DescComponent },
  data () {
    const reg = /^[0-9]*$/
    const validateIsEmpty = (rule, value, callback) => {
      if (value === "") {
        if (rule.field === "product_code") {
          callback(new Error(this.$t("iot_plat_select_fireware_model")))
        } else if (rule.field === "rom_ver") {
          callback(new Error(this.$t("iot_plat_input_fireware_version")))
        } else if (rule.field === "rom") {
          callback(new Error(this.$t("iot_plat_upload_fireware")))
        } else if (rule.field === "md5") {
          callback(new Error(this.$t("iot_plat_input_md5_value")))
        } else if (rule.field === "change_log") {
          callback(new Error(this.$t("iot_plat_input_upgrade_desc")))
        } else if (rule.field === "rom_type") {
          callback(new Error(this.$t("iot_plat_select_fireware_type")))
        }
      }
      callback()
    }
    const releaseIsEmpty = (rule, value, callback) => {
      if (value === "") {
        if (rule.field === "if_force_upd") {
          callback(new Error(this.$t("iot_plat_select_update_type")))
        }
      } else if (rule.field === "update_percent") {
        const MAX = 100
        if (!reg.test(value) || (parseInt(value) < 0 || parseInt(value) > MAX)) {
          callback(new Error(this.$t("iot_plat_only_number_and_length_limit")))
        }
      }
      callback()
    }
    return {
      loading : false,
      countrys: countrys,
      form    : {
        product_code: "",
        rom_type    : "",
        rom_ver     : "",
        rom         : "",
        md5         : "",
        change_log  : {}
      },
      deviceIDForm: {
        update_done_num: "",
        device_id      : "",
        total          : 0,
        repeat         : 0,
        succeed        : 0
      },
      formRelease: {
        product_code  : "",
        country_id    : [],
        dealer        : "",
        device_id     : "",
        rom_ver       : [],
        target_rom_ver: "",
        update_percent: "",
        if_force_upd  : [],
        pub_ver_type  : ""
      },
      releaseTargetVer      : "",
      isGetHistory          : false,
      historyRecord         : [],
      productCodes          : [],
      uploadPath            : COOP_FIRE_UPLOAD,
      deviceIdVisible       : false,
      isRomploading         : false,
      isDialogVisible       : false,
      isDialogVisibleList   : false,
      isDialogVisibleRelease: false,
      tableData             : {
        data   : [],
        page   : "1",
        pageAll: 1,
        product: [],
        total  : 1,
        res    : []
      },
      romVersion: [],
      rules     : {
        product_code: [
          { validator: validateIsEmpty, trigger: "change" }
        ],
        rom_type: [
          { validator: validateIsEmpty, trigger: "change" }
        ],
        rom_ver: [
          { validator: validateIsEmpty, trigger: "change" }
        ],
        rom: [
          { validator: validateIsEmpty, trigger: "change" }
        ],
        md5: [
          { validator: validateIsEmpty, trigger: "change" }
        ],
        change_log: [
          { validator: validateIsEmpty, trigger: "change" }
        ]
      },
      releaseRules: {
        update_percent: [
          { validator: releaseIsEmpty, trigger: "change" }
        ],
        if_force_upd: [
          { validator: releaseIsEmpty, trigger: "change" }
        ]
      }
    }
  },
  created () {
    this.getFirmwareLists(1)
  },
  methods: {
    showAddDialog () {
      this.isDialogVisible = true
    },
    async showListDialog (index, row) {
      try {
        this.isDialogVisibleList = true
        this.isGetHistory = true
        const data = this.createFormData({
          product_code: row.product_code,
          rom_type    : row.rom_type
        })
        const res = await this.$http.post(COOP_FIRE_HISTORY_QUERY, data)
        this.isGetHistory = false
        if (this.vmResponseHandler(res)) {
          this.historyRecord = res.data.data
        }
      } catch (error) {
        this.isGetHistory = false
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    },
    getFirmwareLists: _.debounce(async function (currentPage) {
      try {
        const data = this.createFormData({
          page     : currentPage,
          page_size: 20
        })
        this.loading = true
        const res = await this.$http.post(GET_COOP_FIRMWARES_POST, data)
        if (this.vmResponseHandler(res)) {
          this.tableData = res.data
          this.productCodes = res.data.product
        }
        this.loading = false
      } catch (error) {
        this.loading = false
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    }, this.DEBOUNCE_TIME),
    onBeforeUpload (file) {
      const BYTE = 1024
      const MAX_SIZE = 80
      const sizeM = file.size / BYTE / BYTE
      if (sizeM > MAX_SIZE) {
        return this.vmMsgError(this.$t("iot_plat_fireware_size_limit", [ MAX_SIZE ]))
      }
    },
    onUploadSuccess (response, file) {
      this.isRomploading = false
      // 上传
      if (response.statu === 0) {
        this.$router.push("/signin"); return
      }

      if (!response.status) {
        this.form.rom = ""
        this.vmMsgError(response.msg); return
      }
      this.form.rom = file.name
      this.form.md5 = response.md5
    },
    onUploadProgress (event) {
      this.isRomploading = true
      this.form.rom = `${Math.ceil(event.percent)}%`
    },
    onUploadError (err) {
      this.isRomploading = false
      this.form.rom = ""
      this.vmMsgError(err)
    },
    submitFirmware: _.debounce(function () {
      const wait = this.vmLoadingFull()
      try {
        this.$refs.updateForm.validate(async valid => {
          if (valid) {
            const res = await this.$http.post(COOP_FIRMWARES_ADD_POST, this.createFormData(this.form))
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess(this.$t("iot_plat_submit_success"))
              this.isDialogVisible = false
              this.getFirmwareLists(this.tableData.page)
              this.$refs.updateForm.resetFields()
            }
            wait.close()
          }
        }) 
      } catch (error) {
        wait.close()
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    }, this.DEBOUNCE_TIME),
    showReleaseDialog (row) {
      setTimeout(() => this.$refs.releaseForm.resetFields(), this.DEBOUNCE_TIME)
      this.isDialogVisibleRelease = true
      this.getRomVer(row.product_code, row.rom_ver, row.rom_type)
    },

    async getRomVer (code, ver, type) {
      try {
        this.formRelease.product_code = code
        this.formRelease.target_rom_ver = ver
        this.formRelease.pub_ver_type = type
        const res = await this.$http.post(GET_ROM_VER_POST, this.createFormData({ product_code: code, rom_ver: ver, rom_type: type }))
        if (this.vmResponseHandler(res)) {
          this.releaseTargetVer = res.data.data.target_rom_ver
          this.romVersion = res.data.romver
          this.formRelease.rom_ver = res.data.data.rom_ver.includes("all") ? res.data.romver.map(o => o.rom_ver) : res.data.data.rom_ver
          res.data.data.rom_ver.includes("all") && this.formRelease.rom_ver.unshift("all")
          this.formRelease.update_percent = res.data.data.update_percent
          this.formRelease.country_id = res.data.data.country_id.includes("all") ? this.countrys.map(o => o.code) : res.data.data.country_id
          this.formRelease.if_force_upd = res.data.data.if_force_upd
          this.formRelease.device_id = res.data.data.device_id.join("\n")
          this.deviceIDForm.update_done_num = res.data.data.update_done_num
        }
      } catch (error) {
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    },
    selectAllRom_ver (val) {
      const allValues = [ "all" ]
      if (val.includes("all")) {
        // 保留所有版本值
        for (const item of this.romVersion) {
          allValues.push(item.rom_ver)
        }
        this.formRelease.rom_ver = allValues
      }
    },
    selectAllCountry_id (val) {
      const allValues = []
      // TODO: 全选时点击非全选选项时无法取消
      if (val.includes("all")) {
        // 保留所有版本值
        for (const item of this.countrys) {
          allValues.push(item.code)
        }
        this.formRelease.country_id = allValues
      } else if (val.length === this.countrys.length - 1) {
        this.formRelease.country_id = []
      }
    },
    showDeviceID () {
      this.deviceIdVisible = true
      this.deviceIDForm.device_id = this.formRelease.device_id
      this.testDeviceId()
    },
    testDeviceId () {
      const ary = this.deviceIDForm.device_id.split(/[\n,]/g)
      const nAry = ary.filter(val => val !== "")
      const succeedAry = new Set(nAry)
      this.deviceIDForm.total = nAry.length
      this.deviceIDForm.succeed = succeedAry.size
      this.deviceIDForm.repeat = this.deviceIDForm.total - this.deviceIDForm.succeed
    },
    addDeviceID () {
      this.deviceIdVisible = false
      this.formRelease.device_id = this.deviceIDForm.device_id
    },

    addDeviceVersion: _.debounce(function () {
      this.$refs.releaseForm.validate(valid => {
        if (valid) {
          // 临时版本，如果填写了设备ID，而升级版本、升级百分比、升级地区填写错误或不完整，提示仅升级设备ID内的设备
          if (this.formRelease.device_id && this.formRelease.pub_ver_type === this.firmwareTypeMap.TEMP
          && (!this.formRelease.update_percent || this.formRelease.rom_ver.length === 0 || this.formRelease.country_id.length === 0)) {
            this.vmConfirm({
              msg            : this.$t("iot_plat_upgrrade_condition_desc"),
              confirmCallback: this.releaseVerRequest
            })
          } else {
            this.releaseVerRequest()
          }
        }
      })
    }, this.DEBOUNCE_TIME),

    async releaseVerRequest () {
      const wait = this.vmLoadingFull()
      try {
        const data = Object.assign({}, this.formRelease)
        if (data.rom_ver.includes("all")) { data.rom_ver = [ "all" ] }
        const res = await this.$http.post(FIRMWARE_RELEASE_POST, this.createFormData(data))
        if (this.vmResponseHandler(res)) {
          this.vmMsgSuccess(this.$t("iot_plat_submit_success"))
          this.isDialogVisibleRelease = false
          this.getFirmwareLists(this.tableData.page)
        }
        wait.close()
      } catch (error) {
        wait.close()
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    },

    closeDialog (done) {
      if (this.isRomploading) { return false } done() 
    },

    // 撤销发布条件
    cancelRelease: _.debounce(async function () {
      if (!this.formRelease.device_id) { this.vmMsgError(this.$t("iot_plat_not_publish_and_undo")); return }
      if (!this.releaseTargetVer) { this.vmMsgWarning(this.$t("iot_plat_retry_after")); return }
      const wait = this.vmLoadingFull()
      try {
        const data = {
          product_code  : this.formRelease.product_code,
          target_rom_ver: this.releaseTargetVer
        }
        const res = await this.$http.post(COOP_CANCEL_RELEASE, this.createFormData(data))
        if (this.vmResponseHandler(res)) {
          this.vmMsgSuccess(this.$t("iot_plat_undo_success"))
          this.getRomVer(this.formRelease.product_code, this.formRelease.target_rom_ver, this.formRelease.pub_ver_type)
        }
        wait.close()
      } catch (error) {
        wait.close()
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    }, this.DEBOUNCE_TIME)
  }
}
</script>

<style scoped>
/** 本页定制 start */
.el-dialog__wrapper /deep/ .el-dialog {
  width: 53rem;
}

.el-dialog .btn-submit {
  margin-top: 4.33rem;
}
.code-panel {
  position: relative;
}
.code-panel .form-btn-upload {
  display: inline-block;
  vertical-align: middle;
  position: absolute;
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
  right: 1.5rem;
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
.pTxt {
  color: #ffffff;
}
/** 本页定制 end */
</style>
