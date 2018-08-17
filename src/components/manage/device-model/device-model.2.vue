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
            <el-form-item label="">
              <el-date-picker
                class="time"
                v-model="formInline.ChoiceTime"
                type="daterange"
                value-format="yyyy-MM-dd"
                :editable="false"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="">
              <el-input v-model="formInline.query_by_name"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-form>
          <el-button
            icon="el-icon-delete"
            type="danger" circle
            class="btn-circle-delete btn-circle-right"
            v-if="vmHasAuth(AdminPermissionsLib.DEL_DEVICE_MODEL, resData.res)"
            @click="Delete()"></el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <TableComponent :options="tableOptions" :data="tableData" v-on:page-change="onSubmit" v-on:selection="handleSelectionChange">
            <el-table-column prop="" label="操作" slot="handler">
              <template slot-scope="scope">
                <el-button class="btn-circle"
                            icon="iconfont icon-bianji"
                            size="mini"
                            circle
                            @click="editDevice(scope.row)"></el-button>
              </template>
            </el-table-column>
            <template slot-scope="scope" slot="pic1_fileid">
              <ScaleImgComponent :path="scope.row.pic1_fileid" style="width:5rem;height:5rem" alt="图1"></ScaleImgComponent>
            </template>
            <template slot-scope="scope" slot="pic2_fileid">
              <ScaleImgComponent :path="scope.row.pic2_fileid" style="width:5rem;height:5rem" alt="图2"></ScaleImgComponent>
            </template>
          </TableComponent>
        </el-col>
      </el-row>
    </el-row>

    <el-dialog
        title="型号配置"
        :visible.sync="editDialog"
        center
        style="margin-top: -6vh;"
        :before-close="handleClose">
        <el-row class="device-model-editdialog">
          <el-col :span="24" style="padding:0 0 1rem 2.5rem;">
            <div>型号名称：{{dialogData.product_name}}</div>
            <div>连接方式：{{dialogData.nbi_code}}</div>
          </el-col>
          <el-col :span="24">
            <el-form label-width="100px" :model="formConfig" status-icon ref="ConfigForm">
            <div v-if="showList1">
              <el-col :span="24" class="device-model-editdialog-title">IPC分类（IPCC）</el-col>
              <el-form-item label="设备分类" class="form-row" prop="class0">
                <el-select v-model="formConfig.class0" placeholder="请选择" disabled>
                  <el-option
                    v-for="item in class_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="解码方式" class="form-row" prop="dec">
                <el-select v-model="formConfig.dec" placeholder="请选择" disabled>
                  <el-option
                    v-for="item in dec_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
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
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="音频模式" class="form-row" prop="audio">
                <el-select v-model="formConfig.audio" placeholder="请选择" disabled>
                  <el-option
                    v-for="item in audio_options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
              <div v-if="showList2">
               <el-col :span="24" class="device-model-editdialog-title">情景按钮（BHSC）</el-col>
               <el-form-item label="按钮数量" class="form-row" prop="num">
                 <el-input v-model="formConfig.num" disabled></el-input>
               </el-form-item>
             </div>
             <div v-if="showList3">
               <el-col :span="24" class="device-model-editdialog-title">组合开关（CMSW）</el-col>
               <el-form-item label="开关数量" class="form-row" prop="num2">
                 <el-input v-model="formConfig.num2" disabled></el-input>
               </el-form-item>
             </div>
            </el-form>
          </el-col>
        </el-row>
      </el-dialog>
  </div>
