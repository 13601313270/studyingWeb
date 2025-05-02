<template>
  <div class="chatPage" v-if="chatUser">
    <!-- <div class="user" v-if="transformFinish">
      <img class="icon" :src="chatUser.icon + '?x-oss-process=image/resize,m_fill,h_100,w_100'" />
      <div class="name">{{ chatUser.name }}</div>
      <div v-if="chatUser.isVip">VIP</div>
    </div> -->
    <div class="content">
      <div v-if="chatListing">loading</div>
      <div v-if="chatList.length === 0 && !chatListing">
        <div class="receive">
          <div class="icon"><img :src="chatUser.icon + '?x-oss-process=image/resize,m_fill,h_100,w_100'" /></div>
          <div class="content">我们已互现关注，开始聊天吧</div>
        </div>
      </div>
      <div v-for="item in chatList">
        <div v-if="item.sender_id === +route.params.id" class="receive">
          <div class="icon"><img :src="chatUser.icon + '?x-oss-process=image/resize,m_fill,h_100,w_100'" /></div>
          <div class="content">{{ item.content }}</div>
        </div>
        <div v-else-if="item.receiver_id === +route.params.id" class="sent">
          <div class="content">{{ item.content }}</div>
          <div class="icon"><img :src="myInfo.icon + '?x-oss-process=image/resize,m_fill,h_100,w_100'" /></div>
        </div>
      </div>
    </div>
    <div class="footer">
      <textarea placeholder="发消息..." rows="1" maxlength="120" ref="textareaRef" v-model="sentMessage"
        class="input"></textarea>
      <Button class="sentButton" text="发送" @click="sent"></Button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onActivated, onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import request from '../plugin/request'
import Button from '@/components/Button.vue';
import toast from '@/plugin/toast';

type ChatItem = {
  receiver_id: number,
  sender_id: number,
  content: string,
  ctime: string,
}
const route = useRoute()
const chatUser = ref<{
  id: number,
  name: string,
  icon: string,
  isVip: boolean,
}>()
const transformFinish = ref<boolean>(false)// position:fixed遇到页面切换动画会有展示bug，通过这个变量控制动画完再变成true
const sentMessage = ref<string>('');
const textareaRef = ref();
const chatList = ref<Array<ChatItem>>([])
const chatListing = ref<boolean>(false)
const myInfo = ref<{
  icon: string,
}>({
  icon: ''
})

let eventSource: EventSource;

onMounted(async () => {
  const uid = route.params.id;
  chatUser.value = await request.get('/friend/getUserInfo/' + uid)

  request.get('/user/getInfo').then(res => {
    myInfo.value = res as any;
  });

  setTimeout(() => {
    transformFinish.value = true;
    console.log(textareaRef.value)
    if (textareaRef.value) {
      textareaRef.value.addEventListener('input', function () {
        // @ts-ignore
        this.style.height = 'auto';
        // @ts-ignore
        this.style.height = (this.scrollHeight) + 'px';
      })
    }
    listen();
  }, 300)
  if (chatUser.value) {
    initList()
  }
})
onUnmounted(() => {
  eventSource.close()
})

function listen() {
  const uid = route.params.id;
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const token = userInfo.account + '@@' + localStorage.getItem('token');
  eventSource = new EventSource('https://api.studying1v1.com/friend/chat/heart/' + uid + '?token=' + token);
  eventSource.onopen = function () {
    console.log('连接已打开');
  };
  eventSource.onmessage = function (event) {
    const jsonStr = event.data.replace(/^data:\s/, '');
    const json = JSON.parse(jsonStr)
    if (json && json.hasNew) {
      console.log('收到刷新消息了。。。。。。。。。')
      initList()
    }
  };
  eventSource.addEventListener('error', (event) => {
    if (event.eventPhase === EventSource.CLOSED) {
      console.log('结束');
    } else {
      console.error('An error occurred:', event);
    }
  });
}
function initList() {
  const uid = route.params.id;
  console.log('333333333')
  chatListing.value = true;
  request.post('/friend/chat/receive/' + uid, {
    page: 0,
  }).then(list => {
    chatList.value = list as any;
    chatListing.value = false;
  })
}

function sent() {
  const uid = route.params.id;
  request.post('/friend/chat/sent/' + uid, {
    content: sentMessage.value
  }).then(res => {
    if (res) {
      sentMessage.value = ''
      toast({
        'message': '发送成功',
        'duration': 3000
      })
      initList()
    }
  })
}

</script>
<style scoped lang="less">
.chatPage {
  display: flex;
  flex-direction: column;
}

.user {
  position: absolute;
  top: -80px;
  left: 88px;
  z-index: 1;
  display: flex;
  flex-direction: row;
  align-items: center;

  .icon {
    width: 72px;
    height: 72px;
    border-radius: 44px;
  }

  .name {
    margin-left: 16px;
    color: white;
    font-size: 32px;
  }
}

.content {
  flex-grow: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 0 24px;

  .receive {
    margin-top: 32px;
    display: flex;
    flex-direction: row;
    max-width: 600px;
    float: left;
    align-items: start;

    .content {
      background-color: rgb(245 245 245);
      color: black;
      margin-left: 32px;
      border-radius: 32px;
      padding: 16px;
    }
  }

  .sent {
    margin-top: 32px;
    display: flex;
    flex-direction: row;
    max-width: 600px;
    float: right;
    align-items: start;

    .content {
      background-color: rgb(39 128 254);
      color: white;
      margin-right: 32px;
      border-radius: 32px;
      padding: 16px;
    }
  }

  .icon {
    width: 88px;
    height: 88px;
    border: solid 1px rgb(228, 228, 228);
    box-sizing: border-box;
    border-radius: 44px;
    overflow: hidden;
    flex-shrink: 0;

    >img {
      width: 88px;
      height: 88px;
    }
  }
}

.footer {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 16px;
  margin-bottom: calc(env(safe-area-inset-bottom) + 16px);
  border-radius: 24px;
  background-color: #eee;
  padding: 8px;

  .input {
    flex-grow: 1;
    border: none;
    background: transparent;
    font-size: 32px;
    resize: none;
    padding: 0;
    padding-left: 24px;
    color: #333;

    &::placeholder {
      color: #ccc;
      font-size: 26px;
    }

    &:focus {
      border: none;
      outline: none;
    }
  }

  .sentButton {}
}
</style>