<template>
  <div>
    <h3 style="text-align:center">测试页面</h3>
    <UploadComponent
      ref="upload"
      :path="options.path"
      :accept="options.accept"
      :size="options.size"
      :condition="options.condition" @response="getUploadResult"></UploadComponent>
  </div>
</template>

<script>
import UploadComponent from './upload.vue'
export default {
  components: {UploadComponent},
  data () {
    return {
      options: {
        path: '../manageTest/index.php?m=Home&c=Rom&a=putObject',
        size: 2,
        accept: ['.jpg', '.png'],
        condition: `格式为 jpg 且小于2M`
      }
    }
  },
  methods: {
    getUploadResult (res) {
      console.log(res)
    }
  }
}
</script>

<style scoped>

</style>
