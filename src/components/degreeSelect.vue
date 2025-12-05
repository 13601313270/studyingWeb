<template>
  <div v-if="selectDegreeInfo" class="degreeSelect" @click="showDegreeSelect">
    {{ selectDegreeInfo.name }}
    <!-- <img src="../icons/sanjiao-white.svg" /> -->
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
<style lang="less" scoped>
.degreeSelect {
  font-size: 32px;
  display: flex;
  align-items: center;

  img {
    width: 12px;
    height: 12px;
    margin-left: 8px;
  }
}
</style>