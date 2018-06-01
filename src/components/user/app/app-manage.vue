<template>
  <div class="container">
    <el-row class="app_nav">
      <h5>APP版本</h5>
      <p>THE APP VERSION</p>
    </el-row>
    <el-row class="table">
      <el-row>
        <el-col :span="5">
          <el-input
            placeholder="点击此处搜索"
            v-model="inputVal">
            <i slot="prefix" class="el-input__icon el-icon-search" @click="searchData()"></i>
          </el-input>
          <el-button icon="el-icon-plus" type="primary" circle class="btn-circle-add" @click="operationData('add')"></el-button>
          <el-button icon="el-icon-delete" type="danger" circle class="btn-circle-delete" @click="operationData('delete')"></el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-table
          element-loading-text="拼命加载中"
          :data="tableData"
          @selection-change="handleSelectionChange"
          style="width: 100%;">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            type="index"
            min-width="100"
            label="编号">
          </el-table-column>
          <el-table-column
            prop="app_name"
            min-width="150"
            label="APP名称">
          </el-table-column>
          <el-table-column
            prop="ver"
            min-width="150"
            label="版本号">
          </el-table-column>
          <el-table-column
            prop="url"
            min-width="200"
            label="URL">
          </el-table-column>
          <el-table-column
            prop="review_time"
            min-width="180"
            label="时间">
          </el-table-column>
          <el-table-column
            prop=""
            label="操作"
            min-width="120">
            <template slot-scope="scope">
              <el-button
                class="btn-circle"
                size="mini"
                icon="iconfont icon-gengduo"
                circle
                @click="operationData('select',scope.$index)"></el-button>
              <el-button
                class="btn-circle"
                size="mini"
                icon="iconfont icon-bianji"
                circle
                @click="operationData('edit',scope.$index)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row type="flex" justify="center" v-if="totalAll!=0">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="selectParam.page"
          :page-size="selectParam.page_size"
          layout="prev, pager, next, jumper"
          :total="totalAll">
        </el-pagination>
      </el-row>
    </el-row>
    <el-dialog
      title="APP升级"
      center
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :before-close="handleClose">
      <el-form status-icon :model="ruleForm" :rules="rules" ref="ruleForm" label-position="right" label-width="100px">
        <el-form-item label="升级方式" class="form-row">
          <span class="detail_item" v-show="updateStyle==='update'">更新</span>
          <span class="detail_item" v-show="updateStyle==='add'">添加</span>
        </el-form-item>
        <el-form-item label="APP名称" prop="app_name" class="form-row">
          <el-input v-model="ruleForm.app_name" placeholder="请输入app名称" v-show="updateStyle==='add'"></el-input>
          <el-input v-model="ruleForm.app_name" readonly v-show="updateStyle==='update'"></el-input>
        </el-form-item>
        <el-form-item label="版本" prop="ver" class="form-row">
          <el-input v-model="ruleForm.ver" placeholder="请输入app版本"></el-input>
        </el-form-item>
        <el-form-item label="下载地址" prop="url" class="form-row">
          <el-input v-model="ruleForm.url" placeholder="请输入app下载地址"></el-input>
        </el-form-item>
        <el-form-item label="MD5值" prop="md5" class="form-row">
          <el-input v-model="ruleForm.md5" placeholder="请输入app MD5值"></el-input>
        </el-form-item>
        <el-form-item label="升级描述" prop="change_log" class="form-row">
          <quill-editor ref="myTextEditor"
                        v-model="ruleForm.change_log"
                        :options="editorOption">
          </quill-editor>
        </el-form-item>
        <el-form-item class="form-row" style="margin-top: 4.33rem">
          <el-button type="primary" @click="submitForm" class="btn-submit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="APP升级详情"
      center
      :visible.sync="detailDialogVisible"
      :close-on-click-modal="false"
      :before-close="handleClose">
      <el-form label-width="100px">
        <el-form-item label="APP名称">
          <span class="detail_item">{{detailData.app_name}}</span>
        </el-form-item>
        <el-form-item label="版本">
          <span class="detail_item">{{detailData.ver}}</span>
        </el-form-item>
        <el-form-item label="下载地址">
          <a :href="detailData.url" target="_blank" class="download">{{detailData.url}}</a>
        </el-form-item>
        <el-form-item label="MD5值">
          <span class="detail_item">{{detailData.md5}}</span>
        </el-form-item>
        <el-form-item label="升级描述">
          <span class="detail_item" v-html="vmEscapeToHTML(detailData.change_log)"></span>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import '@/assets/css/content.css'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
