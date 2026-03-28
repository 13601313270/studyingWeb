<template>
  <Page title="QQ交流群" foot-active="mine">
    <div class="group" v-for="group in allQQGroup" :key="group.number">
      <div class="info">
        <div class="title">{{ group.title }}</div>
        <div class="number">{{ group.number }}</div>
      </div>
      <Button text="复制群号" @click="copyNumber(group.number)" type="white" />
    </div>
  </Page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Page from '@/components/Page.vue';
import toast from '../plugin/toast'
import request from '../plugin/request'
import Button from '../components/Button.vue'

const allQQGroup = ref<Array<{
  title: string,
  number: string
}>>([]);
onMounted(() => {
  // this.logAction('QQ');
  request.get('/globleConfig?keys=allQQGroup').then((list: any) => {
    allQQGroup.value = list.allQQGroup;
  })
})
function copyNumber(number: string) {
  navigator.clipboard.writeText(number).then(() => {
    // 显示复制成功提示
    toast({
      'message': '复制成功',
      'duration': 2.0
    })
  });
}
</script>

<style scoped lang="less">
.group {
  margin-top: 20px;
  width: 650px;
  margin-left: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;

  &:last-child {
    margin-bottom: 48px;
  }

  .info {
    flex-grow: 1;
  }

  .title {
    line-height: 40px;
    font-size: 40px;
    flex: 1;
  }

  .number {
    line-height: 30px;
    font-size: 30px;
    flex: 1;
    color: grey;
  }
}
</style>
