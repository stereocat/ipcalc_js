<template>
  <div id="app">
    <IPCalcHeader />
    <InputIPAddress />
    <el-collapse v-model="activeNames">
      <el-collapse-item title="IP Info Table" name="ip-info">
        <IPAddrInfoTable />
      </el-collapse-item>
      <el-collapse-item title="Netmask Info Table" name="netmask-info">
        <NetmaskInfoTable />
        <SpecialAddrInfo />
      </el-collapse-item>
      <el-collapse-item title="Address Block Tree" name="address-block-tree">
        <AddrBlockTree />
      </el-collapse-item>
    </el-collapse>
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
  },
  data () {
    return {
      activeNames: ['ip-info', 'netmask-info', 'address-block-tree']
    }
  }
}
</script>

<style>
#app {
  padding-left: 60px;
  padding-right: 60px;
}
.debug {
  background-color: gainsboro;
}
</style>
