<template>
  <Page title="语法册">
    <div class="list">
      <div v-for="item in list" class="item" @click="toDetail(item.id)">
        {{ item.title }}
      </div>
    </div>
  </Page>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import Page from '@/components/Page.vue';
import request from '../plugin/request'

const router = useRouter();
const store = useStore<any>()
const list = ref<Array<{
  id: number,
  title: string,
}>>([])

onMounted(async () => {
  store.dispatch('main/setPath', [{ name: '语法册' }])
  list.value = await request.get('/en/grammar/list');
})
function toDetail(id: number) {
  router.push('/enGrammarItem/' + id)
}
</script>
<style lang="less" scoped>
.list {
  padding: 16px;

  .item {
    margin-bottom: 16px;
    padding: 20px;
    border-radius: 10px;
    color: rgb(49, 49, 49);
    background-color: rgba(74, 121, 108, 0.2);
    font-size: 32px;
  }
}
</style>