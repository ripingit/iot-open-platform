<template>
  <el-dialog :title="$t('iot_plat_model_edit')" :visible.sync="isVisible" center :before-close="dialogClose">
    <el-form label-width="185px" status-icon :model="formData" ref="form" :rules="rules" :hide-required-asterisk="true">
      <el-form-item :label="$t('iot_plat_model_name')" class="form-row" prop="product_name">
        <el-input v-model="formData.product_name" disabled :placeholder="$t('iot_plat_input_model_name')"></el-input>
        <span class="form-tip">*</span>
      </el-form-item>
      <el-form-item :label="$t('iot_plat_model_code')" class="form-row" prop="product_code">
        <el-input v-model="formData.product_code" maxlength="6" disabled :placeholder="$t('iot_plat_input_model_code')"></el-input>
        <span class="form-tip">*</span>
      </el-form-item>
      <el-form-item :label="$t('iot_plat_connection_way')" class="form-row" prop="nbi_code">
        <el-select v-model="formData.nbi_code" multiple :placeholder="$t('iot_plat_select_connection_way')">
          <el-option
            v-for="item in nbiCode"
            :key="item.nbi_code"
            :label="item.nbi_code_name"
            :value="item.nbi_code"
          ></el-option>
        </el-select>
        <span class="form-tip">*</span>
      </el-form-item>
      <el-form-item :label="$t('iot_plat_reset_note')" class="form-row" prop="reset_code">
        <el-select v-model="formData.reset_code" multiple :placeholder="$t('iot_plat_select_reset_note')">
          <el-option
            v-for="(item, index) in resetCode"
            :key="index"
            :label="JSON.parse(item.str_translation)[lang]"
            :value="Number(item.str_id.replace('Resetcode_value', ''))"
          ></el-option>
        </el-select>
        <span class="form-tip">*</span>
      </el-form-item>
      <el-form-item :label="$t('iot_plat_device_class')" class="form-row" prop="prodt_code">
        <el-select v-model="formData.prodt_code" multiple disabled :placeholder="$t('iot_plat_select_device_class')">
          <el-option
            v-for="item in productCode"
            :key="item.prodt_code"
            :label="item.prodt_name"
            :value="item.prodt_code"
          ></el-option>
        </el-select>
        <span class="form-tip">*</span>
      </el-form-item>

      <el-form-item class="form-row" :label="$t('iot_plat_device_online_pic')" prop="pic1_fileid.online">
        <div class="form-btn-upload">
          <UploadComponent
            class="pic-format-1"
            :path="uploadPath"
            :data="{name: 'online'}"
            :previewPath="formData.pic1_fileid.online"
            :accept="['image/jpeg', 'image/png']"
            :size="2"
            model="preview"
            :condition="$t('iot_plat_picture_desc_01')"
            @response="getUploadResult"
          ></UploadComponent>
        </div>
        <span class="form-tip">*</span>
      </el-form-item>

      <el-form-item class="form-row" :label="$t('iot_plat_deivce_state_pic')" prop="pic1_fileid.state">
        <div class="form-btn-upload">
          <UploadComponent
            class="pic-format-1"
            :path="uploadPath"
            :data="{name: 'state'}"
            :previewPath="formData.pic1_fileid.state"
            :accept="['image/jpeg', 'image/png']"
            :size="2"
            model="preview"
            :condition="$t('iot_plat_picture_desc_01')"
            @response="getUploadResult"
          ></UploadComponent>
        </div>
      </el-form-item>

      <el-form-item class="form-row" :label="$t('iot_plat_device_reset_pic')" prop="pic1_fileid.reset">
        <div class="form-btn-upload">
          <UploadComponent
            class="pic-format-1"
            :path="uploadPath"
            :data="{name: 'reset'}"
            :previewPath="formData.pic1_fileid.reset"
            :accept="['image/jpeg', 'image/png']"
            :size="2"
            model="preview"
            :condition="$t('iot_plat_picture_desc_01')"
            @response="getUploadResult"
          ></UploadComponent>
        </div>
      </el-form-item>

      <el-form-item class="form-row" :label="$t('iot_plat_device_thumbnial_pic')" prop="pic1_fileid.thumb">
        <div class="form-btn-upload">
          <UploadComponent
            class="pic-format-2"
            :path="uploadPath"
            :data="{name: 'thumb'}"
            :previewPath="formData.pic1_fileid.thumb"
            :accept="['image/jpeg', 'image/png']"
            :size="2"
            model="preview"
            :condition="$t('iot_plat_picture_desc_02')"
            @response="getUploadResult"
          ></UploadComponent>
        </div>
        <span class="form-tip">*</span>
      </el-form-item>
      <el-form-item style="margin-top: 4.33rem;">
        <el-button type="primary" class="btn-submit" @click="submit()">{{$t("iot_plat_submit")}}</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import UploadComponent from "@/components/uploader/upload.vue";
