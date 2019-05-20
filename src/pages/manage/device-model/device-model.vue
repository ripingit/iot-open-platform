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
            <el-form-item>
              <el-button
                type="primary"
                @click="onModelTransfer"
                v-if="vmHasAuth(AdminPermissionsLib.TRANS_DEVICE, resData.res)"
              >转移</el-button>
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
                :path="typeof scope.row.pic1_fileid === 'string' ? scope.row.pic1_fileid : scope.row.pic1_fileid.thumb"
                style="width:6rem;height:6rem"
                alt="缩略图"
              ></ScaleImgComponent>
            </template>
          </TableComponent>
        </el-col>
      </el-row>
    </el-row>

    <ModelConfigComponent :isVisible="isConfigModalVisible" :data="dialogData" @close="modelConfigDialogClose"></ModelConfigComponent>

    <EditModelComponent
      :isVisible="dialogVisible"
      :formData="editFormData"
      :nbiCode="nbi_code_options"
      :productCode="prodt_code_options"
      @close="editModelDialogClose"></EditModelComponent>

    <ModelTransferComponent :isVisible="isTransferVisible"></ModelTransferComponent>
  </div>
</template>
<script>
import "@/assets/css/content.css";
import _ from "lodash";
import { validateProductCode } from "@/lib/validate.js";
import ScaleImgComponent from "@/components/preview-img/scale-img.vue";
import TableComponent from "@/components/table/table.vue";
import EditModelComponent from "./component/edit-model.vue";
import ModelConfigComponent from "./component/config.vue";
import ModelTransferComponent from "./component/mode-transfer.vue";
import {
  EQUIPMENT_MODEL_QUERY,
  EQUIPMENT_MODEL_DELETE
} from "../../../lib/api.js";
export default {
  components: { ScaleImgComponent, TableComponent, EditModelComponent, ModelConfigComponent, ModelTransferComponent },
  data() {
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
      } else if (rule.field === "product_code") {
        if (!validateProductCode(value)) {
          callback(new Error("最大长度不超过6位字符，且只能包含字母和数字"));
        }
      }
      callback();
    };
    return {
      editFormData: {
        product_name: "",
        product_code: "",
        nbi_code    : [],
        prodt_code  : [],
        pic1_fileid : {
          online: "",
          state : "",
          reset : "",
          thumb : ""
        }
      },
      rules: {
        pic1_fileid: [ { validator: validateIsEmpty, trigger: "blur" } ],
        pic2_fileid: [ { validator: validateIsEmpty, trigger: "blur" } ],
        class0     : [ { validator: validateIsEmpty, trigger: "change" } ],
        dec        : [ { validator: validateIsEmpty, trigger: "change" } ],
        chans      : [ { validator: validateIsEmpty, trigger: "blur" } ],
        pipc_dv    : [ { validator: validateIsEmpty, trigger: "change" } ],
        audio      : [ { validator: validateIsEmpty, trigger: "change" } ],
        num        : [ { validator: validateIsEmpty, trigger: "blur" } ],
        num2       : [ { validator: validateIsEmpty, trigger: "blur" } ]
      },

      dialogVisible    : false,
      isTransferVisible: false,
      formInline       : {
        ChoiceTime   : "",
        query_by_name: ""
      },
      formModelTransfer: {
        device_id: "",
        change_id: "1"
      },

      piconePath          : "",
      piconeDialogVisible : false,
      isPiconeUploading   : false,
      piconeUploadProgress: "",
      pictwoPath          : "",
      pictwoDialogVisible : false,
      isPictwoUploading   : false,
      pictwoUploadProgress: "",
      tableData           : [],
      tableDataCache      : [],
      dialogData          : {},
      isConfigModalVisible: false,
      resData             : [],
      loading             : false,
      multipleSelection   : [],
      nbi_code_options    : [],
      prodt_code_options  : [],
      tableOptions        : {
        loading     : true,
        hasSelection: true,
        hasNumber   : true,
        pageOptions : {
          pageSize   : 20,
          total      : 0,
          currentPage: 1
        },
        columns: [
          {
            label: "型号名称",
            prop : "product_name"
          },
          {
            prop : "product_code",
            label: "型号代码"
          },
          {
            prop : "nbi_code",
            label: "连接方式"
          },
          {
            prop    : "pic1_fileid",
            label   : "缩略图",
            slotName: "pic1_fileid"
          },
          {
            prop : "rom_ver",
            label: "固件版本"
          },
          {
            prop : "upgrade_time",
            label: "添加时间"
          },
          {
            prop : "company_name",
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
      if (e.keyCode === this.ENTER_KEY_CODE) {
        this.onSubmit();
      }
    },

    editModelDialogClose (isToUpdate) {
      if (isToUpdate) {
        this.onSubmit()
      }
      this.dialogVisible = false
    },

    modelConfigDialogClose (isToRefresh) {
      if (isToRefresh) {
        this.onSubmit()
      }
      this.isConfigModalVisible = false;
    },

    onModelTransfer() {
      this.isTransferVisible = true;
    },

    onSubmit: _.debounce(async function() {
      try {
        const param = this.createFormData({
          page         : parseInt(this.tableOptions.pageOptions.currentPage),
          page_size    : parseInt(this.tableOptions.pageOptions.pageSize),
          query_by_name: this.formInline.query_by_name,
          start_time   : this.formInline.ChoiceTime
            ? this.formInline.ChoiceTime[0]
            : "",
          end_time: this.formInline.ChoiceTime
            ? this.formInline.ChoiceTime[1]
            : ""
        });
        this.tableOptions.loading = true;
        const res = await this.$http.post(EQUIPMENT_MODEL_QUERY, param)
        this.tableOptions.loading = false;
        if (this.vmResponseHandler(res)) {
          const codeObj = {};
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

            if (this.isJsonString(val.pic1_fileid)) {
              val.pic1_fileid = JSON.parse(val.pic1_fileid)
            }

            return val;
          });
          this.resData = res.data;
          this.tableOptions.pageOptions.total = res.data.total;
        }
      } catch (error) {
        this.tableOptions.loading = false;
        this.vmMsgError("程序错误");
      }
    }, this.DEBOUNCE_TIME),
    Delete() {
      if (!this.multipleSelection.length) {
        return this.vmMsgWarning("请选择记录");
      }
      const loading = this.vmLoadingFull();
      try {
        const codeArr = [];
        this.multipleSelection.forEach(val => {
          codeArr.push(val.product_code);
        });
        const param = this.createFormData({ product_code: JSON.stringify(codeArr) });
        this.vmConfirm({
          msg            : "确定删除该记录？",
          confirmCallback: async () => {
            const res = await this.$http.post(EQUIPMENT_MODEL_DELETE, param)
            loading.close();
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess("删除成功！");
              this.onSubmit();
            }
          }
        }); 
      } catch (error) {
        loading.close();
        this.vmMsgError("程序错误");
      }
    },
    editDevice(row) {
      if (row.is_review !== 1) {
        return this.vmMsgWarning("只有通过审核才能进行型号配置！");
      }
      this.dialogData = row;
      this.isConfigModalVisible = true
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    updateDevice(row) {
      this.editFormData = this.tableDataCache.find(o => o.product_code === row.product_code);
      // 如果pic1_fileid为以前的格式（一个字符串地址），则设置成现有格式（json）
      if (this.isJsonString(this.editFormData.pic1_fileid)) {
        this.editFormData.pic1_fileid = JSON.parse(this.editFormData.pic1_fileid)
      } else if (typeof this.editFormData.pic1_fileid === "string") {
        this.editFormData.pic1_fileid = {
          online: this.editFormData.pic1_fileid,
          thumb : "",
          reset : "",
          state : ""
        }
      }
      this.dialogVisible = true;
    }
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
