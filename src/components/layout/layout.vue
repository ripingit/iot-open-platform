<template>
  <div class="container">
    <el-row class="header">
      <el-col :xl="3" :lg="4">
        <div class="brand">
          <i class="iconfont icon-wulianwang logo"></i><span class="brand-name">迈科物联</span>
        </div>
      </el-col>
      <el-col :xl="21" :lg="20">
        <HeaderComponent v-on:menu-toggle="menuToggle"></HeaderComponent>
      </el-col>
    </el-row>
    <el-row class="content">
      <el-col :xl="3" :lg="4" class="left">
        <MenuComponent class="position" :class="isShowMenu ? '' : 'menu'" v-on:menu-toggle="menuToggle"></MenuComponent>
      </el-col>
      <el-col :xl="21" :lg="20" class="right">
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
    return {
      isShowMenu: false
    }
  },
  components: { MenuComponent, HeaderComponent, ContentComponent },
  methods: {
    menuToggle () {
      this.isShowMenu = !this.isShowMenu
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

@media (max-width:1200px) {
  .menu {
    display: none;
  }
  .position {
    z-index: 99;
    position: absolute;
    width: 100%;
  }
}

@media (max-width:1366px) { /**小于笔记本屏幕 */
  .container {
    width: 1366px;
  }
  .brand {
    line-height: 4.67rem;
    background: #33373a;
    color: #fff;
    font-size: 1.33rem;
    text-align: center;
    margin-right: -0.08rem;
  }
  .brand .brand-name {
    margin-left: 1rem;
    vertical-align: middle;
  }
  .brand i.logo {
    font-size: 1.8rem;
    display: inline-block;
    vertical-align: middle;
  }
  .content {
    top: -0.08rem;
  }
}

@media (min-width:1366px) { /**大于笔记本屏幕 */
  .header{
    width: 100%;
  }
  .container {
    overflow: hidden;
    height: 100%;
  }
  .header{
    position: absolute;
    z-index: 999;
  }
  .brand {
    line-height: 4.67rem;
    background: #33373a;
    color: #fff;
    font-size: 1.33rem;
    text-align: center;
  }
  .brand .brand-name {
    margin-left: 1rem;
    vertical-align: middle;
  }
  .brand i.logo {
    font-size: 1.8rem;
    display: inline-block;
    vertical-align: middle;;
  }
  .content {
    display: flex;
    height: 100%;
    padding-top: 4.67rem;
  }
  .content .left {
    background: rgb(59, 63, 66);
  }
  .content .right {
    background: #292c31;
  }
}
</style>
