<template>
  <div id="app">
    <IPCalcHeader />
    <InputIPAddress />
    <AddrInfoTable />
    <SpecialAddrInfo />
    <AddrBlockTree />
  </div>
</template>

<script>
import IPCalcHeader from './components/IPCalcHeader'
import InputIPAddress from './components/InputIPAddress'
import AddrInfoTable from './components/AddrInfoTable'
import SpecialAddrInfo from './components/SpecialAddrInfo'
import AddrBlockTree from './components/AddrBlockTree'

export default {
  name: 'app',
  components: {
    IPCalcHeader,
    InputIPAddress,
    AddrInfoTable,
    SpecialAddrInfo,
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
  padding: 1em;
}
.debug {
  background-color: gainsboro;
}
</style>
