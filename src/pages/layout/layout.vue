<template>
  <div class="container">
    <el-row class="header">
      <el-col :xl="3" :lg="3">
        <div class="brand">
          <i class="iconfont icon-wulianwang logo"></i><span class="brand-name">{{$t("iot_plat_mktech")}}</span>
        </div>
      </el-col>
      <el-col :xl="21" :lg="21">
        <HeaderComponent v-on:menu-toggle="menuToggle"></HeaderComponent>
      </el-col>
    </el-row>
    <transition name="bounce" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import HeaderComponent from "./header.vue"

export default {
  components: { HeaderComponent },
  methods   : {
    menuToggle () {
      this.isShowMenu = !this.isShowMenu
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  background: #292c31;
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
}
</style>
