<template>
  <Page title="阅读">
    <div class="list">
      <div v-for="item in list" class="item" @click="toDetail(item.id)">
        <div>{{ item.id }}</div>
        <div>{{ item.title }}</div>
      </div>
    </div>
  </Page>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import request from '../plugin/request'
import Page from '@/components/Page.vue';
import { useRouter } from 'vue-router';

type Item = {
  id: number;
  title: string;
}
const router = useRouter()
const list = ref<Item[]>([])

onMounted(() => {
  initPage(1)
})
function initPage(page: number) {
  request.get('/en/readPage/' + page).then(res => {
    list.value = res as any;
  })
}
function toDetail(id: number) {
  router.push({ path: '/enReadDetail/' + id })
}
</script>
<style lang="less">
.list {
  padding: 16px;

  .item {
    border: solid 1px black;
  }
}
</style>