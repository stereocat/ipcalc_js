import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import App from '../src/App.vue'

let wrapper

afterEach(() => {
  wrapper?.unmount()
  wrapper = null
  vi.useRealTimers()
})

function mountApp () {
  return mount(App, {
    attachTo: document.body,
    global: {
      plugins: [createPinia(), ElementPlus]
    }
  })
}

describe('App', () => {
  it('renders the calculator and its address block tree', async () => {
    wrapper = mountApp()
    await nextTick()

    expect(wrapper.get('h1').text()).toBe('IP Calculator')
    expect(wrapper.get('input').element.value).toBe('127.0.0.1/8')
    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.text()).toContain('Loopback')
  })

  it('updates all results after a valid delayed input', async () => {
    vi.useFakeTimers()
    wrapper = mountApp()
    const input = wrapper.get('input')

    await input.setValue('192.168.1.10/24')
    await input.trigger('keyup')
    await vi.advanceTimersByTimeAsync(1000)
    await nextTick()

    expect(wrapper.text()).toContain('192.168.1.0')
    expect(wrapper.text()).toContain('192.168.1.255')
    expect(wrapper.text()).toContain('Private-Use')
  })

  it('rejects non-standard IPv4 notation', async () => {
    wrapper = mountApp()
    const input = wrapper.get('input')

    await input.setValue('127.1/8')
    await input.trigger('keyup')

    expect(wrapper.text()).toContain('There is invalid IP/Mask')
  })
})
