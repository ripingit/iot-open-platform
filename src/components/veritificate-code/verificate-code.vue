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
      codeBtnText: this.$t("iot_plat_get_vertify_code"),
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
      this.codeBtnText = this.$t("iot_plat_get_vertify_code")
      clearInterval(this.timer)
    },
    getCheckCode () {
      const SECOND = 1000
      const TIME = 59
      let time = TIME
      this.isSendCode = true
      this.codeBtnText = this.$t("iot_plat_resend_after", [ time ])
      this.timer = setInterval(() => {
        if (time <= 1) { this.reset(); return }
        time -= 1
        this.codeBtnText = this.$t("iot_plat_resend_after", [ time ])
      }, SECOND)

      this.$emit("emit-statu")
    }
  }
}
</script>
