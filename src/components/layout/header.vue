<template>
  <div class="header-container">
    <el-row>
      <el-col :span="8">
        <div class="menu">
          <i class="menu-icon el-icon-menu" @click="toggleMenu"></i>
        </div>
      </el-col>
      <el-col :span="8">
        <el-input placeholder="请输入关键字进行搜索" v-model="keyword">
          <i slot="prefix" class="iconfont icon-sousuo"></i>
        </el-input>
      </el-col>
      <el-col :span="8">
        <div class="info">
          <i class="iconfont icon-xiaoxi tips" aria-hidden="true"></i>
          <i class="iconfont icon-bangzhu" aria-hidden="true"></i>
          <div class="user-control">
            <p v-on:click.stop="showSetPanel">{{userAccount}}</p>
            <transition name="slide">
              <ul class="control-panel" v-show="isPanelShow">
                <li v-if="identity === identityCode.COOP" @click="routeGo('/manage/coopApply')">合作</li>
                <li @click="routeGo(resetPassPath)">修改密码</li>
                <li @click="signOut">退出</li>
              </ul>
            </transition>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ADMIN_SIGN_OUT_POST, SIGN_OUT_POST } from "../../lib/api.js";
import { validatePhone, validateEmail } from "../../lib/validate.js";
import {
  MENU_UPDATE,
  IDENTITY_UPDATE,
  AUTH_UPDATE,
  AUTH_CHANGE,
  MENU_TOGGLE_UPDATE
} from "@/store/mutations-type";
export default {
  data() {
    return {
      identity: this.$store.getters.getUserIdentity,
      keyword: "",
      isPanelShow: false,
      userAccount: ""
    };
  },
  computed: {
    resetPassPath() {
      return this.identity === this.identityCode.ADMIN
        ? "/manage/admin/resetAdminPass"
        : "/manage/user/resetPass";
    }
  },
  created() {
    document.addEventListener("click", () => {
      this.isPanelShow = false;
    });

    let account = localStorage["_acd"];
    let start = account.slice(0, 3);
    if (validatePhone(account)) {
      let end = account.slice(8);
      this.userAccount = start + "****" + end;
    } else if (validateEmail(account)) {
      let index = account.indexOf("@");
      let end = account.slice(index);
      let length = account.slice(3, index + 1).length;
      this.userAccount = start + "*".repeat(length) + end;
    } else {
      this.userAccount = account;
    }
  },
  methods: {
    toggleMenu() {
      let flag = this.$store.getters.getToggleMenu;
      this.$store.commit(MENU_TOGGLE_UPDATE, { toggleMenu: !flag });
    },

    showSetPanel() {
      this.isPanelShow = !this.isPanelShow;
    },
    routeGo(route) {
      this.$store.commit(MENU_UPDATE, { highlightMenu: "-1" });
      this.$router.push(route);
    },
    signOut() {
      this.vmConfirm({
        msg: "确认要退出登录吗？",
        confirmCallback: () => {
          let url =
            this.identity === this.identityCode.ADMIN
              ? ADMIN_SIGN_OUT_POST
              : SIGN_OUT_POST;
          this.$http
            .post(url)
            .then(res => {
              if (this.vmResponseHandler) {
                this.$router.push("/signin");
                this.$store.commit(IDENTITY_UPDATE, { identity: "-1" });
                this.$store.commit(AUTH_UPDATE, { menus: [] });
                this.$store.commit(AUTH_CHANGE, { authState: -1 });

                this.vmMsgSuccess("退出成功！");
              }
            })
            .catch(() => {
              this.vmMsgError("程序错误！");
            });
        }
      });
    }
  }
};
</script>

<style scoped>
@media (max-width: 1200px) {
  .menu-icon {
    font-size: 2rem;
    padding-left: 2.5rem;
    display: inline-block !important;
  }
}

.menu {
  display: -webkit-inline-box;
}
.menu-icon {
  display: none;
}
.header-container {
  line-height: 4.67rem;
  background: #3b3f42;
  color: #fff;
  width: auto;
}

.el-input /deep/ input::-webkit-input-placeholder {
  color: #808080;
}
.el-input /deep/ input::-moz-placeholder {
  color: #808080;
}
.el-input /deep/ input:-ms-input-placeholder {
  color: #808080;
}
.el-input /deep/ input {
  border: none;
  background: #3b3f42;
  border-bottom: 1px solid #808080;
}
.info {
  text-align: right;
}
.info .user-control {
  border-left: 1px solid #8e8e8e;
  padding: 0 4rem;
  cursor: pointer;
  display: inline-block;
  position: relative;
}
.info .user-control p {
  line-height: 1;
}
.info .user-control .control-panel {
  position: absolute;
  background: #2f2f2f;
  box-shadow: 0px 4px 2px 0px #000;
  width: 10rem;
  text-align: center;
  left: 50%;
  top: 2rem;
  margin-left: -5rem;
  z-index: 20;
}
.info .user-control .control-panel li {
  line-height: 3.5rem;
  border-top: 1px solid #3c3c3c;
  transition: all 1s ease-out;
}
.info .user-control .control-panel li:first-child {
  border-top: none;
}
.info .user-control .control-panel li:hover {
  background: #1b1b1b;
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
  content: "";
  width: 0px;
  height: 0;
  border-radius: 50%;
  border: 3px solid #d60707;
  position: absolute;
  top: 0.2rem;
  right: 0rem;
}

/** 过渡动画 */
.slide-enter-active {
  animation: enter 0.3s;
}
.slide-leave-active {
  animation: leave 0.3s;
}

@keyframes enter {
  0% {
    transform: scale(0);
    transform-origin: 50% 0% 0px;
  }
  100% {
    transform: scale(1);
    transform-origin: 50% 0% 0px;
  }
}
@keyframes leave {
  0% {
    transform: scale(1);
    transform-origin: 50% 0% 0px;
  }
  100% {
    transform: scale(0);
    transform-origin: 50% 0% 0px;
  }
}
</style>
