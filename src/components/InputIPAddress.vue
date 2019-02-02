<template>
  <div id="inputIPAddress">
    <form onsubmit="return false">
      <label for="ipAddr">IP Address : </label>
      <input type="text" id="ipAddr"
             v-model="inputString"
             v-on:change="updateIPAddressString"
             placeholder="e.g. 127.0.0.1/32">
    </form>
    <div id="input-warning" v-if="isInvalidInput">
      There is invalid IP/Mask(or prefix length) input.
    </div>
    <div class="debug">
      [InputIPAddress.vue debug]
      input string: {{ inputString }},
      ip: {{ ipAddrString.toString() }},
    </div>
  </div>
</template>

<script>
import { Netmask } from 'netmask'

export default {
  props: ['ipAddrString', 'ipBlock'],
  data () {
    return {
      inputString: '',
      candidateIPAddrString: '',
      candidateIPBlock: null,
      isInvalidInput: false
    }
  },
  methods: {
    validateInputString () {
      this.isInvalidInput = false
      try {
        this.candidateIPBlock = new Netmask(this.inputString)
      } catch {
        this.isInvalidInput = true
      }
      // extract ip part
      const match = this.inputString.match(/([\d.]+)(\/.*)?/)
      if (match) {
        this.candidateIPAddrString = match[1]
      }
    },
    updateIPAddressString () {
      this.validateInputString()
      if (!this.isInvalidInput) {
        this.$emit('updateInput', this.candidateIPAddrString, this.candidateIPBlock)
      }
    }
  }
}
</script>

<style scoped>
form {
  border: 1px gray solid;
  margin: 5px;
  padding: 5px;
}
input{
  font-size: 1.5em;
  width: 20em;
  height: 1.1em;
  padding: 5px;
  font-family: Arial, sans-serif;
  color: #aaa;
  border: solid 1px #ccc;
  margin: 5px;
  /* rounded corner*/
  -webkit-border-radius: 30px;
  -moz-border-radius: 30px;
  border-radius: 30px;
}
input:focus {
  outline: 0;
  border:solid 3px #EEA34A;
}
</style>
