<template>
  <div>
    <h3>Hello from Vue!</h3>
    <counter :starting="5"></counter>
  </div>
</template>

<script>
import Counter from './Counter.vue'
export default {
  name: 'Home',
  components: {
    Counter
  }
}
</script>

<style lang="scss" scoped>
h3 {
  color: blue;
}
</style>
