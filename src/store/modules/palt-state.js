
/** 该模块中主要用于平台功能状态的存储 */

import { MENU_UPDATE } from '@/store/mutations-type'

export const moduleFunctionState = {
  state: {
    // 高亮的菜单
    highlightMenu: '1'
  },
  mutations: {
    [MENU_UPDATE] (state, payload) {
      state.highlightMenu = payload.highlightMenu
    }
  },

  getters: {
    getHighlightMenu (state) {
      return state.highlightMenu
    }
  }
}
