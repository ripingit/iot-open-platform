<template>
  <div class="content-container">
    <el-row>
      <el-col :span="24">
          <p class="title-cn">{{$t("iot_plat_device_produce")}}</p>
          <p class="title-en">THE EQUIPMENT PRODUCTION</p>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <div class="table">
         <!-- <el-row>
            <el-col :span="24">
              <el-input
                placeholder="请输入设备ID"
                v-model="searchKeyWord"
                clearable>
              </el-input>
              <el-button class="btn-search" type="primary" @click="getEquipmentLists(1)">查询</el-button>
            </el-col>
          </el-row>-->
          <el-row>
            <el-col :span="24">
              <el-table
                v-loading="loading"
                :data="tableData.data"
                style="width: 100%">
                <el-table-column
                  type="index"
                  :label="$t('iot_plat_number')"
                  width="50">
                </el-table-column>
                <el-table-column
                  prop="device_id"
                  :label="$t('iot_plat_device_id')"
                  width="220">
                </el-table-column>
                <el-table-column
                  prop="production_time"
                  :label="$t('iot_plat_produce_date')"
                  width="100">
                </el-table-column>
                <el-table-column
                  prop="put_time"
                  :label="$t('iot_plat_storage_date')"
                  width="100">
                </el-table-column>
                <el-table-column
                  prop="out_time"
                  :label="$t('iot_plat_out_lib_date')"
                  width="100">
                </el-table-column>
                <el-table-column
                  prop="company_code"
                  :label="$t('iot_plat_coop_partner')"
                  width="250">
                </el-table-column>
                <el-table-column
                  prop="dealer_name"
                  :label="$t('iot_plat_dealer')"
                  width="250">
                </el-table-column>
                <el-table-column
                  prop="out_bound"
                  :label="$t('iot_plat_area')">
                </el-table-column>
                <el-table-column
                  prop="delivery_time"
                  :label="$t('iot_plat_harvest_time')"
                  width="100">
                </el-table-column>
                <el-table-column
                  prop="box_number"
                  :label="$t('iot_plat_case_number')"
                  width="80">
                  <!--<template slot-scope="scope">{{ formatDate(new Date(scope.row.goods_adddate * 1000), 'yyyy-MM-dd hh:mm:ss')  }}</template>-->
                </el-table-column>
                <el-table-column
                  prop="activation_time"
                  :label="$t('iot_plat_activation_time')"
                  width="100">
                </el-table-column>
                <el-table-column
                  v-if="vmHasAuth(AdminPermissionsLib.REWORK_EQUIPMENT, tableData.res)"
                  prop="untie_status"
                  :label="$t('iot_plat_return_status')">
                  <template slot-scope="scope">
                    <span v-if="scope.row.untie_status === 0">{{$t("iot_plat_none")}}</span>
                    <span v-else @click="showReworkList(scope.row.device_id)" style="cursor:pointer;color:#38a0f8">{{$t("iot_plat_view")}}</span>
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

    <el-dialog :title="$t('iot_plat_return_record')" width="85rem" :visible.sync="isShowReworkList" center>
      <el-table
        :data="reworkData"
        v-loading="reloading"
        style="width: 100%;height: 41.67rem;overflow: auto;">
        <el-table-column
          prop="repair_time"
          :label="$t('iot_plat_return_time')"
          width="180">
        </el-table-column>
        <el-table-column
          prop="results_reason"
          :label="$t('iot_plat_return_reason')"
          width="180">
        </el-table-column>
        <el-table-column
          prop="results_of_repair"
          :label="$t('iot_plat_return_way')">
          <template slot-scope="scope">{{ $t(repairWayCode[scope.row.results_of_repair]) }}</template>
        </el-table-column>
        <el-table-column
          prop="pic"
          :label="$t('iot_plat_return_picture')">
          <template slot-scope="scope">
            <ScaleImgComponent :path="scope.row.pic" style="width:5rem;height:5rem" :alt="$t('iot_plat_return_picture')"></ScaleImgComponent>
          </template>
        </el-table-column>
        <el-table-column
          prop="untie"
          :label="$t('iot_plat_unbind_status')">
          <template slot-scope="scope">{{ $t(untieCode[scope.row.untie]) }}</template>
        </el-table-column>
        <el-table-column
          prop="untie_time"
          :label="$t('iot_plat_unbind_time')">
        </el-table-column>
        <el-table-column
          prop="user_name"
          :label="$t('iot_plat_processing_staff')">
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import "@/assets/css/content.css"
import ScaleImgComponent from "@/components/preview-img/scale-img.vue"
import { GET_ADMIN_EQUIPMENT_POST, ADMIN_DEVICE_RETIRE } from "@/lib/api"
import _ from "lodash"

export default {
  components: { ScaleImgComponent },
  data () {
    return {
      loading         : false,
      reloading       : false,
      searchKeyWord   : "",
      isShowReworkList: false,
      reworkData      : [],
      tableData       : {
        data   : [],
        page   : "1",
        pageAll: 1,
        total  : 1,
        res    : []
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
        this.getEquipmentLists(1)
      }
    },
    getEquipmentLists: _.debounce(async function (currentPage) {
      try {
        const data = this.createFormData({
          page         : currentPage,
          page_size    : 20,
          query_by_name: this.searchKeyWord
        })
        this.loading = true
        const res = await this.$http.post(GET_ADMIN_EQUIPMENT_POST, data)
        if (this.vmResponseHandler(res)) {
          this.tableData = res.data
        }
        this.loading = false  
      } catch (error) {
        this.loading = false
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    }, this.DEBOUNCE_TIME),

    async getEquipmentReworkInfo (deviceId) {
      try {
        this.reloading = true
        const data = this.createFormData({ device_id: deviceId })
        const res = await this.$http.post(ADMIN_DEVICE_RETIRE, data)
        if (this.vmResponseHandler(res)) {
          this.reworkData = res.data.data
        }
        this.reloading = false
      } catch (error) {
        this.reloading = false
        this.vmMsgError(this.$t("iot_plat_program_error"));
      }
    },

    showReworkList (deviceId) {
      this.isShowReworkList = true
      this.reworkData = []
      this.getEquipmentReworkInfo(deviceId)
    }
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
