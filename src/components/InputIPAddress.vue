<template>
  <div id="input-ip-address">
    <h2>Input IP/Mask</h2>
    <form onsubmit="return false">
      <input type="text" id="ipAddr"
             v-model="inputString"
             v-on:keyup="updateIPAddressString"
             placeholder="e.g. 127.0.0.1/8">
    </form>
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
        console.log('update by change input string')
        // mutation
        this.ipAddrString(this.candidateIPAddrString)
        this.ipBlock(this.candidateIPBlock)
      }
    }
  }
}
</script>

<style scoped>
form {
  margin: 5px;
  padding: 5px;
}
input{
  font-size: 1.5em;
  width: 20em;
  height: 1.1em;
  padding: 5px 20px;
  font-family: Arial, sans-serif;
  color: #aaa;
  border: solid 2px #ccc;
  margin: 5px;
  /* rounded corner*/
  -webkit-border-radius: 30px;
  -moz-border-radius: 30px;
  border-radius: 30px;
}
input:focus {
  outline: 0;
  color: #585858;
  background-color: lightgoldenrodyellow;
  border:solid 2px #EEA34A;
}
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
