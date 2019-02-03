<template>
  <div id="addr-info-table">
    <h2>Calculated Values</h2>
    <table>
      <tr><th>Name</th><th>Value</th><th>Binary</th></tr>
      <tr v-for="(infoDef, index) in this.infoDefs"
          v-bind:key="infoDef.name"
          v-bind:class="index % 2 ? 'even-row' : 'odd-row'">
        <td>{{ infoDef.name }}</td>
        <td>{{ infoDef.value }}</td>
        <td>{{ isNaN(infoDef.value) ? toBinary(infoDef.value) : ''}}</td>
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
        { name: 'Broadcast Address', value: this.ipBlock.broadcast },
        { name: 'First Host Address', value: this.ipBlock.first },
        { name: 'Last Host Address', value: this.ipBlock.last },
        { name: 'Block Size (Number of Addresses)', value: this.ipBlock.size },
        { name: 'Previous CIDR Block', value: this.previousBlockString },
        { name: 'THIS CIDR Block', value: this.ipBlock.toString() },
        { name: 'Next CIDR Block', value: this.nextBlockString }
      ]
    },
    previousBlockString () {
      const blockStr = this.previousBlock()
      return blockStr ? blockStr.toString() : null
    },
    nextBlockString () {
      const blockStr = this.nextBlock()
      return blockStr ? blockStr.toString() : null
    }
  },
  methods: {
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
    toBinary (addrString) {
      return `TBA: convert ${addrString} to binary` // TODO
    }
  }
}
</script>

<style scoped>
table, td, th {
  border: 1px darkgray solid;
  border-collapse: collapse;
}

th {
  color: white;
  background-color: gray;
}
td {
  padding: 0.2em 1em;
}
tr.even-row {
  background-color: white;
}
tr.odd-row {
  background-color: ghostwhite;
}
td.value td.binary {
  font-family: Consolas, 'Courier New', Courier, Monaco, monospace;
}
</style>
