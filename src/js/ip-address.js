import ipaddr from 'ipaddr.js'

export function isValidIPv4 (address) {
  return ipaddr.IPv4.isValidFourPartDecimal(address)
}

export function parseIPv4 (address) {
  if (!isValidIPv4(address)) {
    throw new Error(`Invalid IPv4 address: ${address}`)
  }
  return ipaddr.IPv4.parse(address)
}

export function ipv4ToLong (address) {
  return parseIPv4(address).octets.reduce((value, octet) => {
    return value * 256 + octet
  }, 0)
}

export function ipv4ToByteArray (address) {
  return parseIPv4(address).toByteArray()
}

export function getIPv4CIDRInfo (cidr) {
  if (!ipaddr.IPv4.isValidCIDRFourPartDecimal(cidr)) {
    throw new Error(`Invalid IPv4 CIDR block: ${cidr}`)
  }

  const [, prefixLength] = ipaddr.IPv4.parseCIDR(cidr)
  return {
    networkAddress: ipaddr.IPv4.networkAddressFromCIDR(cidr).toString(),
    broadcastAddress: ipaddr.IPv4.broadcastAddressFromCIDR(cidr).toString(),
    prefixLength,
    size: 2 ** (32 - prefixLength)
  }
}
