import Vue from 'vue'
import Vuex from 'vuex'
import jwt from 'jsonwebtoken'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    context: '5a43354f1a070f28107f806a',
    user: {}
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
      if (payload.AccessLevel !== 4) {
        localStorage.setItem('forAdmin', true)
      }
    },
    removeUser (state) {
      state.user = {}
    }
  },
  actions: {
    jwtdecode ({commit}, payload) {
      var data = jwt.verify(payload, 'blaiseSecretKey')
      localStorage.setItem('AuthCode',data.user.AuthCode)
      commit('setUser', data.user)
    },
    logout ({commit}) {
      commit('removeUser')
    }
  },
  getters: {
    getContext (state) {
      return state.context
    },
    getUser (state) {
      return state.user
    },
    getAuthCode (state) {
      return state.user.AuthCode
    }
  }
})
