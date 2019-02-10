<template>
  <div id="input-ip-address">
    <el-input
      size="large" autofocus
      v-model="inputString"
      v-on:keyup.native="updateIPAddressString"
      placeholder="e.g. 127.0.0.1/8" />
    <transition>
      <div id="input-warning" v-if="!validInput" class="input-warning">
        There is invalid IP/Mask(or prefix length) input.
      </div>
    </transition>
    <div class="debug" v-bind:style="{ display: debugDisplay }">
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
      inputString: '',
      candidateIPAddrString: '',
      candidateIPBlock: null,
      validInput: true,
      delayTimer: null
    }
  },
  methods: {
    ...mapMutations(['ipAddrString', 'ipBlock']),
    validateInputAsIPNetmask () {
      try {
        this.candidateIPBlock = new Netmask(this.inputString)
        return true
      } catch {
        // Error if the Netmask cannot accept input.
        return false
      }
    },
    extractIPAddrStringFromInput () {
      // extract ip part
      const match = this.inputString.match(/([\d.]+)(\/.*)?/)
      if (match) {
        if (match[1].match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)) {
          this.candidateIPAddrString = match[1]
        } else {
          // when used abbrev ip string (e.g. 192.168 => '192.168.0.0')
          this.candidateIPAddrString = this.candidateIPBlock.base
        }
      }
    },
    validateInputString () {
      this.validInput = this.validateInputAsIPNetmask()
      if (this.validInput) {
        this.extractIPAddrStringFromInput()
      }
    },
    updateIPAddressString () {
      // validate ASAP for each key input
      this.validateInputString()
      if (!this.validInput) {
        return
      }
      // wait to update app state when finish input
      clearTimeout(this.delayTimer)
      this.delayTimer = setTimeout(() => {
        // mutation
        this.ipAddrString(this.candidateIPAddrString)
        this.ipBlock(this.candidateIPBlock)
      }, 500)
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
