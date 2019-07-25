<template>
  <div class="content-container">
    <el-row>
      <el-col :span="24">
          <p class="title-cn">{{$t("iot_plat_device_produce")}}</p>
          <p class="title-en">THE EQUIPMENT PRODUCTION</p>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <div class="table">
          <el-row>
            <el-col :span="24">
              <el-input
                :placeholder="$t('iot_plat_input_device_id')"
                v-model="searchKeyWord"
                clearable>
              </el-input>
              <el-button class="btn-search" type="primary" @click="getEquipmentLists(1)">{{$t("iot_plat_query")}}</el-button>
              <el-button class="btn-search" type="primary" @click="getTemplate()" v-if="vmHasAuth(CoopPermissionsLib.DEVICE_IMPORT, tableData.res)">{{$t("iot_plat_download_template")}}</el-button>
              <UploadComponent
                v-if="vmHasAuth(CoopPermissionsLib.DEVICE_IMPORT, tableData.res)"
                class="uploader-import"
                ref="uploaderImport"
                :path="importPath"
                :accept="['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']"
                :size="2"
                model="btn"
                @response="getUploadResult"></UploadComponent>
              <!--<el-button class="btn-circle-delete el-button--primary is-circle" type="primary" icon="el-icon-plus" circle @click="addEquipment"></el-button>-->
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
                  prop="device_id"
                  :label="$t('iot_plat_device_id')"
                  width="240">
                </el-table-column>
                <el-table-column
                  prop="production_time"
                  :label="$t('iot_plat_produce_date')"
                  width="140">
                </el-table-column>
                <el-table-column
                  prop="put_time"
                  :label="$t('iot_plat_storage_date')">
                </el-table-column>
                <el-table-column
                  prop="out_time"
                  :label="$t('iot_plat_out_lib_date')">
                </el-table-column>
                <el-table-column
                  prop="dealer_name"
                  :label="$t('iot_plat_dealer')">
                </el-table-column>
                <el-table-column
                  prop="out_bound"
                  :label="$t('iot_plat_area')">
                </el-table-column>
                <el-table-column
                  prop="delivery_time"
                  :label="$t('iot_plat_harvest_time')">
                </el-table-column>
                <el-table-column
                  prop="box_number"
                  :label="$t('iot_plat_case_number')"
                  width="200">
                  <!--<template slot-scope="scope">{{ formatDate(new Date(scope.row.goods_adddate * 1000), 'yyyy-MM-dd hh:mm:ss')  }}</template>-->
                </el-table-column>
                <el-table-column
                  prop="activation_time"
                  :label="$t('iot_plat_activation_time')">
                </el-table-column>
                <el-table-column
                  prop="untie_status"
                  v-if="vmHasAuth(CoopPermissionsLib.QUERY_REWORK, tableData.res)"
                  :label="$t('iot_plat_return_status')">
                  <template slot-scope="scope">
                    <span v-if="scope.row.untie_status === 0">{{$t("iot_plat_none")}}</span>
                    <span v-else @click="showReworkList(scope.row.device_id)" style="cursor:pointer;color:#38a0f8">{{$t("iot_plat_view")}}</span>
                  </template>
                </el-table-column>
                <!-- <el-table-column label="操作"
                  width="120"
                  v-if="vmHasAuth(CoopPermissionsLib.ADD_REWORK, tableData.res)">
                  <template slot-scope="scope">
                    <el-button
                      class="btn-circle"
                      size="mini"
                      icon="iconfont icon-bianji"
                      circle
                      @click="reworkEquip(scope.$index, scope.row)"></el-button>
                  </template>
                </el-table-column> -->
              </el-table>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-pagination
                v-if="tableData.data.length !== 0"
                @size-change="getEquipmentLists"
                @current-change="getEquipmentLists"
                :page-size="20"
                layout="prev, pager, next, jumper"
                :total="tableData.total">
              </el-pagination>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>

    <el-dialog :title="$t('iot_plat_return_record')" width="85rem" :visible.sync="isShowReworkList" center>
      <el-table
        :data="reworkData"
        v-loading="reloading"
        style="width: 100%;height: 41.67rem;overflow: auto;">
        <el-table-column
          prop="repair_time"
          :label="$t('iot_plat_return_time')"
          width="180">
        </el-table-column>
        <el-table-column
          prop="results_reason"
          :label="$t('iot_plat_return_reason')"
          width="180">
        </el-table-column>
        <el-table-column
          prop="results_of_repair"
          :label="$t('iot_plat_return_way')">
          <template slot-scope="scope">{{ $t(repairWayCode[scope.row.results_of_repair]) }}</template>
        </el-table-column>
        <el-table-column
          prop="pic"
          :abel="$t('iot_plat_return_picture')">
          <template slot-scope="scope">
            <ScaleImgComponent :path="scope.row.pic" style="width:5rem;height:5rem" :alt="$t('iot_plat_return_picture')"></ScaleImgComponent>
          </template>
        </el-table-column>
        <el-table-column
          prop="untie"
          :label="$t('iot_plat_unbind_status')">
          <template slot-scope="scope">{{ $t(untieCode[scope.row.untie]) }}</template>
        </el-table-column>
        <el-table-column
          prop="untie_time"
          :label="$t('iot_plat_unbind_time')">
        </el-table-column>
        <el-table-column
          prop="user_name"
          :label="$t('iot_plat_processing_staff')">
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog :title="$t('iot_plat_rework')" :visible.sync="isDialogVisibleAdd" center>
      <el-form label-position="right" status-icon label-width="100px" :model="reworkForm" :rules="rules" ref="reworkForm">
        <el-form-item class="form-row" :label="$t('iot_plat_device_id')"><span style="color:#fff">{{ reworkForm.device_id }}</span></el-form-item>
        <el-form-item class="form-row" :label="$t('iot_plat_processing_method')" prop="results_of_repair">
          <el-select v-model="reworkForm.results_of_repair" :placeholder="$t('iot_plat_select_processing_method')" :no-data-text="$t('iot_plat_none_data')">
            <el-option :key="1" :label="$t('iot_plat_replace')" value="1"></el-option>
            <el-option :key="2" :label="$t('iot_plat_repair')" value="2"></el-option>
          </el-select>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item class="form-row" :label="$t('iot_plat_device_picture')" prop="pic">
          <div class="form-btn-upload">
            <span class="form-img-cert" v-if="isUploading">
              {{uploadProgress || picTip}}
            </span>
            <img v-else class="form-img-cert" :src="picPath"/>
            <div class="form-btn-upload">
              <el-upload
                :action="uploadPath"
                name="photo"
                accept=".jpg,.jpeg,.png"
                :before-upload="onBeforeUpload"
                :on-success="onUploadSuccess"
                :on-progress="onUploadProgress"
                :on-error="onUploadError"
                :show-file-list="false">
                <el-button class="btn-upload" size="small" type="primary">{{$t("iot_plat_upload")}}</el-button>
              </el-upload>
            </div>
          </div>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item class="form-row" :label="$t('iot_plat_return_reason')" prop="results_reason">
          <el-input type="textarea" :rows="6" v-model="reworkForm.results_reason" :placeholder="$t('iot_plat_input_rework_reason')"></el-input>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-checkbox style="margin-top: 20px" v-model="reworkForm.untie">{{$t("iot_plat_rework_explaine")}}</el-checkbox>
        <el-form-item class="form-row">
          <el-button class="btn-submit" type="primary" @click="submit">{{$t("iot_plat_submit")}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import "@/assets/css/content.css"
import ScaleImgComponent from "@/components/preview-img/scale-img.vue"
import UploadComponent from "@/components/uploader/upload.vue"
import { GET_EQUIPMENT_POST, GET_EQUIPMENT_REWORK_POST, REWORK_UPLOAD_PIC_POST, REWORK_ADD_POST, COOP_PROD_TEMPLATE_POST, COOP_PROD_IMPORT_POST } from "@/lib/api"
import _ from "lodash"

export default {
  components: { ScaleImgComponent, UploadComponent },
  data () {
    const validateIsEmpty = (rule, value, callback) => {
      if (value === "") {
        if (rule.field === "results_reason") {
          callback(new Error(this.$t("iot_plat_input_rework_reason")))
        } else if (rule.field === "results_of_repair") {
          callback(new Error(this.$t("iot_plat_select_rework_way")))
        } else if (rule.field === "pic") {
          callback(new Error(this.$t("iot_plat_upload_rework_picture")))
        }
      }
      callback()
    }
    return {
      loading            : false,
      reloading          : false,
      searchKeyWord      : "",
      isShowReworkList   : false,
      reworkData         : [],
      isDialogVisibleList: false,
      isDialogVisibleAdd : false,
      uploadPath         : REWORK_UPLOAD_PIC_POST,
      importPath         : COOP_PROD_IMPORT_POST,
      isUploading        : true,
      uploadProgress     : "",
      picTip             : this.$t("iot_plat_picture_desc_04"),
      picPath            : "",
      tableData          : {
        data   : [],
        page   : "1",
        pageAll: 1,
        total  : 1,
        res    : []
      },
      reworkForm: {
        device_id        : "",
        untie            : "",
        results_reason   : "",
        results_of_repair: "",
        pic              : ""
      },
      rules: {
        results_reason: [
          { validator: validateIsEmpty, trigger: "change" }
        ],
        results_of_repair: [
          { validator: validateIsEmpty, trigger: "change" }
        ],
        pic: [
          { validator: validateIsEmpty, trigger: "change" }
        ]
      }
    }
  },
  created () {
    this.getEquipmentLists(1)
    document.body.addEventListener("keydown", this.keyCodeDown, false)
  },
  beforeDestroy () {
    document.body.removeEventListener("keydown", this.keyCodeDown, false)
  },
  methods: {
    keyCodeDown (e) {
      if (e.keyCode === this.ENTER_KEY_CODE) {
        if (this.isDialogVisibleAdd) {
          this.submit(); return
        }
        this.getEquipmentLists(1)
      }
    },
    getUploadResult (res) {
      if (res.status) {
        this.getEquipmentLists(1)
      }
    },
    getTemplate: _.debounce(() => {
      const aAchor = document.createElement("a")
      aAchor.href = COOP_PROD_TEMPLATE_POST
      aAchor.click()
    }),
    reworkEquip (index, row) {
      this.reworkForm.device_id = row.device_id
      this.isUploading = true
      this.uploadProgress = ""
      this.reworkForm.pic = ""
      this.reworkForm.untie = false
      this.isDialogVisibleAdd = true
    },
    getEquipmentLists: _.debounce(async function (currentPage) {
      try {
        const data = this.createFormData({
          page     : currentPage,
          page_size: 20,
          device_id: this.searchKeyWord
        })
        this.loading = true
        const res = await this.$http.post(GET_EQUIPMENT_POST, data)
        if (this.vmResponseHandler(res)) {
          this.tableData = res.data
        }
        this.loading = false
      } catch (error) {
        this.loading = false
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
      
    }, this.DEBOUNCE_TIME),

    async getEquipmentReworkInfo (deviceId) {
      try {
        this.reloading = true
        const data = this.createFormData({ device_id: deviceId })
        const res = await this.$http.post(GET_EQUIPMENT_REWORK_POST, data)
        if (this.vmResponseHandler(res)) {
          this.reworkData = res.data.data
        }
        this.reloading = false
      } catch (error) {
        this.reloading = false
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    },

    showReworkList (deviceId) {
      this.isShowReworkList = true
      this.reworkData = []
      this.getEquipmentReworkInfo(deviceId)
    },
    onBeforeUpload (file) {
      const BYTES = 1024
      const MAX_SIZE = 2
      const sizeM = file.size / BYTES / BYTES
      const imgArr = [ "image/png", "image/jpeg", "image/jpg" ]
      if (!imgArr.includes(file.type) || sizeM > MAX_SIZE) {
        this.vmMsgError(this.$t("iot_plat_picture_desc_05", [ MAX_SIZE ]))
        return false
      }
    },
    onUploadSuccess (response, file) {
      this.isUploading = false
      // 上传
      if (response.statu === 0) {
        this.$router.push("/signin"); return
      }

      if (!response.status) {
        this.vmMsgError(response.msg); return
      }
      this.picPath = file.url
      this.reworkForm.pic = response.md5
    },
    onUploadProgress (event) {
      this.isUploading = true
      this.reworkForm.pic = `${Math.ceil(event.percent)}%`
    },
    onUploadError (err) {
      this.isUploading = false
      this.reworkForm.pic = ""
      this.vmMsgError(err)
    },
    submit: _.debounce(function () {
      if (!this.reworkForm.untie) { return this.vmMsgError(this.$t("iot_plat_agree_unbind_protocol")) }
      const wait = this.vmLoadingFull()
      try {
        this.$refs.reworkForm.validate(async valid => {
          if (valid) {
            const res = await this.$http.post(REWORK_ADD_POST, this.createFormData(this.reworkForm))
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess(this.$t("iot_plat_submit_success"))
              this.isDialogVisibleAdd = false
              this.getEquipmentLists(this.tableData.page)
              this.$refs.reworkForm.resetFields()
            }
            wait.close()
          }
        })  
      } catch (error) {
        wait.close()
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    }, this.DEBOUNCE_TIME)
  }
}
</script>
<style scoped>
.content-container /deep/ .el-dialog {
  width: 54rem;
}
.el-dialog .form-img-cert {
  display: inline-block;
  width: 14rem;
  height: 8rem;
  background: #636363;
  vertical-align: middle;
  color: #fff;
  text-align: center;
  line-height: 8rem;
}
.el-dialog .form-btn-upload {
  display: inline-block;
  vertical-align: middle;
}
.el-dialog .form-btn-upload .btn-upload {
  height: 8rem;
  width: 3rem;
  border-radius: 0;
  padding: 0;
  font-size: 1.2rem;
  background: #1f7ecf;
  border: none;
}
.uploader-import {
  display: inline-block !important;
}
.uploader-import /deep/ .el-upload .only-btn {
  border-radius: 3px;
  margin-left: 1.5rem;
  width: auto;
  height: auto;
  padding: 12px 20px;
}
.uploader-import /deep/ .btn-progress {
  left: 0;
}
</style>
