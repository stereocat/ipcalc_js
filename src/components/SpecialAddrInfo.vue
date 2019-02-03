<template>
  <div id="special-addr-info">
    <transition>
      <div class="addr-info"
           v-if="containsSpecialBlock">
        THIS block contains special use address block:
        <strong>{{ containsSpecialBlock.addrBlock }}</strong>
        ({{ containsSpecialBlock.name }}).
        See:
        <a v-bind:href="`https://tools.ietf.org/html/rfc${containsSpecialBlock.rfc}`"
           target="_blank" rel="noopener noreferrer">
          RFC{{ containsSpecialBlock.rfc }}
        </a>
      </div>
    </transition>
    <transition>
      <div class="addr-info"
           v-if="containedSpecialBlock && !foundSameBlock">
        THIS block is contained by special use address block:
        <strong>{{ containedSpecialBlock.addrBlock }}</strong>
        ({{ containedSpecialBlock.name }}).
        See:
        <a v-bind:href="`https://tools.ietf.org/html/rfc${containedSpecialBlock.rfc}`"
           target="_blank" rel="noopener noreferrer">
          RFC{{ containedSpecialBlock.rfc }}
        </a>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Netmask } from 'netmask'

export default {
  data () {
    return {
      blockList: [
        { addrBlock: '0.0.0.0/8', name: 'This host on this network', rfc: 1122 },
        { addrBlock: '10.0.0.0/8', name: 'Private-Use', rfc: 1918 },
        { addrBlock: '100.64.0.0/10', name: 'Shared Address Space', rfc: 6598 },
        { addrBlock: '127.0.0.0/8', name: 'Loopback', rfc: 1122 },
        { addrBlock: '169.254.0.0/16', name: 'Link Local', rfc: 3927 },
        { addrBlock: '172.16.0.0/12', name: 'Private-Use', rfc: 1918 },
        { addrBlock: '192.0.0.0/29', name: 'DS-Lite', rfc: 6333 },
        { addrBlock: '192.0.0.0/24', name: 'IETF Protocol Assignments', rfc: 6890 },
        { addrBlock: '192.0.2.0/24', name: 'Documentation (TEST-NET-1)', rfc: 5737 },
        { addrBlock: '192.88.99.0/24 ', name: '6to4 Relay Anycast', rfc: 3068 },
        { addrBlock: '192.168.0.0/16', name: 'Private-Use', rfc: 1918 },
        { addrBlock: '198.18.0.0/15', name: 'Benchmarking', rfc: 2544 },
        { addrBlock: '198.51.100.0/24', name: 'Documentation (TEST-NET-2)', rfc: 5737 },
        { addrBlock: '203.0.113.0/24', name: 'Documentation (TEST-NET-3)', rfc: 5737 },
        { addrBlock: '224.0.0.0/4', name: 'Multicast', rfc: 3171 },
        { addrBlock: '255.255.255.255/32', name: 'Limited Broadcast', rfc: 919 },
        { addrBlock: '240.0.0.0/4', name: 'Reserved', rfc: 1112 },
        // old
        { addrBlock: '14.0.0.0/8', name: 'Public-Data Networks (in RFC3330) but no longer reserved', rfc: 5735 },
        { addrBlock: '24.0.0.0/8', name: 'Cable Television Networks (in RFC3330) but no longer reserved', rfc: 5735 },
        { addrBlock: '39.0.0.0/8', name: 'Reserved (in RFC3330) but no longer reserved', rfc: 5735 },
        { addrBlock: '128.0.0.0/16', name: 'Reserved (in RFC3330) but no longer reserved', rfc: 5735 },
        { addrBlock: '191.255.0.0/16', name: 'Reserved (in RFC3330) but no longer reserved', rfc: 5735 },
        { addrBlock: '223.255.255.0/24', name: 'Reserved (in RFC3330) but no longer reserved', rfc: 5735 }
      ]
    }
  },
  computed: {
    ...mapGetters(['ipAddrString', 'ipBlock']),
    foundSameBlock () {
      return this.containsSpecialBlock && this.containedSpecialBlock &&
        this.containedSpecialBlock.addrBlock === this.containsSpecialBlock.addrBlock
    },
    containsSpecialBlock () {
      return this.blockList.find(d => {
        return this.ipBlock.contains(d.addrBlock)
      })
    },
    containedSpecialBlock () {
      return this.blockList.find(d => {
        const sp = new Netmask(d.addrBlock)
        return sp.contains(this.ipBlock.base)
      })
    }
  }
}
</script>

<style scoped>
div.addr-info {
  border: 3px darkgreen solid;
  padding: 0.5em;
  background-color: mintcream;
  margin: 0.2em;
}
div strong {
  text-decoration: underline;
}
.v-enter, .v-leave-to {
  opacity: 0;
}
.v-enter-active, .v-leave-active {
  transition: opacity .5s;
}
</style>
