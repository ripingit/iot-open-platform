<template>
  <div class="container">
    <el-row class="header">
      <el-col :xl="3" :lg="3" :md="3" :sm="3" :xs="5">
        <div class="brand">
          <i class="iconfont logo"></i><span class="brand-name">迈科物联</span>
        </div>
      </el-col>
      <el-col :xl="21" :lg="21" :md="21" :sm="21" :xs="19">
        <HeaderComponent></HeaderComponent>
      </el-col>
    </el-row>
    <el-row class="content">
      <el-col :xl="3" :lg="3" :md="3" :sm="3" :xs="5" class="left">
         <MenuComponent></MenuComponent>
      </el-col>
      <el-col :xl="21" :lg="21" :md="21" :sm="21" :xs="19" class="right">
         <ContentComponent></ContentComponent>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import MenuComponent from './menu.vue'
import HeaderComponent from './header.vue'
import ContentComponent from './content.vue'

export default {
  data () {
    return {}
  },
  components: { MenuComponent, HeaderComponent, ContentComponent },
  created () {
    this.$http.get(`/aaa/getdevice`).then(res => {
      // 返回mock.js 中模板格式数据
      console.log(res.data)
    }).catch(e => {
      console.error(`${e}`)
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* .el-container {
  height: 100%;
}
.el-aside {
  width: 18rem !important;
  overflow: hidden;
}
.el-main {
  padding: 0;
  overflow: hidden;
} */

.container {
  height: 100%;
}
.header{
  position: absolute;
  width: 100%;
  z-index: 999;
}

.content {
  display: flex;
  height: 100%;
  padding-top: 5rem;
}
.content .left {
  background: rgb(59, 63, 66);
}
.content .right {
  background: #292c31;
}

.brand {
    line-height: 5rem;
    background: #33373a;
    color: #fff;
    font-size: 2rem;
    text-align: center;
}
.brand .brand-name {
    margin-left: 1rem;
}
.brand i.logo {
    width: 2.6rem;
    height: 2.6rem;
    display: inline-block;
    background: url('../../assets/logo.png') no-repeat center center;
    background-size: cover;
    vertical-align: middle;;
}
</style>
