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
      // constants
      delay: 1000, // msec
      ipv4Regexp: /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
      ipv4BitmaskRegexp: /^\/?(?:3[0-2]|[12]?\d)$/,
      ipv4MaskRegexp: /^\/?(?:(?:25[245]|24[08]|224|192|128|0)\.){3}(?:25[245]|24[08]|224|192|128|0)$/
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
      if (maskStr.match(this.ipv4MaskRegexp)) {
        this.useBitmask = false
        return true // assume bitmask specified
      }
      if (maskStr.match(this.ipv4BitmaskRegexp)) {
        this.useBitmask = true
        return true // assume preflx-length specified
      }
      return false
    },
    validateInputAsIPNetmask () {
      try {
        const match = this.inputString.match(/([\d.]+)(\/.*)?/)
        if (match && match[1].match(this.ipv4Regexp) && this.validMaskString(match[2])) {
          this.candidateIPAddrString = match[1]
          this.candidateIPBlock = new Netmask(this.inputString)
          return true
        }
        return false
      } catch {
        // Error if the inputString is not acceptable ip-address/(bit)mask format string
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
