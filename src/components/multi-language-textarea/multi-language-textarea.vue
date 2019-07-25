<template>
  <div>
    <el-select :placeholder="$t('iot_plat_select_lang_please')" v-model="lang">
      <el-option
        v-for="(item, index) in multiLanguage"
        :key="index"
        :label="item.language_desc"
        :value="item.language"></el-option>
    </el-select>
    <div class="split-line"></div>
    <el-input type="textarea" :rows="6" :placeholder="$attrs.placeholder" v-model="value[lang]"></el-input>
    <span class="form-tip" v-if="required">*</span>
  </div>
</template>

<script>

export default {
  props: {
    value: {
      type    : Object,
      required: true
    },
    /**
     * 判断是否显示表示必填的红色星号
     */
    required: {
      type     : Boolean,
      "default": true
    }
  },
  data () {
    return { 
      lang         : "CN",
      multiLanguage: this.$store.getters.getLanguages
    }
  }
}
</script>

<style scoped>
.split-line {
  width: 23rem;
  height: 1px;
  background: #797979;
  margin-left: 1rem;
  position: absolute;
  z-index: 1;
}
</style>
