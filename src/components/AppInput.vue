<template>
  <div>
    <el-input
      size="large" autofocus
      v-model="inputString"
      @keyup="updateIPAddressString"
      placeholder="e.g. 127.0.0.1/8" />
    <transition>
      <div
        id="input-warning"
        v-if="!validInput"
        class="input-warning"
      >
        <el-icon><WarningFilled /></el-icon>
        There is invalid IP/Mask(or prefix length) input.
      </div>
    </transition>
    <div
      class="debug"
      v-bind:style="{ display: debugDisplay }"
    >
      [InputIPAddress.vue debug]
      input string: {{ inputString }}
    </div>
  </div>
</template>

<script>
import { WarningFilled } from '@element-plus/icons-vue'
import { mapActions } from 'pinia'
import { Netmask } from 'netmask'
import { useIPStore } from '../store'
import { isValidIPv4 } from '../js/ip-address'

export default {
  components: {
    WarningFilled
  },
  data () {
    return {
      debugDisplay: 'none',
      inputString: '',
      candidateIPAddrString: '',
      candidateIPBlock: null,
      validInput: true,
      useBitmask: true,
      delayTimer: null,
      unsubscribeStore: null,
      delay: 1000,
      ipv4BitmaskRegexp: /^\/?(?:3[0-2]|[12]?\d)$/,
      ipv4MaskRegexp: /^\/?(?:(?:25[245]|24[08]|224|192|128|0)\.){3}(?:25[245]|24[08]|224|192|128|0)$/
    }
  },
  mounted () {
    const store = useIPStore()
    const syncInput = state => {
      this.inputString = this.useBitmask
        ? `${state.ipAddrString}/${state.ipBlock.bitmask}`
        : `${state.ipAddrString}/${state.ipBlock.mask}`
    }

    syncInput(store)
    this.unsubscribeStore = store.$subscribe((_mutation, state) => {
      syncInput(state)
    })
  },
  beforeUnmount () {
    clearTimeout(this.delayTimer)
    this.unsubscribeStore?.()
  },
  methods: {
    ...mapActions(useIPStore, ['selectIPBlock']),
    validMaskString (maskStr) {
      if (maskStr === undefined || maskStr === null || maskStr === '') {
        this.useBitmask = true
        return true
      }
      if (maskStr.match(this.ipv4MaskRegexp)) {
        this.useBitmask = false
        return true
      }
      if (maskStr.match(this.ipv4BitmaskRegexp)) {
        this.useBitmask = true
        return true
      }
      return false
    },
    validateInputAsIPNetmask () {
      try {
        const match = this.inputString.match(/^([\d.]+)(\/.*)?$/)
        if (match && isValidIPv4(match[1]) && this.validMaskString(match[2])) {
          this.candidateIPAddrString = match[1]
          this.candidateIPBlock = new Netmask(this.inputString)
          return true
        }
        return false
      } catch {
        return false
      }
    },
    updateIPAddressString () {
      clearTimeout(this.delayTimer)
      this.validInput = this.validateInputAsIPNetmask()
      if (!this.validInput) {
        return
      }
      this.delayTimer = setTimeout(() => {
        this.selectIPBlock(this.candidateIPAddrString, this.candidateIPBlock)
      }, this.delay)
    }
  }
}
</script>

<style scoped>
div.input-warning {
  border: 3px pink solid;
  padding: 5px;
  background-color: lavenderblush;
  margin: 0.2em;
}
.v-enter-from, .v-leave-to {
  opacity: 0;
}
.v-enter-active, .v-leave-active {
  transition: opacity .5s;
}
</style>
