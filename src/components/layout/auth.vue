<template>
  <transition name="bounce" mode="out-in">
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
          <el-steps :active="1" process-status="process" finish-status="success">
            <el-step title="注册迈科账号" description="请牢记用户名和密码"></el-step>
            <el-step title="申请认证" description="提交相关营业执照申请迈科智能认证"></el-step>
            <el-step title="等待审核" description="申请将在24小时之内反馈结果"></el-step>
            <el-step title="申请KEY" description="认证可查看到独有的KEY请牢记"></el-step>
          </el-steps>
          <el-steps class="step-operation">
            <el-step></el-step>
            <el-step @click.native="showDialog"></el-step>
            <el-step></el-step>
            <el-step></el-step>
          </el-steps>
        </el-col>
      </el-row>

      <el-dialog title="提交审核" :visible.sync="isDialogVisible" center>
        <p class="note">* 所有填写的信息要与营业执照上保持一致</p>
        <el-row class="form-row">
          <el-col :span="2" :sm="3" class="form-label">公司名</el-col>
          <el-col :span="20" :sm="18" class="form-input">
            <el-input v-model="form.name" auto-complete="off" placeholder="请输入公司全称"></el-input>
          </el-col>
          <el-col :span="2" :sm="3" class="form-tip">*</el-col>
        </el-row>
        <el-row class="form-row">
          <el-col :span="2" :sm="3" class="form-label">证件号码</el-col>
          <el-col :span="20" :sm="18" class="form-input">
            <el-input v-model="form.name" auto-complete="off" placeholder="请输入单位证件号码"></el-input>
          </el-col>
          <el-col :span="2" :sm="3" class="form-tip">*</el-col>
        </el-row>
        <el-row class="form-row">
          <el-col :span="2" :sm="3" class="form-label">证件住所</el-col>
          <el-col :span="20" :sm="18" class="form-input">
            <el-input v-model="form.name" auto-complete="off" placeholder="请输入证件所在地"></el-input>
          </el-col>
          <el-col :span="2" :sm="3" class="form-tip">*</el-col>
        </el-row>
        <el-row class="form-row">
          <el-col :span="2" :sm="3" class="form-label">通讯地址</el-col>
          <el-col :span="20" :sm="18" class="form-input">
            <el-input v-model="form.name" auto-complete="off" placeholder="请输入证件通讯地址"></el-input>
          </el-col>
          <el-col :span="2" :sm="3" class="form-tip">*</el-col>
        </el-row>
        <el-row class="form-row">
          <el-col :span="2" :sm="3" class="form-label">联系电话</el-col>
          <el-col :span="20" :sm="18" class="form-input">
            <el-input v-model="form.name" auto-complete="off" placeholder="请输入联系电话"></el-input>
          </el-col>
          <el-col :span="2" :sm="3" class="form-tip">*</el-col>
        </el-row>
        <el-row class="form-row">
          <el-col :span="2" :sm="3" class="form-label">营业执照</el-col>
          <el-col :span="20" :sm="18" class="form-input">
            <span class="form-img-cert">
            </span>
            <div class="form-btn-upload">
              <el-upload
                action="https://jsonplaceholder.typicode.com/posts/">
                <el-button class="btn-upload" size="small" type="primary">上传</el-button>
              </el-upload>
            </div>
          </el-col>
          <el-col :span="2" :sm="3"></el-col>
        </el-row>
        <el-row class="form-row">
          <el-col :span="2" :sm="3" class="form-label">&nbsp;</el-col>
          <el-col :span="20" :sm="18" class="form-input">
            <el-checkbox v-model="pwChecked">同意 <a href="" style="color: #3193e6">《迈科智能用户协议》</a></el-checkbox>
          </el-col>
          <el-col :span="2" :sm="3"></el-col>
        </el-row>
        <el-row class="form-row">
          <el-col :span="2" :sm="3" class="form-label">&nbsp;</el-col>
          <el-col :span="20" :sm="18" class="form-input">
            <el-button class="btn-submit" type="primary" >提交</el-button>
          </el-col>
          <el-col :span="2" :sm="3"></el-col>
        </el-row>
      </el-dialog>
    </div>
  </transition>
</template>

