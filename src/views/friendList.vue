<template>
  <div class="frindList">
    <div @click="inviteDialogShow = true">邀请（双方获赠VIP）</div>
    <div>===========================</div>
    <div style="width: 100vw;">这些人邀请您过您使用App，请选择一位真正邀请人，双方获得2个月VIP</div>
    <div v-for="item in myBeInviteList" class="friendItem">
      <div class="icon">
        <img :src="item.user1.icon + '?x-oss-process=image/resize,m_fill,h_200,w_200'" />
      </div>
      <div class="info">
        <div class="name">{{ '用户' + item.user1.name || item.user1.account }}</div>
        <!-- <div>{{ item.inviteTime }}</div> -->
        <div class="content">{{ item.content }}</div>
        <div class="inviteTime">邀请时间：{{ item.inviteTime }}</div>
      </div>
      <div class="action">
        <Button warning @click="beUseInvite(item.id)" text="回关"></Button>
      </div>
      <!-- 发私信 -->
    </div>
  </div>
  <div class="split"></div>
  <div class="frindList">
    <div>我的好友</div>
    <div>
      <div v-for="item in frindList" class="friendItem">
        <div class="icon">
          <img :src="item.icon + '?x-oss-process=image/resize,m_fill,h_200,w_200'" />
        </div>
        <div class="info">
          <div class="name">{{ '用户' + item.name || item.account }}</div>
          <div class="city">城市：{{ item.city || '未知' }}</div>
          <div class="sex">性别：{{ item.sex === 1 ? '女' : '' }}{{ item.sex === 0 ? '男' : '' }}</div>
          <!-- <div>{{ item.inviteTime }}</div> -->
          <!-- <div>{{ item.content }}</div> -->
        </div>
        <div class="action">
          <Button @click="toChat(item)" text="发私信"></Button>
        </div>
      </div>
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
import { useRouter } from 'vue-router';

const router = useRouter()

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

type friendItem = {
  account: string,
  city: string,
  icon: string,
  id: number,
  isVip: boolean,
  name: string
  sex: 0 | 1 | 2,
  vipEndDate: string
}
const frindList = ref<Array<friendItem>>([]);

onActivated(() => {
  initList()
})
function initList() {
  request.get('/friend/myList', {
  }).then((res) => {
    // @ts-ignore
    frindList.value = res.map(v => {
      return {
        ...v,
        isVip: !!v.isVip,
      }
    }) as any;
  })
  request.get('/friend/myBeInviteList', {
  }).then(res => {
    myBeInviteList.value = res as any;
  })
}
function send() {
  request.put('/friend/send', {
    phone: beInvitePhone.value,
  }).then(res => {

  })
}
function beUseInvite(id: number) {
  request.put('/friend/beUseInvite/' + id).then(res => {
    console.log('beUseInviteRes', res)
    initList()
  })
}
function toChat(uid: friendItem) {
  router.push('/chat/' + uid.id)
}
</script>

<style scoped lang="less">
.frindList {
  flex: 1;

  .friendItem {
    background-color: white;
    display: flex;
    margin: 32px;
    align-items: center;

    .icon {
      width: 120px;
      height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      border-radius: 60px;
      border: solid 1px #eee;

      >img {
        width: 120px;
      }
    }

    .info {
      margin-left: 24px;
      flex-grow: 1;
      height: 120px;

      .name {
        font-size: 32px;
      }

      .city {
        color: #999;
        font-size: 24px;
      }

      .sex {
        color: #999;
        font-size: 24px;
      }

      .content {
        color: #999;
        font-size: 24px;
      }

      .inviteTime {
        color: #999;
        font-size: 24px;
      }
    }

    .action {}
  }
}

.split {
  height: 16px;
  background-color: #f5f7f5;
}

.inviteDialog {
  .sentButton {
    margin-top: 32px;
  }
}
</style>
