<template>
  <div>
    <SpecialAddressList
      v-if="containSpecialBlocks.length > 0"
      v-bind:blocks="containSpecialBlocks"
    >
      THIS block contains special use address block:
    </SpecialAddressList>
    <SpecialAddressList
      v-if="containedSpecialBlocks.length > 0"
      v-bind:blocks="containedSpecialBlocks"
    >
      THIS block is contained by special use address block:
    </SpecialAddressList>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { Netmask } from 'netmask'
import SpecialAddressList from './SpecialAddressList.vue'
import blockList from '../js/special-addr-info-defs'
import { useIPStore } from '../store'

export default {
  components: {
    SpecialAddressList
  },
  computed: {
    ...mapState(useIPStore, ['ipBlock']),
    containSpecialBlocks () {
      return blockList.filter(d => {
        return this.ipBlock.contains(d.addrBlock)
      })
    },
    containedSpecialBlocks () {
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
