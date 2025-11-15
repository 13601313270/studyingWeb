<template>
  <div v-if="selectDegreeInfo" class="degreeSelect" @click="showDegreeSelect">
    {{ selectDegreeInfo.name }}
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
const store = useStore();
const degreeList = computed(() => store.getters['main/degreeList'])
const degree = computed(() => store.getters['main/degree'])
function showDegreeSelect() {
  // @ts-ignore
  window.degreeListDialogShow()
}
const selectDegreeInfo = computed(() => {
  return degreeList.value.find((v: any) => v.id === degree.value);
})
</script>