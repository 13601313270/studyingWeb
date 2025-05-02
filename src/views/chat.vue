<template>
  <div class="chatPage" v-if="chatUser">
    <div class="user" v-if="transformFinish">
      <img class="icon" :src="chatUser.icon + '?x-oss-process=image/resize,m_fill,h_100,w_100'" />
      <div class="name">{{ chatUser.name }}</div>
      <div v-if="chatUser.isVip">VIP</div>
    </div>
    <div class="content">
      <div>{{ sentMessage }}</div>
    </div>
    <div class="footer">
      <textarea placeholder="发消息..." rows="1" maxlength="120" ref="textareaRef" v-model="sentMessage"
        class="input"></textarea>
      <Button class="sentButton" text="发送" @click="sent"></Button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onActivated, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import require from '../plugin/request'
import Button from '@/components/Button.vue';
import toast from '@/plugin/toast';

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

onMounted(async () => {
  const uid = route.params.id;
  chatUser.value = await require.get('/friend/getUserInfo/' + uid)
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
  }, 300)
})
function sent() {
  const uid = route.params.id;
  require.post('/friend/chat/sent/' + uid, {
    content: sentMessage.value
  }).then(res => {
    if (res) {
      sentMessage.value = ''
      toast({
        'message': '发送成功',
        'duration': 3000
      })
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
  position: fixed;
  top: calc(env(safe-area-inset-top) + 8px);
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
  // background-color: red;
  flex-grow: 1;
  overflow-y: auto;
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