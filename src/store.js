import Vuex from 'vuex'
import { Netmask } from 'netmask'

const initAddr = '127.0.0.1'
const initPrefixLength = 8

export default Vuex.createStore({
  strict: process.env.NODE_ENV !== 'production',
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
    setIPAddrString (state, payload) {
      state.ipAddrString = payload
    },
    setIPBlock (state, payload) {
      state.ipBlock = payload
    }
  }
})
