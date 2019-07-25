<template>
  <transition name="bounce" mode="out-in">
    <div class="device-model">
      <el-row>
        <el-col :span="24">
          <p class="title-cn">{{$t("iot_plat_device_model")}}</p>
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
            <el-table-column type="index" width="100" :label="$t('iot_plat_number')"></el-table-column>
            <el-table-column prop="product_name" :label="$t('iot_plat_model_name')"></el-table-column>
            <el-table-column prop="product_code" :label="$t('iot_plat_model_code')"></el-table-column>
            <el-table-column prop="prodt_code2" :label="$t('iot_plat_device_class')" width="200"></el-table-column>
            <el-table-column prop="nbi_code" :label="$t('iot_plat_connection_way')"></el-table-column>
            <el-table-column prop="pic1_fileid" :label="$t('iot_plat_thumb')">
              <template slot-scope="scope">
                <div>
                  <ScaleImgComponent
                    :path="typeof scope.row.pic1_fileid === 'string' ? scope.row.pic1_fileid : scope.row.pic1_fileid.thumb"
                    style="width:6rem;height:6rem"
                    :alt="$t('iot_plat_thumb')"
                  ></ScaleImgComponent>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="is_review" :label="$t('iot_plat_review_state')">
              <template slot-scope="scope">
                <span v-if="scope.row.is_review===0">{{$t("iot_plat_wating_review")}}</span>
                <span v-if="scope.row.is_review===1" style="color: #2acba7">{{$t("iot_plat_already_pass")}}</span>
                <span v-if="scope.row.is_review===2" style="color: #ff5d66">{{$t("iot_plat_already_reject")}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="review_time" :label="$t('iot_plat_add_time')"></el-table-column>
            <el-table-column prop="config_status" :label="$t('iot_plat_config_state')">
              <template slot-scope="scope">
                <span v-if="scope.row.config_status" style="color: #2acba7">{{$t("iot_plat_already_config")}}</span>
                <span v-if="!scope.row.config_status" style="color: #ff5d66">{{$t("iot_plat_none_config")}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop
              :label="$t('iot_plat_operate')"
              v-if="vmHasAuth(CoopPermissionsLib.SET_DEVICE_MODEL, res) || vmHasAuth(CoopPermissionsLib.DEL_DEVICE_MODEL, res)"
              width="150"
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

      <!-- 设备型号添加 -->
      <ModelAddComponent
        :isVisible="isDialogAddVisible"
        :nbiCode="nbi_code_options"
        :resetCode="resetCode"
        :productCode="prodt_code_options"
        @close="modelAddDialogClose"></ModelAddComponent>

      <!-- 设备型号配置 -->
      <ModelConfigComponent :isVisible="isDialogConfigVisible" :data="dialogData" @close="modelConfigDialogClose"></ModelConfigComponent>
    </div>
  </transition>
</template>
<script>
import "@/assets/css/content.css";
import ScaleImgComponent from "@/components/preview-img/scale-img.vue";
import UploadComponent from "@/components/uploader/upload.vue";
import ModelAddComponent from "./component/add-model.vue";
import ModelConfigComponent from "./component/config.vue";
import {
  COOP_DEVICE_MODEL_QUERY,
  USER_EQUIPMENT_MODEL_DEL,
  COOP_GENERATE_DEVICE_ID
} from "@/lib/api.js";

import _ from "lodash";
export default {
  components: { ScaleImgComponent, UploadComponent, ModelAddComponent, ModelConfigComponent },
  data() {
    return {
      loading              : false,
      isDialogAddVisible   : false,
      isDialogConfigVisible: false,
      query_by_name        : "",
      nbi_code_options     : [],
      resetCode            : [],
      prodt_code_options   : [],
      tableData            : [],
      dialogData           : {},
      currentPage          : 1,
      total                : 0,
      page                 : 20,
      res                  : []
    };
  },
  created() {
    this.onSubmit();
  },
  methods: {
    modelAddDialogClose(isToRefresh) {
      if (isToRefresh) {
        this.onSubmit()
      }
      this.isDialogAddVisible = false;
    },

    modelConfigDialogClose (isToRefresh) {
      if (isToRefresh) {
        this.onSubmit()
      }
      this.isDialogConfigVisible = false;
    },

    onSubmit: _.debounce(async function() {
      try {
        this.loading = true;
        const param = this.createFormData({
          page         : parseInt(this.currentPage),
          page_size    : parseInt(this.page),
          query_by_name: this.query_by_name
        });
        const res = await this.$http.post(COOP_DEVICE_MODEL_QUERY, param)
        this.loading = false;
        if (this.vmResponseHandler(res)) {
          const prodtObj = {};
          res.data.prodtList.forEach(val => {
            this.prodt_code_options = val;
            val.forEach(subval => {
              prodtObj[subval.prodt_code] = subval.prodt_name;
            });
          });
          const codeObj = {};
          res.data.Nbi.forEach(val => {
            this.nbi_code_options = val;
            val.forEach(subval => {
              codeObj[subval.nbi_code] = subval.nbi_code_name;
            });
          });
          this.resetCode = res.data.Reset
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
            if (this.isJsonString(val.pic1_fileid)) {
              val.pic1_fileid = JSON.parse(val.pic1_fileid)
            }

            return val;
          });
          this.total = res.data.total;
          this.res = res.data.res;
        }
      } catch (error) {
        this.loading = false;
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    }, this.DEBOUNCE_TIME),
    addDevice() {
      this.isDialogAddVisible = true;
    },

    editDevice(row) {
      if (row.is_review !== 1) {
        return this.vmMsgWarning(this.$t("iot_plat_only_review_to_model_config"));
      }
      this.isDialogConfigVisible = true;
      this.dialogData = row;
    },
    SearchData() {
      this.onSubmit();
    },
    Delete(row) {
      const loading = this.vmLoadingFull();
      try {
        const codeArr = [ row.product_code ];
        const param = this.createFormData({ product_code: JSON.stringify(codeArr) });
        this.vmConfirm({
          msg            : this.$t("iot_plat_confirm_delete_data"),
          confirmCallback: async () => {
            const res = await this.$http.post(USER_EQUIPMENT_MODEL_DEL, param)
            loading.close();
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess(this.$t("iot_plat_delete_success"));
              this.onSubmit();
            }
          },
          cancelCallback: () => {
            loading.close()
          }
        });
      } catch (error) {
        loading.close();
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
      
    },

    generateDeviceID: _.debounce(function(row) {
      if (row.is_review !== 1) {
        this.vmMsgWarning(this.$t("iot_plat_only_pass_review_genereate_device_id"));
        return;
      }
      const MILL_SECOND = 1000
      this.vmPormpt({
        msg              : this.$t("iot_plat_input_download_number"),
        title            : this.$t("iot_plat_download_device_id_and_key"),
        inputPattern     : /^([1-9]|([1-4][0-9])|(50))$/,
        inputErrorMessage: this.$t("iot_plat_input_integer_limit"),
        inputPlaceholder : this.$t("iot_plat_input_integer_limit"),
        confirmCallback  : value => {
          this.vmConfirm({
            msg            : this.$t("iot_plat_confirm_download"),
            confirmCallback: async () => {
              const loading = this.vmLoadingFull();
              try {
                const data = this.createFormData({ product_code: row.product_code, num: value });
                const res = await this.$http.post(COOP_GENERATE_DEVICE_ID, data)
                loading.close();
                if (this.vmResponseHandler(res)) {
                  const a = document.createElement("a");
                  a.href = res.data.url;
                  document.body.appendChild(a);
                  a.click();
                  setTimeout(() => a.remove(), MILL_SECOND);
                }
              } catch (error) {
                loading.close();
                this.vmMsgError(this.$t("iot_plat_program_error"));
              }
            }
          });
        }
      })
    }, this.DEBOUNCE_TIME),

    handleCurrentChange(val) {
      this.currentPage = val;
      this.onSubmit(val);
    },
    handleClose(done) {
      done();
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
