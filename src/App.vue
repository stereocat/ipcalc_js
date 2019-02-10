<template>
  <div id="app">
    <AppHeader />
    <AppInput />
    <el-collapse v-model="activeNames">
      <el-collapse-item
        title="IP Info Table"
        name="ip-info"
      >
        <IPAddressTable />
      </el-collapse-item>
      <el-collapse-item
        title="Netmask Info Table"
        name="netmask-info"
      >
        <NetmaskTable />
        <SpecialAddressContainer />
      </el-collapse-item>
      <el-collapse-item
        title="Address Block Tree"
        name="address-block-tree"
      >
        <IPBlockTree />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import AppHeader from './components/AppHeader'
import AppInput from './components/AppInput'
import IPAddressTable from './components/IPAddressTable'
import NetmaskTable from './components/NetmaskTable'
import SpecialAddressContainer from './components/SpecialAddressContainer'
import IPBlockTree from './components/IPBlockTree'

export default {
  name: 'app',
  components: {
    AppHeader,
    AppInput,
    IPAddressTable,
    NetmaskTable,
    SpecialAddressContainer,
    IPBlockTree
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
