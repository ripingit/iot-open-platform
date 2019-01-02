<template>
  <transition name="bounce" mode="out-in">
    <div class="device-model">
      <el-row>
        <el-col :span="24">
          <p class="title-cn">设备型号</p>
          <p class="title-en">UNIT TYPE</p>
        </el-col>
      </el-row>
      <el-row class="table">
        <el-row>
          <el-col :span="5">
            <!--<el-input-->
            <!--placeholder="点击此处搜索"-->
            <!--v-model="query_by_name">-->
            <!--<i slot="prefix" class="el-input__icon el-icon-search" @click="SearchData()"></i>-->
            <!--</el-input>-->
            <el-button
              v-if="vmHasAuth(CoopPermissionsLib.ADD_DEVICE_MODEL, res)"
              icon="el-icon-plus"
              type="primary"
              circle
              class="btn-circle-delete"
              @click="addDevice()"
            ></el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-table v-loading="loading" :data="tableData" style="width: 100%;">
            <el-table-column type="index" width="100" label="编号"></el-table-column>
            <el-table-column prop="product_name" label="型号名称"></el-table-column>
            <el-table-column prop="product_code" label="型号代码"></el-table-column>
            <el-table-column prop="prodt_code2" label="设备类别" width="200"></el-table-column>
            <el-table-column prop="nbi_code" label="连接方式"></el-table-column>
            <el-table-column prop="pic1_fileid" label="图1">
              <template slot-scope="scope">
                <div>
                  <ScaleImgComponent
                    :path="scope.row.pic1_fileid"
                    style="width:6rem;height:4.5rem"
                    alt="图2"
                  ></ScaleImgComponent>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="pic2_fileid" label="图2">
              <template slot-scope="scope">
                <div>
                  <ScaleImgComponent
                    :path="scope.row.pic2_fileid"
                    style="width:6rem;height:4.5rem"
                    alt="图2"
                  ></ScaleImgComponent>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="is_review" label="审核状态">
              <template slot-scope="scope">
                <span v-if="scope.row.is_review===0">待审核</span>
                <span v-if="scope.row.is_review===1" style="color: #2acba7">已通过</span>
                <span v-if="scope.row.is_review===2" style="color: #ff5d66">已驳回</span>
              </template>
            </el-table-column>
            <el-table-column prop="config_status" label="配置状态">
              <template slot-scope="scope">
                <span v-if="scope.row.config_status" style="color: #2acba7">已配置</span>
                <span v-if="!scope.row.config_status" style="color: #ff5d66">未配置</span>
              </template>
            </el-table-column>
            <el-table-column
              prop
              label="操作"
              v-if="vmHasAuth(CoopPermissionsLib.SET_DEVICE_MODEL, res) || vmHasAuth(CoopPermissionsLib.DEL_DEVICE_MODEL, res)"
              width="180"
            >
              <template slot-scope="scope">
                <el-button
                  class="btn-circle"
                  icon="iconfont icon-bianji"
                  size="mini"
                  circle
                  v-if="vmHasAuth(CoopPermissionsLib.SET_DEVICE_MODEL, res)"
                  @click="editDevice(scope.row)"
                ></el-button>
                <el-button
                  class="btn-circle"
                  icon="iconfont icon-shanchu"
                  circle
                  size="mini"
                  v-if="vmHasAuth(CoopPermissionsLib.DEL_DEVICE_MODEL, res)"
                  @click="Delete(scope.row)"
                ></el-button>
                <el-button
                  class="btn-circle"
                  icon="iconfont icon-xiangxia4"
                  circle
                  size="mini"
                  v-if="vmHasAuth(CoopPermissionsLib.GENERATE_DEVICE_ID, res)"
                  @click="generateDeviceID(scope.row)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <el-row v-if="total>page" type="flex" justify="center">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="page"
            layout="prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </el-row>
      </el-row>
      <el-dialog
        :title="dialogTitle"
        :visible.sync="dialogVisible"
        center
        :before-close="handleClose"
      >
        <el-form label-width="100px" status-icon :model="formAdd" ref="AddForm" :rules="rules">
          <el-form-item label="型号名称" class="form-row" prop="product_name">
            <el-input v-model="formAdd.product_name"></el-input>
            <span class="form-tip">*</span>
          </el-form-item>
          <el-form-item label="型号代码" class="form-row" prop="product_code">
            <el-input v-model="formAdd.product_code" maxlength="6"></el-input>
            <span class="form-tip">*</span>
          </el-form-item>
          <el-form-item label="连接方式" class="form-row" prop="nbi_code">
            <el-select v-model="formAdd.nbi_code" multiple placeholder="请选择连接方式">
              <el-option
                v-for="item in nbi_code_options"
                :key="item.nbi_code"
                :label="item.nbi_code_name"
                :value="item.nbi_code"
              ></el-option>
            </el-select>
            <span class="form-tip">*</span>
          </el-form-item>
          <el-form-item label="设备类别" class="form-row" prop="prodt_code">
            <el-select v-model="formAdd.prodt_code" multiple placeholder="请选择设备类别">
              <el-option
                v-for="item in prodt_code_options"
                :key="item.prodt_code"
                :label="item.prodt_name"
                :value="item.prodt_code"
              ></el-option>
            </el-select>
            <span class="form-tip">*</span>
          </el-form-item>
          <el-form-item label="在线图片" class="form-row" prop="pic1">
            <el-col :span="24" style="line-height:1.2">
              <span class="device-model-uploadImg" v-if="isUploading">{{uploadProgress}}</span>
              <div
                v-else
                class="device-model-uploadImg"
                style="position: relative;display: inline-block"
              >
                <img class="device-model-uploadImg" :src="picPath">
                <i class="el-icon-zoom-in showBig" @click="dialogVisibleImg=true"></i>
              </div>
              <div style="display: inline-block;">
                <el-upload
                  :action="uploadPath"
                  :data="{pic:1}"
                  name="photo"
                  accept=".jpg, .jpeg, .png"
                  :before-upload="onBeforeUpload"
                  :on-success="onUploadSuccess"
                  :on-progress="onUploadProgress"
                  :on-error="onUploadError"
                  :show-file-list="false"
                >
                  <el-button class="btn-upload" size="small" type="primary">上传</el-button>
                </el-upload>
              </div>
              <el-dialog :modal="false" :visible.sync="dialogVisibleImg">
                <img width="100%" :src="picPath">
              </el-dialog>
              <div class="device-model-div">
                <p>底色：白色</p>
                <p>尺寸：608*470</p>
                <p>图片大小不超过2M</p>
              </div>
            </el-col>
          </el-form-item>
          <el-form-item label="离线图片" class="form-row" prop="pic2">
            <el-col :span="24" style="line-height:1.2">
              <span class="device-model-uploadImg" v-if="isUploading2">{{uploadProgress2}}</span>
              <div
                v-if="!isUploading2"
                class="device-model-uploadImg"
                style="position: relative;display: inline-block"
              >
                <img class="device-model-uploadImg" :src="picPath2">
                <i class="el-icon-zoom-in showBig" @click="dialogVisibleImg2=true"></i>
              </div>
              <div style="display: inline-block;">
                <el-upload
                  :action="uploadPath"
                  :data="{pic:2}"
                  name="photo"
                  accept=".jpg, .jpeg, .png"
                  :before-upload="onBeforeUpload2"
                  :on-success="onUploadSuccess2"
                  :on-progress="onUploadProgress2"
                  :on-error="onUploadError2"
                  :show-file-list="false"
                >
                  <el-button class="btn-upload" size="small" type="primary">上传</el-button>
                </el-upload>
              </div>
              <el-dialog :modal="false" :visible.sync="dialogVisibleImg2">
                <img width="100%" :src="picPath2">
              </el-dialog>
              <div class="device-model-div">
                <p>底色：白色</p>
                <p>尺寸：608*470</p>
                <p>图片大小不超过2M</p>
              </div>
            </el-col>
          </el-form-item>
          <el-form-item style="margin-top: 4.33rem;">
            <el-button type="primary" class="btn-submit" @click="EnsureSubmit()">提 交</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog
        title="型号配置"
        :visible.sync="editDialog"
        center
        style="margin-top: -6vh;"
        :before-close="handleClose"
      >
        <el-row class="device-model-editdialog">
          <el-col :span="24" style="padding:0 0 1rem 2.5rem;">
            <div>型号名称：{{dialogData.product_name}}</div>
            <div>连接方式：{{dialogData.nbi_code}}</div>
          </el-col>
          <el-col :span="24">
            <el-form
              label-width="100px"
              :model="formConfig"
              status-icon
              ref="ConfigForm"
              :rules="rules"
            >
              <div v-if="IPCC">
                <el-col :span="24" class="device-model-editdialog-title">IPC分类（IPCC）</el-col>
                <el-form-item label="设备分类" class="form-row" prop="class0">
                  <el-select v-model="formConfig.class0" placeholder="请选择">
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
              <div v-if="BHSC">
                <el-col :span="24" class="device-model-editdialog-title">情景按钮（BHSC）</el-col>
                <el-form-item label="按钮数量" class="form-row" prop="num">
                  <el-input v-model="formConfig.num"></el-input>
                </el-form-item>
              </div>
              <div v-if="CMSW">
                <el-col :span="24" class="device-model-editdialog-title">组合开关（CMSW）</el-col>
                <el-form-item label="开关数量" class="form-row" prop="num2">
                  <el-input v-model="formConfig.num2"></el-input>
                </el-form-item>
              </div>
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
                <el-form-item label="移动侦测" class="form-row" prop="motion_detect">
                  <el-radio v-model="formConfig.motion_detect" label="1">支持</el-radio>
                  <el-radio v-model="formConfig.motion_detect" label="0">不支持</el-radio>
                </el-form-item>
                <el-form-item label="低功耗" class="form-row" prop="liteos">
                  <el-radio v-model="formConfig.liteos" label="1">支持</el-radio>
                  <el-radio v-model="formConfig.liteos" label="0">不支持</el-radio>
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
                  @click="ConfigSubmit()"
                >提 交</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </transition>
