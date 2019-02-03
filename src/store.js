import Vue from 'vue'
import Vuex from 'vuex'
import { Netmask } from 'netmask'

Vue.use(Vuex)

const initString = '127.0.0.1/32'

export default new Vuex.Store({
  state: {
    ipAddrString: initString,
    ipBlock: new Netmask(initString)
  },
  getters: {
    ipAddrString (state) {
      return state.ipAddrString
    },
    ipBlock (state) {
      return state.ipBlock
    }
  },
  mutations: {
    ipAddrString (state, payload) {
      state.ipAddrString = payload
    },
    ipBlock (state, payload) {
      state.ipBlock = payload
    }
  }
})
