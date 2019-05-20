<template>
  <div class="content-container">
    <el-row>
      <el-col :span="24">
        <p class="title-cn">设备管理</p>
        <p class="title-en">THE EQUIPMENT MANAGEMENT</p>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <div class="table">
          <el-row>
            <el-col :span="24">
              <el-input
                placeholder="请输入设备ID"
                v-model="searchKeyWord"
                clearable>
              </el-input>
              <el-button class="btn-search" type="primary" @click="getEquipmentLists(1)">查询</el-button>
              <!--<el-button class="btn-circle-delete el-button--primary is-circle" type="primary" icon="el-icon-plus" circle @click="addEquipment"></el-button>-->
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-table
                v-loading="loading"
                :data="tableData.data"
                style="width: 100%">
                <el-table-column
                  type="index"
                  label="编号"
                  width="80">
                </el-table-column>
                <el-table-column
                  prop="device_id"
                  label="设备ID"
                  width="240">
                </el-table-column>
                <el-table-column
                  prop="production_time"
                  label="生产日期">
                </el-table-column>
                <el-table-column
                  prop="put_time"
                  label="入库日期">
                </el-table-column>
                <el-table-column
                  prop="out_time"
                  label="出库日期">
                </el-table-column>
                <el-table-column
                  prop="delivery_time"
                  label="收货时间">
                </el-table-column>
                <el-table-column
                  prop="box_number"
                  label="批次编码"
                  width="200">
                  <!--<template slot-scope="scope">{{ dateFormat(new Date(scope.row.goods_adddate * 1000), 'yyyy-MM-dd hh:mm:ss')  }}</template>-->
                </el-table-column>
                <el-table-column
                  prop="untie_status"
                  v-if="vmHasAuth(CoopPermissionsLib.QUERY_REWORK_DEALER, tableData.res)"
                  label="返修状况">
                  <template slot-scope="scope">
                    <span v-if="scope.row.untie_status === 0">无</span>
                    <span v-else @click="showReworkList(scope.row.device_id)" style="cursor:pointer;color:#38a0f8">查看</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作"
                                 width="120"
                                 v-if="vmHasAuth(CoopPermissionsLib.ADD_REWORK_DEALER, tableData.res)">
                  <template slot-scope="scope">
                    <el-button
                      class="btn-circle"
                      size="mini"
                      icon="iconfont icon-bianji"
                      circle
                      @click="reworkEquip(scope.$index, scope.row)"></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-pagination
                v-if="tableData.data.length !== 0"
                @size-change="getEquipmentLists"
                @current-change="getEquipmentLists"
                :page-size="20"
                layout="prev, pager, next, jumper"
                :total="tableData.total">
              </el-pagination>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>

    <el-dialog title="返修记录" width="85rem" :visible.sync="isShowReworkList" center>
      <el-table
        :data="reworkData"
        v-loading="reloading"
        style="width: 100%;height: 41.67rem;overflow: auto;">
        <el-table-column
          prop="repair_time"
          label="返修时间"
          width="180">
        </el-table-column>
        <el-table-column
          prop="results_reason"
          label="返修原因"
          width="180">
        </el-table-column>
        <el-table-column
          prop="results_of_repair"
          label="返修方式">
          <template slot-scope="scope">{{ repairWayCode[scope.row.results_of_repair] }}</template>
        </el-table-column>
        <el-table-column
          prop="pic"
          label="返修图片">
          <template slot-scope="scope">
            <ScaleImgComponent :path="scope.row.pic" style="width:5rem;height:5rem" alt="返修图片"></ScaleImgComponent>
          </template>
        </el-table-column>
        <el-table-column
          prop="untie"
          label="解绑状态">
          <template slot-scope="scope">{{ untieCode[scope.row.untie] }}</template>
        </el-table-column>
        <el-table-column
          prop="untie_time"
          label="解绑时间">
        </el-table-column>
        <el-table-column
          prop="user_name"
          label="处理人">
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="返修" :visible.sync="isDialogVisibleAdd" center>
      <el-form label-position="right" status-icon label-width="100px" :model="reworkForm" :rules="rules" ref="reworkForm">
        <el-form-item class="form-row" label="设备ID"><span style="color:#fff">{{ reworkForm.device_id }}</span></el-form-item>
        <el-form-item class="form-row" label="处理方式" prop="results_of_repair">
          <el-select v-model="reworkForm.results_of_repair" placeholder="请选择处理方式" no-data-text="无数据">
            <el-option :key="1" label="更换" value="1"></el-option>
            <el-option :key="2" label="维修" value="2"></el-option>
          </el-select>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item class="form-row" label="设备图片" prop="pic">
          <div class="form-btn-upload">
            <span class="form-img-cert" v-if="isUploading">
              {{uploadProgress || picTip}}
            </span>
            <img v-else class="form-img-cert" :src="picPath"/>
            <div class="form-btn-upload">
              <el-upload
                :action="uploadPath"
                name="photo"
                accept=".jpg,.jpeg,.png"
                :before-upload="onBeforeUpload"
                :on-success="onUploadSuccess"
                :on-progress="onUploadProgress"
                :on-error="onUploadError"
                :show-file-list="false">
                <el-button class="btn-upload" size="small" type="primary">上传</el-button>
              </el-upload>
            </div>
          </div>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item class="form-row" label="返修原因" prop="results_reason">
          <el-input type="textarea" :rows="6" v-model="reworkForm.results_reason" placeholder="请输入返修原因"></el-input>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-checkbox style="margin-top: 20px" v-model="reworkForm.untie">发起返修将向用户发送解绑设备信息，如用户拒绝后将30天内不能再次发起返修</el-checkbox>
        <el-form-item class="form-row">
          <el-button class="btn-submit" type="primary" @click="submit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import "@/assets/css/content.css"
