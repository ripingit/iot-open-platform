<template>
  <el-dialog title="型号配置" :visible.sync="isVisible" center style="margin-top: -6vh;" :before-close="handleClose">
    <el-row class="device-model-editdialog">
      <el-col :span="24" style="padding:0 0 1rem 2.5rem;">
        <div>型号名称：{{data.product_name}}</div>
        <div>连接方式：{{data.nbi_code}}</div>
      </el-col>
      <el-col :span="24">
        <el-form
          label-width="100px"
          :model="formConfig"
          status-icon
          ref="configForm"
          :rules="rules"
        >
          <div v-if="IPCC">
            <el-col :span="24" class="device-model-editdialog-title">IPC分类（IPCC）</el-col>
            <el-form-item label="设备分类" class="form-row" prop="class">
              <el-select v-model="formConfig.class" placeholder="请选择">
                <el-option
                  v-for="item in class_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="解码方式" class="form-row" prop="dec">
              <el-select v-model="formConfig.dec" placeholder="请选择">
                <el-option
                  v-for="item in dec_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="设备通道数" class="form-row" prop="chans">
              <el-input v-model="formConfig.chans"></el-input>
            </el-form-item>
            <el-form-item label="校正解码" class="form-row" prop="pipc_dv">
              <el-select v-model="formConfig.pipc_dv" placeholder="请选择">
                <el-option
                  v-for="item in pipc_dv_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="音频模式" class="form-row" prop="audio">
              <el-select v-model="formConfig.audio" placeholder="请选择">
                <el-option
                  v-for="item in audio_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="麦克风" class="form-row" prop="mic">
              <el-radio v-model="formConfig.mic" label="1">支持</el-radio>
              <el-radio v-model="formConfig.mic" label="0">不支持</el-radio>
            </el-form-item>
            <el-form-item label="喇叭" class="form-row" prop="speaker">
              <el-radio v-model="formConfig.speaker" label="1">支持</el-radio>
              <el-radio v-model="formConfig.speaker" label="0">不支持</el-radio>
            </el-form-item>
            <el-form-item label="存储卡" class="form-row" prop="sdcard">
              <el-radio v-model="formConfig.sdcard" label="1">支持</el-radio>
              <el-radio v-model="formConfig.sdcard" label="0">不支持</el-radio>
            </el-form-item>
            <el-form-item label="云存储" class="form-row" prop="yun">
              <el-radio v-model="formConfig.yun" label="1">支持</el-radio>
              <el-radio v-model="formConfig.yun" label="0">不支持</el-radio>
            </el-form-item>
            <el-form-item label="云台控制" class="form-row" prop="ptzctrl">
              <el-radio v-model="formConfig.ptzctrl" label="1">水平</el-radio>
              <el-radio v-model="formConfig.ptzctrl" label="2">垂直</el-radio>
              <el-radio v-model="formConfig.ptzctrl" label="3">水平+垂直</el-radio>
              <el-radio v-model="formConfig.ptzctrl" label="0">不支持</el-radio>
            </el-form-item>
            <el-form-item label="指示灯" class="form-row" prop="status_light">
              <el-radio v-model="formConfig.status_light" label="1">有</el-radio>
              <el-radio v-model="formConfig.status_light" label="0">没有</el-radio>
            </el-form-item>
            <el-form-item label="人形检测" class="form-row" prop="human_detect">
              <el-radio v-model="formConfig.human_detect" label="1">支持</el-radio>
              <el-radio v-model="formConfig.human_detect" label="0">不支持</el-radio>
            </el-form-item>
            <el-form-item label="人形跟踪" class="form-row" prop="human_track">
              <el-radio v-model="formConfig.human_track" label="1">支持</el-radio>
              <el-radio v-model="formConfig.human_track" label="0">不支持</el-radio>
            </el-form-item>
            <el-form-item label="OSD" class="form-row" prop="osd">
              <el-radio v-model="formConfig.osd" label="1">支持</el-radio>
              <el-radio v-model="formConfig.osd" label="0">不支持</el-radio>
            </el-form-item>
            <el-form-item label="区域侦测" class="form-row" prop="area_detect">
              <el-radio v-model="formConfig.area_detect" label="1">支持</el-radio>
              <el-radio v-model="formConfig.area_detect" label="0">不支持</el-radio>
            </el-form-item>
            <el-form-item label="声音检测" class="form-row" prop="voice_detect">
              <el-radio v-model="formConfig.voice_detect" label="1">支持</el-radio>
              <el-radio v-model="formConfig.voice_detect" label="0">不支持</el-radio>
            </el-form-item>
            <el-form-item label="哭声检测" class="form-row" prop="cry_detect">
              <el-radio v-model="formConfig.cry_detect" label="1">支持</el-radio>
              <el-radio v-model="formConfig.cry_detect" label="0">不支持</el-radio>
            </el-form-item>
            <el-form-item label="移动侦测" class="form-row" prop="motion_detect">
              <el-radio v-model="formConfig.motion_detect" label="1">支持</el-radio>
              <el-radio v-model="formConfig.motion_detect" label="0">不支持</el-radio>
            </el-form-item>
          </div>

          <!-- 情景按钮 -->
          <div v-if="BHSC">
            <el-col :span="24" class="device-model-editdialog-title">情景按钮（BHSC）</el-col>
            <el-form-item label="按钮数量" class="form-row" prop="num">
              <el-input v-model="formConfig.num"></el-input>
            </el-form-item>
          </div>

          <!-- 组合开关 -->
          <div v-if="CMSW">
            <el-col :span="24" class="device-model-editdialog-title">组合开关（CMSW）</el-col>
            <el-form-item label="开关数量" class="form-row" prop="num2">
              <el-input v-model="formConfig.num2"></el-input>
            </el-form-item>
          </div>

          <!-- 智能门禁 -->
          <div v-if="VZDB">
            <el-col :span="24" class="device-model-editdialog-title">智能门禁（VZDB）</el-col>
            <el-form-item label="解码方式" class="form-row" prop="dec">
              <el-select v-model="formConfig.dec" placeholder="请选择">
                <el-option
                  v-for="item in dec_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="音频模式" class="form-row" prop="audio">
              <el-select v-model="formConfig.audio" placeholder="请选择">
                <el-option
                  v-for="item in audio_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="麦克风" class="form-row" prop="mic">
              <el-radio v-model="formConfig.mic" label="1">支持</el-radio>
              <el-radio v-model="formConfig.mic" label="0">不支持</el-radio>
            </el-form-item>
            <el-form-item label="喇叭" class="form-row" prop="speaker">
              <el-radio v-model="formConfig.speaker" label="1">支持</el-radio>
              <el-radio v-model="formConfig.speaker" label="0">不支持</el-radio>
            </el-form-item>
            <el-form-item label="存储卡" class="form-row" prop="sdcard">
              <el-radio v-model="formConfig.sdcard" label="1">支持</el-radio>
              <el-radio v-model="formConfig.sdcard" label="0">不支持</el-radio>
            </el-form-item>
            <el-form-item label="云存储" class="form-row" prop="yun">
              <el-radio v-model="formConfig.yun" label="1">支持</el-radio>
              <el-radio v-model="formConfig.yun" label="0">不支持</el-radio>
            </el-form-item>
            <el-form-item label="指示灯" class="form-row" prop="status_light">
              <el-radio v-model="formConfig.status_light" label="1">有</el-radio>
              <el-radio v-model="formConfig.status_light" label="0">没有</el-radio>
            </el-form-item>
            <el-form-item label="声音检测" class="form-row" prop="voice_detect">
              <el-radio v-model="formConfig.voice_detect" label="1">支持</el-radio>
              <el-radio v-model="formConfig.voice_detect" label="0">不支持</el-radio>
            </el-form-item>
            <el-form-item label="人体感应" class="form-row" prop="body_induction">
              <el-radio v-model="formConfig.body_induction" label="1">支持</el-radio>
              <el-radio v-model="formConfig.body_induction" label="0">不支持</el-radio>
            </el-form-item>
            <el-form-item label="低功耗" class="form-row" prop="liteos">
              <el-radio v-model="formConfig.liteos" label="1">支持</el-radio>
              <el-radio v-model="formConfig.liteos" label="0">不支持</el-radio>
            </el-form-item>
          </div>

          <!-- 智能音箱 -->
          <div v-if="SSYX">
            <el-col :span="24" class="device-model-editdialog-title">智能音箱（SSYX）</el-col>
            <el-form-item label="聊天" class="form-row" prop="chat">
              <el-radio v-model="formConfig.chat" label="1">支持</el-radio>
              <el-radio v-model="formConfig.chat" label="0">不支持</el-radio>
            </el-form-item>
          </div>

          <!-- 故事机 -->
          <div v-if="SYME">
            <el-col :span="24" class="device-model-editdialog-title">故事机（SYME）</el-col>
            <el-form-item label="聊天" class="form-row" prop="chat">
              <el-radio v-model="formConfig.chat" label="1">支持</el-radio>
              <el-radio v-model="formConfig.chat" label="0">不支持</el-radio>
            </el-form-item>
          </div>
        </el-form>
      </el-col>
      <el-col :span="24">
        <el-form label-width="100px" :model="formConfig">
          <el-form-item label>
            <el-button
              type="primary"
              class="btn-submit"
              style="margin-top: 4.33rem"
              @click="configSubmit()"
            >提 交</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { validateProductCode } from "@/lib/validate.js";
