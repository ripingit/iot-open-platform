<template>
  <div class="content-container">
    <el-row>
      <el-col :span="24">
        <div class="big-font">申</div>
        <div class="small-font">
          <p class="cn">请资格</p><p class="en">ELIGIBILITY</p>
        </div>
      </el-col>
    </el-row>
    <el-row class="panel">
      <el-col :span="8" class="eligibility">
        <div class="eligi-icon right">
          <i class="iconfont icon-yingyezhizhao" aria-hidden="true"></i>
          <i class="iconfont pass icon-duihao1"></i>
        </div>
        <div class="eligi-desc">
          <p class="name">公司资质</p>
          <p class="note note-01">申请机构必须是工商部门注册的正规公司</p>
        </div>
      </el-col>
      <el-col :span="8" class="eligibility center">
        <div class="eligi-icon">
          <i class="iconfont icon-yingjianzhichi" aria-hidden="true"></i>
          <i class="iconfont pass icon-duihao1"></i>
        </div>
        <div class="eligi-desc">
          <p class="name">硬件支持</p>
          <p class="note note-02">拥有自主或授权硬件创新能力</p>
        </div>
      </el-col>
      <el-col :span="8" class="eligibility">
        <div class="eligi-icon">
          <i class="iconfont icon-ruanjianzhichi" aria-hidden="true"></i>
          <i class="iconfont pass icon-duihao1"></i>
        </div>
        <div class="eligi-desc">
          <p class="name">软件支持</p>
          <p class="note note-03">具有一定的软件开发能力</p>
        </div>
      </el-col>
    </el-row>
    <el-row class="mt30">
      <el-col :span="24">
        <div class="big-font">认</div>
        <div class="small-font">
          <p class="cn">证流程</p><p class="en">WORKFLOW</p>
        </div>
      </el-col>
    </el-row>
    <el-row class="panel flow">
      <el-col :span="24">
        <el-steps :active="steps" finish-status="success">
          <el-step title="注册迈科账号" description="请牢记用户名和密码"></el-step>
          <el-step title="申请认证" description="提交相关营业执照申请迈科智能认证"></el-step>
          <el-step :title="authResult" :status="proStatu" :description="description"></el-step>
          <!--<el-step title="申请KEY" description="认证可查看到独有的KEY请牢记"></el-step>-->
        </el-steps>
        <el-steps class="step-operation">
          <el-step></el-step>
          <el-step v-if="isShowSubmit" class="auth"></el-step>
          <el-step v-else-if="canUpdate" @click.native="showDialog" class="edit"></el-step>
          <el-step v-else @click.native="showDialog"></el-step>
          <el-step v-if="isShowUpdate || isUpdateState" :class="'review'"></el-step>
          <el-step v-else @click.native="updateReviewState(true)"></el-step>
          <!--<el-step class="key"></el-step>-->
        </el-steps>
      </el-col>
    </el-row>

    <el-dialog title="提交审核" :visible.sync="isDialogVisible" center>
      <p class="note">* 所有填写的信息要与营业执照上保持一致</p>
      <el-form :model="form" status-icon ref="authForm" :rules="rules" label-position="right" label-width="100px">
        <el-form-item label="公司名" prop="name" class="form-row" v-if="authStatu !== authCode.PASS">
          <el-input
            placeholder="请输入公司全称"
            v-model="form.name"
            clearable>
          </el-input>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item label="公司英文名" prop="en_name" class="form-row" v-if="authStatu !== authCode.PASS">
          <el-input
            placeholder="请输入公司英文名称"
            v-model="form.en_name"
            clearable>
          </el-input>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item label="证件号码" prop="agency_code" class="form-row" v-if="authStatu !== authCode.PASS">
          <el-input
            placeholder="请输入单位证件号码"
            v-model="form.agency_code">
          </el-input>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item label="通讯地址" prop="addr" class="form-row">
          <el-input
            placeholder="请输入通讯地址"
            v-model="form.addr">
          </el-input>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item label="联系电话" prop="tel" class="form-row">
          <el-input
            placeholder="请输入联系电话"
            v-model="form.tel">
          </el-input>
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item label="营业执照" prop="file_ids" class="form-row" v-if="authStatu !== authCode.PASS">
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
          <span class="form-tip">*</span>
        </el-form-item>
        <el-form-item prop="protocolChecked" class="form-row" v-if="authStatu !== authCode.PASS">
          <el-checkbox v-model="form.protocolChecked">同意 <a href="" style="color: #3193e6">《迈科智能用户协议》</a></el-checkbox>
        </el-form-item>
        <el-form-item class="form-row">
           <el-button class="btn-submit" type="primary" @click="authenticate">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import '@/assets/css/content.css'