</template>
<script>
import "@/assets/css/content.css";
import ScaleImgComponent from "@/components/_ui/scale-img.vue";
import { validateProductCode } from "../../../lib/validate.js";
import {
  USER_EQUIPMENT_MODEL_QUERY,
  USER_EQUIPMENT_MODEL_UPLOADIMG,
  USER_EQUIPMENT_MODEL_ADD,
  USER_EQUIPMENT_MODEL_DEL,
  USER_EQUIPMENT_MODEL_CONFIG,
  COOP_GENERATE_DEVICE_ID_POST
} from "../../../lib/api.js";
import _ from "lodash";
export default {
  components: { ScaleImgComponent },
  data() {
    let validateIsEmpty = (rule, value, callback) => {
      if (value === "") {
        if (rule.field === "product_name") {
          callback(new Error("请输入型号名称"));
        } else if (rule.field === "product_code") {
          callback(new Error("请输入型号代码"));
        } else if (rule.field === "nbi_code") {
          callback(new Error("请选择连接方式"));
        } else if (rule.field === "prodt_code") {
          callback(new Error("请选择设备类别"));
        } else if (rule.field === "pic1") {
          callback(new Error("请上传图1"));
        } else if (rule.field === "pic2") {
          callback(new Error("请上传图2"));
        } else if (rule.field === "class0") {
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
      } else {
        if (rule.field === "product_code") {
          if (!validateProductCode(value)) {
            callback(new Error("最大长度不超过6位字符，且只能包含字母和数字"));
          }
        }
      }
      callback();
    };
    return {
      rules: {
        product_name: [{ validator: validateIsEmpty, trigger: "blur" }],
        product_code: [{ validator: validateIsEmpty, trigger: "change" }],
        nbi_code: [{ validator: validateIsEmpty, trigger: "change" }],
        prodt_code: [{ validator: validateIsEmpty, trigger: "change" }],
        pic1: [{ validator: validateIsEmpty, trigger: "blur" }],
        pic2: [{ validator: validateIsEmpty, trigger: "blur" }],
        class0: [{ validator: validateIsEmpty, trigger: "change" }],
        dec: [{ validator: validateIsEmpty, trigger: "change" }],
        chans: [{ validator: validateIsEmpty, trigger: "blur" }],
        pipc_dv: [{ validator: validateIsEmpty, trigger: "change" }],
        audio: [{ validator: validateIsEmpty, trigger: "change" }],
        num: [{ validator: validateIsEmpty, trigger: "blur" }],
        num2: [{ validator: validateIsEmpty, trigger: "blur" }]
      },
      loading: false,
      uploadPath: USER_EQUIPMENT_MODEL_UPLOADIMG,
      picPath: "",
      dialogVisibleImg: false,
      isUploading: true,
      uploadProgress: "",
      picPath2: "",
      dialogVisibleImg2: false,
      isUploading2: true,
      uploadProgress2: "",
      dialogVisible: false,
      editDialog: false,
      IPCC: false,
      BHSC: false,
      CMSW: false,
      VZDB: false,
      query_by_name: "",
      dialogTitle: "",
      formAdd: {
        product_name: "",
        product_code: "",
        nbi_code: [],
        prodt_code: [],
        pic1: "",
        pic2: ""
      },
      formConfig: {
        class0: "",
        dec: "",
        chans: "",
        pipc_dv: "",
        audio: "",
        num: "",
        num2: "",
        mic: "1",
        speaker: "1",
        sdcard: "1",
        yun: "1",
        ptzctrl: "1",
        status_light: "1",
        human_detect: "1",
        human_track: "1",
        osd: "1",
        voice_detect: "1",
        cry_detect: "1",
        motion_detect: "1",
        area_detect: "1",
        liteos: "1"
      },
      nbi_code_options: [],
      prodt_code_options: [],
      class_options: [
        {
          value: 1,
          label: "IPC"
        },
        {
          value: 2,
          label: "NVR"
        },
        {
          value: 3,
          label: "DVR"
        },
        {
          value: 4,
          label: "PIPC"
        }
      ],
      dec_options: [
        {
          value: 0,
          label: "多通道"
        },
        {
          value: 1,
          label: "多路合成"
        }
      ],
      pipc_dv_options: [
        {
          value: 1,
          label: "中科龙智"
        }
      ],
      audio_options: [
        {
          value: 1,
          label: "半双工"
        },
        {
          value: 2,
          label: "全双工"
        }
      ],
      tableData: [],
      dialogData: [],
      currentPage: 1,
      total: 0,
      page: 20,
      res: []
    };
  },
  created() {
    this.onSubmit();
    document.body.addEventListener("keydown", this.keyCodeDown, false);
  },
  beforeDestroy() {
    document.body.removeEventListener("keydown", this.keyCodeDown, false);
  },
  methods: {
    keyCodeDown(e) {
      if (e.keyCode === 13) {
        if (this.dialogVisible) {
          this.EnsureSubmit();
        } else if (this.editDialog) {
          this.ConfigSubmit();
        }
      }
    },
    onSubmit: _.debounce(function() {
      this.loading = true;
      let param = this.createFormData({
        page: parseInt(this.currentPage),
        page_size: parseInt(this.page),
        query_by_name: this.query_by_name
      });
      this.$http
        .post(USER_EQUIPMENT_MODEL_QUERY, param)
        .then(res => {
          this.loading = false;
          if (this.vmResponseHandler(res)) {
            let prodtObj = {};
            res.data.prodtList.forEach(val => {
              this.prodt_code_options = val;
              val.forEach(subval => {
                prodtObj[subval.prodt_code] = subval.prodt_name;
              });
            });
            let codeObj = {};
            res.data.Nbi.forEach(val => {
              this.nbi_code_options = val;
              val.forEach(subval => {
                codeObj[subval.nbi_code] = subval.nbi_code_name;
              });
            });
            this.tableData = res.data.data.map(val => {
              if (Array.isArray(val.nbi_code)) {
                val.nbi_code = val.nbi_code
                  .map(subval => codeObj[subval])
                  .join("、");
              }
              if (Array.isArray(val.prodt_code)) {
                val.prodt_code2 = val.prodt_code
                  .map(subval => prodtObj[subval])
                  .join("、");
              }
              return val;
            });
            this.total = res.data.total;
            this.res = res.data.res;
          }
        })
        .catch(() => {
          this.loading = false;
          this.vmMsgError("网络错误！");
        });
    }, 300),
    addDevice() {
      this.dialogTitle = "添加型号";
      this.dialogVisible = true;
    },
    EnsureSubmit: _.debounce(function() {
      this.$refs["AddForm"].validate(valid => {
        if (valid) {
          let param = this.createFormData(this.formAdd);
          this.$http
            .post(USER_EQUIPMENT_MODEL_ADD, param)
            .then(res => {
              if (res.data.statu === 0) {
                this.$router.push("/signin");
                return false;
              }
              if (this.vmResponseHandler(res)) {
                this.vmMsgSuccess("操作成功！");
                this.dialogVisible = false;
                this.isUploading = true;
                this.uploadProgress = "";
                this.isUploading2 = true;
                this.uploadProgress2 = "";
                this.$refs["AddForm"].resetFields();
                this.onSubmit();
              }
            })
            .catch(() => {
              this.vmMsgError("网络错误！");
            });
        }
      });
    }, 300),
    editDevice(row) {
      if (row.is_review !== 1) {
        this.vmMsgWarning("只有通过审核才能进行型号配置！");
        return;
      }
      this.dialogData = row;
      this.IPCC = this.dialogData.prodt_code.indexOf("IPCC") > -1;
      this.BHSC = this.dialogData.prodt_code.indexOf("BHSC") > -1;
      this.CMSW = this.dialogData.prodt_code.indexOf("CMSW") > -1;
      this.VZDB = this.dialogData.prodt_code.indexOf("VZDB") > -1;
      this.editDialog = true;
      if (row.config_status) {
        this.formConfig = {};
        let rowData = JSON.parse(row.config_status);
        this.formConfig = {
          class0: rowData[0].conf.class,
          dec: rowData[0].conf.dec,
          chans: rowData[0].conf.chans,
          pipc_dv: rowData[0].conf.pipc_dv,
          audio: rowData[0].conf.audio,
          num: rowData[0].conf.num,
          num2: rowData[0].conf.num,
          mic:
            rowData[0].conf.mic === 0 || rowData[0].conf.mic === 1
              ? String(rowData[0].conf.mic)
              : "0",
          speaker:
            rowData[0].conf.speaker === 0 || rowData[0].conf.speaker === 1
              ? String(rowData[0].conf.speaker)
              : "0",
          sdcard:
            rowData[0].conf.sdcard === 0 || rowData[0].conf.sdcard === 1
              ? String(rowData[0].conf.sdcard)
              : "0",
          yun:
            rowData[0].conf.yun === 0 || rowData[0].conf.yun === 1
              ? String(rowData[0].conf.yun)
              : "0",
          ptzctrl:
            rowData[0].conf.ptzctrl === 0 ||
            rowData[0].conf.ptzctrl === 1 ||
            rowData[0].conf.ptzctrl === 2 ||
            rowData[0].conf.ptzctrl === 3
              ? String(rowData[0].conf.ptzctrl)
              : "0",
          status_light:
            rowData[0].conf.status_light === 0 ||
            rowData[0].conf.status_light === 1
              ? String(rowData[0].conf.status_light)
              : "0",
          human_detect:
            rowData[0].conf.human_detect === 0 ||
            rowData[0].conf.human_detect === 1
              ? String(rowData[0].conf.human_detect)
              : "0",
          human_track:
            rowData[0].conf.human_track === 0 ||
            rowData[0].conf.human_track === 1
              ? String(rowData[0].conf.human_track)
              : "0",
          osd:
            rowData[0].conf.osd === 0 || rowData[0].conf.osd === 1
              ? String(rowData[0].conf.osd)
              : "0",
          voice_detect:
            rowData[0].conf.voice_detect === 0 ||
            rowData[0].conf.voice_detect === 1
              ? String(rowData[0].conf.voice_detect)
              : "0",
          cry_detect:
            rowData[0].conf.cry_detect === 0 || rowData[0].conf.cry_detect === 1
              ? String(rowData[0].conf.cry_detect)
              : "0",
          motion_detect:
            rowData[0].conf.motion_detect === 0 ||
            rowData[0].conf.motion_detect === 1
              ? String(rowData[0].conf.motion_detect)
              : "0",
          area_detect:
            rowData[0].conf.area_detect === 0 ||
            rowData[0].conf.area_detect === 1
              ? String(rowData[0].conf.area_detect)
              : "0",
          liteos:
            rowData[0].conf.liteos === 0 || rowData[0].conf.liteos === 1
              ? String(rowData[0].conf.liteos)
              : "0"
        };
      }
    },
    ConfigSubmit: _.debounce(function() {
      this.$refs["ConfigForm"].validate(valid => {
        if (valid) {
          let param = null;
          if (this.IPCC) {
            param = this.createFormData({
              product_code: this.dialogData.product_code,
              config: JSON.stringify([
                {
                  prodt_code: "IPCC",
                  conf: {
                    class: parseInt(this.formConfig.class0),
                    chans: parseInt(this.formConfig.chans),
                    dec: parseInt(this.formConfig.dec),
                    pipc_dv: parseInt(this.formConfig.pipc_dv),
                    audio: parseInt(this.formConfig.audio),
                    mic: parseInt(this.formConfig.mic),
                    speaker: parseInt(this.formConfig.speaker),
                    sdcard: parseInt(this.formConfig.sdcard),
                    yun: parseInt(this.formConfig.yun),
                    ptzctrl: parseInt(this.formConfig.ptzctrl),
                    status_light: parseInt(this.formConfig.status_light),
                    human_detect: parseInt(this.formConfig.human_detect),
                    human_track: parseInt(this.formConfig.human_track),
                    osd: parseInt(this.formConfig.osd),
                    voice_detect: parseInt(this.formConfig.voice_detect),
                    cry_detect: parseInt(this.formConfig.cry_detect),
                    motion_detect: parseInt(this.formConfig.motion_detect),
                    area_detect: parseInt(this.formConfig.area_detect),
                    liteos: parseInt(this.formConfig.liteos)
                  }
                }
              ])
            });
          }
          if (this.BHSC) {
            param = this.createFormData({
              product_code: this.dialogData.product_code,
              config: JSON.stringify([
                {
                  prodt_code: "BHSC",
                  conf: {
                    num: parseInt(this.formConfig.num)
                  }
                }
              ])
            });
          }
          if (this.CMSW) {
            param = this.createFormData({
              product_code: this.dialogData.product_code,
              config: JSON.stringify([
                {
                  prodt_code: "CMSW",
                  conf: {
                    num: parseInt(this.formConfig.num2)
                  }
                }
              ])
            });
          }
          if (this.VZDB) {
            param = this.createFormData({
              product_code: this.dialogData.product_code,
              config: JSON.stringify([
                {
                  prodt_code: "VZDB",
                  conf: {
                    dec: parseInt(this.formConfig.dec),
                    audio: parseInt(this.formConfig.audio),
                    mic: parseInt(this.formConfig.mic),
                    speaker: parseInt(this.formConfig.speaker),
                    sdcard: parseInt(this.formConfig.sdcard),
                    yun: parseInt(this.formConfig.yun),
                    status_light: parseInt(this.formConfig.status_light),
                    voice_detect: parseInt(this.formConfig.voice_detect),
                    motion_detect: parseInt(this.formConfig.motion_detect),
                    liteos: parseInt(this.formConfig.liteos)
                  }
                }
              ])
            });
          }
          this.$http
            .post(USER_EQUIPMENT_MODEL_CONFIG, param)
            .then(res => {
              if (res.data.statu === 0) {
                this.$router.push("/signin");
                return false;
              }
              if (this.vmResponseHandler(res)) {
                this.vmMsgSuccess("操作成功！");
                this.editDialog = false;
                this.$refs["ConfigForm"].resetFields();
                this.onSubmit();
              }
            })
            .catch(() => {
              this.vmMsgError("网络错误！");
            });
        }
      });
    }, 300),
    SearchData() {
      this.onSubmit();
    },
    Delete(row) {
      let codeArr = [];
      codeArr.push(row.product_code);
      let param = this.createFormData({
        product_code: JSON.stringify(codeArr)
      });
      this.vmConfirm({
        msg: "确定删除该记录？",
        confirmCallback: () => {
          let loading = this.vmLoadingFull();
          this.$http
            .post(USER_EQUIPMENT_MODEL_DEL, param)
            .then(res => {
              if (res.data.statu === 0) {
                this.$router.push("/signin");
                return false;
              }
              loading.close();
              if (this.vmResponseHandler(res)) {
                this.vmMsgSuccess("删除成功！");
                this.onSubmit();
              }
            })
            .catch(() => {
              loading.close();
              this.vmMsgError("网络错误！");
            });
        }
      });
    },

    generateDeviceID: _.debounce(function(row) {
      if (row.is_review !== 1) {
        this.vmMsgWarning("只有通过审核才能生成设备ID！");
        return;
      }
      let loading = this.vmLoadingFull();
      let data = this.createFormData({ product_code: row.product_code });
      this.$http.post(COOP_GENERATE_DEVICE_ID_POST, data).then(res => {
        loading.close();
        if (this.vmResponseHandler(res)) {
          let a = document.createElement("a");
          a.href = res.data.url;
          a.click();
        }
      });
    }, 300),

    handleCurrentChange(val) {
      this.currentPage = val;
      this.onSubmit(val);
    },
    handleClose(done) {
      done();
    },
    onBeforeUpload(file) {
      let sizeM = file.size / 1024 / 1024;
      let imgArr = ["image/png", "image/jpeg", "image/jpg"];
      if (!imgArr.includes(file.type) || sizeM > 2) {
        this.vmMsgError("请上传后缀为.jpg或.png或.jpeg且小于2M的图片");
        return false;
      }
    },
    onUploadSuccess(response, file, fileList) {
      this.uploadProgress = "";
      // 上传
      if (response.statu === 0) {
        this.$router.push("/signin");
        return;
      }
      if (!response.status) {
        this.vmMsgError(response.msg);
        return;
      }
      this.isUploading = false;
      this.picPath = file.url;
      this.formAdd.pic1 = file.url;
    },
    onUploadProgress(event, file, fileList) {
      this.isUploading = true;
      this.uploadProgress = "已上传" + event.percent + "%";
    },
    onUploadError(err, file, fileList) {
      this.vmMsgError(err);
    },
    onBeforeUpload2(file) {
      let sizeM = file.size / 1024 / 1024;
      let imgArr = ["image/png", "image/jpeg", "image/jpg"];
      if (!imgArr.includes(file.type) || sizeM > 2) {
        this.vmMsgError("请上传后缀为.jpg或.png或.jpeg且小于2M的图片");
        return false;
      }
    },
    onUploadSuccess2(response, file, fileList) {
      this.uploadProgress2 = "";
      // 上传
      if (response.statu === 0) {
        this.$router.push("/signin");
        return;
      }
      if (!response.status) {
        this.vmMsgError(response.msg);
        return;
      }
      this.isUploading2 = false;
      this.picPath2 = file.url;
      this.formAdd.pic2 = file.url;
    },
    onUploadProgress2(event, file, fileList) {
      this.isUploading2 = true;
      this.uploadProgress2 = "已上传" + event.percent + "%";
    },
    onUploadError2(err, file, fileList) {
      this.vmMsgError(err);
    }
  }
};
</script>
<style scoped>
.device-model {
  padding: 1.67rem 2.5rem;
  color: #fff;
}
.device-model-div {
  display: inline-block;
  color: #cecece;
  margin-left: 0.5rem;
  text-align: left;
  vertical-align: bottom;
}
.device-model-editdialog {
  color: #b3b3b3;
  font-size: 14px;
}
.device-model-editdialog-title {
  border-top: 1px solid #808080;
  padding: 1rem 0;
  margin: 1rem 0;
}
.device-model-uploadImg {
  display: inline-block;
  width: 8rem;
  height: 6rem;
  background: #636363;
  border-color: #636363;
  vertical-align: middle;
}
.device-model-uploadImg:hover > .showBig {
  display: block;
  transition: opacity 0.3s;
}
.showBig {
  position: absolute;
  top: 0;
  display: none;
  text-align: center;
  width: 8rem;
  height: 6rem;
  z-index: 999;
  font-size: 1.6rem;
  line-height: 6rem;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.5);
}
.el-dialog .btn-upload {
  height: 6rem;
  width: 3rem;
  border-radius: 0;
  padding: 0;
  font-size: 1.2rem;
  background: #1f7ecf;
  border: none;
  margin-left: 0.4rem;
}
</style>
<style>
.device-model .el-dialog {
  width: 54.17rem;
}
</style>
