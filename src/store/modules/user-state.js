
/** 该模块中主要用于用户的登陆状态、认证状态的存储 */

import { AUTH_CHANGE, IDENTITY_UPDATE } from '@/store/mutations-type'

export const moduleUserState = {
  state: {
    // 认证状态：-1未提交认证，9审核中，1已通过，2未通过
    authState: -1,
    // 身份标识
    identity: -1
  },
  mutations: {
    [AUTH_CHANGE] (state, payload) {
      state.authState = payload.authState
    },

    [IDENTITY_UPDATE] (state, payload) {
      state.identity = payload.identity
    }
  },

  getters: {
    getAuthState (state) {
      return state.authState
    },
    getUserIdentity (state) {
      return state.identity
    }
  }
}
