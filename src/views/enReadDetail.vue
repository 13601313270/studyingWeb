<template>
  <Page title="阅读">
    <div v-if="info">
      <div>{{ info.title }}</div>
    </div>
  </Page>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import Page from '@/components/Page.vue';
import request from '@/plugin/request';

type Detail = {
  id: number;
  title: string;
  contentList: Array<{
    title: string;
    content: string;
    level: number;
  }>
}
const route = useRoute()
const info = ref<Detail>()
onMounted(() => {
  const id = route.params.id;
  request.get('/en/read/detail/' + id).then(res => {
    info.value = res as any;
  })
})
</script>