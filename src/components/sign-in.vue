<template>
  <div>
    <el-button type="primary" @click="signIn">登录</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    signIn () {
      this.$router.push('/layout')
    }
  }
}
</script>
