
/** 该模块中主要用于平台功能状态的存储 */

import { MENU_UPDATE, AUTH_UPDATE } from '@/store/mutations-type'

export const moduleFunctionState = {
  state: {
    // 高亮的菜单
    highlightMenu: '1',
    // 菜单权限数据
    menus: ''
  },
  mutations: {
    [MENU_UPDATE] (state, payload) {
      state.highlightMenu = payload.highlightMenu
    },
    [AUTH_UPDATE] (state, payload) {
      state.menus = JSON.stringify(payload.menus)
    }
  },

  getters: {
    getHighlightMenu (state) {
      return state.highlightMenu
    },
    getAuthMenu (state) {
      return JSON.parse(state.menus)
    }
  }
}
