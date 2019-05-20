
<template>
  <div class="upload-container">
    <div class="upload-left" v-if="model === uploadModel.preview">
      <div class="upload-tips" v-if="!isUploading && !previewImgUrl">
        <p>{{condition}}</p>
      </div>
      <ScaleImgComponent v-else-if="!isUploading && previewImgUrl" :path="previewImgUrl" style="width:100%;height: 100%" alt="图1"></ScaleImgComponent>
      <div class="loading" v-if="isShowLoading">
        <i class="el-icon-loading"></i>
      </div>
      <div v-show="isUploading" class="circle-container">
        <p class="progress">{{progress}}%</p>
        <div class="left-circle-mask">
          <div class="left-circle" ref="leftCircle"></div>
        </div>
        <div class="right-circle-mask">
          <div class="right-circle" ref="rightCircle"></div>
        </div>
      </div>
    </div>
    <div class="upload-right">
      <el-upload
        v-bind="$attrs"
        :action="path"
        :name="name"
        :data="data"
        :disabled="isUploading"
        :accept="accept.join(',')"
        :before-upload="onBeforeUpload"
        :on-success="onUploadSuccess"
        :on-progress="onUploadProgress"
        :on-error="onUploadError"
        :show-file-list="false">
        <el-button class="btn-upload" :disabled="isUploading" :class="model === uploadModel.onlybtn ? 'only-btn' : 'preview-btn'" size="small" type="primary">
          {{btnText}}
          <div class="btn-progress" ref="btnProgress" v-show="model === uploadModel.onlybtn && isUploading"></div>
        </el-button>
      </el-upload>
    </div>
  </div>
</template>

<script>
/**
 * 使用方法详见 upload.md
 */

import ScaleImgComponent from "@/components/preview-img/scale-img.vue"

const BTN_TEXT = "上传"
// 进度 100
const PERCENT_HUNDRED = 100
// 进度 50
const HALF_PERCENT = 50
// 角度
const ANGEL = -135
// 系数
const COEFFICIENT = 3.6
// bytes
const BYTES = 1024


export default {
  components: { ScaleImgComponent },
  props     : {
    // 上传路径
    path: {
      type    : String,
      required: true
    },
    // 编辑时预览路径
    previewPath: {
      type     : String,
      "default": ""
    },
    // 上传时服务端接收名称
    name: {
      type     : String,
      "default": "photo"
    },
    // 上传时的额外参数
    data: {
      type     : Object,
      "default": function () { return {} }
    },
    // 可上传文件类型
    accept: {
      type     : Array,
      /*
       * validator: function (value) {
       *   let flag = value.every(o => o.indexOf(`/`) !== -1)
       *   if (!flag) { throw new Error(`accept: 请输入标准MIME文件类型！`) }
       *   return value
       * },
       */
      "default": function () { return [] }
    },
    // 上传文件大小限制
    size     : { type: Number },
    // 上传文件条件提示
    condition: { type: String },
    // 组件模式
    model    : {
      type     : String,
      "default": "btn"
    },
    // 按钮文字
    buttonText: {
      type     : String,
      "default": BTN_TEXT
    }
  },
  data () {
    return {
      // 上传进度
      progress     : 0,
      // 预览图片路径
      previewImgUrl: "",
      // 是否开始上传--如果未开始上传就显示上传条件，正在上传就显示上传进度，上传成功显示图片预览（预览模式），上传失败则恢复初始状态
      isUploading  : false,
      // 图片对象
      image        : null,
      // 是否显示图片加载动画
      isShowLoading: false,

      // 上传组件的模式，带预览(仅限图片)模式、纯按钮模式
      uploadModel: {
        preview: "preview",
        onlybtn: "btn"
      },
      // 上传按钮显示文字
      btnText: "上传",

      // 上传成功策略
      successFunc: null,

      // 上传中策略
      progressFunc: null
    }
  },
  watch: {
    previewPath () {
      this.previewImgUrl = this.previewPath
    }
  },
  created () {
    this.reset()
    this.previewImgUrl = this.previewPath
    this.image = new Image()

    // 初始化策略
    this.successFunc = {
      [this.uploadModel.preview]: this.previewUploadSuccess,
      [this.uploadModel.onlybtn]: this.onlybtnUploadSuccess
    }
    this.progressFunc = {
      [this.uploadModel.preview]: this.previewUploadProgress,
      [this.uploadModel.onlybtn]: this.onlybtnUploadProgress
    }
  },
  methods: {
    /**
     * 重置组件状态
     */
    reset () {
      this.isUploading = false
      this.isShowLoading = false
      this.previewImgUrl = ""
      this.progress = 0
      this.btnText = this.buttonText
    },

    onBeforeUpload (file) {
      const sizeM = file.size / BYTES / BYTES
      const isInclude = this.accept.some(o => file.type.indexOf(o.replace(".", "")))
      if (this.accept.length > 0 && !isInclude) {
        this.vmMsgError(`请上传格式为${this.accept.join(`、`)}的文件`)
        return false
      }
      if (this.size && sizeM > this.size) {
        this.vmMsgError(`请上传小于${this.size}M的文件`)
        return false
      }
    },
    onUploadSuccess (response, file) {
      this.isUploading = false

      // 登录状态失效或未登录则返回登录界面
      if (response.statu === 0) {
        this.vmMsgError("请重新登录")
        this.$router.push("/signin"); return false
      }

      if (!response.status) {
        this.reset()
        this.$emit("response", null)
        this.vmMsgError(response.msg)
        return false
      }
      this.execSuccessStrategy(this.model, file)
      this.$emit("response", response, this.data)
      this.vmMsgSuccess("上传成功！")
    },
    onUploadProgress (event) {
      this.isUploading = true
      const percent = Math.ceil(event.percent)
      this.execProgressStrategy(this.model, percent)
    },
    onUploadError (err) {
      this.isUploading = false
      this.$emit("response", null)
      this.vmMsgError(err)
      this.reset()
    },

    /**
     * 上传中策略执行函数
     */
    execProgressStrategy (strategy, params) {
      this.progressFunc[strategy](params)
    },
    /**
     * 上传成功策略执行函数
     */
    execSuccessStrategy (strategy, params) {
      this.successFunc[strategy](params)
    },

    // ====== 预览模式上传处理开始 ======
    previewUploadProgress (percent) {
      this.progress = percent
      if (percent <= HALF_PERCENT) {
        this.$refs.rightCircle.style.cssText = `transform: rotate(${ANGEL + COEFFICIENT * percent}deg)`
        this.$refs.leftCircle.style.cssText = `transform: rotate(-135deg)`
      } else {
        this.$refs.rightCircle.style.cssText = `transform: rotate(45deg)`
        this.$refs.leftCircle.style.cssText = `transform: rotate(${ANGEL + COEFFICIENT * (percent - HALF_PERCENT)}deg)`
      }
    },
    previewUploadSuccess (file) {
      file.url = URL.createObjectURL(file.raw)
      this.image.src = file.url
      this.isShowLoading = true
      this.image.onload = () => {
        this.previewImgUrl = file.url
        this.isShowLoading = false
      }
    },
    // ====== 预览模式上传处理结束 ======

    // ====== 纯按钮模式上传处理结束 ======
    onlybtnUploadProgress (percent) {
      this.btnText = `${percent}%`
      this.$refs.btnProgress.style.cssText = `width:${percent}%`
      if (percent === PERCENT_HUNDRED) { this.btnText = `处理中` }
    },
    onlybtnUploadSuccess () {
      this.btnText = this.buttonText
    }
    // ====== 纯按钮模式上传处理结束 ======
  }
}
</script>

