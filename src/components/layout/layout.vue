<template>
  <el-container>
    <el-aside>
      <MenuComponent></MenuComponent>
    </el-aside>
    <el-main>
      <HeaderComponent></HeaderComponent>
      <ContentComponent></ContentComponent>
    </el-main>
  </el-container>
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
.el-container {
  height: 100%;
}
.el-aside {
  width: 15rem !important;
  overflow: hidden;
}
.el-main {
  padding: 0;
}
</style>
