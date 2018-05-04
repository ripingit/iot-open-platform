<template>
    <div class="container">
        <el-row>
             <el-col :span="24">
                <el-menu
                    default-active="1"
                    background-color="#3b3f42"
                    text-color="rgba(255, 255, 255, 0.5)"
                    active-text-color="#ffd04b">
                    <el-menu-item index="1" @click="routeGo('/manage/home')">
                        <i class="el-icon-menu"></i>
                        <span slot="title">首页</span>
                    </el-menu-item>
                    <el-menu-item index="2" @click="routeGo('/manage/users')">
                        <i class="el-icon-menu"></i>
                        <span slot="title">用户管理</span>
                    </el-menu-item>
                    <el-menu-item index="3" @click="routeGo('/manage/category')">
                        <i class="el-icon-document"></i>
                        <span slot="title">设备类别</span>
                    </el-menu-item>
                    <el-menu-item index="4" @click="routeGo('/manage/model')">
                        <i class="el-icon-setting"></i>
                        <span slot="title">设备型号</span>
                    </el-menu-item>
                    <el-menu-item index="5" @click="routeGo('/manage/appVersion')">
                        <i class="el-icon-setting"></i>
                        <span slot="title">APP版本</span>
                    </el-menu-item>
                    <el-menu-item index="6" @click="routeGo('/manage/key')">
                        <i class="el-icon-setting"></i>
                        <span slot="title">KEY</span>
                    </el-menu-item>
                </el-menu>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {
    routeGo (path) {
      this.$router.push(path)
    }
  }
}
</script>

<style scoped>
.container, .el-row, .el-col, .el-menu {
    height: 100%
}
.el-menu {
    border-right: none;
}

.el-menu /deep/ .el-menu-item {
    padding-left: 2.5rem !important;
}
.el-menu /deep/ i {
    font-size: 2rem;
    margin-right: 2rem;
}
</style>
