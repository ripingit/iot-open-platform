<template>
  <el-dialog title="添加型号" :visible.sync="isVisible" center :before-close="dialogClose">
    <el-form label-width="120px" status-icon :model="formData" ref="form" :rules="rules">
      <el-form-item label="型号名称" class="form-row" prop="product_name">
        <el-input v-model="formData.product_name" placeholder="请输入型号名称"></el-input>
        <span class="form-tip">*</span>
      </el-form-item>
      <el-form-item label="型号代码" class="form-row" prop="product_code">
        <el-input v-model="formData.product_code" maxlength="6" placeholder="请输入型号代码"></el-input>
        <span class="form-tip">*</span>
      </el-form-item>
      <el-form-item label="连接方式" class="form-row" prop="nbi_code">
        <el-select v-model="formData.nbi_code" multiple placeholder="请选择连接方式">
          <el-option
            v-for="item in nbiCode"
            :key="item.nbi_code"
            :label="item.nbi_code_name"
            :value="item.nbi_code"
          ></el-option>
        </el-select>
        <span class="form-tip">*</span>
      </el-form-item>
      <el-form-item label="设备类别" class="form-row" prop="prodt_code">
        <el-select v-model="formData.prodt_code" multiple placeholder="请选择设备类别">
          <el-option
            v-for="item in productCode"
            :key="item.prodt_code"
            :label="item.prodt_name"
            :value="item.prodt_code"
          ></el-option>
        </el-select>
        <span class="form-tip">*</span>
      </el-form-item>
      <el-form-item class="form-row" label="设备在线图" prop="pic1_fileid.online">
        <div class="form-btn-upload">
          <UploadComponent
            :path="uploadPath"
            :data="{name: 'online'}"
            :previewPath="formData.pic1_fileid.online"
            :accept="['.jpg', '.jpeg', '.png']"
            :size="2"
            model="preview"
            condition="尺寸为608*470，格式为 jpg\jpeg\png 且小于2M的白底图片"
            @response="getUploadResult"
          ></UploadComponent>
        </div>
        <span class="form-tip">*</span>
      </el-form-item>

      <el-form-item class="form-row" label="设备状态图" prop="pic1_fileid.state">
        <div class="form-btn-upload">
          <UploadComponent
            :path="uploadPath"
            :data="{name: 'state'}"
            :previewPath="formData.pic1_fileid.state"
            :accept="['.jpg', '.jpeg', '.png']"
            :size="2"
            model="preview"
            condition="尺寸为608*470，格式为 jpg\jpeg\png 且小于2M的白底图片"
            @response="getUploadResult"
          ></UploadComponent>
        </div>
      </el-form-item>

      <el-form-item class="form-row" label="设备Reset图" prop="pic1_fileid.reset">
        <div class="form-btn-upload">
          <UploadComponent
            :path="uploadPath"
            :data="{name: 'reset'}"
            :previewPath="formData.pic1_fileid.reset"
            :accept="['.jpg', '.jpeg', '.png']"
            :size="2"
            model="preview"
            condition="尺寸为608*470，格式为 jpg\jpeg\png 且小于2M的白底图片"
            @response="getUploadResult"
          ></UploadComponent>
        </div>
      </el-form-item>

      <el-form-item class="form-row" label="设备缩略图" prop="pic1_fileid.thumb">
        <div class="form-btn-upload">
          <UploadComponent
            :path="uploadPath"
            :data="{name: 'thumb'}"
            :previewPath="formData.pic1_fileid.thumb"
            :accept="['.jpg', '.jpeg', '.png']"
            :size="2"
            model="preview"
            condition="尺寸为144*144，格式为 jpg\jpeg\png 且小于2M的白底图片"
            @response="getUploadResult"
          ></UploadComponent>
        </div>
        <span class="form-tip">*</span>
      </el-form-item>

      <el-form-item style="margin-top: 4.33rem;">
        <el-button type="primary" class="btn-submit" @click="submit()">提 交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import UploadComponent from "@/components/_ui/upload.vue";
import {
  USER_EQUIPMENT_MODEL_UPLOADIMG,
  USER_EQUIPMENT_MODEL_ADD
} from "@/lib/api.js";
import _ from "lodash";
export default {
  props: {
    /**
     * 连接方式数据
     */
    nbiCode: {
      type: Array,
      required: true,
      default: () => []
    },
    /**
     * 设备类别数据
     */
    productCode: {
      type: Array,
      required: true,
      default: () => []
    },
    /**
     * 控制弹出层的显示隐藏
     */
    isVisible: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  components: { UploadComponent },
  data() {
    return {
      uploadPath: USER_EQUIPMENT_MODEL_UPLOADIMG,
      formData: {
        product_name: "",
        product_code: "",
        nbi_code: [],
        prodt_code: [],
        pic1_fileid: {
          online: "",
          state: "",
          reset: "",
          thumb: ""
        }
      },
      rules: {
        product_name: [
          {
            required: true,
            message: "请输入型号名称",
            trigger: "change"
          }
        ],
        product_code: [
          {
            required: true,
            message: "请输入型号代码",
            trigger: "change"
          }
        ],
        nbi_code: [
          {
            required: true,
            message: "请选择连接方式",
            trigger: "change"
          }
        ],
        prodt_code: [
          {
            required: true,
            message: "请选择设备类别",
            trigger: "change"
          }
        ],
        "pic1_fileid.online": [
          {
            required: true,
            message: "请上传设备在线图片",
            trigger: "change"
          }
        ],
        "pic1_fileid.thumb": [
          {
            required: true,
            message: "请上传设备缩略图",
            trigger: "change"
          }
        ]
      }
    };
  },

  methods: {
    dialogClose() {
      this.$emit("close");
    },
    getUploadResult(res, params) {
      if (res) {
        this.formData.pic1_fileid[params.name] = res.path;
      }
    },

    submit: _.debounce(function() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          const loading = this.vmLoadingFull();
          try {
            const param = this.createFormData(this.formData);
            let res = await this.$http.post(USER_EQUIPMENT_MODEL_ADD, param);
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess("添加成功！");
              this.$refs["form"].resetFields();
              this.$emit("close", true); // 通知父组件获取最新数据
              loading.close();
            }
          } catch (e) {
            loading.close();
            this.vmMsgError("程序错误！");
          }
        }
      });
    }, 300)
  }
};
</script>

<style scoped>
.el-dialog .form-btn-upload {
  display: inline-block;
  vertical-align: middle;
}
</style>
