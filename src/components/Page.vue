<template>
  <div class="pageContent">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { useStore } from 'vuex';

const props = defineProps({
  title: String,
});
const store = useStore();
onMounted(() => {
  console.log(props.title)
  store.dispatch('main/setPath', [{ name: props.title }]);
})
</script>
<style lang="less"></style>