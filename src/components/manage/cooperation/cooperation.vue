<template>
  <div class="main">
    <el-row>
      <el-col :span="24">
          <p class="title-cn">合作</p>
          <p class="title-en">COOPERATION</p>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="table">
          <el-row>
            <el-col :span="24">
              <el-date-picker
                v-model="value6"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
              <el-select v-model="value" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-button class="btn-search" type="primary">查询</el-button>
              <el-button class="btn-circle-delete" type="danger" icon="el-icon-delete" circle></el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-table
                :data="tableData"
                style="width: 100%">
                <el-table-column
                  type="selection"
                  width="55">
                </el-table-column>
                <el-table-column
                  prop="date"
                  label="编号"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="公司名称"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="固件版本">
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="联系方式">
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="认证ID">
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="认证KEY">
                </el-table-column>
                <el-table-column
                  prop="address"
                  label="注册时间">
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 管理员
export default {
  data () {
    return {
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value6: '',
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  }
}
</script>

<style scoped>
.main {
  padding: 1.6rem 2.5rem;
  color: #fff;
}

.title-cn {
  font-size: 1.8rem;
}
.title-en {
  font-size: 1rem;
  color: #808080;
  margin-top: 0.33rem;
}
.table {
  padding: 2.5rem 4.7rem;
  background: #36393e;
  border-radius: 6px;
  margin-top: 1.33rem;
}
.el-table {
  margin-top: 2.9rem;
}

.el-select, .btn-search {
  margin-left: 1.5rem;
}
.btn-circle {
  background: rgb(94, 94, 94);
  color: #fff;
  opacity: 0.6;
  border: none;
}
.btn-circle-delete {
  width: 4.5rem;
  height: 4.5rem;
  position: absolute;
  top: -4.67rem;
  right: 6.63rem;
}
</style>
