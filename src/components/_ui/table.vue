<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-table
          :data="data"
          v-loading="options.loading"
          @selection-change="handleSelectionChange">
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
          <template  v-for="(column, index) in options.columns">
            <el-table-column v-bind="column" :key="index">
              <template slot-scope="scope">
                <span v-if="column.render">{{ column.render(scope.row[column.prop]) }}</span>
                <span v-else-if="column.slotName">
                  <slot :name="column.slotName" :row="scope.row"></slot>
                </span>
                <span v-else>{{ scope.row[column.prop] }}</span>
              </template>
            </el-table-column>
          </template>
          <slot name="handler"></slot>
        </el-table>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-pagination
          v-if="options.pageOptions && options.pageOptions.total !== 0"
          @size-change="handlerEmit"
          @current-change="handlerEmit"
          :page-size="options.pageOptions.pageSize"
          :total="options.pageOptions.total"
          layout="prev, pager, next, jumper">
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: ['options', 'data'],
  data () {
    return {
      // config: {
      //   columns: [{
      //     prop: '',
      //     width: '',
      //     label: '',
      //     render: function () {} // 将数据转换成需要的样子，如将1转成成功字样
      //   }], // 通用列数据
      //   loading: false,
      //   hasNumber: true, // 是否有序号列
      //   hasSelection: true, // 是否有选择列
      //   pageOptions: {
      //     currentPage: 1,
      //     pageSize: 0,
      //     total: 0
      //   }
      // }
    }
  },
  methods: {
    handleSelectionChange (selectedArr) {
      this.$emit('selection', selectedArr)
    },

    handlerEmit (page) {
      this.options.pageOptions.currentPage = page
      this.$emit('page-change')
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
