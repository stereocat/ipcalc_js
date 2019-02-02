<template>
  <div id="app">
    <InputIPAddress
      v-bind:ip-addr-string="ipAddrString"
      v-bind:ip-block="ipBlock"
      v-on:updateInput="updateInput"
    />
    <div class="debug">
      [App.vue debug] IP address: {{ ipAddrString }}, subnetMask: {{ ipBlock ? ipBlock.mask : 'xx' }}
    </div>
    <AddrInfoTable
      v-bind:ip-addr-string="ipAddrString"
      v-bind:ip-block="ipBlock"
    />
  </div>
</template>

<script>
import { Netmask } from 'netmask'
import InputIPAddress from './components/InputIPAddress'
import AddrInfoTable from './components/AddrInfoTable'

const initString = '127.0.0.1/32'
export default {
  name: 'app',
  data () {
    return {
      ipAddrString: initString,
      ipBlock: new Netmask(initString)
    }
  },
  components: {
    InputIPAddress,
    AddrInfoTable
  },
  methods: {
    updateInput (ipAddrString, ipBlock) {
      this.ipAddrString = ipAddrString
      this.ipBlock = ipBlock
    }
  }
}
</script>
<style>
#app {
}
.debug {
  background-color: gainsboro;
}
</style>
