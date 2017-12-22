import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    context: '1235481135468792ADSXC'
  },
  mutations: {},
  actions: {},
  getters: {
    getContext (state) {
      return state.context
    }
  }
})
