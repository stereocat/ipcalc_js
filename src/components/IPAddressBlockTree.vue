<template>
  <div id="ipaddr-block-tree">
    <div>
      "Address block tree" shows single supernet (parent) and its subnets (children).
    </div>
    <div class="debug" v-bind:style="{ display: debugDisplay }">
      [AddrBlockTree.vue debug]
      ip address: {{ ipAddrString }}
      ip block: {{ selfBlock }}
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import ip from 'ip'
import { Netmask } from 'netmask'
import { select } from 'd3-selection'
import { hierarchy, partition } from 'd3-hierarchy'
import { transition } from 'd3-transition'
import { easeElasticOut } from 'd3-ease'
import '../css/addr-tree.css'

export default {
  data () {
    return {
      debugDisplay: 'none',
      height: 400,
      width: 600,
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
      const addrTreeData = this.buildAddrTree(rootCidrBlock, this.blockLayerNum)
      return hierarchy(addrTreeData).sum(d => d.size)
    }
  },
  mounted () {
    this.svg = select('div#ipaddr-block-tree')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
    // make addr tree diagrams at first
    this.treeView()
    // add input watcher
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
    ...mapMutations(['setIPAddrString', 'setIPBlock']),
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
    addHighlightToRect (d) {
      select(`rect[id='${d.data.name}']`)
        .classed('selected', true)
    },
    removeHighlightToRect (d) {
      select(`rect[id='${d.data.name}']`)
        .classed('selected', false)
    },
    updateStateToBlock (d) {
      const block = new Netmask(d.data.name)
      this.setIPAddrString(block.base)
      this.setIPBlock(block)
    },
    setObjectPositionForTransition (target) {
      const p = 10
      this.svg.selectAll(target)
        .attr('x', d => d.y0 + p)
    },
    createRectangles (data) {
      // NOTICE: transposed x/y
      // rectangles (NodeTree map)
      const svgRect = this.svg
        .selectAll('rect')
        .data(data)
      const svgRectEnter = svgRect // 1st time (if not exists rectangles)
        .enter()
        .append('rect')
      svgRect.merge(svgRectEnter)
        .attr('id', d => `${d.data.name}`)
        .attr('class', this.setClass)
        .on('mouseover', this.addHighlightToRect)
        .on('mouseout', this.removeHighlightToRect)
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
      // labels for rectangles (address block)
      const svgText = this.svg.selectAll('text')
        .data(data)
      const svgTextEnter = svgText // 1st time (if not exists rectangles)
        .enter()
        .append('text')
      svgTextEnter.merge(svgText)
        .attr('class', this.setClass)
        .on('mouseover', this.addHighlightToRect)
        .on('mouseout', this.removeHighlightToRect)
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
