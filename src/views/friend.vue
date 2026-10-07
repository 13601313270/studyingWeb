<template>
  <Page title="消息" class="friend" root foot-active="friend" hide-header>
    <FriendList />
  </Page>
</template>
<script lang="ts" setup>
import Page from '@/components/Page.vue';
import FriendList from './friendList.vue'
</script>

<style scoped lang="less"></style>
