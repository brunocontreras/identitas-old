import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    data: undefined,
    log: undefined
  },
  mutations: {
    SET_DATA: (state, data) => {
      state.data = data
    },
    SET_LOG: (state, log) => {
      state.log = log
    }
  },
  strict: process.env.NODE_ENV !== 'production'
})