import ScaleImgComponent from "@/components/preview-img/scale-img.vue"
import { COOP_DEVICE_INFO_QUERY, COOP_DEVICE_RETIRE_DETAIL, COOP_DEVICE_UPLOAD_PIC, COOP_DEVICE_RETIRE_ADD } from "@/lib/api"
import _ from "lodash"

export default {
  components: { ScaleImgComponent },
  data () {
    const validateIsEmpty = (rule, value, callback) => {
      if (value === "") {
        if (rule.field === "results_reason") {
          callback(new Error("请输入返修原因"))
        } else if (rule.field === "results_of_repair") {
          callback(new Error("请选择返修方式"))
        } else if (rule.field === "pic") {
          callback(new Error("请上传返修图片"))
        }
      }
      callback()
    }
    return {
      loading            : false,
      reloading          : false,
      searchKeyWord      : "",
      isShowReworkList   : false,
      reworkData         : [],
      isDialogVisibleList: false,
      isDialogVisibleAdd : false,
      uploadPath         : COOP_DEVICE_UPLOAD_PIC,
      isUploading        : true,
      uploadProgress     : "",
      picTip             : "格式为 jpg 且小于2M",
      picPath            : "",
      tableData          : {
        data   : [],
        page   : "1",
        pageAll: 1,
        total  : 1,
        res    : []
      },
      reworkForm: {
        device_id        : "",
        untie            : "",
        results_reason   : "",
        results_of_repair: "",
        pic              : ""
      },
      rules: {
        results_reason: [
          { validator: validateIsEmpty, trigger: "change" }
        ],
        results_of_repair: [
          { validator: validateIsEmpty, trigger: "change" }
        ],
        pic: [
          { validator: validateIsEmpty, trigger: "change" }
        ]
      }
    }
  },
  created () {
    this.getEquipmentLists(1)
    document.body.addEventListener("keydown", this.keyCodeDown, false)
  },
  beforeDestroy () {
    document.body.removeEventListener("keydown", this.keyCodeDown, false)
  },
  methods: {
    keyCodeDown (e) {
      if (e.keyCode === this.ENTER_KEY_CODE) {
        if (this.isDialogVisibleAdd) {
          this.submit(); return
        }
        this.getEquipmentLists(1)
      }
    },
    reworkEquip (index, row) {
      this.reworkForm.device_id = row.device_id
      this.isUploading = true
      this.uploadProgress = ""
      this.reworkForm.pic = ""
      this.reworkForm.untie = false
      this.isDialogVisibleAdd = true
    },
    getEquipmentLists: _.debounce(async function (currentPage) {
      try {
        const data = this.createFormData({
          page         : currentPage,
          page_size    : 20,
          query_by_name: this.searchKeyWord,
          start_time   : "",
          end_time     : ""
        })
        this.loading = true
        const res = await this.$http.post(COOP_DEVICE_INFO_QUERY, data)
        if (this.vmResponseHandler(res)) {
          this.tableData = res.data
        }
        this.loading = false  
      } catch (error) {
        this.loading = false
        this.vmMsgError("程序错误！")
      }
    }, this.DEBOUNCE_TIME),

    async getEquipmentReworkInfo (deviceId) {
      try {
        this.reloading = true
        const data = this.createFormData({ device_id: deviceId })
        const res = await this.$http.post(COOP_DEVICE_RETIRE_DETAIL, data)
        if (this.vmResponseHandler(res)) {
          this.reworkData = res.data.data
        }
        this.reloading = false
      } catch (error) {
        this.reloading = false
        this.vmMsgError("程序错误！")
      }
    },

    showReworkList (deviceId) {
      this.isShowReworkList = true
      this.reworkData = []
      this.getEquipmentReworkInfo(deviceId)
    },
    onBeforeUpload (file) {
      const BYTE = 1024
      const MAX_SIZE = 2
      const sizeM = file.size / BYTE / BYTE
      const imgArr = [ "image/png", "image/jpeg", "image/jpg" ]
      if (!imgArr.includes(file.type) || sizeM > MAX_SIZE) {
        this.vmMsgError(`请上传后缀为.jpg或.png或.jpeg且小于${MAX_SIZE}M的图片`)
        return false
      }
    },
    onUploadSuccess (response, file) {
      this.isUploading = false
      // 上传
      if (response.statu === 0) {
        this.$router.push("/signin"); return
      }

      if (!response.status) {
        this.vmMsgError(response.msg); return
      }
      this.picPath = file.url
      this.reworkForm.pic = response.md5
    },
    onUploadProgress (event) {
      this.isUploading = true
      this.reworkForm.pic = `${Math.ceil(event.percent)}%`
    },
    onUploadError (err) {
      this.isUploading = false
      this.reworkForm.pic = ""
      this.vmMsgError(err)
    },
    submit: _.debounce(function () {
      if (!this.reworkForm.untie) { return this.vmMsgError("请勾选同意解绑协议！") }
      const wait = this.vmLoadingFull()
      try {
        this.$refs.reworkForm.validate(async valid => {
          if (valid) {
            const res = await this.$http.post(COOP_DEVICE_RETIRE_ADD, this.createFormData(this.reworkForm))
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess("提交成功！")
              this.isDialogVisibleAdd = false
              this.getEquipmentLists(this.tableData.page)
              this.$refs.reworkForm.resetFields()
            }
            wait.close()
          }
        })
      } catch (error) {
        wait.close()
        this.vmMsgError("程序错误！")
      }
    }, this.DEBOUNCE_TIME)
  }
}
</script>
<style scoped>
  .content-container /deep/ .el-dialog {
    width: 54rem;
  }
  .el-dialog .form-img-cert {
    display: inline-block;
    width: 14rem;
    height: 8rem;
    background: #636363;
    vertical-align: middle;
    color: #fff;
    text-align: center;
    line-height: 8rem;
  }
  .el-dialog .form-btn-upload {
    display: inline-block;
    vertical-align: middle;
  }
  .el-dialog .form-btn-upload .btn-upload {
    height: 8rem;
    width: 3rem;
    border-radius: 0;
    padding: 0;
    font-size: 1.2rem;
    background: #1f7ecf;
    border: none;
  }
</style>
