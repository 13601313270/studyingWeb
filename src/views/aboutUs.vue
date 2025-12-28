<template>
  <Page title="关于我们" foot-active="mine">
    <div>
      <div class="content">{{ info.content }}</div>
    </div>
  </Page>
</template>

<script lang="ts" setup>
import request from '../plugin/request'
import Page from '@/components/Page.vue'
import { onMounted, ref } from 'vue'

const info = ref({
  title: '',
  content: ''
})
onMounted(() => {
  request.get('/aboutUs.html').then((res: any) => {
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
  font-size: 34px;
  padding: 30px;
  text-indent: 68px;
}
</style>
