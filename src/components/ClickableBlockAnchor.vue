<template>
  <span class="clickable-block" v-on:click="click">
    <i v-if="block" class="el-icon-info"></i>
    {{ block }}
  </span>
</template>

<script>
import { mapMutations } from 'vuex'
import { Netmask } from 'netmask'

export default {
  props: ['block'],
  methods: {
    ...mapMutations(['setIPAddrString', 'setIPBlock']),
    click () {
      const block = new Netmask(this.block)
      this.setIPAddrString(block.base)
      this.setIPBlock(block)
    }
  }
}
</script>

<style scoped>
.clickable-block {
  font-weight: bold;
}
.clickable-block:hover {
  background-color: mistyrose;
  text-decoration: underline;
}
</style>
