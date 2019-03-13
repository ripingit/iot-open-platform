<template>
  <el-dialog title="型号编辑" :visible.sync="isVisible" center :before-close="dialogClose">
    <el-form label-width="120px" status-icon :model="formData" ref="form" :rules="rules">
      <el-form-item label="型号名称" class="form-row" prop="product_name">
        <el-input v-model="formData.product_name" disabled placeholder="请输入型号名称"></el-input>
        <span class="form-tip">*</span>
      </el-form-item>
      <el-form-item label="型号代码" class="form-row" prop="product_code">
        <el-input v-model="formData.product_code" maxlength="6" disabled placeholder="请输入型号代码"></el-input>
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
        <el-select v-model="formData.prodt_code" multiple disabled placeholder="请选择设备类别">
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
  ADMIN_EQUIPMENT_MODEL_UPLOADIMG,
  ADMIN_EQUIPMENT_MODEL_UPDATE
} from "@/lib/api.js";
import _ from "lodash";
export default {
  components: { UploadComponent },
  props: {
    /**
     * 连接方式数据
     */
    nbiCode: {
      type: Array,
      default: () => [],
      required: true
    },
    /**
     * 设备类别数据
     */
    productCode: {
      type: Array,
      default: () => [],
      required: true
    },
    /**
     * 控制弹出层的显示隐藏
     */
    isVisible: {
      type: Boolean,
      required: true,
      default: false
    },
    /**
     * 待编辑数据
     */
    formData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      urlOld: [],
      uploadPath: ADMIN_EQUIPMENT_MODEL_UPLOADIMG,
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
    getUploadResult(res, params, file) {
      if (res) {
        this.formData.pic1_fileid[params.name] = res.path;
      }
    },
    submit: _.debounce(function() {
      this.$refs["form"].validate(async valid => {
        if (valid) {
          const loading = this.vmLoadingFull();
          try {
            this.oldUrlFilter();
            this.formData.url_old = this.urlOld;
            const param = this.createFormData(this.formData);
            const res = await this.$http.post(
              ADMIN_EQUIPMENT_MODEL_UPDATE,
              param
            );
            loading.close();
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess("操作成功！");
              this.$refs["form"].resetFields();
              this.$emit("close", true); // 通知父组件获取最新数据
            }
          } catch (e) {
            loading.close();
            this.vmMsgError("程序错误！");
          }
        }
      });
    }, 300),

    /**
     * 如果logo地址与宣传图地址在oldUrl中，则说明该地址未被改变，不需要传给后台
     */
    oldUrlFilter() {
      Object.keys(this.formData.pic1_fileid).forEach(key => {
        if (this.urlOld.includes(this.formData.pic1_fileid[key])) {
          this.urlOld.splice(
            this.urlOld.indexOf(this.formData.pic1_fileid[key]),
            1
          );
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
</style>
