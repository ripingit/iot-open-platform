<template>
  <div>
    <el-dialog :title="model === 0 ? $t('iot_plat_device_bind') : $t('iot_plat_unbind')" width="55rem" :visible.sync="isVisible" center :before-close="dialogClose">
      <el-form label-width="160px" status-icon :model="formData" :rules="rules" ref="bindForm" :hide-required-asterisk="true">
        <el-form-item :label="$t('iot_plat_device_id')" class="form-row">
          <el-button type="primary" class="btn-import" @click="showDeviceIdCopyDialog()">{{$t("iot_plat_copy_import")}}</el-button>
          <UploadComponent
              class="xls-uploader"
              :path="uploadPath"
              :data="{name: 'online'}"
              :accept="['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']"
              :size="2"
              model="btn"
              :buttonText="$t('iot_plat_excel_import')"
              @response="getUploadResult"
            ></UploadComponent>
          <span class="form-tip">*</span>
        </el-form-item>
        <!-- <el-form-item label="KEY" class="form-row">
          <el-select v-model="formData.clientIds" placeholder="请选择key" @change="getBindManger">
            <el-option
              v-for="item in clientIds"
              :key="item.client_id"
              :label="item.app_name"
              :value="item.client_id"
            ></el-option>
          </el-select>
          <span class="form-tip">*</span>
        </el-form-item> -->
        <el-form-item :label="$t('iot_plat_bind_manage')" class="form-row" prop="user_id" v-if="model === 0">
          <el-select v-model="formData.user_id" :placeholder="$t('iot_plat_select_please')">
            <el-option
              v-for="item in bindManagers"
              :key="item.user_id"
              :label="item.user_name"
              :value="item.user_id"
            ></el-option>
          </el-select>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item>
          <a class="success" href="javascript:void(0)" @click="downloadTemplate">{{$t("iot_plat_download_excel_template")}}</a>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn-submit" @click="submit()">{{$t("iot_plat_submit")}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 复制设备ID -->
    <el-dialog :title="$t('iot_plat_copy_uid')" :visible.sync="isCopyBoardVisible" center width="50rem" :close-on-click-modal="false">
      <el-form label-width="100px" status-icon :model="formData" ref="form">
        <el-form-item :label="$t('iot_plat_device_id')" class="form-row">
          <el-input
            class="ipt-area"
            type="textarea"
            :autosize="{ minRows: 15, maxRows: 15}"
            :placeholder="$t('iot_plat_input_device_id_one_line')"
            v-model="formData.device_ids"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn-confirm" @click="copyDeviceID()">{{$t("iot_plat_confirm")}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 绑定结果 -->
    <el-dialog :title="$t('iot_plat_add_result')" :visible.sync="isBindResultVisible" center width="50rem" :close-on-click-modal="false">
      <el-form label-width="100px" status-icon>
        <el-form-item :label="$t('iot_plat_fail_result')" class="form-row">
          <el-input
            disabled
            class="ipt-area"
            type="textarea"
            :autosize="{ minRows: 15, maxRows: 15}"
            :placeholder="$t('iot_plat_input_value_please')"
            v-model="bindFailedResults"></el-input>
        </el-form-item>
        <el-form-item>
          <a class="success" href="javascript:void(0)" @click="downloadBindFailedRes">{{$t("iot_plat_download_txt")}}</a>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { 
  COOP_DEVICE_BIND_ADD, 
  /*
   * COOP_CLIENTID_QUERY, 
   * COOP_MANAGER_QUERY, 
   */
  COOP_CLIENTID_UPLOAD, 
  COOP_EXCEL_TEMPLATE_GET,
  COOP_DEL_DEVICE_BIND
} from "@/lib/api"
import _ from "lodash";
import UploadComponent from "@/components/uploader/upload.vue"

