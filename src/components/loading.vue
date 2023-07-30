<template>
  <div class="loading" ref="loading">
    <slot></slot>
  </div>
</template>
<script>
  export default {
    mounted() {
      // this.$refs.loading.style.marginBottom = this.$refs.loading.offsetHeight * -1 + 'px'
    }
  }
</script>