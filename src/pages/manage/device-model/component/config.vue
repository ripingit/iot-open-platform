<template>
  <el-dialog :title="$t('iot_plat_model_config')" :visible.sync="isVisible" center style="margin-top: -6vh;" :before-close="handleClose">
    <el-row class="device-model-editdialog">
      <el-col :span="24" style="padding:0 0 1rem 2.5rem;">
        <div>{{$t("iot_plat_model_name")}}：{{data.product_name}}</div>
        <div style="padding-top: 1rem">{{$t("iot_plat_connection_way")}}：{{data.nbi_code}}</div>
      </el-col>
      <el-col :span="24">
        <el-form label-width="160px" :model="formConfig" status-icon ref="ConfigForm">
          <template v-if="isIPCC">
            <el-col :span="24" class="device-model-editdialog-title">{{$t("iot_plat_ipc_class")}}（IPCC）</el-col>
            <el-form-item :label="$t('iot_plat_device_category')" class="form-row" prop="class">
              <el-select v-model="formConfig.class" :placeholder="$t('iot_plat_select_please')" disabled>
                <el-option
                  v-for="item in ipccClass"
                  :key="item.value"
                  :label="$t(item.label)"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
           <!--  <el-form-item :label="$t('iot_plat_decode_way')" class="form-row" prop="dec">
              <el-select v-model="formConfig.dec" :placeholder="$t('iot_plat_select_please')" disabled>
                <el-option
                  v-for="item in dec_options"
                  :key="item.value"
                  :label="$t(item.label)"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('iot_plat_device_channel_number')" class="form-row" prop="chans">
              <el-input v-model="formConfig.chans" disabled></el-input>
            </el-form-item> -->
            <el-form-item :label="$t('iot_plat_correction_decoding')" class="form-row" prop="pipc_dv" v-if="formConfig.class === 4">
              <el-select v-model="formConfig.pipc_dv" :placeholder="$t('iot_plat_select_please')" disabled>
                <el-option
                  v-for="item in pipc_dv_options"
                  :key="item.value"
                  :label="$t(item.label)"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('iot_plat_audio_mode')" class="form-row" prop="audio" v-if="formConfig.mic === '1' && formConfig.speaker === '1'">
              <el-select v-model="formConfig.audio" :placeholder="$t('iot_plat_select_please')" disabled>
                <el-option
                  v-for="item in audio_options"
                  :key="item.value"
                  :label="$t(item.label)"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('iot_plat_microphone')" class="form-row" prop="mic">
              <el-radio v-model="formConfig.mic" label="1" disabled>{{$t("iot_plat_support")}}</el-radio>
              <el-radio v-model="formConfig.mic" label="0" disabled>{{$t("iot_plat_non_support")}}</el-radio>
            </el-form-item>
            <el-form-item :label="$t('iot_plat_horn')" class="form-row" prop="speaker">
              <el-radio v-model="formConfig.speaker" label="1" disabled>{{$t("iot_plat_support")}}</el-radio>
              <el-radio v-model="formConfig.speaker" label="0" disabled>{{$t("iot_plat_non_support")}}</el-radio>
            </el-form-item>
            <el-form-item :label="$t('iot_plat_storage_card')" class="form-row" prop="sdcard">
              <el-radio v-model="formConfig.sdcard" label="1" disabled>{{$t("iot_plat_support")}}</el-radio>
              <el-radio v-model="formConfig.sdcard" label="0" disabled>{{$t("iot_plat_non_support")}}</el-radio>
            </el-form-item>
            <el-form-item :label="$t('iot_plat_cloud_storage')" class="form-row" prop="cloud_storage">
              <el-radio v-model="formConfig.cloud_storage" label="1" disabled>{{$t("iot_plat_support")}}</el-radio>
              <el-radio v-model="formConfig.cloud_storage" label="0" disabled>{{$t("iot_plat_non_support")}}</el-radio>
            </el-form-item>
            <el-form-item :label="$t('iot_plat_ptz_control')" class="form-row" prop="ptzctrl">
              <el-radio v-model="formConfig.ptzctrl" label="1" disabled>{{$t("iot_plat_horizontal")}}</el-radio>
              <el-radio v-model="formConfig.ptzctrl" label="2" disabled>{{$t("iot_plat_vertical")}}</el-radio>
              <el-radio v-model="formConfig.ptzctrl" label="3" disabled>{{$t("iot_plat_horizontal_and_vertical")}}</el-radio>
              <el-radio v-model="formConfig.ptzctrl" label="0" disabled>{{$t("iot_plat_non_support")}}</el-radio>
            </el-form-item>
            <el-form-item :label="$t('iot_plat_indicator_light')" class="form-row" prop="status_light">
              <el-radio v-model="formConfig.status_light" label="1" disabled>{{$t("iot_plat_have")}}</el-radio>
              <el-radio v-model="formConfig.status_light" label="0" disabled>{{$t("iot_plat_have_not")}}</el-radio>
            </el-form-item>
            <el-form-item :label="$t('iot_plat_humanoid_detection')" class="form-row" prop="human_detect">
              <el-radio v-model="formConfig.human_detect" label="1" disabled>{{$t("iot_plat_support")}}</el-radio>
              <el-radio v-model="formConfig.human_detect" label="0" disabled>{{$t("iot_plat_non_support")}}</el-radio>
            </el-form-item>
            <el-form-item :label="$t('iot_plat_humanoid_tracking')" class="form-row" prop="human_track">
              <el-radio v-model="formConfig.human_track" label="1" disabled>{{$t("iot_plat_support")}}</el-radio>
              <el-radio v-model="formConfig.human_track" label="0" disabled>{{$t("iot_plat_non_support")}}</el-radio>
            </el-form-item>
            <el-form-item :label="$t('iot_plat_osd')" class="form-row" prop="osd">
              <el-radio v-model="formConfig.osd" label="1" disabled>{{$t("iot_plat_support")}}</el-radio>
              <el-radio v-model="formConfig.osd" label="0" disabled>{{$t("iot_plat_non_support")}}</el-radio>
            </el-form-item>
            <el-form-item :label="$t('iot_plat_move_detection')" class="form-row" prop="motion_detect">
              <el-radio v-model="formConfig.motion_detect" label="1" disabled>{{$t("iot_plat_support")}}</el-radio>
              <el-radio v-model="formConfig.motion_detect" label="0" disabled>{{$t("iot_plat_non_support")}}</el-radio>
            </el-form-item>
            <el-form-item :label="$t('iot_plat_area_detection')" class="form-row" prop="area_detect" v-if="formConfig.motion_detect === '1'">
              <el-radio v-model="formConfig.area_detect" label="1" disabled>{{$t("iot_plat_support")}}</el-radio>
              <el-radio v-model="formConfig.area_detect" label="0" disabled>{{$t("iot_plat_non_support")}}</el-radio>
            </el-form-item>
            <el-form-item :label="$t('iot_plat_sound_detection')" class="form-row" prop="voice_detect">
              <el-radio v-model="formConfig.voice_detect" label="1" disabled>{{$t("iot_plat_support")}}</el-radio>
              <el-radio v-model="formConfig.voice_detect" label="0" disabled>{{$t("iot_plat_non_support")}}</el-radio>
            </el-form-item>
            <el-form-item :label="$t('iot_plat_cry_detection')" class="form-row" prop="cry_detect">
              <el-radio v-model="formConfig.cry_detect" label="1" disabled>{{$t("iot_plat_support")}}</el-radio>
              <el-radio v-model="formConfig.cry_detect" label="0" disabled>{{$t("iot_plat_non_support")}}</el-radio>
            </el-form-item>
            <el-form-item :label="$t('iot_plat_low_power_consumption')" class="form-row" prop="liteos">
              <el-radio v-model="formConfig.liteos" label="1" disabled>{{$t("iot_plat_support")}}</el-radio>
              <el-radio v-model="formConfig.liteos" label="0" disabled>{{$t("iot_plat_non_support")}}</el-radio>
            </el-form-item>
            <el-form-item :label="$t('iot_plat_human_body_infrared')" class="form-row" prop="human_body_infrared">
              <el-radio v-model="formConfig.human_body_infrared" label="1" disabled>{{$t("iot_plat_support")}}</el-radio>
              <el-radio v-model="formConfig.human_body_infrared" label="0" disabled>{{$t("iot_plat_non_support")}}</el-radio>
            </el-form-item>
            <el-form-item :label="$t('iot_plat_progress_bar')" class="form-row" prop="progress_bar">
              <el-radio v-model="formConfig.progress_bar" label="1" disabled>{{$t("iot_plat_support")}}</el-radio>
              <el-radio v-model="formConfig.progress_bar" label="0" disabled>{{$t("iot_plat_non_support")}}</el-radio>
            </el-form-item>
            <el-form-item :label="$t('iot_plat_sos')" class="form-row" prop="sos">
              <el-radio v-model="formConfig.sos" label="1" disabled>{{$t("iot_plat_support")}}</el-radio>
              <el-radio v-model="formConfig.sos" label="0" disabled>{{$t("iot_plat_non_support")}}</el-radio>
            </el-form-item>
          </template>

          <template v-if="isNVRX">
            <el-col :span="24" class="device-model-editdialog-title">NVRX（NVRX）</el-col>
            <el-form-item :label="$t('iot_plat_device_category')" class="form-row" prop="class">
              <el-select v-model="formConfig.class" :placeholder="$t('iot_plat_select_please')" disabled>
                <el-option
                  v-for="item in nvrxClass"
                  :key="item.value"
                  :label="$t(item.label)"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('iot_plat_decode_way')" class="form-row" prop="dec">
              <el-select v-model="formConfig.dec" :placeholder="$t('iot_plat_select_please')" disabled>
                <el-option
                  v-for="item in dec_options"
                  :key="item.value"
                  :label="$t(item.label)"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('iot_plat_device_channel_number')" class="form-row" prop="chans">
              <el-input v-model="formConfig.chans" disabled></el-input>
            </el-form-item>
            <el-form-item :label="$t('iot_plat_horn')" class="form-row" prop="speaker">
              <el-radio v-model="formConfig.speaker" label="1" disabled>{{$t("iot_plat_support")}}</el-radio>
              <el-radio v-model="formConfig.speaker" label="0" disabled>{{$t("iot_plat_non_support")}}</el-radio>
            </el-form-item>
            <el-form-item :label="$t('iot_plat_cloud_storage')" class="form-row" prop="cloud_storage">
              <el-radio v-model="formConfig.cloud_storage" label="1" disabled>{{$t("iot_plat_support")}}</el-radio>
              <el-radio v-model="formConfig.cloud_storage" label="0" disabled>{{$t("iot_plat_non_support")}}</el-radio>
            </el-form-item>
            <el-form-item :label="$t('iot_plat_indicator_light')" class="form-row" prop="status_light">
              <el-radio v-model="formConfig.status_light" label="1" disabled>{{$t("iot_plat_have")}}</el-radio>
              <el-radio v-model="formConfig.status_light" label="0" disabled>{{$t("iot_plat_have_not")}}</el-radio>
            </el-form-item>
            <el-form-item :label="$t('iot_plat_humanoid_detection')" class="form-row" prop="human_detect">
              <el-radio v-model="formConfig.human_detect" label="1" disabled>{{$t("iot_plat_support")}}</el-radio>
              <el-radio v-model="formConfig.human_detect" label="0" disabled>{{$t("iot_plat_non_support")}}</el-radio>
            </el-form-item>
            <el-form-item :label="$t('iot_plat_humanoid_tracking')" class="form-row" prop="human_track">
              <el-radio v-model="formConfig.human_track" label="1" disabled>{{$t("iot_plat_support")}}</el-radio>
              <el-radio v-model="formConfig.human_track" label="0" disabled>{{$t("iot_plat_non_support")}}</el-radio>
            </el-form-item>
            <el-form-item :label="$t('iot_plat_osd')" class="form-row" prop="osd">
              <el-radio v-model="formConfig.osd" label="1" disabled>{{$t("iot_plat_support")}}</el-radio>
              <el-radio v-model="formConfig.osd" label="0" disabled>{{$t("iot_plat_non_support")}}</el-radio>
            </el-form-item>
            <el-form-item :label="$t('iot_plat_move_detection')" class="form-row" prop="motion_detect">
              <el-radio v-model="formConfig.motion_detect" label="1" disabled>{{$t("iot_plat_support")}}</el-radio>
              <el-radio v-model="formConfig.motion_detect" label="0" disabled>{{$t("iot_plat_non_support")}}</el-radio>
            </el-form-item>
            <el-form-item :label="$t('iot_plat_area_detection')" class="form-row" prop="area_detect" v-if="formConfig.motion_detect === '1'">
              <el-radio v-model="formConfig.area_detect" label="1" disabled>{{$t("iot_plat_support")}}</el-radio>
              <el-radio v-model="formConfig.area_detect" label="0" disabled>{{$t("iot_plat_non_support")}}</el-radio>
            </el-form-item>
            <el-form-item :label="$t('iot_plat_sound_detection')" class="form-row" prop="voice_detect">
              <el-radio v-model="formConfig.voice_detect" label="1" disabled>{{$t("iot_plat_support")}}</el-radio>
              <el-radio v-model="formConfig.voice_detect" label="0" disabled>{{$t("iot_plat_non_support")}}</el-radio>
            </el-form-item>
            <el-form-item :label="$t('iot_plat_cry_detection')" class="form-row" prop="cry_detect">
              <el-radio v-model="formConfig.cry_detect" label="1" disabled>{{$t("iot_plat_support")}}</el-radio>
              <el-radio v-model="formConfig.cry_detect" label="0" disabled>{{$t("iot_plat_non_support")}}</el-radio>
            </el-form-item>
          </template>

          <template v-if="isBHCC">
            <el-col :span="24" class="device-model-editdialog-title">{{$t("iot_plat_scene_button")}}（BHSC）</el-col>
            <el-form-item :label="$t('iot_plat_button_number')" class="form-row" prop="num">
              <el-input v-model="formConfig.num" disabled></el-input>
            </el-form-item>
          </template>
          <template v-if="isCMSW">
            <el-col :span="24" class="device-model-editdialog-title">{{$t("iot_plat_combination_switch")}}（CMSW）</el-col>
            <el-form-item :label="$t('iot_plat_switch_number')" class="form-row" prop="num2">
              <el-input v-model="formConfig.num2" disabled></el-input>
            </el-form-item>
          </template>

          <template v-if="isSSYX">
            <el-col :span="24" class="device-model-editdialog-title">{{$t("iot_plat_smart_speaker")}}（SSYX）</el-col>
            <el-form-item :label="$t('iot_plat_chat')" class="form-row" prop="chat">
              <el-radio v-model="formConfig.chat" label="1" disabled>{{$t("iot_plat_support")}}</el-radio>
              <el-radio v-model="formConfig.chat" label="0" disabled>{{$t("iot_plat_non_support")}}</el-radio>
            </el-form-item>
          </template>
          <template v-if="isSYME">
            <el-col :span="24" class="device-model-editdialog-title">{{$t("iot_plat_story_machine")}}（SYME）</el-col>
            <el-form-item :label="$t('iot_plat_chat')" class="form-row" prop="chat">
              <el-radio v-model="formConfig.chat" label="1" disabled>{{$t("iot_plat_support")}}</el-radio>
              <el-radio v-model="formConfig.chat" label="0" disabled>{{$t("iot_plat_non_support")}}</el-radio>
            </el-form-item>
          </template>

          <template v-if="isVZDB">
            <el-col :span="24" class="device-model-editdialog-title">{{$t("iot_plat_smart_access_control")}}（VZDB）</el-col>
            <el-form-item :label="$t('iot_plat_decode_way')" class="form-row" prop="dec">
              <el-select v-model="formConfig.dec" :placeholder="$t('iot_plat_select_please')" disabled>
                <el-option
                  v-for="item in dec_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('iot_plat_audio_mode')" class="form-row" prop="audio" v-if="formConfig.mic === '1' && formConfig.speaker === '1'">
              <el-select v-model="formConfig.audio" :placeholder="$t('iot_plat_select_please')" disabled>
                <el-option
                  v-for="item in audio_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('iot_plat_microphone')" class="form-row" prop="mic">
              <el-radio v-model="formConfig.mic" label="1" disabled>{{$t("iot_plat_support")}}</el-radio>
              <el-radio v-model="formConfig.mic" label="0" disabled>{{$t("iot_plat_non_support")}}</el-radio>
            </el-form-item>
            <el-form-item :label="$t('iot_plat_horn')" class="form-row" prop="speaker">
              <el-radio v-model="formConfig.speaker" label="1" disabled>{{$t("iot_plat_support")}}</el-radio>
              <el-radio v-model="formConfig.speaker" label="0" disabled>{{$t("iot_plat_non_support")}}</el-radio>
            </el-form-item>
            <el-form-item :label="$t('iot_plat_storage_card')" class="form-row" prop="sdcard">
              <el-radio v-model="formConfig.sdcard" label="1" disabled>{{$t("iot_plat_support")}}</el-radio>
              <el-radio v-model="formConfig.sdcard" label="0" disabled>{{$t("iot_plat_non_support")}}</el-radio>
            </el-form-item>
            <el-form-item :label="$t('iot_plat_cloud_storage')" class="form-row" prop="cloud_storage">
              <el-radio v-model="formConfig.cloud_storage" label="1" disabled>{{$t("iot_plat_support")}}</el-radio>
              <el-radio v-model="formConfig.cloud_storage" label="0" disabled>{{$t("iot_plat_non_support")}}</el-radio>
            </el-form-item>
            <el-form-item :label="$t('iot_plat_indicator_light')" class="form-row" prop="status_light">
              <el-radio v-model="formConfig.status_light" label="1" disabled>{{$t("iot_plat_have")}}</el-radio>
              <el-radio v-model="formConfig.status_light" label="0" disabled>{{$t("iot_plat_have_not")}}</el-radio>
            </el-form-item>
            <el-form-item :label="$t('iot_plat_sound_detection')" class="form-row" prop="voice_detect">
              <el-radio v-model="formConfig.voice_detect" label="1" disabled>{{$t("iot_plat_support")}}</el-radio>
              <el-radio v-model="formConfig.voice_detect" label="0" disabled>{{$t("iot_plat_non_support")}}</el-radio>
            </el-form-item>
            <el-form-item :label="$t('iot_plat_human_body_induction ')" class="form-row" prop="body_induction">
              <el-radio v-model="formConfig.body_induction" label="1" disabled>{{$t("iot_plat_support")}}</el-radio>
              <el-radio v-model="formConfig.body_induction" label="0" disabled>{{$t("iot_plat_non_support")}}</el-radio>
            </el-form-item>
            <el-form-item :label="$t('iot_plat_low_power_consumption')" class="form-row" prop="liteos">
              <el-radio v-model="formConfig.liteos" label="1" disabled>{{$t("iot_plat_support")}}</el-radio>
              <el-radio v-model="formConfig.liteos" label="0" disabled>{{$t("iot_plat_non_support")}}</el-radio>
            </el-form-item>
          </template>
        </el-form>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { deviceCategory, decodeFormat, pipcDvDecode, audioMode } from "@/lib/mixins.js"
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
    data: {
      type    : Object,
      required: true
    }
  },
  data () {
    return {
      configItem: [ "mic", "speaker", "sdcard", "yun", "cloud_storage", "ptzctrl", "status_light", "human_detect", "human_track", "osd", "voice_detect", "body_induction", "cry_detect", "motion_detect", "area_detect", "liteos", "chat", "human_body_infrared", "progress_bar", "sos" ],
      isIPCC    : false,
      isBHCC    : false,
      isCMSW    : false,
      isVZDB    : false,
      isSYME    : false,
      isSSYX    : false,
      isNVRX    : false,
      formConfig: {
        "class"            : "",
        dec                : "",
        chans              : "",
        pipc_dv            : "",
        audio              : "",
        num                : "",
        num2               : "",
        mic                : "1",
        speaker            : "1",
        sdcard             : "1",
        cloud_storage      : "1",
        ptzctrl            : "1",
        status_light       : "1",
        human_detect       : "1",
        human_track        : "1",
        osd                : "1",
        voice_detect       : "1",
        body_induction     : "1",
        cry_detect         : "1",
        motion_detect      : "1",
        area_detect        : "1",
        liteos             : "1",
        chat               : "1",
        human_body_infrared: "0",
        progress_bar       : "0",
        sos                : "0"
      }
    }
  },
  computed: {
    nvrxClass () {
      return this.class_options.filter(item => item.value === Number("2") || item.value === Number("3"))
    },
    ipccClass () {
      return this.class_options.filter(item => item.value === Number("1") || item.value === Number("4"))
    }
  },
  watch: {
    data () {
      this.isIPCC = this.data.prodt_code.includes("IPCC");
      this.isBHCC = this.data.prodt_code.includes("BHSC");
      this.isCMSW = this.data.prodt_code.includes("CMSW");
      this.isVZDB = this.data.prodt_code.includes("VZDB");
      this.isSYME = this.data.prodt_code.includes("SYME");
      this.isSSYX = this.data.prodt_code.includes("SSYX");
      this.isNVRX = this.data.prodt_code.includes("NVRX");
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
        // 云储存 字段有 yun 改为 cloud_storage，此处代码为兼容以前的 yun 字段
        this.formConfig.cloud_storage = this.formConfig.yun
      }
    }
  },

  methods: {
    handleClose() {
      this.$emit("close");
    }
  }
}
</script>
