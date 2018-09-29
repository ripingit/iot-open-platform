<template>
  <div class="content-container">
    <el-row>
      <el-col :span="24">
          <p class="title-cn">设备生产</p>
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
                  label="编号"
                  width="50">
                </el-table-column>
                <el-table-column
                  prop="device_id"
                  label="设备ID"
                  width="200">
                </el-table-column>
                <el-table-column
                  prop="production_time"
                  label="生产日期"
                  width="100">
                </el-table-column>
                <el-table-column
                  prop="put_time"
                  label="入库日期"
                  width="100">
                </el-table-column>
                <el-table-column
                  prop="out_time"
                  label="出库日期"
                  width="100">
                </el-table-column>
                <el-table-column
                  prop="company_code"
                  label="合作方"
                  width="250">
                </el-table-column>
                <el-table-column
                  prop="dealer_name"
                  label="经销商"
                  width="250">
                </el-table-column>
                <el-table-column
                  prop="delivery_time"
                  label="收货时间"
                  width="100">
                </el-table-column>
                <el-table-column
                  prop="box_number"
                  label="箱号"
                  width="80">
                  <!--<template slot-scope="scope">{{ dateFormat(new Date(scope.row.goods_adddate * 1000), 'yyyy-MM-dd hh:mm:ss')  }}</template>-->
                </el-table-column>
                <el-table-column
                  prop="activation_time"
                  label="激活时间"
                  width="100">
                </el-table-column>
                <el-table-column
                  v-if="vmHasAuth(AdminPermissionsLib.REWORK_EQUIPMENT, tableData.res)"
                  prop="untie_status"
                  label="返修状况">
                  <template slot-scope="scope">
                    <span v-if="scope.row.untie_status === 0">无</span>
                    <span v-else @click="showReworkList(scope.row.device_id)" style="cursor:pointer;color:#38a0f8">查看</span>
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
  </div>
</template>
<script>
import '@/assets/css/content.css'
import ScaleImgComponent from '@/components/_ui/scale-img.vue'
import { GET_ADMIN_EQUIPMENT_POST, GET_ADMIN_EQUIPMENT_REWORK_POST } from '@/lib/api'
import _ from 'lodash'

export default {
  components: { ScaleImgComponent },
  data () {
    return {
      loading: false,
      reloading: false,
      searchKeyWord: '',
      isShowReworkList: false,
      reworkData: [],
      tableData: {
        data: [],
        page: '1',
        pageAll: 1,
        total: 1,
        res: []
      }
    }
  },
  created () {
    this.getEquipmentLists(1)
    document.body.addEventListener('keydown', this.keyCodeDown, false)
  },
  beforeDestroy () {
    document.body.removeEventListener('keydown', this.keyCodeDown, false)
  },
  methods: {
    keyCodeDown (e) {
      if (e.keyCode === 13) {
        this.getEquipmentLists(1)
      }
    },
    getEquipmentLists: _.debounce(function (currentPage) {
      let data = this.createFormData({
        page: currentPage,
        page_size: 20,
        query_by_name: this.searchKeyWord
      })
      this.loading = true
      this.$http.post(GET_ADMIN_EQUIPMENT_POST, data).then(res => {
        if (this.vmResponseHandler(res)) {
          this.tableData = res.data
        }
        this.loading = false
      }).catch(e => {
        this.loading = false
        this.vmMsgError('网络错误！')
      })
    }, 300),

    getEquipmentReworkInfo (deviceId) {
      this.reloading = true
      let data = this.createFormData({
        device_id: deviceId
      })
      this.$http.post(GET_ADMIN_EQUIPMENT_REWORK_POST, data).then(res => {
        if (this.vmResponseHandler(res)) {
          this.reworkData = res.data.data
        }
        this.reloading = false
      }).catch(e => {
        this.reloading = false
        this.vmMsgError('网络错误！')
      })
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
