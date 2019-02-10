<template>
  <div id="special-addr-info">
    <AddrInfoBlock
      v-if="containSpecialBlocks.length > 0"
      v-bind:blocks="containSpecialBlocks">
      THIS block contains special use address block:
    </AddrInfoBlock>
    <AddrInfoBlock
      v-if="containedSpecialBlocks.length > 0"
      v-bind:blocks="containedSpecialBlocks">
      THIS block is contained by special use address block:
    </AddrInfoBlock>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Netmask } from 'netmask'
import AddrInfoBlock from './AddrInfoBlock'
import blockList from '../js/special-addr-info-defs'

export default {
  components: {
    AddrInfoBlock
  },
  computed: {
    ...mapGetters(['ipAddrString', 'ipBlock']),
    containSpecialBlocks () {
      return blockList.filter(d => {
        return this.ipBlock.contains(d.addrBlock)
      })
    },
    containedSpecialBlocks () {
      // always returns 0 or 1 element array
      return blockList.filter(d => {
        const sp = new Netmask(d.addrBlock)
        return sp.contains(this.ipBlock.toString())
      })
    }
  }
}
</script>

<style scoped>
</style>
