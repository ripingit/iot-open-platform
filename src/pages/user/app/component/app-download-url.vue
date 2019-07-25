<template>
  <el-dialog
    center
    :title="$t('iot_plat_download_address')"
    width="56rem"
    :visible.sync="isVisibleEnable"
    :close-on-click-modal="false"
    :before-close="closeDownloadDialog"
  >
    <el-form label-width="170px">
      <el-form-item
        v-for="(item, index) in data"
        :key="item.id"
        :label="$t(item.name)"
        class="form-row"
      >
        <el-input v-model="data[index].url" :placeholder="$t('iot_plat_input_download_addr')"></el-input>
      </el-form-item>
      <el-form-item class="form-row">
        <el-button type="primary" @click="closeDownloadDialog" class="btn-submit">{{$t('iot_plat_confirm')}}</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  props: {
    /**
     * 控制促销弹出层的显示隐藏
     */
    isVisibleEnable: {
      type     : Boolean,
      "default": false
    },
    /**
     * 应用商店数据
     */
    data: {
      type     : Array,
      required : true,
      "default": () => []
    }
  },
  methods: {
    closeDownloadDialog() {
      this.$emit("response", this.data);
    }
  }
};
</script>
<style scoped>
/* 英文 */
.el-dialog .el-form-item:nth-child(1) /deep/ .el-form-item__label,
.el-dialog .el-form-item:nth-child(2) /deep/ .el-form-item__label {
  line-height: 1.5rem;
}
</style>
