<template>
  <div class="device-model-admin">
    <el-row>
      <el-col :span="24">
        <p class="title-cn">设备型号</p>
        <p class="title-en">UNIT TYPE</p>
      </el-col>
    </el-row>
    <el-row class="table">
      <el-row>
        <el-col :span="24">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label>
              <el-date-picker
                class="time"
                v-model="formInline.ChoiceTime"
                type="daterange"
                value-format="yyyy-MM-dd"
                :editable="false"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label>
              <el-input v-model="formInline.query_by_name"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-form>
          <el-button
            icon="el-icon-delete"
            type="danger"
            circle
            class="btn-circle-delete btn-circle-right"
            v-if="vmHasAuth(AdminPermissionsLib.DEL_DEVICE_MODEL, resData.res)"
            @click="Delete()"
          ></el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <TableComponent
            :options="tableOptions"
            :data="tableData"
            v-on:page-change="onSubmit"
            v-on:selection="handleSelectionChange"
          >
            <el-table-column prop label="操作" slot="handler">
              <template slot-scope="scope">
                <el-button
                  class="btn-circle"
                  icon="iconfont icon-setting"
                  size="mini"
                  circle
                  @click="editDevice(scope.row)"
                ></el-button>
                <el-button
                  class="btn-circle"
                  v-if="vmHasAuth(AdminPermissionsLib.UPDATE_DEVICE_MODEL, resData.res)"
                  icon="iconfont icon-bianji"
                  size="mini"
                  circle
                  @click="updateDevice(scope.row)"
                ></el-button>
              </template>
            </el-table-column>
            <template slot-scope="scope" slot="pic1_fileid">
              <ScaleImgComponent
                :path="scope.row.pic1_fileid"
                style="width:6rem;height:4.5rem"
                alt="图1"
              ></ScaleImgComponent>
            </template>
            <template slot-scope="scope" slot="pic2_fileid">
              <ScaleImgComponent
                :path="scope.row.pic2_fileid"
                style="width:6rem;height:4.5rem"
                alt="图2"
              ></ScaleImgComponent>
            </template>
          </TableComponent>
        </el-col>
      </el-row>
    </el-row>

    <el-dialog title="型号配置" :visible.sync="isConfigModalShow" center style="margin-top: -6vh;">
      <el-row class="device-model-editdialog">
        <el-col :span="24" style="padding:0 0 1rem 2.5rem;">
          <div>型号名称：{{dialogData.product_name}}</div>
          <div style="padding-top: 1rem">连接方式：{{dialogData.nbi_code}}</div>
        </el-col>
        <el-col :span="24">
          <el-form label-width="100px" :model="formConfig" status-icon ref="ConfigForm">
            <template v-if="isIPCC">
              <el-col :span="24" class="device-model-editdialog-title">IPC分类（IPCC）</el-col>
              <el-form-item label="设备分类" class="form-row" prop="class0">
                <el-select v-model="formConfig.class0" placeholder="请选择" disabled>
                  <el-option
                    v-for="item in class_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="解码方式" class="form-row" prop="dec">
                <el-select v-model="formConfig.dec" placeholder="请选择" disabled>
                  <el-option
                    v-for="item in dec_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="设备通道数" class="form-row" prop="chans">
                <el-input v-model="formConfig.chans" disabled></el-input>
              </el-form-item>
              <el-form-item label="校正解码" class="form-row" prop="pipc_dv">
                <el-select v-model="formConfig.pipc_dv" placeholder="请选择" disabled>
                  <el-option
                    v-for="item in pipc_dv_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="音频模式" class="form-row" prop="audio">
                <el-select v-model="formConfig.audio" placeholder="请选择" disabled>
                  <el-option
                    v-for="item in audio_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="麦克风" class="form-row" prop="mic">
                <el-radio v-model="formConfig.mic" label="1" disabled>支持</el-radio>
                <el-radio v-model="formConfig.mic" label="0" disabled>不支持</el-radio>
              </el-form-item>
              <el-form-item label="喇叭" class="form-row" prop="speaker">
                <el-radio v-model="formConfig.speaker" label="1" disabled>支持</el-radio>
                <el-radio v-model="formConfig.speaker" label="0" disabled>不支持</el-radio>
              </el-form-item>
              <el-form-item label="存储卡" class="form-row" prop="sdcard">
                <el-radio v-model="formConfig.sdcard" label="1" disabled>支持</el-radio>
                <el-radio v-model="formConfig.sdcard" label="0" disabled>不支持</el-radio>
              </el-form-item>
              <el-form-item label="云存储" class="form-row" prop="yun">
                <el-radio v-model="formConfig.yun" label="1" disabled>支持</el-radio>
                <el-radio v-model="formConfig.yun" label="0" disabled>不支持</el-radio>
              </el-form-item>
              <el-form-item label="云台控制" class="form-row" prop="ptzctrl">
                <el-radio v-model="formConfig.ptzctrl" label="1" disabled>水平</el-radio>
                <el-radio v-model="formConfig.ptzctrl" label="2" disabled>垂直</el-radio>
                <el-radio v-model="formConfig.ptzctrl" label="3" disabled>水平+垂直</el-radio>
                <el-radio v-model="formConfig.ptzctrl" label="0" disabled>不支持</el-radio>
              </el-form-item>
              <el-form-item label="指示灯" class="form-row" prop="status_light">
                <el-radio v-model="formConfig.status_light" label="1" disabled>有</el-radio>
                <el-radio v-model="formConfig.status_light" label="0" disabled>没有</el-radio>
              </el-form-item>
              <el-form-item label="人形检测" class="form-row" prop="human_detect">
                <el-radio v-model="formConfig.human_detect" label="1" disabled>支持</el-radio>
                <el-radio v-model="formConfig.human_detect" label="0" disabled>不支持</el-radio>
              </el-form-item>
              <el-form-item label="人形跟踪" class="form-row" prop="human_track">
                <el-radio v-model="formConfig.human_track" label="1" disabled>支持</el-radio>
                <el-radio v-model="formConfig.human_track" label="0" disabled>不支持</el-radio>
              </el-form-item>
              <el-form-item label="OSD" class="form-row" prop="osd">
                <el-radio v-model="formConfig.osd" label="1" disabled>支持</el-radio>
                <el-radio v-model="formConfig.osd" label="0" disabled>不支持</el-radio>
              </el-form-item>
              <el-form-item label="区域侦测" class="form-row" prop="area_detect">
                <el-radio v-model="formConfig.area_detect" label="1" disabled>支持</el-radio>
                <el-radio v-model="formConfig.area_detect" label="0" disabled>不支持</el-radio>
              </el-form-item>
              <el-form-item label="声音检测" class="form-row" prop="voice_detect">
                <el-radio v-model="formConfig.voice_detect" label="1" disabled>支持</el-radio>
                <el-radio v-model="formConfig.voice_detect" label="0" disabled>不支持</el-radio>
              </el-form-item>
              <el-form-item label="哭声检测" class="form-row" prop="cry_detect">
                <el-radio v-model="formConfig.cry_detect" label="1" disabled>支持</el-radio>
                <el-radio v-model="formConfig.cry_detect" label="0" disabled>不支持</el-radio>
              </el-form-item>
              <el-form-item label="移动侦测" class="form-row" prop="motion_detect">
                <el-radio v-model="formConfig.motion_detect" label="1" disabled>支持</el-radio>
                <el-radio v-model="formConfig.motion_detect" label="0" disabled>不支持</el-radio>
              </el-form-item>
            </template>
            <template v-if="isBHCC">
              <el-col :span="24" class="device-model-editdialog-title">情景按钮（BHSC）</el-col>
              <el-form-item label="按钮数量" class="form-row" prop="num">
                <el-input v-model="formConfig.num" disabled></el-input>
              </el-form-item>
            </template>
            <template v-if="isCMSW">
              <el-col :span="24" class="device-model-editdialog-title">组合开关（CMSW）</el-col>
              <el-form-item label="开关数量" class="form-row" prop="num2">
                <el-input v-model="formConfig.num2" disabled></el-input>
              </el-form-item>
            </template>

            <template v-if="isVZDB">
              <el-col :span="24" class="device-model-editdialog-title">智能门禁（VZDB）</el-col>
              <el-form-item label="解码方式" class="form-row" prop="dec">
                <el-select v-model="formConfig.dec" placeholder="请选择" disabled>
                  <el-option
                    v-for="item in dec_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="音频模式" class="form-row" prop="audio">
                <el-select v-model="formConfig.audio" placeholder="请选择" disabled>
                  <el-option
                    v-for="item in audio_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="麦克风" class="form-row" prop="mic">
                <el-radio v-model="formConfig.mic" label="1" disabled>支持</el-radio>
                <el-radio v-model="formConfig.mic" label="0" disabled>不支持</el-radio>
              </el-form-item>
              <el-form-item label="喇叭" class="form-row" prop="speaker">
                <el-radio v-model="formConfig.speaker" label="1" disabled>支持</el-radio>
                <el-radio v-model="formConfig.speaker" label="0" disabled>不支持</el-radio>
              </el-form-item>
              <el-form-item label="存储卡" class="form-row" prop="sdcard">
                <el-radio v-model="formConfig.sdcard" label="1" disabled>支持</el-radio>
                <el-radio v-model="formConfig.sdcard" label="0" disabled>不支持</el-radio>
              </el-form-item>
              <el-form-item label="云存储" class="form-row" prop="yun">
                <el-radio v-model="formConfig.yun" label="1" disabled>支持</el-radio>
                <el-radio v-model="formConfig.yun" label="0" disabled>不支持</el-radio>
              </el-form-item>
              <el-form-item label="指示灯" class="form-row" prop="status_light">
                <el-radio v-model="formConfig.status_light" label="1" disabled>有</el-radio>
                <el-radio v-model="formConfig.status_light" label="0" disabled>没有</el-radio>
              </el-form-item>
              <el-form-item label="声音检测" class="form-row" prop="voice_detect">
                <el-radio v-model="formConfig.voice_detect" label="1" disabled>支持</el-radio>
                <el-radio v-model="formConfig.voice_detect" label="0" disabled>不支持</el-radio>
              </el-form-item>
              <el-form-item label="移动侦测" class="form-row" prop="motion_detect">
                <el-radio v-model="formConfig.motion_detect" label="1" disabled>支持</el-radio>
                <el-radio v-model="formConfig.motion_detect" label="0" disabled>不支持</el-radio>
              </el-form-item>
              <el-form-item label="低功耗" class="form-row" prop="liteos">
                <el-radio v-model="formConfig.liteos" label="1" disabled>支持</el-radio>
                <el-radio v-model="formConfig.liteos" label="0" disabled>不支持</el-radio>
              </el-form-item>
            </template>
          </el-form>
        </el-col>
      </el-row>
    </el-dialog>

    <el-dialog title="型号编辑" :visible.sync="dialogVisible" center>
      <el-form label-width="100px" status-icon :model="formUpdate" ref="AddForm" :rules="rules">
        <el-form-item label="型号名称" class="form-row" prop="product_name">
          <el-input v-model="formUpdate.product_name" disabled></el-input>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item label="型号代码" class="form-row" prop="product_code">
          <el-input v-model="formUpdate.product_code" maxlength="6" disabled></el-input>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item label="连接方式" class="form-row" prop="nbi_code">
          <el-select v-model="formUpdate.nbi_code" multiple placeholder="请选择连接方式">
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
          <el-select v-model="formUpdate.prodt_code" multiple disabled placeholder="请选择设备类别">
            <el-option
              v-for="item in prodt_code_options"
              :key="item.prodt_code"
              :label="item.prodt_name"
              :value="item.prodt_code"
            ></el-option>
          </el-select>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item label="在线图片" class="form-row" prop="pic1_fileid">
          <el-col :span="24" style="line-height:1.2">
            <span class="device-model-uploadImg" v-if="isPiconeUploading">{{piconeUploadProgress}}</span>
            <div
              v-else
              class="device-model-uploadImg"
              style="position: relative;display: inline-block"
            >
              <img class="device-model-uploadImg" :src="piconePath">
              <i class="el-icon-zoom-in showBig" @click="piconeDialogVisible=true"></i>
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
            <el-dialog :modal="false" :visible.sync="piconeDialogVisible">
              <img width="100%" :src="piconePath">
            </el-dialog>
            <div class="device-model-div">
              <p>底色：白色</p>
              <p>尺寸：608*470</p>
              <p>图片大小不超过2M</p>
            </div>
          </el-col>
        </el-form-item>
        <el-form-item label="离线图片" class="form-row" prop="pic2_fileid">
          <el-col :span="24" style="line-height:1.2">
            <span class="device-model-uploadImg" v-if="isPictwoUploading">{{pictwoUploadProgress}}</span>
            <div
              v-if="!isPictwoUploading"
              class="device-model-uploadImg"
              style="position: relative;display: inline-block"
            >
              <img class="device-model-uploadImg" :src="pictwoPath">
              <i class="el-icon-zoom-in showBig" @click="pictwoDialogVisible=true"></i>
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
            <el-dialog :modal="false" :visible.sync="pictwoDialogVisible">
              <img width="100%" :src="pictwoPath">
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
  </div>
