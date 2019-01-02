<template>
  <div class="content-container">
    <el-row>
      <el-col :span="24">
        <p class="title-cn">生产数据</p>
        <p class="title-en">PRODUCT DATA</p>
      </el-col>
    </el-row>
    <el-row>
      <div class="table">
        <p>拉阿拉蕾，啊哈哈哈</p>
      </div>
    </el-row>
  </div>
</template>

<script>
import '@/assets/css/content.css'

import { COOP_PROD_DATA_QUERY } from '@/lib/api'
import _ from 'lodash'

export default{
  data () {
    return {
      loading: false,
      param: {
        company_name: '',
        addr: '',
        data_year: ''
      }
    }
  },
  created () {
    this.getProductData()
  },
  methods: {
    getProductData: _.debounce(function () {
      let data = this.createFormData(this.param)
      this.loading = true
      this.$http.post(COOP_PROD_DATA_QUERY, data).then(res => {
        if (this.vmResponseHandler(res)) {
        }
        this.loading = false
      }).catch(e => {
        this.loading = false
        this.vmMsgError('网络错误！')
      })
    }, 300)
  }
}
</script>
<style scoped>
</style>
