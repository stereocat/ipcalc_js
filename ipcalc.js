var Vue = require("vue");
var ip = require("ip");

var app = new Vue({
    el: '#ipCalc',
    data: {
        ipAddr: '192.168.0.1',
        subnet: '255.255.255.0',
        invalidAddr: true
    },
    computed: {
        binIpAddr: function() {
            return this.toBin(this.ipAddr);
        },

        length: function () {
            var val = this.subnet; // String
            if (/^\d+\.\d+\.\d+.\d+$/.test(this.subnet)) {
                try {
                    this.invalidAddr = false;
                    val = ip.subnet(this.ipAddr, this.subnet).subnetMaskLength; // Number
                }
                catch(err) {
                    console.log("catch error in length");
                    this.invalidAddr = true;
                    val = -1;
                }
            }
            return Number(val); // always number
        },

        netmask: function () {
            var val = this.subnet;
            if(/^\d+$/.test(this.subnet)) {
                try {
                    this.invalidAddr = false;
                    val = ip.fromPrefixLen(Number(this.subnet));
                }
                catch(err) {
                    console.log("catch error in netmask");
                    this.invalidAddr = true;
                    val = "0.0.0.0";
                }
            }
            return val;
        },
        binNetmask: function() {
            return this.toBin(this.netmask);
        },

        wildcard: function () {
            try {
                this.invalidAddr = false;
                return ip.not(this.netmask);
            }
            catch (err) {
                this.invalidAddr = true;
                console.log("catch error in wildcard");
                return "0.0.0.0";
            }
        },
        binWildcard: function() {
            return this.toBin(this.wildcard);
        },

        network: function () {
            try {
                this.invalidAddr = false;
                return ip.subnet(this.ipAddr, this.netmask).networkAddress;
            }
            catch (err) {
                this.invalidAddr = true;
                console.log("catch error in network");
                return "0.0.0.0";
            }
        },
        binNetwork: function() {
            return this.toBin(this.network);
        },

        broadcast: function() {
            try {
                this.invalidAddr = false;
                return ip.subnet(this.ipAddr, this.netmask).broadcastAddress;
            }
            catch (err) {
                this.invalidAddr = true;
                console.log("catch error in broadcast");
                return "0.0.0.0";
            }
        },
        binBroadcast: function() {
            return this.toBin(this.broadcast);
        },

        first: function() {
            try {
                this.invalidAddr = false;
                return ip.subnet(this.ipAddr, this.netmask).firstAddress;
            }
            catch (err) {
                this.invalidAddr = true;
                console.log("catch error in first");
                return "0.0.0.0";
            }
        },
        binFirst: function() {
            return this.toBin(this.first);
        },

        last: function() {
            try {
                this.invalidAddr = false;
                return ip.subnet(this.ipAddr, this.netmask).lastAddress;
            }
            catch (err) {
                this.invalidAddr = true;
                console.log("catch error in last");
                return "0.0.0.0";
            }
        },
        binLast: function() {
            return this.toBin(this.last);
        },

        numberOfHosts: function() {
            try {
                this.invalidAddr = false;
                return ip.subnet(this.ipAddr, this.netmask).numHosts;
            }
            catch (err) {
                this.invalidAddr = true;
                console.log("catch error in numberOfHosts");
                return -1;
            }
        },
        numberOfAddrs: function() {
            try {
                this.invalidAddr = false;
                return ip.subnet(this.ipAddr, this.netmask).length;
            }
            catch (err) {
                this.invalidAddr = true;
                console.log("catch error in numberOfAddrs");
                return -1;
            }
        },
        rows: function () {
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
    methods: {
        toBin: function(dottedStr) {
            try {
                this.invalidAddr = false;
                var buf = ip.toBuffer(dottedStr);
                var octets = [];
                for(var i=0; i<buf.length; i++) {
                    octets.push(this.paddingOctet(buf[i].toString(2)));
                }
                var dottedStr = octets.join('.');
                var sep = this.length + Math.floor((this.length - 1) / 8);
                var headStr = dottedStr.slice(0, sep);
                var tailStr = dottedStr.slice(sep);
                return { head: headStr, tail: tailStr };
            }
            catch (err) {
                console.log("error in toBin");
                this.invalidAddr = true;
                return "";
            }
        },
        paddingOctet: function(octetBinStr) {
            return ('00000000' + octetBinStr ).slice(-8);
        }
    }
})
