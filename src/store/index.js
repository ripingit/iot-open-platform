import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist'

import { moduleUserState } from './modules/user-state'
import { moduleFunctionState } from './modules/palt-state'

Vue.use(Vuex)

const vuexLocalStorage = new VuexPersist({
  key: 'vuex',
  storage: window.sessionStorage
})

const store = new Vuex.Store({
  modules: {
    moduleUserState,
    moduleFunctionState
  },
  plugins: [ vuexLocalStorage.plugin ]
})

export default store
