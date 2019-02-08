<template>
  <div id="app">
    <IPCalcHeader />
    <InputIPAddress />
    <IPAddrInfoTable />
    <NetmaskInfoTable />
    <SpecialAddrInfo />
    <AddrBlockTree />
  </div>
</template>

<script>
import IPCalcHeader from './components/IPCalcHeader'
import InputIPAddress from './components/InputIPAddress'
import IPAddrInfoTable from './components/IPAddrInfoTable'
import NetmaskInfoTable from './components/NetmaskInfoTable'
import SpecialAddrInfo from './components/SpecialAddrInfo'
import AddrBlockTree from './components/AddrBlockTree'

export default {
  name: 'app',
  components: {
    IPCalcHeader,
    InputIPAddress,
    IPAddrInfoTable,
    NetmaskInfoTable,
    SpecialAddrInfo,
    AddrBlockTree
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
.header-anchor {
  font-size: xx-small;
  vertical-align: super;
}
.header-anchor:link {
  text-decoration: none;
}
</style>
