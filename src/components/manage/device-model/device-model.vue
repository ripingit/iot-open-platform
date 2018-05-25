<template>
  <div class="device-model-admin">
    <el-row>
      <el-col :span="24">
        <el-col :span="21">
          <p class="device-model-admin-title-1">设备型号</p>
          <p class="device-model-admin-title-2">UNIT TYPE</p>
        </el-col>
      </el-col>
    </el-row>
    <el-row class="table">
      <el-row>
        <el-col :span="24">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="">
              <el-date-picker
                class="time"
                v-model="formInline.ChoiceTime"
                type="daterange"
                :editable="false"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="">
              <el-select v-model="formInline.company" placeholder="请选择">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-form>
          <el-button icon="el-icon-delete" type="danger" circle class="btn-circle-delete btn-circle-right" @click="Delete()"></el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-table
          ref="multipleTable"
          :data="tableData"
          style="width: 100%;"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection">
          </el-table-column>
          <el-table-column
            type="index"
            width="100"
            label="编号">
          </el-table-column>
          <el-table-column
            prop="product_name"
            label="型号">
          </el-table-column>
          <el-table-column
            prop="product_code"
            label="型号代码">
          </el-table-column>
          <el-table-column
            prop="nbi_code"
            label="连接方式">
          </el-table-column>
          <el-table-column
            prop=" pic1_fileid"
            label="图1">
            <template slot-scope="scope">
              <div>
                <ScaleImgComponent :path="scope.row.pic1_fileid" style="width:5rem;height:5rem" alt="图1"></ScaleImgComponent>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop=" pic2_fileid"
            label="图2">
            <template slot-scope="scope">
              <div>
                <ScaleImgComponent :path="scope.row.pic2_fileid" style="width:5rem;height:5rem" alt="图2"></ScaleImgComponent>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="remark"
            label="固件版本">
          </el-table-column>
          <el-table-column
            prop="company_name"
            label="所属公司">
          </el-table-column>
        </el-table>
      </el-row>
      <el-row type="flex" justify="center">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="page"
          layout="prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-row>
    </el-row>
  </div>
</template>
<script>
import '@/assets/css/content.css'
import ScaleImgComponent from '@/components/_ui/scale-img.vue'
import { EQUIPMENT_MODEL_QUERY, EQUIPMENT_MODEL_DELETE } from '../../../lib/api.js'
export default {
  components: { ScaleImgComponent },
  data () {
    return {
      dialogVisible: false,
      formInline: {
        ChoiceTime: '',
        company: ''
      },
      tableData: [],
      multipleSelection: [],
      currentPage: 1,
      total: 0,
      page: 10
    }
  },
  created () {
    this.onSubmit()
  },
  methods: {
    onSubmit () {
      let loading = this.vmLoadingFull()
      let param = this.createFormData({
        page: parseInt(this.currentPage),
        page_size: parseInt(this.page)
      })
      this.$http.post(EQUIPMENT_MODEL_QUERY, param).then(res => {
        loading.close()
        if (res.data.statu === 0) {
          this.$router.push('/login')
          return false
        }
        if (this.vmResponseHandler(res)) {
          let codeObj = {}
          res.data.Nbi.forEach(val => {
            val.forEach(subval => {
              codeObj[subval.nbi_code] = subval.nbi_code_name
            })
          })
          this.tableData = res.data.data.map(val => {
            val.nbi_code = val.nbi_code.map(subval => codeObj[subval]).join('、')
            return val
          })
          this.total = res.data.total
        }
      }
      ).catch(() => {
        loading.close()
        this.vmMsgError('网络错误！')
      })
    },
    Delete () {
      if (!this.multipleSelection.length) {
        this.vmMsgWarning('请选择记录')
        return
      }
      let codeArr = ''
      this.multipleSelection.forEach(val => {
        codeArr = val.product_code
      })
      let param = this.createFormData({
        product_code: codeArr
      })
      this.vmConfirm({
        msg: '确定删除该记录？',
        confirmCallback: () => {
          let loading = this.vmLoadingFull()
          this.$http.post(EQUIPMENT_MODEL_DELETE, param).then(res => {
            if (res.data.statu === 0) {
              this.$router.push('/login')
              return false
            }
            loading.close()
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess('删除成功！')
              this.onSubmit()
            }
          }).catch(() => {
            loading.close()
            this.vmMsgError('网络错误！')
          })
        }
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.onSubmit(val)
    },
    handleClose (done) {
      done()
    }
  }
}
</script>
<style scoped>
  .device-model-admin{
    margin: 1.67rem 2.5rem;
    color: #ffffff;
  }
  .device-model-admin-title-1{
    font-size: 1.8rem;
  }
  .device-model-admin-title-2{
    padding-top: 0.35rem;
    font-size: 1rem;
    color: #808080;
  }
</style>
