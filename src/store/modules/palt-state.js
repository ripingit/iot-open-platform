
/** 该模块中主要用于平台功能状态的存储 */

import { MENU_UPDATE, AUTH_UPDATE, MENU_TOGGLE_UPDATE } from '@/store/mutations-type'

export const moduleFunctionState = {
  state: {
    // 高亮的菜单
    highlightMenu: '1',
    // 菜单权限数据
    menus: '',
    // 小屏幕时设置菜单是展开还是收缩
    toggleMenu: false
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
    }
  }
}
