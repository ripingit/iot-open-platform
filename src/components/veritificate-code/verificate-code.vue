<template>
  <el-button
    type="primary"
    :disabled="isSendCode"
    :class="isSendCode ? 'disabled' : ''"
    @click="getCheckCode">{{codeBtnText}}</el-button>
</template>

<script>
export default {
  props: [
    "isReset"
  ],
  data () {
    return {
      codeBtnText: "获取验证码",
      isSendCode : false,
      timer      : null
    }
  },
  watch: {
    isReset () {
      this.reset()
    }
  },
  methods: {
    reset () {
      this.isSendCode = false
      this.codeBtnText = "获取验证码"
      clearInterval(this.timer)
    },
    getCheckCode () {
      const SECOND = 1000
      const TIME = 59
      let time = TIME
      this.isSendCode = true
      this.codeBtnText = `${time}秒后可重发`
      this.timer = setInterval(() => {
        if (time <= 1) { this.reset(); return }
        time -= 1
        this.codeBtnText = `${time}秒后可重发`
      }, SECOND)

      this.$emit("emit-statu")
    }
  }
}
</script>