<script>
export default {
  data () {
    return {
      isDialogVisible: false,
      formLabelWidth: '120px',
      form: {
        name: '',
        region: '区域一'
      }
    }
  },
  methods: {
    showDialog () {
      this.isDialogVisible = true
    }
  }
}
</script>

<style scoped>
@media (min-width: 1366px) { /**大于笔记本屏幕 */

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
    justify-content:center;
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

  .eligibility .eligi-icon, .eligi-desc {
    display: inline-block;
    position: relative;
  }
  .eligibility .eligi-desc{
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
  .eligibility .eligi-desc .note-01 { width: 15.5rem; }
  .eligibility .eligi-desc .note-02 { width: 11rem; }
  .eligibility .eligi-desc .note-03 { width: 13rem; }

  .el-steps /deep/ .el-step__title.is-success,
  .el-steps /deep/ .el-step__title.is-process,
  .el-steps /deep/ .el-step__title.is-wait{
    color: #fff !important;
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

  .step-operation { margin-top: 1.5rem; }
  .step-operation .el-step:first-child /deep/ .el-step__head,
  .step-operation .el-step:nth-child(2) /deep/ .el-step__head .el-step__line,
  .step-operation .el-step:nth-child(3) /deep/ .el-step__head .el-step__line,
  .step-operation .el-step:nth-child(2) /deep/ .el-step__head .el-step__icon .el-step__icon-inner,
  .step-operation .el-step:nth-child(3) /deep/ .el-step__head .el-step__icon .el-step__icon-inner,
  .step-operation .el-step:nth-child(4) /deep/ .el-step__head .el-step__icon .el-step__icon-inner {
    display: none;
  }

  .step-operation .el-step:nth-child(2) /deep/ .el-step__head .el-step__icon {
    width: 7.8rem;
    height: 2.5rem;
    border: solid 1px #3da0f4;
    border-radius: 0;
    background: transparent;
  }
  .step-operation .el-step:nth-child(2) /deep/ .el-step__head .el-step__icon::after {
    content: '提交认证';
    color: #3da0f4;
    font-size:1.17rem;
  }
  .step-operation .el-step:nth-child(2) /deep/ .el-step__head .el-step__icon:active {
    border: none;
    background: #3da0f4;
  }
  .step-operation .el-step:nth-child(2) /deep/ .el-step__head .el-step__icon:active::after {
    color: #fff;
  }

  .step-operation .el-step:nth-child(3) /deep/ .el-step__head .el-step__icon,
  .step-operation .el-step:nth-child(4) /deep/ .el-step__head .el-step__icon {
    width: 7.8rem;
    height: 2.5rem;
    border: none;
    background: transparent;
  }

  .step-operation .el-step:nth-child(3) /deep/ .el-step__head .el-step__icon::after,
  .step-operation .el-step:nth-child(4) /deep/ .el-step__head .el-step__icon::after {
    content: '认证后查看';
    color: #ff6870;
    position: absolute;
    left: 0;
  }
  .el-dialog .note {
    position: absolute;
    top: 48px;
    width: 100%;
    left: 0;
    text-align: center;
    color: #e36068;
    font-size: 1rem;
  }

  .el-dialog .el-dialog__body {
    margin-top: 3rem;
  }

  .el-dialog .form-label {
    line-height: 3rem;
    color: #fff;
    text-align: right;
    font-size: 1.17rem;
  }
  .el-dialog .form-input {
    padding-left: 2.2rem;
  }

  .el-dialog .form-row {
    margin-top: 0.5rem;
  }
  .el-dialog .form-tip {
    color: red;
    line-height: 3rem;
    padding-left: 1.6rem;
  }
  .el-dialog .form-img-cert {
    display: inline-block;
    width: 14rem;
    height: 8rem;
    background: #636363;
    vertical-align: middle;
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
  .btn-submit {
    width: 100%;
    border-radius: 0;
    background: #1f7ecf;
    border: none;
  }
  .el-input /deep/ input {
    background: #5e6165;
  }
  .container /deep/ .el-dialog {
    background: #36393e;
  }
  .container /deep/ .el-dialog .el-dialog__body {
    padding: 35px 25px 30px;
  }
  .container /deep/ .el-dialog .el-dialog__title,
  .container /deep/ .el-dialog .el-form-item__label {
    color: #fff;
  }
  .mt30 {
    margin-top: 3rem;
  }
</style>