</template>
<script>
import "@/assets/css/content.css";
import _ from "lodash";
import {
  deviceCategory,
  decodeFormat,
  pipcDvDecode,
  audioMode
} from "@/lib/mixins";
import { validateProductCode } from "@/lib/validate.js";
import ScaleImgComponent from "@/components/_ui/scale-img.vue";
import TableComponent from "@/components/_ui/table.vue";
import {
  EQUIPMENT_MODEL_QUERY,
  EQUIPMENT_MODEL_DELETE,
  ADMIN_EQUIPMENT_MODEL_UPLOADIMG,
  ADMIN_EQUIPMENT_MODEL_UPDATE
} from "../../../lib/api.js";
export default {
  components: { ScaleImgComponent, TableComponent },
  mixins: [
    {
      data() {
        return {
          class_options: deviceCategory,
          dec_options: decodeFormat,
          pipc_dv_options: pipcDvDecode,
          audio_options: audioMode
        };
      }
    }
  ],
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
        } else if (rule.field === "pic1_fileid") {
          callback(new Error("请上传图1"));
        } else if (rule.field === "pic2_fileid") {
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
        pic1_fileid: [{ validator: validateIsEmpty, trigger: "blur" }],
        pic2_fileid: [{ validator: validateIsEmpty, trigger: "blur" }],
        class0: [{ validator: validateIsEmpty, trigger: "change" }],
        dec: [{ validator: validateIsEmpty, trigger: "change" }],
        chans: [{ validator: validateIsEmpty, trigger: "blur" }],
        pipc_dv: [{ validator: validateIsEmpty, trigger: "change" }],
        audio: [{ validator: validateIsEmpty, trigger: "change" }],
        num: [{ validator: validateIsEmpty, trigger: "blur" }],
        num2: [{ validator: validateIsEmpty, trigger: "blur" }]
      },
      dialogVisible: false,
      formInline: {
        ChoiceTime: "",
        query_by_name: ""
      },
      formUpdate: {
        product_name: "",
        product_code: "",
        nbi_code: [],
        prodt_code: [],
        pic1_fileid: "",
        pic2_fileid: "",
        url_old1: "",
        url_old2: ""
      },
      uploadPath: ADMIN_EQUIPMENT_MODEL_UPLOADIMG,
      piconePath: "",
      piconeDialogVisible: false,
      isPiconeUploading: false,
      piconeUploadProgress: "",
      pictwoPath: "",
      pictwoDialogVisible: false,
      isPictwoUploading: false,
      pictwoUploadProgress: "",
      tableData: [],
      tableDataCache: [],
      dialogData: [],
      isConfigModalShow: false,
      isIPCC: false,
      isBHCC: false,
      isCMSW: false,
      isVZDB: false,
      formConfig: {},
      resData: [],
      loading: false,
      multipleSelection: [],
      nbi_code_options: [],
      prodt_code_options: [],
      tableOptions: {
        loading: true,
        hasSelection: true,
        hasNumber: true,
        pageOptions: {
          pageSize: 20,
          total: 0,
          currentPage: 1
        },
        columns: [
          {
            label: "型号名称",
            prop: "product_name"
          },
          {
            prop: "product_code",
            label: "型号代码"
          },
          {
            prop: "nbi_code",
            label: "连接方式"
          },
          {
            prop: "pic1_fileid",
            label: "图1",
            slotName: "pic1_fileid"
          },
          {
            prop: "pic2_fileid",
            label: "图2",
            slotName: "pic2_fileid"
          },
          {
            prop: "rom_ver",
            label: "固件版本"
          },
          {
            prop: "upgrade_time",
            label: "添加时间"
          },
          {
            prop: "company_name",
            label: "所属公司",
            width: 200
          }
        ]
      }
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
        this.onSubmit();
      }
    },
    onSubmit: _.debounce(function() {
      let param = this.createFormData({
        page: parseInt(this.tableOptions.pageOptions.currentPage),
        page_size: parseInt(this.tableOptions.pageOptions.pageSize),
        query_by_name: this.formInline.query_by_name,
        start_time: this.formInline.ChoiceTime
          ? this.formInline.ChoiceTime[0]
          : "",
        end_time: this.formInline.ChoiceTime
          ? this.formInline.ChoiceTime[1]
          : ""
      });
      this.tableOptions.loading = true;
      this.$http
        .post(EQUIPMENT_MODEL_QUERY, param)
        .then(res => {
          this.tableOptions.loading = false;
          if (this.vmResponseHandler(res)) {
            let codeObj = {};
            res.data.Nbi.forEach(val => {
              this.nbi_code_options = val;
              val.forEach(subval => {
                codeObj[subval.nbi_code] = subval.nbi_code_name;
              });
            });
            res.data.prodtList.forEach(val => {
              this.prodt_code_options = val;
            });
            this.tableDataCache = JSON.parse(JSON.stringify(res.data.data));
            this.tableData = res.data.data.map(val => {
              if (Array.isArray(val.nbi_code)) {
                val.nbi_code = val.nbi_code
                  .map(subval => codeObj[subval])
                  .join("、");
              }
              return val;
            });
            this.resData = res.data;
            this.tableOptions.pageOptions.total = res.data.total;
          }
        })
        .catch(() => {
          this.tableOptions.loading = false;
          this.vmMsgError("网络错误！");
        });
    }, 300),
    Delete() {
      if (!this.multipleSelection.length) {
        this.vmMsgWarning("请选择记录");
        return;
      }
      let codeArr = [];
      this.multipleSelection.forEach(val => {
        codeArr.push(val.product_code);
      });
      let param = this.createFormData({
        product_code: JSON.stringify(codeArr)
      });
      this.vmConfirm({
        msg: "确定删除该记录？",
        confirmCallback: () => {
          let loading = this.vmLoadingFull();
          this.$http
            .post(EQUIPMENT_MODEL_DELETE, param)
            .then(res => {
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
    editDevice(row) {
      if (row.is_review !== 1) {
        this.vmMsgWarning("只有通过审核才能进行型号配置！");
        return;
      }
      this.dialogData = row;
      this.isIPCC = this.dialogData.prodt_code.indexOf("IPCC") > -1;
      this.isBHCC = this.dialogData.prodt_code.indexOf("BHSC") > -1;
      this.isCMSW = this.dialogData.prodt_code.indexOf("CMSW") > -1;
      this.isVZDB = this.dialogData.prodt_code.indexOf("VZDB") > -1;
      this.isConfigModalShow = true;
      this.formConfig = {};
      if (row.config_status) {
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
      this.piconeUploadProgress = "";
      if (response.statu === 0) {
        this.$router.push("/signin");
        return;
      }
      if (!response.status) {
        this.vmMsgError(response.msg);
        return;
      }
      this.isPiconeUploading = false;
      this.piconePath = file.url;
      this.formUpdate.pic1_fileid = response.pic1_fileid;
    },
    onUploadProgress(event, file, fileList) {
      this.isPiconeUploading = true;
      this.piconeUploadProgress = "已上传" + event.percent + "%";
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
      this.pictwoUploadProgress = "";
      // 上传
      if (response.statu === 0) {
        this.$router.push("/signin");
        return;
      }
      if (!response.status) {
        this.vmMsgError(response.msg);
        return;
      }
      this.isPictwoUploading = false;
      this.pictwoPath = file.url;
      this.formUpdate.pic2_fileid = response.pic2_fileid;
    },
    onUploadProgress2(event, file, fileList) {
      this.isPictwoUploading = true;
      this.pictwoUploadProgress = "已上传" + event.percent + "%";
    },
    onUploadError2(err, file, fileList) {
      this.vmMsgError(err);
    },
    updateDevice(row) {
      let tempRow = this.tableDataCache.find(
        o => o.product_code === row.product_code
      );
      this.dialogVisible = true;
      this.isPiconeUploading = false;
      this.isPictwoUploading = false;
      this.formUpdate.product_name = tempRow.product_name;
      this.formUpdate.product_code = tempRow.product_code;
      this.formUpdate.nbi_code = tempRow.nbi_code;
      this.formUpdate.prodt_code = tempRow.prodt_code;
      this.formUpdate.url_old1 = tempRow.pic1_fileid;
      this.formUpdate.url_old2 = tempRow.pic2_fileid;
      this.piconePath = this.formUpdate.pic1_fileid = tempRow.pic1_fileid;
      this.pictwoPath = this.formUpdate.pic2_fileid = tempRow.pic2_fileid;
    },
    EnsureSubmit: _.debounce(function() {
      this.$refs["AddForm"].validate(valid => {
        if (valid) {
          let param = this.createFormData(this.formUpdate);
          this.$http
            .post(ADMIN_EQUIPMENT_MODEL_UPDATE, param)
            .then(res => {
              if (this.vmResponseHandler(res)) {
                this.vmMsgSuccess("操作成功！");
                this.dialogVisible = false;
                this.isPiconeUploading = true;
                this.piconeUploadProgress = "";
                this.isPictwoUploading = true;
                this.pictwoUploadProgress = "";
                this.$refs["AddForm"].resetFields();
                this.onSubmit();
              }
            })
            .catch(() => {
              this.vmMsgError("网络错误！");
            });
        }
      });
    }, 300)
  }
};
</script>
<style scoped>
.device-model-admin {
  padding: 1.67rem 2.5rem;
  color: #fff;
}
</style>
<style>
.device-model-admin /deep/ .el-dialog {
  width: 54.17rem;
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
  color: #fff;
  text-align: center;
  line-height: 6rem;
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
.device-model-div {
  display: inline-block;
  color: #cecece;
  margin-left: 0.5rem;
  text-align: left;
  vertical-align: bottom;
}
</style>