export default {
  components: { UploadComponent },
  props     : {
    isVisible: {
      type     : Boolean,
      required : true,
      "default": false
    },
    // 识别解绑还是新增绑定 0：新增绑定 1：解绑
    model: {
      type     : Number,
      required : true,
      "default": 0
    },
    // 待绑定设备的用户数据
    bindManagers: {
      type     : Array,
      required : true,
      "default": []
    }
  },
  data () {
    return {
      /*
       * clientIds          : [],
       * bindManagers       : [],
       */
      bindFailedResults  : "",
      isCopyBoardVisible : false,
      isBindResultVisible: false,
      uploadPath         : COOP_CLIENTID_UPLOAD,
      formData           : {
        user_id   : "",
        device_ids: "",
        path      : ""
      },
      rules: {
        user_id: [
          { required: true, message: this.$t("iot_plat_select_admin"), trigger: "change" }
        ]
      }
    }
  },
  /*
   * created () {
   *   this.getBindManger()
   * },
   */
  methods: {
    dialogClose () {
      this.resetBindForm()
      this.$emit("close")
    },

    showDeviceIdCopyDialog () {
      this.isCopyBoardVisible = true
    },

    copyDeviceID () {
      this.isCopyBoardVisible = false
    },

    getUploadResult (res) {
      if (res) {
        this.formData.path = res.path
      }
    },

    downloadTemplate () {
      const anchor = document.createElement("a")
      anchor.href = COOP_EXCEL_TEMPLATE_GET
      anchor.click()
    },

    downloadBindFailedRes () {
      const aTag = document.createElement("a");
      const blob = new Blob([ this.bindFailedResults ]);
      aTag.download = `${this.$t("iot_plat_fail_bind_device_txt")}`;
      aTag.href = URL.createObjectURL(blob);
      aTag.click();
      URL.revokeObjectURL(blob);
    },

    resetBindForm () {
      this.formData.user_id = ""
      this.formData.device_ids = ""
      this.formData.path = ""
    },

    untied: _.debounce(function () {
      if (!this.formData.device_ids && !this.formData.path) {
        return this.vmMsgError(this.$t("iot_plat_set_device_id"))
      }
      
      this.$refs.bindForm.validate(valid => {
        if (valid) {
          const loading = this.vmLoadingFull()
          this.vmConfirm({
            msg            : this.$t("iot_plat_confirm_unbind_device"),
            confirmCallback: async () => {
              try {
                const data = this.createFormData({
                  device_ids: !this.formData.device_ids ? [] : this.formData.device_ids.trim().split("\n"),
                  path      : this.formData.path
                })
                const res = await this.$http.post(COOP_DEL_DEVICE_BIND, data)
                loading.close()
                if (this.vmResponseHandler(res)) {
                  this.$emit("close", true)
                  this.resetBindForm()
                  this.$refs.bindForm.resetFields()
                  this.vmMsgSuccess(this.$t("iot_plat_unbind_success"))
                }
              } catch (error) {
                loading.close()
                this.vmMsgError(this.$t("iot_plat_program_error"));
              }  
            },
            cancelCallback: () => {
              loading.close()
            }
          })
        }
      });
    }, this.DEBOUNCE_TIME),

    submit () {
      if (this.model === 0) {
        this.bind()
      } else if (this.model === 1) {
        this.untied()
      }
    },

    bind: _.debounce(function () {
      if (!this.formData.device_ids && !this.formData.path) {
        return this.vmMsgError(this.$t("iot_plat_set_device_id"))
      }
      
      this.$refs.bindForm.validate(async valid => {
        // 该函数处理了字符串分割符为空格和换行符拆分成数组
        const parseDeviceIds = () => {
          let devices = []
          if (!this.formData.device_ids) { return devices }

          devices = this.formData.device_ids.split("\n")
          // 将数组中为空串的元素排除并去除元素中的所有空格
          const temp = devices.map(item => item.replace(/\s+/g, "")).filter(item => {
            if (item) { return item }
          })
          return temp
        }
        if (valid) {
          const loading = this.vmLoadingFull()
          try {
            const data = this.createFormData({
              user_id   : this.formData.user_id,
              device_ids: parseDeviceIds(),
              path      : this.formData.path
            })
            const res = await this.$http.post(COOP_DEVICE_BIND_ADD, data)
            loading.close()
            if (this.vmResponseHandler(res)) {
              this.$emit("close", true)
              this.resetBindForm()
              this.$refs.bindForm.resetFields()
              if (res.data.total === 0) {
                this.vmMsgSuccess(this.$t("iot_plat_bind_success_all"))
              } else {
                this.isBindResultVisible = true
                this.bindFailedResults = res.data.device_ids.join("\n")
              }
            }
          } catch (error) {
            loading.close()
            this.vmMsgError(this.$t("iot_plat_program_error"));
          }
        }
      });
    }, this.DEBOUNCE_TIME)
  }
}
</script>

<style scoped>
.btn-import {
  width: auto;
}
.xls-uploader {
  display: inline-block !important;
}
.xls-uploader /deep/ .el-upload .only-btn {
  height: 3.17rem;
  width: 8rem;
}
.ipt-area {
  width: 80%
}
.btn-confirm{
  width: 25.8rem;
  margin-top: 4.33rem;
}
.success {
  margin-left: 0.5rem;
}
</style>
