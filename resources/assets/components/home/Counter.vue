<template>
  <div>
    <button v-on:click="counter += 1">Click me {{ counter }}</button>
    <div>{{ message }}</div>
  </div>
</template>

<script>
export default {
  name: 'Counter',
  props: ['starting'],
  data() {
    return {
      counter: this.starting,
      message: 'Wow a counter'
    }
  }
}
</script>
