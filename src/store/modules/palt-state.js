
/** 该模块中主要用于平台功能状态的存储 */

import { MENU_UPDATE, AUTH_UPDATE, MENU_TOGGLE_UPDATE, LANGUAGE_LIST } from "@/store/mutations-type"
import { COOP_LANGUAGE_QUERY, ADMIN_LANGUAGE_LIST_QUERY } from "@/lib/api.js"
import Vue from "vue"
import axios from "@/lib/axios"
import StatuCode from "@/lib/statu"
import CommonApi from "@/lib/common-api"

Vue.use(StatuCode)
Vue.use(CommonApi)
const vm = new Vue()

export const moduleFunctionState = {
  state: {
    // 高亮的菜单
    highlightMenu: "1",
    // 菜单权限数据
    menus        : "",
    // 小屏幕时设置菜单是展开还是收缩
    toggleMenu   : false,
    // 语种
    languageLists: []
  },
  mutations: {
    [MENU_UPDATE] (state, payload) {
      state.highlightMenu = payload.highlightMenu
    },
    [AUTH_UPDATE] (state, payload) {
      state.menus = JSON.stringify(payload.menus)
    },
    [MENU_TOGGLE_UPDATE] (state, payload) {
      state.toggleMenu = payload.toggleMenu
    },
    [LANGUAGE_LIST] (state, payload) {
      state.languageLists = payload.languages
    }
  },
  actions: {
    async getLanguages ({ commit }, { identity }) {
      const url = identity === vm.identityCode.ADMIN ? ADMIN_LANGUAGE_LIST_QUERY : COOP_LANGUAGE_QUERY
      const res = await axios.post(url)
      if (vm.vmResponseHandler(res)) {
        commit(LANGUAGE_LIST, { languages: res.data.data })
      }
    }
  },

  getters: {
    getHighlightMenu (state) {
      return state.highlightMenu
    },
    getAuthMenu (state) {
      return JSON.parse(state.menus)
    },
    getToggleMenu (state) {
      return state.toggleMenu
    },
    getLanguages (state) {
      return state.languageLists
    }
  }
}
