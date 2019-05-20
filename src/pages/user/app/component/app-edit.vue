<template>
  <div>
    <el-dialog
      title="app编辑"
      center
      :visible.sync="isVisible"
      :close-on-click-modal="false"
      :before-close="dialogClose"
    >
      <el-form
        status-icon
        :model="formData"
        :rules="rules"
        ref="ruleForm"
        label-position="right"
        label-width="120px"
        :hide-required-asterisk="true"
      >
        <el-form-item label="APP名称" class="form-row" prop="app_name">
          <el-input v-model="formData.app_name" placeholder="请输入APP名称"></el-input>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item label="APP英文名称" class="form-row" prop="en_app_name">
          <el-input v-model="formData.en_app_name" placeholder="请输入APP英文名称"></el-input>
        </el-form-item>

        <el-form-item label="下载地址" prop class="form-row code-panel">
          <el-select
            v-model="storeName"
            placeholder="请选择应用商店"
            no-data-text="无数据"
            @change="appStoreChange"
          >
            <el-option
              v-for="(item, index) in appStore"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-button @click="loadDownloadDialog" size="medium" type="primary">更多</el-button>
          <div class="split-line"></div>
          <el-input v-model="storeUrl" placeholder="请输入app下载地址" @change="downloadUrlSet($event)"></el-input>
          <span class="form-tip">*</span>
        </el-form-item>

        <el-form-item class="form-row logo" label="LOGO" prop="app_logo_url">
          <div class="form-btn-upload">
            <UploadComponent
              class="logo-pic"
              :path="uploadPathLogo"
              :previewPath="formData.app_logo_url"
              :accept="['.jpg', '.jpeg', '.png']"
              :size="2"
              :data="{name: 'app_logo_url'}"
              model="preview"
              condition="格式为 jpg\jpeg\png 且小于2M"
              @response="getLogoUploadResult"
            ></UploadComponent>
          </div>
          <span class="form-tip">*</span>
        </el-form-item>

        <el-form-item class="form-row start-boot" label="宣传图1">
          <div class="form-btn-upload">
            <UploadComponent
              class="logo-pic"
              :path="uploadPathLogo"
              :previewPath="bootAnimations.pic1"
              :accept="['.png','.jpg','.jpeg','.bmp','.apng','.gif']"
              :size="5"
              :data="{name: 'boot_logo_url'}"
              model="preview"
              condition="小于5M的jpg/gif图片"
              @response="getAnimationUploadResult1"
            ></UploadComponent>
          </div>
          <div class="animation-oper">
            <el-input class="url" v-model="bootAnimations.url1" placeholder="请输入跳转地址"></el-input>
            <el-button
              type="primary"
              @click="delBootAnimation('url1', 'pic1')"
              class="animation-del-btn"
            >删除</el-button>
          </div>
        </el-form-item>
        <el-form-item class="form-row start-boot" label="宣传图2">
          <div class="form-btn-upload">
            <UploadComponent
              class="logo-pic"
              :path="uploadPathLogo"
              :previewPath="bootAnimations.pic2"
              :accept="['.png','.jpg','.jpeg','.bmp','.apng','.gif']"
              :size="5"
              :data="{name: 'boot_logo_url'}"
              model="preview"
              condition="小于5M的jpg/gif图片"
              @response="getAnimationUploadResult2"
            ></UploadComponent>
          </div>
          <div class="animation-oper">
            <el-input class="url" v-model="bootAnimations.url2" placeholder="请输入跳转地址"></el-input>
            <el-button
              type="primary"
              @click="delBootAnimation('url2', 'pic2')"
              class="animation-del-btn"
            >删除</el-button>
          </div>
        </el-form-item>
        <el-form-item class="form-row start-boot" label="宣传图3">
          <div class="form-btn-upload">
            <UploadComponent
              class="logo-pic"
              :path="uploadPathLogo"
              :previewPath="bootAnimations.pic3"
              :accept="['.png','.jpg','.jpeg','.bmp','.apng','.gif']"
              :size="5"
              :data="{name: 'boot_logo_url'}"
              model="preview"
              condition="小于5M的jpg/gif图片"
              @response="getAnimationUploadResult3"
            ></UploadComponent>
          </div>
          <div class="animation-oper">
            <el-input class="url" v-model="bootAnimations.url3" placeholder="请输入跳转地址"></el-input>
            <el-button
              type="primary"
              @click="delBootAnimation('url3', 'pic3')"
              class="animation-del-btn"
            >删除</el-button>
          </div>
        </el-form-item>
        <el-form-item class="form-row">
          <el-button type="primary" @click="submitForm" class="btn-submit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <AppDownloadUrlComponent
      :isVisibleEnable="isAppUrlSettingVisible"
      :data="formData.url"
      @response="setAppDownloadUrl"
    ></AppDownloadUrlComponent>
  </div>
