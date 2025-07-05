<template>
  <Page>
    <div v-if="info" class="content">
      <div v-html="info.content"></div>
    </div>
  </Page>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import request from '../plugin/request'
import Page from '@/components/Page.vue';

const store = useStore<any>()
const route = useRoute()
type Info = {
  id: number,
  title: string,
  content: string,
}
const info = ref<Info>()

onMounted(async () => {
  const { id } = route.params;
  const res = await request.get('/en/grammar/item/' + id) as Info;
  info.value = res;
  store.dispatch('main/setPath', [{ name: res.title.split('（')[0] }])

})
</script>
<style lang="less" scoped>
.content {
  padding: 24px;
}

:deep(.content) {
  h2 {
    font-size: 38px;
  }

  h3 {
    font-size: 32px;
  }

  p {
    font-size: 28px;
  }
}
</style>