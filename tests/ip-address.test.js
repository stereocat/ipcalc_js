import { describe, expect, it } from 'vitest'
import {
  getIPv4CIDRInfo,
  ipv4ToByteArray,
  ipv4ToLong,
  isValidIPv4
} from '../src/js/ip-address'

describe('IPv4 helpers', () => {
  it('accepts only four-part decimal IPv4 addresses', () => {
    expect(isValidIPv4('192.168.1.1')).toBe(true)
    expect(isValidIPv4('127.1')).toBe(false)
    expect(isValidIPv4('0x7f.0.0.1')).toBe(false)
    expect(isValidIPv4('256.0.0.1')).toBe(false)
  })

  it('converts an IPv4 address to an unsigned integer', () => {
    expect(ipv4ToLong('0.0.0.0')).toBe(0)
    expect(ipv4ToLong('127.0.0.1')).toBe(2130706433)
    expect(ipv4ToLong('255.255.255.255')).toBe(4294967295)
  })

  it('converts an IPv4 address to bytes', () => {
    expect(ipv4ToByteArray('192.0.2.1')).toEqual([192, 0, 2, 1])
  })

  it('derives IPv4 CIDR boundaries', () => {
    expect(getIPv4CIDRInfo('192.168.1.42/24')).toEqual({
      networkAddress: '192.168.1.0',
      broadcastAddress: '192.168.1.255',
      prefixLength: 24,
      size: 256
    })
  })

  it('handles prefix boundary blocks', () => {
    expect(getIPv4CIDRInfo('0.0.0.0/0').size).toBe(4294967296)
    expect(getIPv4CIDRInfo('203.0.113.5/32')).toEqual({
      networkAddress: '203.0.113.5',
      broadcastAddress: '203.0.113.5',
      prefixLength: 32,
      size: 1
    })
  })
})
