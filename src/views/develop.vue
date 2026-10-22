<template>
  <Page title="开发设置" foot-active="mine">
    <div class="develop">
      <Button text="取消VIP" @click="closeVip"></Button>
      <Button text="取消已受邀状态" @click="closeBeInvite"></Button>
      <Button text="取消已受邀状态2" @click="closeBeInvite"></Button>
      <div style="padding: 8px;">
        <Button text="下载html课件" @click="downloadHtml"></Button>
        <Button text="打开html课件" @click="openHtml"></Button>
      </div>
    </div>

    <iframe v-if="iframeUrl" :src="iframeUrl" frameborder="0" class="html-iframe"></iframe>
  </Page>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import request from '../plugin/request'
import Button from '../components/Button.vue'
import Page from '../components/Page.vue'
import file from '@/plugin/file'

const iframeUrl = ref('')
function closeVip() {
  request.put('/develop/changeStatus', {
    action: 'closeVip'
  }).then((res) => {
    alert(res)
  })
}
function closeBeInvite() {
  request.put('/develop/changeStatus', {
    action: 'closeBeInvite'
  }).then((res) => {
    alert(res)
  })
}
function downloadHtml() {
  file.download('https://lesson-reveal.oss-cn-beijing.aliyuncs.com/html-file-1792403586262-sui1.html')
}
async function openHtml() {
  file.open('html-file-1792403586262-sui1.html')
}
</script>
<style scoped lang="less">
.develop {
  padding: 16px;
  box-sizing: border-box;

  >* {
    margin-bottom: 32px;
  }
}

.html-iframe {
  width: 100%;
  height: 80vh;
  border: none;
  margin-top: 16px;
}
</style>