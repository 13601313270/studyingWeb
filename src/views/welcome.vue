<template>
  <Page title="欢迎" foot-active="source" hide-header>
    <div class="welcome">
      <icon src="icon_green" class="icon" />
      <div class="title">松鼠学</div>
      <div class="slogan">学习面前，人人平等</div>
      <Button class="toAppButton" text="开启新版本" @click="toApp" primary></Button>
    </div>
  </Page>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import Page from '@/components/Page.vue';
import Button from '../components/Button.vue'
import Icon from '@/components/icon.vue'
import isMobileDevice from '@/plugin/isMobileDevice';

const info = ref({
  title: '',
  content: ''
})
const secret = ref('');
const versionUrl = ref('');
const showBindDevelopPhone = ref(0);
const codeInfo = ref(null);
const preList = ref([]);
const $router = useRouter();
onMounted(() => {
  if (localStorage.getItem('welcomeBegin') || !isMobileDevice()) {
    toApp()
  }
})
function toApp() {
  // @ts-ignore
  window.initFinish()
  localStorage.setItem('welcomeBegin', 'true')
  $router.replace('/source')
}
</script>

<style scoped lang="less">
.welcome {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;

  .icon {
    width: 250px;
  }

  .title {
    font-size: 48px;
  }

  .slogan {
    font-size: 36px;
    margin-top: 20px;
    color: rgb(73, 73, 73);
  }

  .toAppButton {
    margin-top: 300px;
    margin-bottom: 100px;
    width: 500px;
  }
}

.title {
  font-size: 50px;
  margin-top: 50px;
  margin-bottom: 20px;
}

.content {
  font-size: 34px;
  padding: 30px;
  text-indent: 68px;
}
</style>
