<template>
  <transition>
    <div class="addr-info">
      <slot />
      <ul>
        <li v-for="block in blocks" v-bind:key="block.addrBlock">
          <span v-bind:class="block.obsoleteRfc ? 'obsoleted' : 'active'">
            <ClickableBlockAnchor v-bind:block="block.addrBlock" /> : {{ block.description }}.
          </span>
          <span v-if="block.obsoleteRfc">
            (in <RfcAnchor v-bind:number="block.obsoleteRfc" />, but no longer reserved.)
          </span>
          See: <RfcAnchor v-bind:number="block.rfc" />
        </li>
      </ul>
    </div>
  </transition>
</template>

<script>
import RfcAnchor from './RfcAnchor'
import ClickableBlockAnchor from './ClickableBlockAnchor'

export default {
  props: ['blocks'],
  components: {
    RfcAnchor,
    ClickableBlockAnchor
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
.v-enter, .v-leave-to {
  opacity: 0;
}
.v-enter-active, .v-leave-active {
  transition: opacity .5s;
}
</style>
