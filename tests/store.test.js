import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { Netmask } from 'netmask'
import { useIPStore } from '../src/store'

describe('IP store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('updates the address and network block atomically', () => {
    const store = useIPStore()
    const block = new Netmask('192.168.1.10/24')

    store.selectIPBlock('192.168.1.10', block)

    expect(store.ipAddrString).toBe('192.168.1.10')
    expect(store.ipBlock.toString()).toBe('192.168.1.0/24')
  })
})
