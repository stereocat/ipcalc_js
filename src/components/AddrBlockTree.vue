<template>
  <div id="addr-block-tree">
    <div class="debug" v-bind:style="{ display: debugDisplay }">
      [AddrBlockTree.vue debug]
      ip address: {{ ipAddrString }}
      ip block: {{ selfBlock }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ip from 'ip'
import { Netmask } from 'netmask'
import { select } from 'd3-selection'
import { hierarchy, treemap, treemapSlice } from 'd3-hierarchy'
import '../css/addr-tree.css'

export default {
  data () {
    return {
      debugDisplay: 'none',
      height: 600,
      width: 400,
      blockLayerNum: 3, // depth: parent(1) + children(2)
      svg: null
    }
  },
  computed: {
    ...mapGetters(['ipAddrString', 'ipBlock']),
    prefixLength () {
      return this.ipBlock.bitmask
    },
    networkAddress () {
      return this.ipBlock.base
    },
    selfBlock () {
      return this.ipBlock.toString()
    },
    rootNode () {
      // convert to hierarchical Node object
      const rootCidrBlock = this.findOriginBlock()
      return hierarchy(this.buildAddrTree(rootCidrBlock, this.blockLayerNum))
        .sum(d => d.size)
    }
  },
  mounted () {
    this.svg = select('div#addr-block-tree')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', 'scale(0.9, 0.9)')
    this.$store.watch(
      // watch both ipAddrString and ipBlock
      state => `${state.ipAddrString}/${this.prefixLength}`,
      (newStr, oldStr) => {
        // console.log(`watch store: ${oldStr} -> ${newStr}`)
        this.treeView()
      }
    )
  },
  methods: {
    nParentBlock (gen) {
      if (this.prefixLength < gen) {
        console.log(`${gen}-parent block does not exists (this is maximum block)`)
        return null
      }
      const parentBlock = new Netmask(`${this.networkAddress}/${this.prefixLength - gen}`)
      return parentBlock.toString()
    },
    findOriginBlock () {
      const hostLength = 32 - this.prefixLength
      const parentDepth = hostLength < this.blockLayerNum ? this.blockLayerNum - hostLength : 1
      return this.nParentBlock(parentDepth) || this.selfBlock
    },
    treeView () {
      const padding = this.height / 30

      const treemapLayout = treemap()
        .tile(treemapSlice)
        .round(true)
        .paddingOuter(padding)
        .paddingInner(padding)
        .size([this.width, this.height])
      const layoutedNodeTree = treemapLayout(this.rootNode)

      const setClass = (d) => {
        return d.data.name === this.selfBlock ? 'targetBlock' : 'normalBlock'
      }

      // rectangles (NodeTree map)
      const svgRects = this.svg
        .selectAll('rect')
        .data(layoutedNodeTree.descendants())
      svgRects.enter()
        .append('rect')
        .attr('class', setClass)
        .attr('x', d => d.x0)
        .attr('y', d => d.y0)
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
      svgRects.exit()
        .remove()
      svgRects
        .attr('class', setClass)
        .attr('x', d => d.x0)
        .attr('y', d => d.y0)
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)

      // text label
      const svgTexts = this.svg.selectAll('text')
        .data(layoutedNodeTree.descendants())
      svgTexts.enter()
        .append('text')
        .attr('x', d => d.x0)
        .attr('y', d => d.y0)
        .attr('dy', padding * 0.8)
        .attr('class', setClass)
        .text(d => d.data.name)
      svgTexts.exit()
        .remove()
      svgTexts
        .attr('x', d => d.x0)
        .attr('y', d => d.y0)
        .attr('dy', padding * 0.8)
        .attr('class', setClass)
        .text(d => d.data.name)
    },
    buildAddrTree (cidrStr, layerNum) {
      const subnet = ip.cidrSubnet(cidrStr)
      const nwAddr = subnet.networkAddress
      const bcAddr = subnet.broadcastAddress
      const childLength = subnet.subnetMaskLength + 1
      const headChildNWAddr = ip.cidrSubnet(`${nwAddr}/${childLength}`).networkAddress
      const tailChildNWAddr = ip.cidrSubnet(`${bcAddr}/${childLength}`).networkAddress
      if (layerNum === 0 || subnet.subnetMaskLength === 32) {
        return { name: cidrStr, size: subnet.length }
      }
      return {
        name: cidrStr,
        children: [
          this.buildAddrTree(`${headChildNWAddr}/${childLength}`, layerNum - 1),
          this.buildAddrTree(`${tailChildNWAddr}/${childLength}`, layerNum - 1)
        ]
      }
    }
  }
}
</script>

<style scoped>
</style>
