<template>
  <el-dialog
    center
    title="下载地址"
    width="56rem"
    :visible.sync="isVisibleEnable"
    :close-on-click-modal="false"
    :before-close="closeDownloadDialog"
  >
    <el-form label-width="150px">
      <el-form-item
        v-for="(item, index) in data"
        :key="item.id"
        :label="item.name"
        class="form-row"
      >
        <el-input v-model="data[index].url" placeholder="请输入下载地址"></el-input>
      </el-form-item>
      <el-form-item class="form-row">
        <el-button type="primary" @click="closeDownloadDialog" class="btn-submit">确定</el-button>
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
      type: Boolean,
      default: false
    },
    /**
     * 应用商店数据
     */
    data: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  methods: {
    closeDownloadDialog() {
      this.$emit("response", this.data);
    }
  }
};
</script>
