<template>
  <img :src="(showUrl || '').replace('http://', 'https://')" :style="style" />
</template>
<script lang="ts" setup>
import { getAllIcons } from '../plugin/allIcons'

import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  src: String,
  width: Number,
  height: Number,
});

const allIcons = ref<{
  [key in string]: {
    path: string
  }
}>({});
const initFinish = ref(false);

const style = computed(() => {
  if (showUrl.value) {
    let str = '';
    if (props.width) {
      str += `width: ${props.width / 7.5}vw;`
    } else if (props.height) {
      str += `height: ${props.height / 7.5}vw;`
    }
    return str;
  } else {
    return 'display:none';
  }
});

const showUrl = computed(() => {
  if (!initFinish.value) {
    return '';
  }
  if (props.src && allIcons.value && allIcons.value[props.src]) {
    return allIcons.value[props.src].path;
  } else {
    return props.src;
  }
});

onMounted(async () => {
  try {
    const icons = await getAllIcons();
    allIcons.value = icons;
  } catch (e) {
    console.error(e);
  }
  initFinish.value = true;
});
</script>
