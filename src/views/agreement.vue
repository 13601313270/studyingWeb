<template>
  <Page :title="info.title">
    <div class="content">
      <div v-html="info.content"></div>
    </div>
  </Page>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import request from '../plugin/request'
import Page from '@/components/Page.vue';
const info = ref({
  title: '',
  content: ''
})
onMounted(() => {
  request.get('/agreement').then((res: any) => {
    info.value = res;
  });
})
</script>

<style scoped lang="less">
.title {
  font-size: 50px;
  margin-top: 50px;
  margin-bottom: 20px;
}

.content {
  font-size: 28px;
  padding: 30px;
  text-indent: 56px;
  color: rgb(154, 154, 154);
}
</style>
