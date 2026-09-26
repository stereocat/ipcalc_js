<template>
  <span
    class="clickable-block"
    v-on:click="click"
  >
    <el-icon v-if="block">
      <InfoFilled />
    </el-icon>
    {{ block }}
  </span>
</template>

<script>
import { InfoFilled } from '@element-plus/icons-vue'
import { mapActions } from 'pinia'
import { Netmask } from 'netmask'
import { useIPStore } from '../store'

export default {
  components: {
    InfoFilled
  },
  props: {
    block: {
      type: String,
      required: true
    }
  },
  methods: {
    ...mapActions(useIPStore, ['selectIPBlock']),
    click () {
      const block = new Netmask(this.block)
      this.selectIPBlock(block.base, block)
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
