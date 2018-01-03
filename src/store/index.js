import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    context: '5a43354f1a070f28107f806a',
    user: {}
  },
  mutations: {
  },
  actions: {},
  getters: {
    getContext (state) {
      return state.context
    },
    getUser (state) {
      return state.user
    }
  }
})
