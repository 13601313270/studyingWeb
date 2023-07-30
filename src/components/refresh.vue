<template>
  <div class="refresh" ref="refresh">
    <slot></slot>
  </div>
</template>
<script>
  export default {
    mounted() {
      this.$refs.refresh.style.top = this.$refs.refresh.offsetHeight * -1 + 'px'
    }
  }
</script>