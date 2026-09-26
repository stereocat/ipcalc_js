import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AppHeader from '../src/components/AppHeader.vue'

describe('AppHeader', () => {
  it('renders a self-contained GitHub ribbon link', () => {
    const wrapper = mount(AppHeader)
    const link = wrapper.get('a.github-ribbon')

    expect(link.text()).toBe('Fork me on GitHub')
    expect(link.attributes('href')).toBe('https://github.com/stereocat/ipcalc_js')
    expect(wrapper.find('img').exists()).toBe(false)
  })
})
