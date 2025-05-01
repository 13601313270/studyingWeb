<template>
  <div class="frindList">
    <div @click="inviteDialogShow = true">邀请（双方获赠VIP）</div>
    <div>==================================================</div>
    <div>这些人邀请您过您使用App，请选择一位真正邀请人，双方获得2个月VIP</div>
    <div v-for="item in myBeInviteList">
      <img :src="item.user1.icon + '?x-oss-process=image/resize,m_fill,h_100,w_100'" />
      <div>{{ item.user1.name }}</div>
      <div>{{ item.inviteTime }}</div>
      <div>{{ item.content }}</div>
      <BUtton @click="beUseInvite(item.id)">采纳</BUtton>
    </div>
  </div>
  <Dialog :show="inviteDialogShow" title="邀请" @close="inviteDialogShow = false">
    <div class="inviteDialog">
      <div>邀请新用户使用App，双方各获得2个月VIP</div>
      <div>对方手机号</div>
      <Input v-model="beInvitePhone" />
      <Button class="sentButton" text="发送邀请" @click="send" />
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import Dialog from '@/components/Dialog.vue';
import Input from '@/components/Input.vue';
import Button from '@/components/Button.vue';
import request from '@/plugin/request'
import { onActivated, ref } from 'vue';

// 邀请弹窗
const inviteDialogShow = ref<boolean>(false)
const beInvitePhone = ref<string>('')
const myBeInviteList = ref<Array<{
  id: number,
  user1: {
    id: number,
    account: string,
    name: string
    icon: string,
  },
  inviteTime: string,
  content: string,
}>>([])

onActivated(() => {
  request.get('/friend/myBeInviteList', {
  }).then(res => {
    myBeInviteList.value = res as any;
  })
})
function send() {
  request.put('/friend/send', {
    phone: beInvitePhone.value,
  }).then(res => {

  })
}
function beUseInvite(id: number) {
  request.put('/friend/beUseInvite/' + id).then(res => {

  })
}
</script>

<style scoped lang="less">
.frindList {
  flex: 1;
}

.inviteDialog {
  .sentButton {
    margin-top: 32px;
  }
}
</style>
