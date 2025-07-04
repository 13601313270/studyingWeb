<template>
  <div class="frindList">
    <div class="title">
      <div class="titleText">我的好友</div>
      <div class="inviteButton" @click="inviteDialogShow = true">
        <div class="text">邀请</div>
        <div class="desc">双方获赠2个月VIP</div>
      </div>
    </div>
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
  <Dialog :show="beInviteShow" title="邀请您安装App的用户" @close="beInviteShow = false">
    <div class="beInviteTitle" v-if="myInfo && !myInfo.beInviteFinish && myBeInviteList.length">
      这些人邀请您过您安装App，请选择一位真正邀请人，双方各获得<span style="font-weight: bold;color: red">2个月</span>VIP。</div>
    <div class="frindList">
      <div v-for="item in myBeInviteList" class="friendItem" style="margin-left: 0;margin-right: 0;">
        <div class="icon">
          <img :src="item.user1.icon + '?x-oss-process=image/resize,m_fill,h_200,w_200'" />
        </div>
        <div class="info">
          <div class="name">{{ item.user1.name || item.user1.account }}</div>
          <!-- <div>{{ item.inviteTime }}</div> -->
          <div class="content">{{ item.content }}</div>
          <div class="inviteTime">{{ item.inviteTime }}</div>
        </div>
        <div class="action">
          <Button warning @click="beUseInvite(item.id)" text="确认受邀"></Button>
        </div>
        <!-- 发私信 -->
      </div>
    </div>
  </Dialog>
  <div class="split"></div>
  <div class="frindList">
    <div>
      <div v-for="item in frindList" class="friendItem">
        <div class="icon">
          <img :src="item.icon + '?x-oss-process=image/resize,m_fill,h_200,w_200'" />
        </div>
        <div class="info">
          <div class="name">{{ item.name || item.account }}</div>
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
      <div class="desc">邀请新用户使用App，对方受邀后，双方各获得2个月VIP，邀请后，记得通知对方安装App。</div>
      <Input placeholder="请输入手机号" v-model="beInvitePhone" />
      <Button primary class="sentButton" text="发送邀请" @click="send" />
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { onActivated, ref } from 'vue';
import { useRouter } from 'vue-router';
import Dialog from '@/components/Dialog.vue';
import Input from '@/components/Input.vue';
import Button from '@/components/Button.vue';
import request from '@/plugin/request'
import toast from "@/plugin/toast";
import validatePhoneNumber from '@/plugin/validatePhoneNumber';

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

const myInfo = ref<{
  id: number,
  name: string,
  icon: string,
  isVip: boolean,
  beInviteFinish: boolean,
}>()

const beInviteShow = ref<boolean>(false)

onActivated(async () => {
  myInfo.value = await request.get('/user/getInfo');
  initList()
})
async function initList() {
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
    if (myInfo.value && !myInfo.value.beInviteFinish && myBeInviteList.value.length) {
      beInviteShow.value = true;
    } else {
      beInviteShow.value = false;
    }
  })
}
function send() {
  if (!validatePhoneNumber(beInvitePhone.value)) {
    toast({
      'message': '手机号不合法',
      'duration': 3000
    })
    return;
  }
  request.put('/friend/send', {
    phone: beInvitePhone.value,
  }).then(res => {
    console.log('=========')
    console.log(res)
    // @ts-ignore
    if (res.status === "success") {
      toast({
        'message': '已发送邀请',
        'duration': 3000
      })
      beInvitePhone.value = '';
      inviteDialogShow.value = false;
    } else {
      toast({
        // @ts-ignore
        'message': res.res,
        'duration': 3000
      })
    }
  })
}
function beUseInvite(id: number) {
  request.put('/friend/beUseInvite/' + id).then(res => {
    console.log('beUseInviteRes', res)
    initList()
    beInviteShow.value = false;
  })
}
function toChat(uid: friendItem) {
  router.push('/chat/' + uid.id)
}
</script>

<style scoped lang="less">
.frindList {
  flex: 1;

  .title {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: 108px;
    padding-left: 32px;
    padding-right: 24px;

    .titleText {
      font-size: 34px;
    }

    .inviteButton {
      height: 88px;
      border-radius: 10px;
      padding-left: 20px;
      padding-right: 20px;
      border-style: solid;
      border-width: 2px;
      border-color: #ccd6d2;
      display: flex;
      background-color: white;
      flex-direction: column;
      align-items: center;
      box-sizing: border-box;
      justify-content: center;

      .text {
        font-size: 32px;
      }

      .desc {
        font-size: 22px;
        color: #999;
      }
    }
  }

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

    .action {
      flex-shrink: 0;
    }
  }
}

.beInviteTitle {
  width: 100%;
  margin-bottom: 32px;
  font-size: 32px;
  color: #333;
}

.split {
  height: 16px;
  background-color: #f5f7f5;
}

.inviteDialog {
  .desc {
    text-align: center;
    font-size: 32px;
    margin-bottom: 32px;
  }

  .sentButton {
    margin-top: 32px;
  }
}
</style>
