<template>
  <div id="netmask-info-table">
    <h2>Netmask, Related Address Blocks</h2>
    <table>
      <tr><th>Name</th><th>Value</th><th>Binary</th></tr>
      <tr v-for="(infoDef, index) in this.infoDefs"
          v-bind:key="infoDef.name"
          v-bind:class="index % 2 ? 'even-row' : 'odd-row'">
        <td class="name">{{ infoDef.name }}</td>
        <td class="value">{{ infoDef.value }}</td>
        <td class="binary">
          <span class="bin-head">{{ infoDef.binary.head }}</span>
          <span class="bin-tail">{{ infoDef.binary.tail }}</span>
        </td>
      </tr>
    </table>
    <div class="debug" v-bind:style="{ display: debugDisplay }">
      [AddrInfoTable.vue debug]
      ip addr: {{ ipAddrString }}, mask: {{ ipBlock.mask }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ip from 'ip'

export default {
  data () {
    return {
      debugDisplay: 'none'
    }
  },
  computed: {
    ...mapGetters(['ipAddrString', 'ipBlock']),
    infoDefs () {
      return [
        { name: 'IP Address', value: this.ipAddrString },
        { name: 'Subnet Length', value: this.ipBlock.bitmask },
        { name: 'Subnet Mask', value: this.ipBlock.mask },
        { name: 'Wild Card (Host Mask)', value: this.ipBlock.hostmask },
        { name: 'Network Address', value: this.ipBlock.base },
        { name: 'First Host Address', value: this.ipBlock.first },
        { name: 'Last Host Address', value: this.ipBlock.last },
        { name: 'Broadcast Address', value: this.ipBlock.broadcast },
        { name: 'Previous CIDR Block', value: this.previousBlockString },
        { name: 'THIS CIDR Block', value: this.ipBlock.toString() },
        { name: 'Next CIDR Block', value: this.nextBlockString },
        { name: 'Block Size (Number of Addresses)', value: this.ipBlock.size }
      ].map(d => this.makeInfoDef(d.name, d.value))
    },
    previousBlockString () {
      try {
        return this.previousBlock().toString()
      } catch {
        return null
      }
    },
    nextBlockString () {
      try {
        return this.nextBlock().toString()
      } catch {
        return null
      }
    }
  },
  methods: {
    makeInfoDef (name, value) {
      return {
        name: name,
        value: value,
        binary: this.toBinary(value)
      }
    },
    previousBlock () {
      const prevBlock = this.ipBlock.next(-1)
      if (ip.toLong(prevBlock.base) > ip.toLong(this.ipBlock.base)) {
        return null
      }
      return prevBlock
    },
    nextBlock () {
      const nextBlock = this.ipBlock.next(1)
      if (ip.toLong(nextBlock.base) < ip.toLong(this.ipBlock.base)) {
        return null
      }
      return nextBlock
    },
    toBinary (dottedStr) {
      const nullValue = { head: '', tail: '' }
      const matches = /(\d+\.\d+\.\d+\.\d+)(:?\/(\d+))?/.exec(dottedStr)
      if (matches) {
        dottedStr = matches[1] // x.x.x.x/mm => x.x.x.x
      } else {
        return nullValue
      }
      try {
        const buf = ip.toBuffer(dottedStr)
        const octets = []
        for (const b of buf) {
          octets.push(`00000000${Number(b).toString(2)}`.slice(-8))
        }
        const binDottedStr = octets.join('.')
        const prefixLength = this.ipBlock.bitmask
        if (prefixLength > 0) {
          const sep = prefixLength + Math.floor((prefixLength - 1) / 8)
          const headStr = binDottedStr.slice(0, sep)
          const tailStr = binDottedStr.slice(sep)
          return { head: headStr, tail: tailStr }
        } else {
          return { head: '', tail: binDottedStr }
        }
      } catch (err) {
        console.log('error in toBinary()')
        return nullValue
      }
    }
  }
}
</script>

<style src="../css/info-table.css" scoped>
</style>