</template>
<script>
import '@/assets/css/content.css'
import _ from 'lodash'
import ScaleImgComponent from '@/components/_ui/scale-img.vue'
import TableComponent from '@/components/_ui/table.vue'
import { EQUIPMENT_MODEL_QUERY, EQUIPMENT_MODEL_DELETE, USER_EQUIPMENT_MODEL_CONFIG } from '../../../lib/api.js'
export default {
  components: { ScaleImgComponent, TableComponent },
  data () {
    return {
      dialogVisible: false,
      formInline: {
        ChoiceTime: '',
        query_by_name: ''
      },
      tableData: [],
      dialogData: [],
      editDialog: false,
      showList1: false,
      showList2: false,
      showList3: false,
      formConfig: {},
      resData: [],
      loading: false,
      multipleSelection: [],
      currentPage: 1,
      total: 0,
      page: 20,
      class_options: [
        {
          value: 1,
          label: 'IPC'
        },
        {
          value: 2,
          label: 'NVR'
        },
        {
          value: 3,
          label: 'DVR'
        },
        {
          value: 4,
          label: 'PIPC'
        }
      ],
      dec_options: [
        {
          value: 0,
          label: '多通道'
        },
        {
          value: 1,
          label: '多路合成'
        }
      ],
      pipc_dv_options: [
        {
          value: 1,
          label: '中科龙智'
        }
      ],
      audio_options: [
        {
          value: 1,
          label: '半双工'
        },
        {
          value: 2,
          label: '全双工'
        }
      ],
      tableOptions: {
        loading: true,
        hasSelection: true,
        hasNumber: true,
        pageOptions: {
          pageSize: 20,
          total: 0
        },
        columns: [
          {
            label: '型号名称',
            prop: 'product_name'
          }, {
            prop: 'product_code',
            label: '型号代码'
          }, {
            prop: 'nbi_code',
            label: '连接方式'
          }, {
            prop: 'pic1_fileid',
            label: '图1',
            slotName: 'pic1_fileid'
          }, {
            prop: 'pic2_fileid',
            label: '图2',
            slotName: 'pic2_fileid'
          }, {
            prop: 'rom_ver',
            label: '固件版本'
          }, {
            prop: 'upgrade_time',
            label: '添加时间'
          }, {
            prop: 'company_name',
            label: '所属公司',
            width: 200
          }
        ]
      }
    }
  },
  created () {
    this.onSubmit()
    document.body.addEventListener('keydown', this.keyCodeDown, false)
  },
  beforeDestroy () {
    document.body.removeEventListener('keydown', this.keyCodeDown, false)
  },
  methods: {
    keyCodeDown (e) {
      if (e.keyCode === 13) {
        this.onSubmit()
      }
    },
    onSubmit: _.debounce(function () {
      let param = this.createFormData({
        page: parseInt(this.currentPage),
        page_size: parseInt(this.page),
        query_by_name: this.formInline.query_by_name,
        start_time: this.formInline.ChoiceTime ? this.formInline.ChoiceTime[0] : '',
        end_time: this.formInline.ChoiceTime ? this.formInline.ChoiceTime[1] : ''
      })
      this.tableOptions.loading = true
      this.$http.post(EQUIPMENT_MODEL_QUERY, param).then(res => {
        this.tableOptions.loading = false
        if (this.vmResponseHandler(res)) {
          let codeObj = {}
          res.data.Nbi.forEach(val => {
            val.forEach(subval => {
              codeObj[subval.nbi_code] = subval.nbi_code_name
            })
          })
          this.tableData = res.data.data.map(val => {
            if (Array.isArray(val.nbi_code)) {
              val.nbi_code = val.nbi_code.map(subval => codeObj[subval]).join('、')
            }
            return val
          })
          this.resData = res.data
          this.tableOptions.pageOptions.total = res.data.total
        }
      }
      ).catch(() => {
        this.tableOptions.loading = false
        this.vmMsgError('网络错误！')
      })
    }, 300),
    Delete () {
      if (!this.multipleSelection.length) {
        this.vmMsgWarning('请选择记录')
        return
      }
      let codeArr = []
      this.multipleSelection.forEach(val => {
        codeArr.push(val.product_code)
      })
      let param = this.createFormData({
        product_code: JSON.stringify(codeArr)
      })
      this.vmConfirm({
        msg: '确定删除该记录？',
        confirmCallback: () => {
          let loading = this.vmLoadingFull()
          this.$http.post(EQUIPMENT_MODEL_DELETE, param).then(res => {
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
    editDevice (row) {
      if (row.is_review !== 1) {
        this.vmMsgWarning('只有通过审核才能进行型号配置！')
        return
      }
      this.dialogData = row
      this.showList1 = this.dialogData.prodt_code.indexOf('IPCC') > -1
      this.showList2 = this.dialogData.prodt_code.indexOf('BHSC') > -1
      this.showList3 = this.dialogData.prodt_code.indexOf('CMSW') > -1
      this.editDialog = true
      this.formConfig = {}
      if (row.config_status) {
        let rowData = JSON.parse(row.config_status)
        this.formConfig = {
          class0: rowData[0].conf.class,
          dec: rowData[0].conf.dec,
          chans: rowData[0].conf.chans,
          pipc_dv: rowData[0].conf.pipc_dv,
          audio: rowData[0].conf.audio,
          num: rowData[0].conf.num,
          num2: rowData[0].conf.num
        }
      }
    },
    ConfigSubmit () {
      this.$refs['ConfigForm'].validate((valid) => {
        if (valid) {
          let param = null
          if (this.showList1) {
            param = this.createFormData({
              product_code: this.dialogData.product_code,
              config: JSON.stringify([{
                prodt_code: 'IPCC',
                conf: {
                  class: parseInt(this.formConfig.class0),
                  chans: parseInt(this.formConfig.chans),
                  dec: parseInt(this.formConfig.dec),
                  pipc_dv: parseInt(this.formConfig.pipc_dv),
                  audio: parseInt(this.formConfig.audio)
                }
              }])
            })
          }
          if (this.showList2) {
            param = this.createFormData({
              product_code: this.dialogData.product_code,
              config: JSON.stringify([{
                prodt_code: 'BHSC',
                conf: {
                  num: parseInt(this.formConfig.num)
                }
              }])
            })
          }
          if (this.showList3) {
            param = this.createFormData({
              product_code: this.dialogData.product_code,
              config: JSON.stringify([{
                prodt_code: 'CMSW',
                conf: {
                  num: parseInt(this.formConfig.num2)
                }
              }])
            })
          }
          this.$http.post(USER_EQUIPMENT_MODEL_CONFIG, param).then(res => {
            if (res.data.statu === 0) {
              this.$router.push('/signin')
              return false
            }
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess('操作成功！')
              this.editDialog = false
              this.$refs['ConfigForm'].resetFields()
              this.onSubmit()
            }
          }).catch(() => {
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
    padding: 1.67rem 2.5rem;
    color: #fff;
  }
</style>
<style>
  .device-model-admin /deep/ .el-dialog{
    width:54.17rem;
  }
  .device-model-editdialog{
   color: #b3b3b3;
   font-size: 14px;
 }
  .device-model-editdialog-title{
    border-top: 1px solid #808080;
    padding:1rem 0;
    margin: 1rem 0;
  }
  .device-model-uploadImg{
    display: inline-block;
    width:8rem;
    height: 6rem;
    background: #636363;
    border-color: #636363;
    vertical-align: middle;
  }
  .device-model-uploadImg:hover>.showBig{
    display: block;
    transition: opacity .3s;
  }
  .showBig{
    position: absolute;
    top: 0;
    display: none;
    text-align: center;
    width:8rem;
    height: 6rem;
    z-index: 999;
    font-size: 1.6rem;
    line-height: 6rem;
    color: #fff;
    background-color: rgba(0,0,0,.5);
  }
</style>