import { APP_SELECT_POST, APP_ADD_POST, APP_DEL_POST } from '@/lib/api.js'

export default {
  components: { quillEditor },
  data () {
    return {
      editorOption: {
        modules: {
          toolbar: ''
        },
        placeholder: '请输入升级描述'
      },
      inputVal: '',
      multipleSelection: [],
      tableData: [],
      selectParam: {
        page: 1,
        page_size: 10
      },
      totalAll: 0,
      dialogVisible: false,
      detailDialogVisible: false,
      ruleForm: {
        app_name: '',
        ver: '',
        change_log: '',
        url: '',
        md5: ''
      },
      updateStyle: 'update',
      rules: {
        app_name: [
          { required: true, message: '请输入app名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        ver: [
          { required: true, message: '请输入版本号', trigger: 'blur' }
        ],
        change_log: [
          { required: true, message: '请输入升级描述', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请输入下载地址', trigger: 'blur' }
        ],
        md5: [
          { required: true, message: '请输入md5值', trigger: 'blur' }
        ]
      },
      detailData: {}
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    searchData () {
      this.selectParam.page = 1
      this.loadData()
    },
    handleCurrentChange (val) {
      this.selectParam.page = val
      this.loadData()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    operationData (type, ix) {
      if (type === 'select') {
        this.detailDialogVisible = true
        this.detailData = JSON.parse(JSON.stringify(this.tableData[ix]))
      } else if (type === 'add') {
        this.updateStyle = 'add'
        this.dialogVisible = true
        for (let key in this.ruleForm) {
          this.ruleForm[key] = ''
        }
      } else if (type === 'edit') {
        this.updateStyle = 'update'
        this.dialogVisible = true
        for (let key in this.ruleForm) {
          this.ruleForm[key] = key === 'change_log' ? this.vmEscapeToHTML(this.tableData[ix][key]) : this.tableData[ix][key]
        }
      } else {
        let data
        let ary = []
        for (let obj of this.multipleSelection) {
          ary.push(obj.app_name)
        }
        data = this.createFormData({
          app_name: JSON.stringify(ary)
        })
        this.vmConfirm({
          msg: '确定删除该记录？',
          confirmCallback: () => {
            let loading = this.vmLoadingFull()
            this.$http.post(APP_DEL_POST, data).then(res => {
              loading.close()
              if (this.vmResponseHandler(res)) {
                this.vmMsgSuccess('删除成功！')
                this.loadData()
              }
            }).catch(e => {
              loading.close()
              this.vmMsgError('网络错误！')
            })
          }
        })
      }
    },
    handleClose (done) {
      done()
    },
    submitForm () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let data = this.createFormData(this.ruleForm)
          let loading = this.vmLoadingFull()
          this.$http.post(APP_ADD_POST, data).then(res => {
            loading.close()
            if (this.vmResponseHandler(res)) {
              if (this.updateStyle === 'add') {
                this.selectParam.page = 1
              }
              this.dialogVisible = false
              this.vmMsgSuccess()
              this.loadData()
            }
          }).catch(e => {
            loading.close()
            this.vmMsgError('网络错误！')
          })
        } else {
          return false
        }
      })
    },
    loadData () {
      let data = this.createFormData(this.selectParam)
      this.$http.post(APP_SELECT_POST, data).then(res => {
        if (this.vmResponseHandler(res)) {
          this.tableData = res.data.data
          this.totalAll = res.data.total
        }
      }).catch(e => {
        this.vmMsgError('网络错误！')
      })
    }
  }
}
</script>
<style scoped>
  .container {
    margin: 1.67rem 2.5rem;
  }

  .app_nav h5 {
    font-size: 1.5rem;
    color: #fff;
  }

  .app_nav p {
    font-size: .83rem;
    color: #808080;
    margin-top: .33rem;
  }
  .container /deep/ .el-dialog{
    width:54.17rem;
  }
  .download{
    color: #38a0f8;
  }
  .detail_item{
    color: #ffffff;
  }
</style>
