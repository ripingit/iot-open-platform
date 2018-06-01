<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-table
          :data="data"
          v-loading="loading">
          <el-table-column
            v-if="options.hasSelection"
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            v-if="options.hasNumber"
            type="index"
            label="编号"
            width="80">
          </el-table-column>
          <template v-for="(column, index) in options.columns">
            <component v-if="column.component" :is="column.component" :config="column" :key="index"></component>
            <el-table-column v-else v-bind="column" :key="index"></el-table-column>
          </template>
          <slot v-if="options.slot.del" :name="options.slot.del"></slot>
          <slot v-if="options.slot.edit" :name="options.slot.edit"></slot>
          <slot v-if="options.slot.review" :name="options.slot.review"></slot>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: ['options', 'data'],
  data () {
    return {
      config: {
        columns: [], // 通用列数据
        hasNumber: true, // 是否有序号列
        hasSelection: true, // 是否有选择列
        slot: { // 操作占位
          del: 'del',
          edit: 'edit'
        }
      }
    }
  }
}
</script>

<style>
.wait {
  color: #b3b3b3;
}
.pass {
  color: #2acba7;
}
.reject {
  color: #ff5d66;
}
</style>
