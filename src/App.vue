<template>
  <div id="app">
    <IPCalcHeader />
    <InputIPAddress />
    <AddrInfoTable />
    <AddrBlockTree />
  </div>
</template>

<script>
import IPCalcHeader from './components/IPCalcHeader'
import InputIPAddress from './components/InputIPAddress'
import AddrInfoTable from './components/AddrInfoTable'
import AddrBlockTree from './components/AddrBlockTree'

export default {
  name: 'app',
  components: {
    IPCalcHeader,
    InputIPAddress,
    AddrInfoTable,
    AddrBlockTree
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
