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
import AppHeader from './components/AppHeader.vue'
import AppInput from './components/AppInput.vue'
import IPAddressTable from './components/IPAddressTable.vue'
import NetmaskTable from './components/NetmaskTable.vue'
import SpecialAddressContainer from './components/SpecialAddressContainer.vue'
import IPBlockTree from './components/IPBlockTree.vue'

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
