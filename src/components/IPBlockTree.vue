<template>
  <div id="ipaddr-block-tree">
    <div>
      "Address block tree" shows single supernet (parent) and its subnets (children).
    </div>
    <div
      class="debug"
      v-bind:style="{ display: debugDisplay }"
    >
      [AddrBlockTree.vue debug]
      ip block: {{ selfBlock }}
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'pinia'
import { Netmask } from 'netmask'
import { select } from 'd3-selection'
import { hierarchy, partition } from 'd3-hierarchy'
import { transition } from 'd3-transition'
import { easeElasticOut } from 'd3-ease'
import { useIPStore } from '../store'
import { getIPv4CIDRInfo } from '../js/ip-address'
import '../css/addr-tree.css'

export default {
  data () {
    return {
      debugDisplay: 'none',
      height: 400,
      width: 600,
      blockLayerNum: 3,
      svg: null,
      unsubscribeStore: null
    }
  },
  computed: {
    ...mapState(useIPStore, ['ipBlock']),
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
      const rootCidrBlock = this.findOriginBlock()
      const addrTreeData = this.buildAddrTree(rootCidrBlock, this.blockLayerNum)
      return hierarchy(addrTreeData).sum(d => d.size)
    }
  },
  mounted () {
    this.svg = select('div#ipaddr-block-tree')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
    this.treeView()

    const store = useIPStore()
    this.unsubscribeStore = store.$subscribe(() => {
      this.treeView()
    })
  },
  beforeUnmount () {
    this.unsubscribeStore?.()
  },
  methods: {
    ...mapActions(useIPStore, ['selectIPBlock']),
    nParentBlock (gen) {
      if (this.prefixLength < gen) {
        return '0.0.0.0/0'
      }
      const parentBlock = new Netmask(`${this.networkAddress}/${this.prefixLength - gen}`)
      return parentBlock.toString()
    },
    findOriginBlock () {
      const hostLength = 32 - this.prefixLength
      const parentDepth = hostLength < this.blockLayerNum ? this.blockLayerNum - hostLength : 1
      return this.nParentBlock(parentDepth) || this.selfBlock
    },
    makeLayout () {
      return partition()
        .round(true)
        .padding(10)
        .size([this.height, this.width])
    },
    rectTransition () {
      return transition()
        .duration(500)
        .ease(easeElasticOut)
    },
    setClass (d) {
      return d.data.name === this.selfBlock ? 'targetBlock' : 'normalBlock'
    },
    addHighlightToRect (_event, d) {
      select(`rect[id='${d.data.name}']`)
        .classed('selected', true)
    },
    removeHighlightFromRect (_event, d) {
      select(`rect[id='${d.data.name}']`)
        .classed('selected', false)
    },
    updateStateToBlock (_event, d) {
      const block = new Netmask(d.data.name)
      this.selectIPBlock(block.base, block)
    },
    setObjectPositionForTransition (target) {
      const p = 10
      this.svg.selectAll(target)
        .attr('x', d => d.y0 + p)
    },
    createRectangles (data) {
      const svgRect = this.svg
        .selectAll('rect')
        .data(data, d => d.data.name)
      svgRect.exit().remove()
      const svgRectEnter = svgRect
        .enter()
        .append('rect')
      svgRect.merge(svgRectEnter)
        .attr('id', d => `${d.data.name}`)
        .attr('class', this.setClass)
        .on('mouseover', this.addHighlightToRect)
        .on('mouseout', this.removeHighlightFromRect)
        .on('click', this.updateStateToBlock)
        .attr('rx', 5)
        .attr('ry', 5)
        .attr('width', d => d.y1 - d.y0)
        .attr('height', d => d.x1 - d.x0)
        .transition(this.rectTransition())
        .delay((d, i) => i * 30)
        .attr('x', d => d.y0)
        .attr('y', d => d.x0)
    },
    createLabels (data) {
      const svgText = this.svg
        .selectAll('text')
        .data(data, d => d.data.name)
      svgText.exit().remove()
      const svgTextEnter = svgText
        .enter()
        .append('text')
      svgTextEnter.merge(svgText)
        .attr('class', this.setClass)
        .on('mouseover', this.addHighlightToRect)
        .on('mouseout', this.removeHighlightFromRect)
        .on('click', this.updateStateToBlock)
        .transition(this.rectTransition())
        .delay((d, i) => i * 25)
        .attr('x', d => d.y0)
        .attr('y', d => d.x0)
        .attr('dx', 5)
        .attr('dy', 15)
        .text(d => d.data.name)
    },
    treeView () {
      const layout = this.makeLayout()
      const layoutedNodeTree = layout(this.rootNode)
      this.setObjectPositionForTransition('rect')
      this.createRectangles(layoutedNodeTree.descendants())
      this.setObjectPositionForTransition('text')
      this.createLabels(layoutedNodeTree.descendants())
    },
    buildAddrTree (cidrStr, layerNum) {
      const subnet = getIPv4CIDRInfo(cidrStr)
      const childLength = subnet.prefixLength + 1
      if (layerNum === 0 || subnet.prefixLength === 32) {
        return { name: cidrStr, size: subnet.size }
      }
      const headChild = getIPv4CIDRInfo(`${subnet.networkAddress}/${childLength}`)
      const tailChild = getIPv4CIDRInfo(`${subnet.broadcastAddress}/${childLength}`)
      return {
        name: cidrStr,
        children: [
          this.buildAddrTree(`${headChild.networkAddress}/${childLength}`, layerNum - 1),
          this.buildAddrTree(`${tailChild.networkAddress}/${childLength}`, layerNum - 1)
        ]
      }
    }
  }
}
</script>

<style scoped>
</style>
