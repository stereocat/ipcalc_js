<template>
  <a v-bind:href="`https://tools.ietf.org/html/rfc${number}`"
     target="_blank" rel="noopener noreferrer">
    RFC{{ number }}
  </a>
</template>

<script>
export default {
  props: ['number']
}
</script>
