import Vue from 'vue'
import Vuex from 'vuex'
import { Netmask } from 'netmask'

Vue.use(Vuex)

const initAddr = '127.0.0.1'
const initPrefixLength = 8

export default new Vuex.Store({
  state: {
    ipAddrString: initAddr,
    ipBlock: new Netmask(`${initAddr}/${initPrefixLength}`)
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
