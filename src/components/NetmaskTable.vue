<template>
  <div>
    <table>
      <tr>
        <th>Name</th>
        <th>Value</th>
        <th>Binary</th>
      </tr>
      <tr
        v-for="(infoDef, index) in infoDefs"
        v-bind:key="infoDef.name"
        v-bind:class="index % 2 ? 'even-row' : 'odd-row'"
      >
        <td class="name">{{ infoDef.name }}</td>
        <td class="value">
          <AppIPBlockAnchor
            v-if="infoDef.clickable"
            v-bind:block="infoDef.value"
          />
          <span v-else>{{ infoDef.value }}</span>
        </td>
        <td class="binary">
          <span class="bin-head">{{ infoDef.binary.head }}</span>
          <span class="bin-tail">{{ infoDef.binary.tail }}</span>
        </td>
      </tr>
    </table>
    <div
      class="debug"
      v-bind:style="{ display: debugDisplay }"
    >
      [AddrInfoTable.vue debug]
      ip addr: {{ ipAddrString }}, mask: {{ ipBlock.mask }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ip from 'ip'
import AppIPBlockAnchor from './AppIPBlockAnchor'

export default {
  components: {
    AppIPBlockAnchor
  },
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
        { name: 'Previous CIDR Block', value: this.previousBlockString, clickable: true },
        { name: 'THIS CIDR Block', value: this.ipBlock.toString(), clickable: true },
        { name: 'Next CIDR Block', value: this.nextBlockString, clickable: true },
        { name: 'Block Size (Number of Addresses)', value: this.ipBlock.size }
      ].map(d => this.makeInfoDef(d))
    },
    previousBlockString () {
      try {
        return this.previousBlock().toString()
      } catch {
        return ""
      }
    },
    nextBlockString () {
      try {
        return this.nextBlock().toString()
      } catch {
        return ""
      }
    }
  },
  methods: {
    makeInfoDef (d) {
      return {
        name: d.name,
        value: d.value,
        clickable: d.clickable,
        binary: this.toBinary(d.value)
      }
    },
    previousBlock () {
      const prevBlock = this.ipBlock.next(-1)
      if (ip.toLong(prevBlock.base) <= ip.toLong(this.ipBlock.base)) {
        return prevBlock
      }
      return ""
    },
    nextBlock () {
      const nextBlock = this.ipBlock.next(1)
      if (ip.toLong(nextBlock.base) >= ip.toLong(this.ipBlock.base)) {
        return nextBlock
      }
      return ""
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
