<template>
  <div></div>
</template>
<script>
export default {
  created () {
    console.log(this.terminal())
  },
  methods: {
    terminal () {
      let u = navigator.userAgent
      // let app = navigator.appVersion
      return {
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
        iPhone: u.indexOf('iPhone') > -1,
        iPad: u.indexOf('iPad') > -1
      }
    }
  }
}
</script>