import {
  ADMIN_DEVICE_PIC_UPLOAD,
  ADMIN_DEVICE_MODEL_UPDATE
} from "@/lib/api.js";
import _ from "lodash";
export default {
  components: { UploadComponent },
  props     : {
    /**
     * 连接方式数据
     */
    nbiCode: {
      type     : Array,
      "default": () => [],
      required : true
    },
    /** 
     * Reset 提示数据
     */
    resetCode: {
      type     : Array,
      required : true,
      "default": () => []
    },
    /**
     * 设备类别数据
     */
    productCode: {
      type     : Array,
      "default": () => [],
      required : true
    },
    /**
     * 控制弹出层的显示隐藏
     */
    isVisible: {
      type     : Boolean,
      required : true,
      "default": false
    },
    /**
     * 待编辑数据
     */
    formData: {
      type    : Object,
      required: true
    }
  },
  data() {
    return {
      urlOld    : [],
      lang      : localStorage.getItem("lang") || "CN",
      uploadPath: ADMIN_DEVICE_PIC_UPLOAD,
      rules     : {
        product_name: [
          {
            required: true,
            message : this.$t("iot_plat_input_model_name"),
            trigger : "change"
          }
        ],
        product_code: [
          {
            required: true,
            message : this.$t("iot_plat_input_model_code"),
            trigger : "change"
          }
        ],
        nbi_code: [
          {
            required: true,
            message : this.$t("iot_plat_select_connection_way"),
            trigger : "change"
          }
        ],
        reset_code: [
          {
            required: true,
            message : this.$t("iot_plat_select_reset_note"),
            trigger : "change"
          }
        ],
        prodt_code: [
          {
            required: true,
            message : this.$t("iot_plat_select_device_class"),
            trigger : "change"
          }
        ],
        "pic1_fileid.online": [
          {
            required: true,
            message : this.$t("iot_plat_upload_device_online_pic"),
            trigger : "change"
          }
        ],
        "pic1_fileid.thumb": [
          {
            required: true,
            message : this.$t("iot_plat_upload_device_thumb_pic"),
            trigger : "change"
          }
        ]
      }
    };
  },
  watch: {
    formData() {
      this.urlOld.length = 0;
      // 缓存旧的图片地址
      Object.keys(this.formData.pic1_fileid).forEach(key => {
        this.urlOld.push(this.formData.pic1_fileid[key]);
      });
      this.urlOld = this.urlOld.filter(o => o !== "");
    }
  },
  methods: {
    getUploadResult(res, params) {
      if (res) {
        this.formData.pic1_fileid[params.name] = res.path;
      }
    },
    submit: _.debounce(function() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const loading = this.vmLoadingFull();
          try {
            this.oldUrlFilter();
            this.formData.url_old = this.urlOld;
            const param = this.createFormData(this.formData);
            const res = await this.$http.post(ADMIN_DEVICE_MODEL_UPDATE,
              param);
            loading.close();
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess(this.$t("iot_plat_operating_success"))
              this.$refs.form.resetFields();
              // 通知父组件获取最新数据
              this.$emit("close", true);
            }
          } catch (e) {
            loading.close();
            this.vmMsgError(this.$t("iot_plat_program_error"));
          }
        }
      });
    }, this.DEBOUNCE_TIME),

    /**
     * 如果logo地址与宣传图地址在oldUrl中，则说明该地址未被改变，不需要传给后台
     */
    oldUrlFilter() {
      Object.keys(this.formData.pic1_fileid).forEach(key => {
        if (this.urlOld.includes(this.formData.pic1_fileid[key])) {
          this.urlOld.splice(this.urlOld.indexOf(this.formData.pic1_fileid[key]),
            1);
        }
      });
    },

    dialogClose() {
      this.$emit("close");
    }
  }
};
</script>

<style scoped>
.el-dialog .form-btn-upload {
  display: inline-block;
  vertical-align: middle;
}

.pic-format-1 /deep/ .upload-left{
  width: 12rem;
  height: 9.25rem;
}

.pic-format-1 /deep/ .upload-right .el-button {
  height: 9.25rem;
}

.pic-format-2 /deep/ .upload-left{
  width: 12rem;
  height: 12rem;
}
.pic-format-2 /deep/ .upload-right .el-button {
  height: 12rem;
}
</style>
