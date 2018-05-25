import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import { moduleUserState } from './modules/user-state'
import { moduleFunctionState } from './modules/palt-state'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    moduleUserState,
    moduleFunctionState
  },
  plugins: [ createPersistedState() ]
})

export default store
