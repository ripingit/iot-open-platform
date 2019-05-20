<template>
  <div>
    <el-select placeholder="请选择语言" v-model="lang">
      <el-option
        v-for="(item, index) in multiLanguage"
        :key="index"
        :label="item.name"
        :value="item.id"></el-option>
    </el-select>
    <div class="split-line"></div>
    <el-input type="textarea" :rows="6" :placeholder="$attrs.placeholder" v-model="value[lang]"></el-input>
    <span class="form-tip" v-if="required">*</span>
  </div>
</template>

<script>
import { multiLanguage } from "@/lib/const";

const mixins = {
  data () {
    return { multiLanguage: multiLanguage }
  }
}

export default {
  mixins: [ mixins ],
  props : {
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
    return { lang: "CN" }
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
