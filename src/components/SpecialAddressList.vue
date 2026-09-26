<template>
  <div class="addr-info">
    <slot />
    <ul>
      <li
        v-for="block in blocks"
        v-bind:key="block.addrBlock"
      >
        <span v-bind:class="block.obsoleteRfc ? 'obsoleted' : 'active'">
          <AppIPBlockAnchor v-bind:block="block.addrBlock" />
          : {{ block.description }}.
        </span>
        <span v-if="block.obsoleteRfc">
          (in <AppRFCAnchor v-bind:number="block.obsoleteRfc" />,
          but no longer reserved.)
        </span>
        See: <AppRFCAnchor v-bind:number="block.rfc" />
      </li>
    </ul>
  </div>
</template>

<script>
import AppRFCAnchor from './AppRFCAnchor.vue'
import AppIPBlockAnchor from './AppIPBlockAnchor.vue'

export default {
  props: {
    blocks: {
      type: Array,
      required: true
    }
  },
  components: {
    AppRFCAnchor,
    AppIPBlockAnchor
  }
}
</script>

<style scoped>
div.addr-info {
  border: 3px darkgreen solid;
  padding: 0.5em;
  background-color: mintcream;
  margin: 0.2em;
}
.active strong {
  text-decoration: underline;
}
ul {
  list-style-type: none;
}
.obsoleted {
  color: #888;
}
.obsoleted strong {
  text-decoration: none;
}
</style>
