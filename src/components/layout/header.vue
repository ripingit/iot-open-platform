<template>
  <div class="container">
    <el-row>
      <el-col :xl="8" :lg="8" :md="8" :sm="8" :xs="10">&nbsp;</el-col>
      <el-col :xl="8" :lg="8" :md="8" :sm="8" :xs="4">
        <el-input
          placeholder="请输入关键字进行搜索"
          v-model="keyword">
          <i slot="prefix" class="iconfont icon-sousuo"></i>
        </el-input>
      </el-col>
      <el-col :xl="8" :lg="8" :md="8" :sm="8" :xs="10">
        <div class="info">
          <i class="iconfont icon-xiaoxi tips" aria-hidden="true"></i>
          <i class="iconfont icon-bangzhu" aria-hidden="true"></i>
          <a @click="routeGo">135****2561</a>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      keyword: ''
    }
  },
  methods: {
    routeGo () {
      this.$router.push('/manage/authention')
    }
  }
}
</script>

<style scoped>
.container {
    line-height: 5rem;
    background: #3b3f42;
    color: #fff;
    width: auto;
}

.el-input /deep/ input::-webkit-input-placeholder { color: #808080; }
.el-input /deep/ input::-moz-placeholder { color: #808080; }
.el-input /deep/ input:-ms-input-placeholder { color:#808080; }
.el-input /deep/ input {
  border: none;
  background: #3b3f42;
  border-bottom: 1px solid #808080;
}
.info {
  text-align: right;
}
.info a {
  border-left: 1px solid #8e8e8e;
  padding: 0 6rem;
  cursor: pointer;
}
.info i {
  margin-right: 4.4rem;
  cursor: pointer;
  position: relative;
  opacity: 0.5;
  font-size: 2.2rem;
  vertical-align: middle;
}
.info .tips::after {
  content: '';
  width: 0px;
  height: 0;
  border-radius: 50%;
  border: 3px solid #d60707;
  position: absolute;
  top: 0.2rem;
  right: 0rem;
}
</style>
