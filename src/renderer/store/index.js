import Vue from 'vue'
import Vuex from 'vuex'
import readRootDirectory from '@/logic'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    data: undefined,
    log: undefined
  },
  actions: {
    READ_ROOT_DIRECTORY: ({ commit }, path) => {
      const { data, log } = readRootDirectory(path)
      commit('SET_DATA', data)
      commit('SET_LOG', log)
    }
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
