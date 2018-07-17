<template>
  <div class="content-container">
    <el-row>
      <el-col :span="24">
        <p class="title-cn">修改密码</p>
        <p class="title-en">CHANGE PASSWORD</p>
      </el-col>
    </el-row>
    <div class="panel">
      <el-form :model="formData" status-icon ref="editForm" :rules="rules" label-position="right" label-width="100px">
        <el-form-item label="新密码" prop="new_pass">
          <el-input
            type="password"
            placeholder="请输入新密码"
            v-model="formData.new_pass"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmNewPass">
          <el-input
            type="password"
            placeholder="请再次输入新密码"
            v-model="formData.confirmNewPass"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="vcode">
          <el-input
            placeholder="请输入验证码"
            v-model="formData.vcode"
            clearable
            style="width: 59%">
          </el-input>
          <CheckCodeComponent style="width: 39.7%;height: 3.33rem;" :isReset="toResetBtnCode" v-on:emit-statu="getCheckCode"></CheckCodeComponent>
        </el-form-item>
        <el-form-item class="form-row" style="margin-top: 2rem">
          <el-button type="primary" class="btn-submit" @click="changePass">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import CheckCodeComponent from '../_ui/verificate-code.vue'
import '@/assets/css/content.css'
import { CODE_POST, CHANGE_PASS_POST } from '../../lib/api.js'

export default {
  data () {
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.formData.new_pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    let validateIsEmpty = (rule, value, callback) => {
      if (value === '') {
        if (rule.field === 'vcode') {
          callback(new Error('请输入验证码'))
        } else if (rule.field === 'new_pass' || rule.field === 'confirmNewPass') {
          callback(new Error('请输入密码'))
        }
      }
      callback()
    }
    return {
      formData: {
        new_pass: '',
        confirmNewPass: '',
        vcode: ''
      },
      toResetBtnCode: false,
      rules: {
        new_pass: [
          { validator: validateIsEmpty, trigger: 'blur' },
          { min: 8, max: 30, message: '长度在 8 到 30 个字符', trigger: 'blur' }
        ],
        confirmNewPass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        vcode: [
          { validator: validateIsEmpty, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    document.body.addEventListener('keydown', this.keyCodeDown, false)
  },
  beforeDestroy () {
    document.body.removeEventListener('keydown', this.keyCodeDown, false)
  },
  components: { CheckCodeComponent },
  methods: {
    keyCodeDown (e) {
      if (e.keyCode === 13) {
        this.changePass()
      }
    },
    getCheckCode () {
      let data = this.createFormData({
        type: 2
      })
      this.$http.post(CODE_POST, data).then(res => {
        if (this.vmResponseHandler(res)) {
          this.vmMsgSuccess('验证码已发送！')
        } else {
          this.toResetBtnCode = true
        }
      }).catch((e) => {
        this.vmMsgError('网络错误！')
        this.toResetBtnCode = true
      })
    },
    changePass () {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          this.$http.post(CHANGE_PASS_POST, this.createFormData(this.formData)).then(res => {
            if (this.vmResponseHandler(res)) {
              this.vmMsgSuccess('修改成功！')
              this.$router.push('/manage/user/home/1')
            }
          }).catch((e) => {
            this.vmMsgError('网络错误！')
          })
        }
      })
    }
  }
}
</script>

<style scoped>
  .disabled {
     background: #949494 !important;
  }
  .panel {
    width: 35rem;
    margin: 10rem auto;
  }
</style>
