<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Value</th>
          <th>Binary</th>
        </tr>
      </thead>
      <tbody>
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
      </tbody>
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
import { mapState } from 'pinia'
import AppIPBlockAnchor from './AppIPBlockAnchor.vue'
import { useIPStore } from '../store'
import { ipv4ToByteArray, ipv4ToLong } from '../js/ip-address'

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
    ...mapState(useIPStore, ['ipAddrString', 'ipBlock']),
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
        return ''
      }
    },
    nextBlockString () {
      try {
        return this.nextBlock().toString()
      } catch {
        return ''
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
      if (ipv4ToLong(prevBlock.base) <= ipv4ToLong(this.ipBlock.base)) {
        return prevBlock
      }
      return ''
    },
    nextBlock () {
      const nextBlock = this.ipBlock.next(1)
      if (ipv4ToLong(nextBlock.base) >= ipv4ToLong(this.ipBlock.base)) {
        return nextBlock
      }
      return ''
    },
    toBinary (dottedStr) {
      const nullValue = { head: '', tail: '' }
      const matches = /(\d+\.\d+\.\d+\.\d+)(?:\/(\d+))?/.exec(dottedStr)
      if (matches) {
        dottedStr = matches[1]
      } else {
        return nullValue
      }
      try {
        const octets = ipv4ToByteArray(dottedStr)
          .map(octet => octet.toString(2).padStart(8, '0'))
        const binDottedStr = octets.join('.')
        const prefixLength = this.ipBlock.bitmask
        if (prefixLength > 0) {
          const sep = prefixLength + Math.floor((prefixLength - 1) / 8)
          return {
            head: binDottedStr.slice(0, sep),
            tail: binDottedStr.slice(sep)
          }
        }
        return { head: '', tail: binDottedStr }
      } catch {
        return nullValue
      }
    }
  }
}
</script>

<style src="../css/info-table.css" scoped>
</style>