import { CERT_UPLOAD_POST, PARTNER_AUTH_POST, UPDATE_AUTH_STATE_POST, COOP_AUTH_GET } from '../../lib/api.js'
import { validatePhone, validateFixPhone, validateBusinessLicense } from '../../lib/validate.js'
import { AUTH_CHANGE, USER_ID_UPDATE, USER_KEY_UPDATE, AUTH_UPDATE } from '@/store/mutations-type'
import { generateMenus, coopMenuRouteMap } from '@/lib/route-menu-map'
import { createRoutes } from '@/router/routes/index'
export default {
  data () {
    let validateIsEmpty = (rule, value, callback) => {
      if (rule.field === 'protocolChecked') {
        if (!value) { callback(new Error('请输入勾选同意迈科智能用户协议')) }
      }
      if (value === '') {
        if (rule.field === 'name') {
          callback(new Error('请输入公司名称'))
        } else if (rule.field === 'addr') {
          callback(new Error('请输入通讯地址'))
        } else if (rule.field === 'agency_code') {
          callback(new Error('请输入证件号码'))
        } else if (rule.field === 'tel') {
          callback(new Error('请输入联系电话'))
        } else if (rule.field === 'file_ids') {
          callback(new Error('请上传营业执照'))
        }
      } else {
        if (rule.field === 'tel') {
          if (!validatePhone(value) && !validateFixPhone(value)) {
            callback(new Error('请输入正确的电话号码'))
          }
        }
        if (rule.field === 'agency_code') {
          if (!validateBusinessLicense(value)) {
            callback(new Error('请输入正确的营业执照号码'))
          }
        }
      }
      callback()
    }
    return {
      authStatu: this.$store.getters.getAuthState,
      isUpdateState: false,
      isToUpdate: false,
      uploadPath: CERT_UPLOAD_POST,
      isDialogVisible: false,
      protocolChecked: false,
      uploadProgress: '',
      isUploading: true,
      authFailedReason: '',
      picPath: '',
      picTip: '格式为 jpg 且小于2M',
      form: {
        role: this.merchantCode.coop,
        name: '',
        en_name: '',
        addr: '',
        agency_code: '',
        tel: '',
        protocolChecked: true,
        file_ids: ''
      },
      rules: {
        name: [
          { validator: validateIsEmpty, trigger: 'blur' }
        ],
        addr: [
          { validator: validateIsEmpty, trigger: 'blur' }
        ],
        agency_code: [
          { validator: validateIsEmpty, trigger: 'blur' }
        ],
        tel: [
          { validator: validateIsEmpty, trigger: 'blur' }
        ],
        protocolChecked: [
          { validator: validateIsEmpty, trigger: 'blur' }
        ],
        file_ids: [
          { validator: validateIsEmpty, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    canUpdate () {
      return this.isToUpdate && this.authStatu === this.authCode.PASS
    },
    isShowSubmit () {
      return this.authStatu === this.authCode.WAIT
    },
    isShowUpdate () {
      return this.authStatu !== this.authCode.WAIT
    },
    steps () {
      return this.authStatu === this.authCode.NO_SUBMIT ? 1
        : (this.authStatu === this.authCode.WAIT || this.authStatu === this.authCode.REJECT) ? 2
          : this.authStatu === this.authCode.PASS ? 4 : 4
    },
    authResult () {
      return this.authStatu === this.authCode.NO_SUBMIT ? '等待审核'
        : this.authStatu === this.authCode.WAIT ? '审核中'
          : this.authStatu === this.authCode.PASS ? '审核通过'
            : this.authStatu === this.authCode.REJECT ? '审核未通过' : '状态未知'
    },
    description () {
      return this.authStatu === this.authCode.REJECT ? this.authFailedReason : '申请将在24小时之内反馈结果'
    },
    proStatu () {
      if (this.authStatu === this.authCode.NO_SUBMIT) { return 'wait' }
      if (this.authStatu === this.authCode.REJECT) { return 'error' }
      if (this.authStatu === this.authCode.PASS) { return 'success' }
      return 'process'
    }
  },
  created () {
    this.updateReviewState(false)
  },
  methods: {
    showDialog () {
      this.isDialogVisible = true
    },

    authenticate () {
      this.$refs['authForm'].validate((valid) => {
        if (valid) {
          let loading = this.vmLoadingFull()
          this.$http.post(PARTNER_AUTH_POST, this.createFormData(this.form)).then(res => {
            loading.close()
            if (this.vmResponseHandler(res)) {
              this.isDialogVisible = false
              if (this.authStatu === this.authCode.PASS) {
                this.vmMsgSuccess('修改成功！'); return
              } else {
                this.vmMsgSuccess('审核提交成功，审核周期为24小时内，我们将尽快处理！')
              }
              this.isUploading = true
              this.uploadProgress = ''
              this.$refs['authForm'].resetFields()
              this.authStatu = this.authCode.WAIT
              this.$store.commit(AUTH_CHANGE, { authState: this.authCode.WAIT })
            }
          }).catch(() => {
            this.vmMsgError('网络错误！')
          })
        }
      })
    },
    updateReviewState (flag) {
      this.isUpdateState = true
      let loading = this.vmLoadingFull()
      this.$http.post(UPDATE_AUTH_STATE_POST, this.createFormData({role: this.merchantCode.coop})).then(res => {
        loading.close()
        if (this.vmResponseHandler(res)) {
          this.isUpdateState = false
          this.isToUpdate = res.data.company_change
          this.authStatu = res.data.company_status
          this.authFailedReason = res.data.data.review_mark
          this.$store.commit(AUTH_CHANGE, { authState: res.data.company_status })
          this.$store.commit(USER_ID_UPDATE, { ID: res.data.company_client_id })
          this.$store.commit(USER_KEY_UPDATE, { KEY: res.data.company_client_secret })
          if (this.authStatu === this.authCode.REJECT || this.authStatu === this.authCode.PASS) {
            this.form.name = res.data.data.name
            this.form.en_name = res.data.data.en_name
            this.form.addr = res.data.data.addr
            this.form.agency_code = res.data.data.agency_code
            this.form.tel = res.data.data.tel
            this.form.file_ids = res.data.data.file_ids
            this.picPath = res.data.data.file_ids
            this.isUploading = false
          }
          if (flag && res.data.company_status === this.authCode.PASS) {
            this.$http.post(COOP_AUTH_GET).then(res => {
              if (res.data.title) {
                this.$router.addRoutes(createRoutes(res.data.title))
                this.$store.commit(AUTH_UPDATE, { menus: generateMenus(res.data.title, coopMenuRouteMap) })
              }
            })
          }
        }
      }).catch(() => {
        this.vmMsgError('网络错误！')
      })
    },
    onBeforeUpload (file) {
      let sizeM = file.size / 1024 / 1024
      let imgArr = ['image/png', 'image/jpeg', 'image/jpg']
      if (!imgArr.includes(file.type) || sizeM > 2) {
        this.vmMsgError('请上传后缀为.jpg或.png或.jpeg且小于2M的图片')
        return false
      }
    },
    onUploadSuccess (response, file, fileList) {
      this.uploadProgress = ''
      // 上传
      if (response.statu === 0) {
        this.$router.push('/signin'); return
      }

      if (!response.status) {
        this.vmMsgError(response.msg); return
      }
      this.isUploading = false
      this.picPath = file.url
      this.form.file_ids = response.file_ids
    },
    onUploadProgress (event, file, fileList) {
      this.isUploading = true
      this.uploadProgress = '已上传' + event.percent + '%'
    },
    onUploadError (err, file, fileList) {
      this.isUploading = false
      this.vmMsgError(err)
    }
  }
}
</script>

<style scoped>
@media (min-width: 1366px) {
  /**大于笔记本屏幕 */
}
.content-container {
  padding: 5rem 5.83rem;
  color: #fff;
}
.panel {
  height: 17.5rem;
  background: #36393e;
  margin-top: 1.75rem;
  border-radius: 0.5rem;
}
.panel.flow {
  padding: 4.17rem;
  height: 24.25rem;
}
.big-font {
  font-size: 2.5rem;
  color: #3da0f4;
  display: inline-block;
  vertical-align: middle;
}
.small-font {
  display: inline-block;
  vertical-align: middle;
}

.small-font .cn {
  font-size: 1.5rem;
}
.small-font .en {
  font-size: 0.83rem;
  transform: scale(0.8);
  margin-left: -0.5rem;
  color: #808080;
  margin-top: 0.4rem;
}

.eligibility {
  text-align: center;
  height: 100%;
  display: flex;
  align-items: center;
}
.eligibility .right {
  flex: 1;
  text-align: right;
}
.eligibility.center {
  justify-content: center;
}
.eligibility i.iconfont {
  font-size: 6rem;
}
.eligibility i.pass {
  display: inline-block;
  font-size: inherit;
  width: 2.58rem;
  height: 2.58rem;
  border-radius: 50%;
  background-color: #2acba7;
  border: 0.17rem solid #36393e;
  position: absolute;
  bottom: -0.7rem;
  right: -0.8rem;
  line-height: 2.58rem;
  text-align: center;
}

.eligibility .eligi-icon,
.eligi-desc {
  display: inline-block;
  position: relative;
}
.eligibility .eligi-desc {
  text-align: left;
  padding-left: 2.5rem;
}

.eligibility .eligi-desc .name {
  font-size: 1.33rem;
}
.eligibility .eligi-desc .note {
  font-size: 1.17rem;
  line-height: 1.4;
  color: #9f9f9f;
  margin-top: 1.2rem;
}
.eligibility .eligi-desc .note-01 {
  width: 15.5rem;
}
.eligibility .eligi-desc .note-02 {
  width: 11rem;
}
.eligibility .eligi-desc .note-03 {
  width: 13rem;
}

.el-steps /deep/ .el-step__title.is-success,
.el-steps /deep/ .el-step__title.is-process,
.el-steps /deep/ .el-step__title.is-wait,
.el-steps /deep/ .el-step__head.is-success,
.el-steps /deep/ .el-step__head.is-error {
  color: #fff !important;
}
.el-steps /deep/ .el-step__head.is-error .el-step__icon.is-text,
.el-steps /deep/ .el-step__head.is-error .el-step__line {
  border: none;
  background: #f56c6c;
}
.el-steps /deep/ .el-step__head.is-success .el-step__icon.is-text,
.el-steps /deep/ .el-step__head.is-success .el-step__line {
  background: #2acba7;
  border: none;
}
.el-steps /deep/ .el-step__head.is-success .el-step__line-inner {
  width: 0 !important;
}
.el-steps /deep/ .el-step__head.is-process .el-step__icon.is-text {
  border: 0.17rem solid #2acba7;
  background: #36393e;
  color: transparent;
}
.el-steps /deep/ .el-step__head.is-process .el-step__line,
.el-steps /deep/ .el-step__head.is-wait .el-step__line,
.el-steps /deep/ .el-step__head.is-error .el-step__line {
  background-color: #808080;
}

.el-steps /deep/ .el-step__head.is-wait .el-step__icon.is-text {
  border: 0.17rem solid #808080;
  background: #36393e;
  color: transparent;
}

.el-steps /deep/ .el-step__description.is-success,
.el-steps /deep/ .el-step__description.is-process {
  color: #9f9f9f;
  font-size: 1.17rem;
}

.el-steps /deep/ .el-step:nth-child(2) .el-step__description {
  width: 9.4rem;
}
.el-steps /deep/ .el-step:nth-child(3) .el-step__description {
  width: 9.4rem;
}
.el-steps /deep/ .el-step:nth-child(4) .el-step__description {
  width: 11rem;
}

.step-operation {
  margin-top: 1.5rem;
}
.step-operation .el-step:first-child /deep/ .el-step__head,
.step-operation .el-step:nth-child(2) /deep/ .el-step__head .el-step__line,
.step-operation .el-step:nth-child(3) /deep/ .el-step__head .el-step__line,
.step-operation
  .el-step:nth-child(2)
  /deep/
  .el-step__head
  .el-step__icon
  .el-step__icon-inner,
.step-operation
  .el-step:nth-child(3)
  /deep/
  .el-step__head
  .el-step__icon
  .el-step__icon-inner,
.step-operation
  .el-step:nth-child(4)
  /deep/
  .el-step__head
  .el-step__icon
  .el-step__icon-inner,
.step-operation .el-step.auth:nth-child(2) /deep/ .el-step__head .el-step__icon,
.step-operation
  .el-step.review:nth-child(3)
  /deep/
  .el-step__head
  .el-step__icon,
.step-operation .el-step.key:nth-child(4) /deep/ .el-step__head .el-step__icon {
  display: none;
}

.step-operation .el-step:nth-child(2) /deep/ .el-step__head .el-step__icon {
  width: 7.8rem;
  height: 2.5rem;
  border: solid 1px #3da0f4;
  border-radius: 0;
  background: transparent;
}
.step-operation
  .el-step:nth-child(2)
  /deep/
  .el-step__head
  .el-step__icon::after {
  content: "提交认证";
}
.step-operation
  .el-step.edit:nth-child(2)
  /deep/
  .el-step__head
  .el-step__icon::after {
  content: "修改信息";
}
.step-operation
  .el-step:nth-child(2)
  /deep/
  .el-step__head
  .el-step__icon::after {
  color: #3da0f4;
  font-size: 1.17rem;
}
.step-operation
  .el-step:nth-child(2)
  /deep/
  .el-step__head
  .el-step__icon:active {
  border: none;
  background: #3da0f4;
}
.step-operation
  .el-step:nth-child(2)
  /deep/
  .el-step__head
  .el-step__icon:active::after {
  color: #fff;
}

.step-operation .el-step:nth-child(3) /deep/ .el-step__head .el-step__icon,
.step-operation .el-step:nth-child(4) /deep/ .el-step__head .el-step__icon {
  width: 7.8rem;
  height: 2.5rem;
  border: none;
  background: transparent;
}
.step-operation
  .el-step.loading:nth-child(3)
  /deep/
  .el-step__head
  .el-step__icon::after {
  content: "\E61E";
  position: absolute;
  left: 0;
}
.step-operation
  .el-step:nth-child(3)
  /deep/
  .el-step__head
  .el-step__icon::after,
.step-operation
  .el-step:nth-child(4)
  /deep/
  .el-step__head
  .el-step__icon::after {
  content: "刷新";
  color: #ff6870;
  position: absolute;
  left: 0;
}
.el-dialog__wrapper /deep/ .el-dialog {
  width: 50rem;
}
.el-dialog .note {
  position: absolute;
  top: 5rem;
  width: 100%;
  left: 0;
  text-align: center;
  color: #e36068;
  font-size: 1rem;
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
.mt30 {
  margin-top: 3rem;
}
</style>
