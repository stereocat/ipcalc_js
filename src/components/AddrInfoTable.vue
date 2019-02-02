<template>
  <div id="addr-info-table">
    <table>
      <tr><th>Name</th><th>Value</th><th>Binary</th></tr>
      <tr v-for="infoDef in this.infoDefs" v-bind:key="infoDef.name">
        <td>{{ infoDef.name }}</td>
        <td>{{ infoDef.value }}</td>
        <td>{{ isNaN(infoDef.value) ? toBinary(infoDef.value) : ''}}</td>
      </tr>
    </table>
    <div class="debug">
      [AddrInfoTable.vue debug]
      ip addr: {{ ipAddrString }}, mask: {{ ipBlock.mask }}
    </div>
  </div>
</template>

<script>
export default {
  props: ['ipAddrString', 'ipBlock'],
  computed: {
    infoDefs () {
      return [
        {
          name: 'IP Address',
          value: this.ipAddrString
        },
        {
          name: 'Subnet Length',
          value: this.ipBlock.bitmask
        },
        {
          name: 'Subnet Mask',
          value: this.ipBlock.mask
        },
        {
          name: 'Wild Card (Host Mask)',
          value: this.ipBlock.hostmask
        },
        {
          name: 'Network Address',
          value: this.ipBlock.base
        },
        {
          name: 'First Host Address',
          value: this.ipBlock.first
        },
        {
          name: 'Last Host Address',
          value: this.ipBlock.last
        },
        {
          name: 'Block Size (Number of Addresses)',
          value: this.ipBlock.size
        },
        {
          name: 'Previous CIDR Block',
          value: 'TODO' // TODO
        },
        {
          name: 'THIS CIDR Block',
          value: this.ipBlock.toString()
        },
        {
          name: 'Next CIDR Block',
          value: 'TODO' // TODO
        }
      ]
    }
  },
  methods: {
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
</style>
