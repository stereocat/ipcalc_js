var Vue = require("vue");
var ip = require("ip");
import * as d3 from 'd3';

var ipcalc_vue = new Vue({
    el: '#ipCalc',
    data: {
        ipAddr: '192.168.0.1',
        subnet: '255.255.255.0',
        invalidAddr: false,
        invalidMask: false,
        blockLayerNum: 2,
        svg: null
    },
    mounted: function() {
        this.svg = d3.select("body")
            .select("div#ipCalcView")
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height)
            .append("g")
            .attr("transform", "scale(0.9, 0.9)");
        this.treeView();
    },
    computed: {
        width: function () {
            return 0.7 * window.innerWidth;
        },
        height: function () {
            return this.blockLayerNum * this.width / Math.pow(2, this.blockLayerNum);
        },

        binIpAddr: function() {
            return this.toBin(this.ipAddr);
        },

        length: function() {
            var val = -1; // default (error value)
            if (this.validMaskLengthStr(this.subnet)) {
                val = Number(this.subnet);
            } else if (this.validIPv4MaskStr(this.subnet)) {
                // use dummy ip, to delink ipAddr validness
                val = ip.subnet('127.0.0.0', this.subnet).subnetMaskLength;
            } else {
                this.invalidMask = true;
            }
            return val;
        },

        netmask: function() {
            var val = '0.0.0.0'; // default
            if (this.validMaskLengthStr(this.subnet)) {
                val = ip.fromPrefixLen(Number(this.subnet));
            } else if (this.validIPv4MaskStr(this.subnet)) {
                val = this.subnet;
            } else {
                this.invalidMask = true;
            }
            return val;
        },
        binNetmask: function() {
            return this.toBin(this.netmask);
        },

        wildcard: function() {
            return ip.not(this.netmask);
        },
        binWildcard: function() {
            return this.toBin(this.wildcard);
        },

        network: function() {
            return this.ipv4Subnet().networkAddress;
        },
        binNetwork: function() {
            return this.toBin(this.network);
        },

        broadcast: function() {
            return this.ipv4Subnet().broadcastAddress;
        },
        binBroadcast: function() {
            return this.toBin(this.broadcast);
        },

        first: function() {
            return this.ipv4Subnet().firstAddress;
        },
        binFirst: function() {
            return this.toBin(this.first);
        },

        last: function() {
            return this.ipv4Subnet().lastAddress;
        },
        binLast: function() {
            return this.toBin(this.last);
        },

        numberOfHosts: function() {
            return this.ipv4Subnet().numHosts;
        },
        numberOfAddrs: function() {
            return this.ipv4Subnet().length;
        },

        addrType: function() {
            if (!this.validIPv4Str(this.ipAddr)) {
                console.log("invalid ipaddr in typeOfAddr, " + this.ipAddr);
                return false;
            }
            return this.searchAddrType();
        },
        rows: function() {
            return [
                { name: "IP Address", value: this.ipAddr, binary: this.binIpAddr },
                { name: "Subnet Length", value: this.length, binary: "" },
                { name: "Subnet Mask", value: this.netmask, binary: this.binNetmask },
                { name: "Wildcard", value: this.wildcard, binary: this.binWildcard },
                { name: "Network Address", value: this.network, binary: this.binNetwork },
                { name: "First Host Address", value: this.first, binary: this.binFirst },
                { name: "Last Host Address", value: this.last, binary: this.binLast },
                { name: "Broadcast Address", value: this.broadcast, binary: this.binBroadcast },
                { name: "Number of Hosts", value: this.numberOfHosts, binary: "" },
                { name: "Number of Addresses", value: this.numberOfAddrs, binary: "" },
                { name: "Prev Block", value: this.prevBlock, binary: "" },
                { name: "Next Block", value: this.nextBlock, binary: "" }
            ];
        },
        prevBlock: function() {
            try {
                var prevBCastAddrLong = ip.toLong(this.network) - 1;
                if (prevBCastAddrLong < 0) { // ip.toLong('0.0.0.0')
                    throw Error("prev block does not exists (this is first block)");
                }
                return this.cidrStr(ip.fromLong(prevBCastAddrLong), this.length);
            } catch(err) {
                console.log("error in prevBlock");
                return "";
            }
        },
        nextBlock: function() {
            try {
                var nextNWAddrLong = ip.toLong(this.broadcast) + 1;
                if (nextNWAddrLong > 4294967295) { // ip.toLong('255.255.255.255')
                    throw Error("next block does not exists (this is last block)");
                }
                return this.cidrStr(ip.fromLong(nextNWAddrLong), this.length);
            } catch(err) {
                console.log("error in nextBlock");
                return "";
            }
        },
        cidrAddr: function() {
            return this.cidrStr(this.ipAddr, this.length);
        },
        cidrBlock: function() {
            return this.cidrStr(this.network, this.length);
        },
        headBlotherBlock: function() {
            if (this.prevBlock) {
                console.log("parent nw: %s")
                return ip.cidrSubnet(this.parentBlock).networkAddress === this.network ?
                    this.cidrBlock : this.prevBlock;
            }
            return "";
        },
        tailBlotherBlock: function() {
            if (this.nextBlock) {
                return ip.cidrSubnet(this.parentBlock).broadcastAddress === this.broadcast ?
                    this.cidrBlock : this.nextBlock;
            }
            return "";
        },
        parentBlock: function() {
            if (this.length < 1) {
                console.log("parent block does not exists (this is maximum block)");
                return "";
            }
            return this.cidrStr(this.ipAddr, this.length - 1);
        },

        childrenBlocks: function() {
            if (this.length > 31) {
                console.log("children blocks does not exist (this is minimum block)");
                return ["", ""];
            }
            return [
                this.cidrStr(this.network, this.length + 1), // head block
                this.cidrStr(this.broadcast, this.length + 1) // tail block
            ];
        },
        headChildBlock: function() {
            return this.childrenBlocks[0];
        },
        tailChildBlock: function() {
            return this.childrenBlocks[1];
        },
        rootNode: function() {
            // convert to hierarchical Node object
            var rootCidrBlock = this.parentBlock || this.cidrBlock;
            return d3.hierarchy(this.buildAddrTree(rootCidrBlock, this.blockLayerNum))
                .sum(function(d) { return d.size; });
        }
    },
    watch: {
        ipAddr: function(newIPStr) {
            this.invalidAddr = true;
            if (this.validIPv4Str(newIPStr)) {
                this.invalidAddr = false; // clear invalid state
                this.ipAddr = newIPStr;
                this.treeView();
            }
        },
        subnet: function(newSubnetStr) {
            this.invalidMask = true;
            if (this.validMask(newSubnetStr)) {
                this.invalidMask = false; // clear invalid state
                this.subnet = newSubnetStr; // string (even if length-number)
                this.treeView();
            }
        }
    },
    methods: {
        treeView: function() {
            var padding = this.height / 20;

            var treemapLayout = d3.treemap()
                .tile(d3.treemapSlice)
                .round(true)
                .paddingOuter(padding)
                .paddingInner(padding)
                .size([this.width, this.height]);
            var layoutedNodeTree = treemapLayout(this.rootNode);
            console.log("layouted tree nodes: %o", layoutedNodeTree.descendants());

            var targetBlock = this.cidrBlock; // to refer in attr lambda

            // rectangles (NodeTree map)
            var svgRects = this.svg
                .selectAll("rect")
                .data(layoutedNodeTree.descendants());
            svgRects.enter()
                .append("rect")
                .attr("class", function(d) {
                    return d.data.name === targetBlock ? "targetBlock" : "normalBlock";
                })
                .attr("x", function(d) { return d.x0; })
                .attr("y", function(d) { return d.y0; })
                .attr("width", function(d) { return d.x1 - d.x0; })
                .attr("height", function(d) { return d.y1 - d.y0; });
            svgRects.exit()
                .remove();
            svgRects
                .attr("class", function(d) {
                    return d.data.name === targetBlock ? "targetBlock" : "normalBlock";
                })
                .attr("x", function(d) { return d.x0; })
                .attr("y", function(d) { return d.y0; })
                .attr("width", function(d) { return d.x1 - d.x0; })
                .attr("height", function(d) { return d.y1 - d.y0; });

            // text label
            var svgTexts = this.svg.selectAll("text")
                .data(layoutedNodeTree.descendants());
            svgTexts.enter()
                .append("text")
                .attr("x", function(d) { return d.x0; })
                .attr("y", function(d) { return d.y0; })
                .attr("dy", function(d) { return padding * 0.8; })
                .text(function(d) { return d.data.name; });
            svgTexts.exit()
                .remove();
            svgTexts
                .attr("x", function(d) { return d.x0; })
                .attr("y", function(d) { return d.y0; })
                .attr("dy", function(d) { return padding * 0.8; })
                .text(function(d) { return d.data.name; });
        },
        buildAddrTree: function(cidrStr, layerNum) {
            var subnet = ip.cidrSubnet(cidrStr);
            var nwAddr = subnet.networkAddress;
            var bcAddr = subnet.broadcastAddress;
            var childLength = subnet.subnetMaskLength + 1;
            var headChildNWAddr = ip.cidrSubnet([nwAddr, childLength].join('/')).networkAddress;
            var tailChildNWAddr = ip.cidrSubnet([bcAddr, childLength].join('/')).networkAddress;
            return layerNum === 0 || subnet.subnetMaskLength === 32 ? {
                    name: cidrStr,
                    size: subnet.length
                } : {
                    name: cidrStr,
                    children: [
                        this.buildAddrTree([headChildNWAddr, childLength].join('/'), layerNum - 1),
                        this.buildAddrTree([tailChildNWAddr, childLength].join('/'), layerNum - 1)
                    ]
                };
        },
        cidrStr: function(addrStr, length) {
            try {
                var subnet = ip.cidrSubnet([addrStr, length].join('/'));
                return [subnet.networkAddress, length].join('/');
            } catch(err) {
                console.log("error in cidrStr");
                return "";
            }
        },
        searchAddrType: function() {
            var blockList = [
                { addrBlock: "0.0.0.0/8", name: "This host on this network", rfc: 1122 },
                { addrBlock: "10.0.0.0/8", name: "Private-Use", rfc: 1918 },
                { addrBlock: "100.64.0.0/10", name: "Shared Address Space", rfc: 6598 },
                { addrBlock: "127.0.0.0/8", name: "Loopback", rfc: 1122 },
                { addrBlock: "169.254.0.0/16", name: "Link Local", rfc: 3927 },
                { addrBlock: "172.16.0.0/12", name: "Private-Use", rfc: 1918 },
                { addrBlock: "192.0.0.0/29", name: "DS-Lite", rfc: 6333 },
                { addrBlock: "192.0.0.0/24", name: "IETF Protocol Assignments", rfc: 6890 },
                { addrBlock: "192.0.2.0/24", name: "Documentation (TEST-NET-1)", rfc: 5737 },
                { addrBlock: "192.88.99.0/24 ", name: "6to4 Relay Anycast", rfc: 3068 },
                { addrBlock: "192.168.0.0/16", name: "Private-Use", rfc: 1918 },
                { addrBlock: "198.18.0.0/15", name: "Benchmarking", rfc: 2544 },
                { addrBlock: "198.51.100.0/24", name: "Documentation (TEST-NET-2)", rfc: 5737 },
                { addrBlock: "203.0.113.0/24", name: "Documentation (TEST-NET-3)", rfc: 5737 },
                { addrBlock: "224.0.0.0/4", name: "Multicast", rfc: 3171 },
                { addrBlock: "255.255.255.255/32", name: "Limited Broadcast", rfc: 919 },
                { addrBlock: "240.0.0.0/4", name: "Reserved", rfc: 1112 },
                // old
                { addrBlock: "14.0.0.0/8", name: "Public-Data Networks (in RFC3330) but no longer reserved", rfc: 5735 },
                { addrBlock: "24.0.0.0/8", name: "Cable Television Networks (in RFC3330) but no longer reserved", rfc: 5735 },
                { addrBlock: "39.0.0.0/8", name: "Reserved (in RFC3330) but no longer reserved", rfc: 5735 },
                { addrBlock: "128.0.0.0/16", name: "Reserved (in RFC3330) but no longer reserved", rfc: 5735 },
                { addrBlock: "191.255.0.0/16", name: "Reserved (in RFC3330) but no longer reserved", rfc: 5735 },
                { addrBlock: "223.255.255.0/24", name: "Reserved (in RFC3330) but no longer reserved", rfc: 5735 }
            ];
            var ipaddr = this.ipAddr;
            for(var i = 0; i < blockList.length; i++) {
                if (ip.cidrSubnet(blockList[i].addrBlock).contains(this.ipAddr)) {
                    return blockList[i];
                }
            }
            return false;
        },
        validMask: function(subnetStr) {
            return this.validMaskLengthStr(subnetStr) || this.validIPv4MaskStr(subnetStr);
        },
        ipv4Subnet: function() {
            if (!this.validIPv4Str(this.ipAddr)) {
                this.invalidAddr = true;
                return ip.subnet('127.0.0.1', '255.255.255.0'); // dummy
            }
            if (!this.validMask(this.netmask)) {
                this.invalidMask = true;
                return ip.subnet('127.0.0.1', '255.255.255.0'); // dummy
            }
            return ip.subnet(this.ipAddr, this.netmask);
        },
        validIPv4MaskStr: function(ipv4MaskStr) {
            return /^(((255\.){3}(255|254|252|248|240|224|192|128|0+))|((255\.){2}(255|254|252|248|240|224|192|128|0+)\.0)|((255\.)(255|254|252|248|240|224|192|128|0+)(\.0+){2})|((255|254|252|248|240|224|192|128|0+)(\.0+){3}))$/.test(ipv4MaskStr);
        },
        validIPv4Str: function(ipv4Str) {
            // return ip.isV4Format(ipv4Str); // it is not good format checker...
            return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipv4Str);
        },
        validMaskLengthStr: function(lenStr) {
            return (/^\d+$/.test(lenStr) && Number(lenStr) >= 0 && Number(lenStr) <= 32);
        },
        toBin: function(dottedStr) {
            try {
                var buf = ip.toBuffer(dottedStr);
                var octets = [];
                for (var i = 0; i < buf.length; i++) {
                    octets.push(this.paddingOctet(buf[i].toString(2)));
                }
                var binDottedStr = octets.join('.');
                if (this.length > 0) {
                    var sep = this.length + Math.floor((this.length - 1) / 8);
                    var headStr = binDottedStr.slice(0, sep);
                    var tailStr = binDottedStr.slice(sep);
                    return { head: headStr, tail: tailStr };
                } else {
                    return { head: "", tail: binDottedStr };
                }
            } catch (err) {
                console.log("error in toBin");
                return "";
            }
        },
        paddingOctet: function(octetBinStr) {
            return ('00000000' + octetBinStr).slice(-8);
        }
    }
});