</template>
<script>
import UploadComponent from "@/components/uploader/upload.vue";
import AppDownloadUrlComponent from "./app-download-url.vue";
import { COOP_APP_UPDATE_POST, COOP_APP_LOGO_UPLOAD_POST } from "@/lib/api";
import { appStore } from "@/lib/const";
// import _ from "lodash";
export default {
  components: { UploadComponent, AppDownloadUrlComponent },
  props     : {
    /**
     * 控制促销弹出层的显示隐藏
     */
    isVisible: {
      type     : Boolean,
      "default": false
    },
    /**
     * 表单数据
     */
    formData: {
      type    : Object,
      required: true
    }
  },
  data() {
    return {
      uploadPathLogo        : COOP_APP_LOGO_UPLOAD_POST,
      storeName             : "",
      appStore              : appStore,
      storeUrl              : "",
      isAppUrlSettingVisible: false,
      urlOld                : [],
      rules                 : {
        app_name    : [ { required: true, message: "请输入APP名称", trigger: "change" } ],
        app_logo_url: [ { required: true, message: "请设置APP的logo", trigger: "change" } ]
      },
      bootAnimations: {
        pic1: "",
        url1: "",
        pic2: "",
        url2: "",
        pic3: "",
        url3: ""
      }
    };
  },

  watch: {
    formData() {
      this.urlOld.length = 0;
      const urls = this.isJsonString(this.formData.url) ? JSON.parse(this.formData.url) : appStore
      this.storeName = urls[0].id;
      this.storeUrl = urls[0].url;
      this.formData.url = urls;
      this.formData.boot_logo_url = this.isJsonString(this.formData.boot_logo_url)
        ? JSON.parse(this.formData.boot_logo_url)
        : this.bootAnimations;
      this.bootAnimations = this.formData.boot_logo_url;

      // 将logo、宣传图地址缓存
      this.urlOld.push(this.formData.app_logo_url);
      this.urlOld.push(this.bootAnimations.pic1);
      this.urlOld.push(this.bootAnimations.pic2);
      this.urlOld.push(this.bootAnimations.pic3);
      this.urlOld = this.urlOld.filter(o => o !== "");
    }
  },
  methods: {
    getLogoUploadResult(res) {
      this.formData.app_logo_url = res.path;
    },
    getAnimationUploadResult1(res) {
      this.bootAnimations.pic1 = res.path;
    },
    getAnimationUploadResult2(res) {
      this.bootAnimations.pic2 = res.path;
    },
    getAnimationUploadResult3(res) {
      this.bootAnimations.pic3 = res.path;
    },
    appStoreChange() {
      const temp = this.formData.url.find(o => o.id === parseInt(this.storeName));
      !temp ? this.storeUrl = "" : this.storeUrl = temp.url;
    },
    downloadUrlSet($event) {
      const temp = this.formData.url.find(o => o.id === parseInt(this.storeName));
      temp.url = $event;
    },
    loadDownloadDialog() {
      this.isAppUrlSettingVisible = true;
    },

    setAppDownloadUrl(res) {
      this.isAppUrlSettingVisible = false;
      this.formData.url = res;
    },

    submitForm() {
      if (!this.formData.url[0].url) {
        this.vmMsgError("安卓通用下载地址为必填！");
        return;
      }
      this.$refs.ruleForm.validate(async valid => { 
        if (valid) {
          const loading = this.vmLoadingFull();
          try {
            this.oldUrlFilter();
            this.formData.pic2 = this.bootAnimations;
            this.formData.url_old = this.urlOld;
            const postForm = { ...this.formData }
            postForm.url = JSON.stringify(postForm.url);
            const postData = this.createFormData(postForm);
            const res = await this.$http.post(COOP_APP_UPDATE_POST, postData);
            loading.close();
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess("更新成功！");
              // true 告诉父组件获取新数据
              this.$emit("close", true);
            }
          } catch (e) {
            loading.close();
            this.vmMsgError("程序错误！");
          }
        }
      })
    },

    delBootAnimation(url, pic) {
      this.bootAnimations[url] = "";
      this.bootAnimations[pic] = "";
    },

    /**
     * 如果logo地址与宣传图地址在oldUrl中，则说明该地址未被改变，不需要传给后台
     */
    oldUrlFilter() {
      if (this.urlOld.includes(this.formData.app_logo_url)) {
        this.urlOld.splice(this.urlOld.indexOf(this.formData.app_logo_url), 1);
      }
      if (this.urlOld.includes(this.bootAnimations.pic1)) {
        this.urlOld.splice(this.urlOld.indexOf(this.bootAnimations.pic1), 1);
      }
      if (this.urlOld.includes(this.bootAnimations.pic2)) {
        this.urlOld.splice(this.urlOld.indexOf(this.bootAnimations.pic2), 1);
      }
      if (this.urlOld.includes(this.bootAnimations.pic3)) {
        this.urlOld.splice(this.urlOld.indexOf(this.bootAnimations.pic3), 1);
      }
    },

    dialogClose() {
      // 解决报错 Avoid mutating a prop directly since the value will be overwritten whenever the parent component re-renders
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

.start-boot .logo-pic /deep/ .upload-left,
.logo .logo-pic /deep/ .upload-left {
  width: 8.33rem;
}
.animation-oper {
  display: inline-block;
  vertical-align: middle;
}
.animation-oper .url {
  width: 12.5rem;
}
.animation-oper .animation-del-btn {
  width: 12.5rem;
  display: block;
  margin-top: 1rem;
}
</style>
