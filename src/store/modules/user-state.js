
/** 该模块中主要用于用户的登陆状态、认证状态的存储 */

import { AUTH_CHANGE, IDENTITY_UPDATE, USER_KEY_UPDATE, USER_ID_UPDATE } from '@/store/mutations-type'

export const moduleUserState = {
  state: {
    // 认证状态：-1未提交认证，9审核中，1已通过，2未通过
    authState: -1,
    // 身份标识
    identity: -1,
    // 用户KEY
    KEY: '',
    // 用户ID
    ID: ''
  },
  mutations: {
    [AUTH_CHANGE] (state, payload) {
      state.authState = payload.authState
    },

    [IDENTITY_UPDATE] (state, payload) {
      state.identity = payload.identity
    },

    [USER_KEY_UPDATE] (state, payload) {
      state.KEY = payload.KEY
    },

    [USER_ID_UPDATE] (state, payload) {
      state.ID = payload.ID
    }
  },

  getters: {
    getAuthState (state) {
      return state.authState
    },
    getUserIdentity (state) {
      return state.identity
    },
    getUserKey (state) {
      return state.KEY
    },
    getUserID (state) {
      return state.ID
    }
  }
}
