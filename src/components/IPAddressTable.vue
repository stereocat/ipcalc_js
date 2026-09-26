<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(ipNotation, index) in ipNotations"
          v-bind:key="ipNotation.name"
          v-bind:class="index % 2 ? 'even-row' : 'odd-row'"
        >
          <td class="name">
            {{ ipNotation.name }}
          </td>
          <td class="value">
            <span
              class="literal-head"
              v-if="ipNotation.head"
            >
              {{ ipNotation.head }}
            </span>
            <span class="literal-body">{{ ipNotation.body }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useIPStore } from '../store'
import { ipv4ToLong } from '../js/ip-address'

export default {
  computed: {
    ...mapState(useIPStore, ['ipAddrString']),
    ipNotations () {
      return [
        { name: 'Dotted Decimal', base: null },
        { name: 'Binary', base: 2 },
        { name: 'Octal', base: 8 },
        { name: 'Decimal', base: 10 },
        { name: 'Hexadecimal', base: 16 }
      ].map(d => this.convertIPValue(d.name, d.base))
    }
  },
  methods: {
    convertIPValue (name, base) {
      let head
      switch (base) {
        case 2:
          head = '0b'
          break
        case 8:
          head = '0o'
          break
        case 10:
          head = '0d'
          break
        case 16:
          head = '0x'
          break
        default:
          return { name: name, head: '', body: this.ipAddrString }
      }
      return {
        name: name,
        head: head,
        body: ipv4ToLong(this.ipAddrString).toString(base)
      }
    }
  }
}
</script>

<style src="../css/info-table.css" scoped>
</style>