<style scoped>
.upload-container {
  display: flex;
  align-items: center;
}
.upload-right,
.upload-left {
  display: inline-block;
}
.upload-left {
  width: 14rem;
  height: 8rem;
  background: #636363;
  display: flex;
  align-items: center;
  position: relative;
}
.upload-left .upload-tips {
  width: 100%;
  height: 100%;
  color: #ececec;
  display: flex;
  align-items: center;
  padding: 10px;
  line-height: 1.5;
  box-sizing: border-box;
}
.upload-left .upload-tips p {
  margin: 0 auto;
  text-align: left;
  font-size: 14px;
}
.circle-container {
  width: 6rem;
  height: 6rem;
  font-size: 0;
  position: relative;
  display: flex;
  align-items: center;
  margin: 0 auto;
}
.circle-container .progress {
  font-size: 20px;
  color: #bfbfbf;
  font-family: fantasy;
  position: absolute;
  width: 100%;
  text-align: center;
}
.left-circle-mask,
.right-circle-mask {
  display: inline-block;
  height: 100%;
  width: 50%;
  overflow: hidden;
  position: relative;
}

.left-circle, .right-circle {
  height: 100%;
  border-radius: 50%;
  border: 10px solid transparent;
  width: 6rem;
  box-sizing: border-box;
  position: absolute;
}
.left-circle {
  border-bottom: 10px solid dodgerblue;
  border-left: 10px solid dodgerblue;
  transform: rotate(-135deg);
  transition: all .3 ease;
  /* animation: circle_left 5s linear 0; */
}
.right-circle{
  right: 0;
  border-top: 10px solid dodgerblue;
  border-right: 10px solid dodgerblue;
  transform: rotate(-135deg);
  transition: all .3 ease;
  /* animation: circle_right 5s linear 0; */
}

/* @keyframes circle_right{
  0%{
      transform : rotate(-135deg);
  }
  50%,100%{
      transform : rotate(45deg);
  }
}
@keyframes circle_left{
  0%,50%{
      transform : rotate(-135deg);
  }
  100%{
      transform : rotate(45deg);
  }
} */

.el-upload .btn-upload {
  border-radius: 0;
  padding: 0;
  font-size: 1.2rem;
  background: #1f7ecf;
  border: none;
  margin-left: .4rem;
  position: relative;
}

.el-upload .preview-btn {
  height: 8rem;
  width: 3rem;
}
.el-upload .only-btn {
  height: 2.5rem;
  width: 6rem;
}

.loading {
  width: 100%;
  position: absolute;
  height: 100%;
  z-index: 10;
  color: #fff;
  font-size: 28px;
  display: flex;
  align-items: center;
  background: #000000a8;
}
.loading .el-icon-loading {
  margin: 0 auto;
}

.btn-progress {
  position: absolute;
  height: 100%;
  width: 0%;
  background: #89c3ff73;
  top: 0;
  transition: all .3s ease;
}
</style>
