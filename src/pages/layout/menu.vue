<template>
  <div class="main">
    <div class="layout">
      <el-row>
        <el-col :span="24">
          <el-menu
            :default-active="activeMenu"
            background-color="#3b3f42"
            text-color="rgba(255, 255, 255, 0.5)"
            active-text-color="#ffd04b">
            <el-menu-item-group>
              <el-menu-item index="0" @click="routeGo('/manage/admin/home', $event)"  v-if="identity === identityCodes.ADMIN">
                <i class="iconfont icon-shouye"></i>
                <span slot="title">{{$t("iot_plat_home")}}</span>
              </el-menu-item>
              <template v-for="(item, index) in menus">
                <el-menu-item v-if="!item.children && item.auth" :key="index" :index="index + 1 + ''"  @click="routeGo(item.path, $event)">
                  <i class="iconfont" :class="item.icon"></i>
                  <span slot="title">{{$t(item.name)}}</span>
                </el-menu-item>
                <el-submenu v-else-if="item.children && item.auth" :index="index + 1 + ''" :key="index">
                  <template slot="title">
                    <i class="iconfont" :class="item.icon"></i>
                    <span>{{$t(item.name)}}</span>
                  </template>
                  <el-menu-item v-for="(obj, num) in item.children" v-if="obj.auth" :key="num" :index="(index + 1) + '-' + num" @click="routeGo(obj.path, $event)">
                    <span slot="title">{{$t(obj.name)}}</span>
                  </el-menu-item>
                </el-submenu>
              </template>
            </el-menu-item-group>
          </el-menu>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { MENU_UPDATE } from "@/store/mutations-type"
export default {
  created () {
    this.$store.commit(MENU_UPDATE, { highlightMenu: this.$route.params.index })
  },
  computed: {
    identity () {
      return this.$store.getters.getUserIdentity
    },
    activeMenu () {
      return this.$store.getters.getHighlightMenu
    },
    menus () {
      return this.$store.getters.getAuthMenu
    },
    identityCodes () {
      return this.identityCode
    }
  },
  methods: {
    routeGo (path, $event) {
      this.$store.commit(MENU_UPDATE, { highlightMenu: $event.index })
      this.$router.push(`${path}/${$event.index}`)
      this.$emit("menu-toggle")
    }
  }
}
</script>

<style scoped>
@media (max-width:1367px) { /**小于笔记本屏幕 */
  .el-menu {
    border-right: none;
    margin-right: -0.08rem;
  }
  .el-menu /deep/ .el-menu-item,
  .el-menu /deep/ .el-submenu__title {
      padding-left: 1rem !important;
  }
  .el-menu /deep/ .el-submenu__title+.el-menu .el-menu-item {
    padding-left: 5.08rem !important;
  }
  .el-menu /deep/ i.iconfont {
      font-size: 2rem;
      margin-right: 1rem;
  }
  .main {
    padding-bottom: 4000px;
    margin-bottom: -4000px;
    background: #3b3f42;
    height: 100%;
    overflow: auto;
  }
  .el-row, .el-col, .el-menu {
      height: auto;
  }
}

@media (min-width:1367px) { /**大于笔记本屏幕 */
  .el-row, .el-col, .el-menu {
    height: 100%;
  }
  .main {
    height: 100%;
    overflow: hidden;
  }
  .layout {
    overflow-y: scroll;
    overflow-x: hidden;
    height: 100%;
    margin-right: -1.7rem;
  }
  .el-menu {
      border-right: none;
  }
  .el-menu /deep/ .el-submenu__icon-arrow {
    right: 1.33rem;
    font-size: 1.4rem;
  }
  .el-menu /deep/ .el-menu-item,
  .el-menu /deep/ .el-submenu__title {
      padding-left: 2.67rem !important;
  }
  .el-menu /deep/ .el-submenu__title+.el-menu .el-menu-item {
    padding-left: 7.08rem !important;
  }
  .el-menu /deep/ i.iconfont {
      font-size: 2rem;
      margin-right: 2rem;
  }
}
</style>
