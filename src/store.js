import { markRaw } from 'vue'
import { defineStore } from 'pinia'
import { Netmask } from 'netmask'

const initAddr = '127.0.0.1'
const initPrefixLength = 8

export const useIPStore = defineStore('ip', {
  state: () => ({
    ipAddrString: initAddr,
    ipBlock: markRaw(new Netmask(`${initAddr}/${initPrefixLength}`))
  }),
  actions: {
    selectIPBlock (ipAddrString, ipBlock) {
      this.$patch(state => {
        state.ipAddrString = ipAddrString
        state.ipBlock = markRaw(ipBlock)
      })
    }
  }
})
