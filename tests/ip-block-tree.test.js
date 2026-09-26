import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import App from '../src/App.vue'
import IPBlockTree from '../src/components/IPBlockTree.vue'
import { useIPStore } from '../src/store'

const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds))
let wrapper

afterEach(() => {
  wrapper?.unmount()
})

describe('Address Block Tree', () => {
  it('redraws around the CIDR selected from the tree', async () => {
    wrapper = mount(App, {
      attachTo: document.body,
      global: {
        plugins: [createPinia(), ElementPlus]
      }
    })
    await wait(900)

    const store = useIPStore()
    const initialBlock = store.ipBlock
    const tree = wrapper.findComponent(IPBlockTree)
    const target = wrapper
      .findAll('#ipaddr-block-tree text')
      .find(node => node.text() === '127.0.0.0/9')

    expect(target).toBeDefined()
    await target.trigger('click')
    await wait(900)

    const updatedLabels = wrapper
      .findAll('#ipaddr-block-tree text')
      .map(node => node.text())

    expect(store.ipBlock).not.toBe(initialBlock)
    expect(store.ipBlock.toString()).toBe('127.0.0.0/9')
    expect(tree.vm.selfBlock).toBe('127.0.0.0/9')
    expect(tree.vm.rootNode.data.name).toBe('127.0.0.0/8')
    expect(wrapper.get('input').element.value).toBe('127.0.0.0/9')
    expect(updatedLabels).toContain('127.0.0.0/10')
    expect(updatedLabels).not.toContain('126.0.0.0/7')
  })
})
