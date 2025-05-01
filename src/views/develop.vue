<template>
  <div class="develop">
    <Button text="取消VIP" @click="closeVip"></Button>
  </div>
</template>
<script setup lang="ts">
import request from '../plugin/request'
import Button from '../components/Button.vue'
function closeVip() {
  request.put('/develop/closeVip', {}).then((res) => {
    alert(res)
  })
}
</script>
<style scoped lang="less">
.develop {
  padding: 16px;
  box-sizing: border-box;
}
</style>