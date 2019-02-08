<template>
  <transition>
    <div class="addr-info">
      <slot />
      <strong>{{ block.addrBlock }}</strong> ({{ block.name }}).
      See:
      <a v-bind:href="`https://tools.ietf.org/html/rfc${block.rfc}`"
         target="_blank" rel="noopener noreferrer">
        RFC{{ block.rfc }}
      </a>
    </div>
  </transition>
</template>

<script>
export default {
  props: ['block']
}
</script>

<style scoped>
div.addr-info {
  border: 3px darkgreen solid;
  padding: 0.5em;
  background-color: mintcream;
  margin: 0.2em;
}
div strong {
  text-decoration: underline;
}
.v-enter, .v-leave-to {
  opacity: 0;
}
.v-enter-active, .v-leave-active {
  transition: opacity .5s;
}
</style>