import { deviceCategory, decodeFormat, pipcDvDecode, audioMode } from "@/lib/mixins.js"
import { COOP_DEVICE_MODEL_SET } from "@/lib/api.js";
import _ from "lodash";
export default {
  mixins: [
    {
      data () {
        return {
          class_options  : deviceCategory,
          dec_options    : decodeFormat,
          pipc_dv_options: pipcDvDecode,
          audio_options  : audioMode
        }
      }
    }
  ],
  props: {
    /**
     * 控制弹出层的显示隐藏
     */
    isVisible: {
      type     : Boolean,
      required : true,
      "default": false
    },
    /**
     * 配置所需数据
     */
    data: {
      type    : Object,
      required: true
    }
  },
  data () {
    const validateIsEmpty = (rule, value, callback) => {
      if (value === "") {
        if (rule.field === "product_name") {
          callback(new Error("请输入型号名称"));
        } else if (rule.field === "product_code") {
          callback(new Error("请输入型号代码"));
        } else if (rule.field === "nbi_code") {
          callback(new Error("请选择连接方式"));
        } else if (rule.field === "prodt_code") {
          callback(new Error("请选择设备类别"));
        } else if (rule.field === "class") {
          callback(new Error("请选择设备分类"));
        } else if (rule.field === "dec") {
          callback(new Error("请选择解码方式"));
        } else if (rule.field === "chans") {
          callback(new Error("请输入设备通道数"));
        } else if (rule.field === "pipc_dv") {
          callback(new Error("请选择设备通道数"));
        } else if (rule.field === "audio") {
          callback(new Error("请选择音频模式"));
        } else if (rule.field === "num") {
          callback(new Error("请输入按钮数量"));
        } else if (rule.field === "num2") {
          callback(new Error("请输入开关数量"));
        }
      } else if (rule.field === "product_code") {
        if (!validateProductCode(value)) {
          callback(new Error("最大长度不超过6位字符，且只能包含字母和数字"));
        }
      }
      callback();
    };
    return {
      configItem: [ "mic", "speaker", "sdcard", "yun", "ptzctrl", "status_light", "human_detect", "human_track", "osd", "voice_detect", "body_induction", "cry_detect", "motion_detect", "area_detect", "liteos", "chat" ],
      IPCC      : false,
      BHSC      : false,
      CMSW      : false,
      VZDB      : false,
      SSYX      : false,
      SYME      : false,
      formConfig: {
        "class"       : "",
        dec           : "",
        chans         : "",
        pipc_dv       : "",
        audio         : "",
        num           : "",
        num2          : "",
        mic           : "1",
        speaker       : "1",
        sdcard        : "1",
        yun           : "1",
        ptzctrl       : "1",
        status_light  : "1",
        human_detect  : "1",
        human_track   : "1",
        osd           : "1",
        voice_detect  : "1",
        body_induction: "1",
        cry_detect    : "1",
        motion_detect : "1",
        area_detect   : "1",
        liteos        : "1",
        chat          : "1"
      },
      rules: {
        product_name: [ { validator: validateIsEmpty, trigger: "blur" } ],
        product_code: [ { validator: validateIsEmpty, trigger: "change" } ],
        nbi_code    : [ { validator: validateIsEmpty, trigger: "change" } ],
        prodt_code  : [ { validator: validateIsEmpty, trigger: "change" } ],
        "class"     : [ { validator: validateIsEmpty, trigger: "change" } ],
        dec         : [ { validator: validateIsEmpty, trigger: "change" } ],
        chans       : [ { validator: validateIsEmpty, trigger: "blur" } ],
        pipc_dv     : [ { validator: validateIsEmpty, trigger: "change" } ],
        audio       : [ { validator: validateIsEmpty, trigger: "change" } ],
        num         : [ { validator: validateIsEmpty, trigger: "blur" } ],
        num2        : [ { validator: validateIsEmpty, trigger: "blur" } ]
      }
    }
  },
  watch: {
    data () {
      this.IPCC = this.data.prodt_code.includes("IPCC");
      this.BHSC = this.data.prodt_code.includes("BHSC");
      this.CMSW = this.data.prodt_code.includes("CMSW");
      this.VZDB = this.data.prodt_code.includes("VZDB");
      this.SYME = this.data.prodt_code.includes("SYME");
      this.SSYX = this.data.prodt_code.includes("SSYX");
      if (this.data.config_status) {
        this.formConfig = {};
        const rowData = JSON.parse(this.data.config_status);
        const tmpConfig = rowData.map(obj => {
          this.configItem.forEach(item => {
            if (item in obj.conf) {
              obj.conf[item] = typeof obj.conf[item] === "number" ? String(obj.conf[item]) : "0"
            }
          })
          return obj
        })
        this.formConfig = tmpConfig[0].conf
      }
    }
  },
  created () {
    document.body.addEventListener("keydown", this.keyCodeDown, false);
  },
  beforeDestroy () {
    document.body.removeEventListener("keydown", this.keyCodeDown, false);
  },
  methods: {
    keyCodeDown(e) {
      if (e.keyCode === this.ENTER_KEY_CODE) {
        this.configSubmit();
      }
    },
    handleClose() {
      this.$emit("close");
    },
    configSubmit: _.debounce(function() {
      const loading = this.vmLoadingFull();
      try {
        this.$refs.configForm.validate(async valid => {
          if (valid) {
            let postData = null;
            const params = {
              product_code: this.data.product_code,
              config      : ""
            }
            const tmpData = [ {
              prodt_code: "",
              conf      : {}
            } ]
            this.IPCC && (tmpData[0].prodt_code = "IPCC")
            this.BHSC && (tmpData[0].prodt_code = "BHSC")
            this.CMSW && (tmpData[0].prodt_code = "CMSW")
            this.VZDB && (tmpData[0].prodt_code = "VZDB")
            this.SSYX && (tmpData[0].prodt_code = "SSYX")
            this.SYME && (tmpData[0].prodt_code = "SYME")
            Object.keys(this.formConfig).forEach(key => {
              tmpData[0].conf[key] = this.formConfig[key] && parseInt(this.formConfig[key])
            })
            params.config = JSON.stringify(tmpData)
            postData = this.createFormData(params)

            const res = await this.$http.post(COOP_DEVICE_MODEL_SET, postData)
            loading.close();
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess("操作成功！");
              this.$refs.configForm.resetFields();
              this.$emit("close", true);
            }
          }
        });
      } catch (e) {
        loading.close();
        this.vmMsgError("程序错误！");
      }
    }, this.DEBOUNCE_TIME)
  }
}
</script>
