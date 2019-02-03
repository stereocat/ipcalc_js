<template>
  <div id="app">
    <InputIPAddress />
    <AddrInfoTable />
    <AddrBlockTree />
  </div>
</template>

<script>
import InputIPAddress from './components/InputIPAddress'
import AddrInfoTable from './components/AddrInfoTable'
import AddrBlockTree from './components/AddrBlockTree'

export default {
  name: 'app',
  components: {
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
