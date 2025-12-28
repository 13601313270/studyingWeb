<template>
  <Page title="开发设置" foot-active="mine">
    <div class="develop">
      <Button text="取消VIP" @click="closeVip"></Button>
      <Button text="取消已受邀状态" @click="closeBeInvite"></Button>
      <Button text="取消已受邀状态2" @click="closeBeInvite"></Button>
    </div>
  </Page>
</template>
<script setup lang="ts">
import request from '../plugin/request'
import Button from '../components/Button.vue'
import Page from '../components/Page.vue'
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
</script>
<style scoped lang="less">
.develop {
  padding: 16px;
  box-sizing: border-box;

  >* {
    margin-bottom: 32px;
  }
}
</style>