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
        <i class="el-icon-warning" />
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
import { mapMutations } from 'vuex'
import { Netmask } from 'netmask'

export default {
  data () {
    return {
      debugDisplay: 'none',
      inputString: '', // binded input (textbox)
      candidateIPAddrString: '',
      candidateIPBlock: null,
      validInput: true,
      useBitmask: true, // default: bitmask (prefix-length) format
      delayTimer: null,
      delay: 1000 // msec
    }
  },
  mounted () {
    this.$store.watch(
      // change detection ip/mask string from state info.
      state => {
        return this.useBitmask ?
          `${state.ipAddrString}/${state.ipBlock.bitmask}` :
          `${state.ipAddrString}/${state.ipBlock.mask}`
      },
      // when state change: update inputString (textbox)
      newStr => this.inputString = newStr
    )
  },
  methods: {
    ...mapMutations(['setIPAddrString', 'setIPBlock']),
    validMaskString(maskStr) {
      if (maskStr === undefined || maskStr === null || maskStr === '') {
        this.useBitmask = true
        return true // assume /32 mask
      }
      if (maskStr.match(/\/?\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)) {
        this.useBitmask = false
        return true // assume bitmask specified
      }
      const m = maskStr.match(/\/?(\d{1,3})$/)
      if (m && 0 <= parseInt(m[1]) && parseInt(m[1]) <= 32) {
        this.useBitmask = true
        return true // assume preflx-length specified
      }
      return false
    },
    validateInputAsIPNetmask () {
      try {
        const match = this.inputString.match(/([\d.]+)(\/.*)?/)
        if (match && match[1].match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/) && this.validMaskString(match[2])) {
          this.candidateIPAddrString = match[1]
          this.candidateIPBlock = new Netmask(this.inputString)
          return true
        }
        return false
      } catch {
        // Error if the Netmask cannot accept input.
        return false
      }
    },
    updateIPAddressString () {
      // clear if delayTime exists while editing textbox...
      clearTimeout(this.delayTimer)
      // validate ASAP for each key input
      this.validInput = this.validateInputAsIPNetmask()
      if (!this.validInput) {
        return
      }
      // wait to update app state (datastore) when finish input
      this.delayTimer = setTimeout(() => {
        // mutation
        this.setIPAddrString(this.candidateIPAddrString)
        this.setIPBlock(this.candidateIPBlock)
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
.v-enter, .v-leave-to {
  opacity: 0;
}
.v-enter-active, .v-leave-active {
  transition: opacity .5s;
}
</style>
