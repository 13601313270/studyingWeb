<template>
  <div>
    <div class="welcome">
      <icon src="icon_green" class="icon" />
      <div class="title">松鼠学</div>
      <div class="slogan">学习面前，人人平等</div>
      <Button class="toAppButton" text="开启新版本" @click="toApp" primary></Button>
    </div>
  </div>
</template>

<script>
import Button from '../components/Button.vue'
import toast from '../plugin/toast'
import request from '../plugin/request'
import Icon from '@/components/icon.vue'
import isMobileDevice from '@/plugin/isMobileDevice';

export default {
  name: 'mine',
  data() {
    return {
      info: {
        title: '',
        content: ''
      },
      secret: '',
      versionUrl: '',
      showBindDevelopPhone: 0,
      codeInfo: null,
      preList: [],
    }
  },
  created() {
    if (localStorage.getItem('welcomeBegin') || !isMobileDevice()) {
      this.toApp()
    }
  },
  methods: {
    toApp() {
      window.initFinish()
      localStorage.setItem('welcomeBegin', 'true')
      this.$router.replace('/source')
    }
  },
  components: { Button, Icon },
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
