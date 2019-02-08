<template>
  <div id="input-ip-address">
    <h2>Input IP/Mask</h2>
    <el-input
      size="large" autofocus
      v-model="inputString"
      v-on:keyup.native="updateIPAddressString"
      placeholder="e.g. 127.0.0.1/8" />
    <p>
      <a href="#ip-addr-info-table">IP</a>,
      <a href="#netmask-info-table">Netmask</a>,
      <a href="#addr-block-tree">Addr Block Tree</a>
    </p>
    <transition>
      <div id="input-warning" v-if="isInvalidInput" class="input-warning">
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
      isInvalidInput: false
    }
  },
  methods: {
    ...mapMutations(['ipAddrString', 'ipBlock']),
    validateWithNetmask () {
      try {
        this.candidateIPBlock = new Netmask(this.inputString)
      } catch {
        // Error if the Netmask cannot accept input.
        this.isInvalidInput = true
      }
    },
    extractIPAddrStringFromInput () {
      // extract ip part
      const match = this.inputString.match(/([\d.]+)(\/.*)?/)
      if (match) {
        if (match[1].match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)) {
          this.candidateIPAddrString = match[1]
        } else {
          // abbreviations
          this.candidateIPAddrString = this.candidateIPBlock.base
        }
      }
    },
    validateInputString () {
      this.isInvalidInput = false
      this.validateWithNetmask()
      if (!this.isInvalidInput) {
        this.extractIPAddrStringFromInput()
      }
    },
    updateIPAddressString () {
      this.validateInputString()
      if (!this.isInvalidInput) {
        // mutation
        this.ipAddrString(this.candidateIPAddrString)
        this.ipBlock(this.candidateIPBlock)
      }
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
