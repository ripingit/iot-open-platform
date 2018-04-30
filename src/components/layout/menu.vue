<template>
    <div class="container">
        <el-row>
             <el-col :span="24">
                <ul class="brand">
                    <li>
                        <i class="el-icon-picture"></i>
                        <span class="brand-name">迈科物联</span>
                    </li>
                </ul>
                <el-menu
                    default-active="1"
                    background-color="#545c64"
                    text-color="#fff"
                    active-text-color="#ffd04b">
                    <el-menu-item index="1" @click="routeGo('/layout/home')">
                        <i class="el-icon-menu"></i>
                        <span slot="title">首页</span>
                    </el-menu-item>
                    <el-menu-item index="2" @click="routeGo('/layout/users')">
                        <i class="el-icon-menu"></i>
                        <span slot="title">用户管理</span>
                    </el-menu-item>
                    <el-menu-item index="3" @click="routeGo('/layout/category')">
                        <i class="el-icon-document"></i>
                        <span slot="title">设备类别</span>
                    </el-menu-item>
                    <el-menu-item index="4" @click="routeGo('/layout/model')">
                        <i class="el-icon-setting"></i>
                        <span slot="title">设备型号</span>
                    </el-menu-item>
                    <el-menu-item index="5" @click="routeGo('/layout/appVersion')">
                        <i class="el-icon-setting"></i>
                        <span slot="title">APP版本</span>
                    </el-menu-item>
                    <el-menu-item index="6" @click="routeGo('/layout/key')">
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
.brand {
    line-height: 3rem;
    background: rgb(53, 57, 62);
    color: #fff;
    font-size: 1.6rem;
    text-align: center;
}
.brand .brand-name {
    margin-left: 1rem;
}
</style>
