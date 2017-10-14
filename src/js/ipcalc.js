var Vue = require("vue");
var ip = require("ip");

var app = new Vue({
    el: '#ipCalc',
    data: {
        ipAddr: '192.168.0.1',
        subnet: '255.255.255.0',
        invalidAddr: false,
        invalidMask: false
    },
    computed: {
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
                { name: "Number of Addresses", value: this.numberOfAddrs, binary: "" }
            ];
        }
    },
    watch: {
        ipAddr: function(newIPStr) {
            this.invalidAddr = true;
            if (this.validIPv4Str(newIPStr)) {
                this.invalidAddr = false; // clear invalid state
                this.ipAddr = newIPStr;
            }
        },
        subnet: function(newSubnetStr) {
            this.invalidMask = true;
            if (this.validMask(newSubnetStr)) {
                this.invalidMask = false; // clear invalid state
                this.subnet = newSubnetStr; // string (even if length-number)
            }
        }
    },
    methods: {
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
                console.log("error in toBin, %s", err);
                return "";
            }
        },
        paddingOctet: function(octetBinStr) {
            return ('00000000' + octetBinStr).slice(-8);
        }
    }
});
