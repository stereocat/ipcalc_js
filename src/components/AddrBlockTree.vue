<template>
  <div id="addr-block-tree">
    <h2>Address Block Tree</h2>
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
import { select } from 'd3-selection'
import { hierarchy, treemap, treemapSlice } from 'd3-hierarchy'
import '../css/addr-tree.css'

export default {
  data () {
    return {
      debugDisplay: 'none',
      height: 400,
      width: 500,
      blockLayerNum: 2,
      svg: null
    }
  },
  computed: {
    ...mapGetters(['ipAddrString', 'ipBlock']),
    prefixLength () {
      return this.ipBlock.bitmask
    },
    selfBlock () {
      return this.ipBlock.toString()
    },
    parentBlock () {
      if (this.prefixLength < 1) {
        console.log('parent block does not exists (this is maximum block)')
        return null
      }
      return this.cidrStr(this.ipAddrString, this.prefixLength - 1)
    },
    childrenBlocks () {
      if (this.prefixLength > 31) {
        console.log('children blocks does not exist (this is minimum block)')
        return ['', '']
      }
      return [
        this.cidrStr(this.ipBlock.base, this.prefixLength + 1), // head block
        this.cidrStr(this.ipBlock.broadcast, this.prefixLength + 1) // tail block
      ]
    },
    rootNode () {
      // convert to hierarchical Node object
      const rootCidrBlock = this.parentBlock || this.selfBlock
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
      state => `${state.ipAddrString}/${state.ipBlock.bitmask}`,
      (newStr, oldStr) => {
        // console.log(`watch store: ${oldStr} -> ${newStr}`)
        this.treeView()
      }
    )
  },
  methods: {
    cidrStr (addrStr, length) {
      try {
        const subnet = ip.cidrSubnet([addrStr, length].join('/'))
        return [subnet.networkAddress, length].join('/')
      } catch {
        return ''
      }
    },
    treeView () {
      const padding = this.height / 20

      const treemapLayout = treemap()
        .tile(treemapSlice)
        .round(true)
        .paddingOuter(padding)
        .paddingInner(padding)
        .size([this.width, this.height])
      const layoutedNodeTree = treemapLayout(this.rootNode)

      // aliases, to refer in attr lambda
      const targetBlock = this.selfBlock

      // rectangles (NodeTree map)
      const svgRects = this.svg
        .selectAll('rect')
        .data(layoutedNodeTree.descendants())

      function setClass (d) {
        return [
          d.data.name,
          d.data.name === targetBlock ? 'targetBlock' : 'normalBlock'
        ].join(' ')
      }
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
      const headChildNWAddr = ip.cidrSubnet([nwAddr, childLength].join('/')).networkAddress
      const tailChildNWAddr = ip.cidrSubnet([bcAddr, childLength].join('/')).networkAddress
      return layerNum === 0 || subnet.subnetMaskLength === 32 ? {
        name: cidrStr,
        size: subnet.length
      } : {
        name: cidrStr,
        children: [
          this.buildAddrTree([headChildNWAddr, childLength].join('/'), layerNum - 1),
          this.buildAddrTree([tailChildNWAddr, childLength].join('/'), layerNum - 1)
        ]
      }
    }
  }
}
</script>

<style scoped>
</style>
