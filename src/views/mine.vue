<template>
  <Page title="我的" class="mine" root foot-active="mine">
    <div class="user" v-if="store.state.main.userInfo && store.state.main.userInfo.account">
      <div v-if="userInfo2.icon" class="user_icon">
        <pic @click="previewImg(userInfo2.icon.replace('http://', 'https://'))"
          :src="userInfo2.icon.replace('http://', 'https://') + '?x-oss-process=image/resize,m_fill,h_100,w_100'"
          :width="100" />
      </div>
      <div class="info" v-if="userInfo2" @click="goUserInformation">
        <text class="name">学员：</text>
        <text class="name">{{ userInfo2.account }}</text>
      </div>
      <div class="payed" :style="{ opacity: showIsPayed ? '1' : '0', transform: showIsPayed ? '' : 'scale(1.3)' }">
        <img src="../icons/isPayed.png" />
        <span>VIP</span>
        <span class="vipEndDate" v-if="userInfo2.vipEndDate">时间至{{ userInfo2.vipEndDate.slice(0, 10) }}</span>
      </div>
    </div>
    <div v-else class="user">
      <div class="info" style="display: flex;flex-direction: row;align-items: center;">
        <text class="name">学员：</text>
        <Button class="loginButton" text="登陆" @click="login" type="white"></Button>
      </div>
    </div>
    <div class="actions">
      <div class="actionItem" v-if="store.state.main.userInfo && store.state.main.userInfo.account"
        :has-top-border="true" :has-arrow="true" @click="goUserInformation">
        <div>用户信息</div>
        <icon class="right" src="right_black" />
      </div>
      <div class="actionItem" @click="sharePanel">
        <div>分享好友</div>
        <icon class="right" src="right_black" />
      </div>
      <div class="actionItem" @click="toAddress">
        <div>我的收件地址</div>
        <icon class="right" src="right_black" />
      </div>
      <div class="actionItem" @click="toOrder">
        <div>我的订单</div>
        <icon class="right" src="right_black" />
      </div>
      <div class="actionItem" @click="showBuyVip = true"
        v-if="store.state.main.userInfo && store.state.main.userInfo.account">
        <div>购买VIP</div>
        <icon class="right" src="right_black" />
      </div>
      <div class="actionItem" @click="$router.push('/QQ')">
        <div>QQ交流群</div>
        <icon class="right" src="right_black" />
      </div>
      <div class="actionItem" @click="$router.push('/aboutUs')">
        <div>关于我们</div>
        <icon class="right" src="right_black" />
      </div>
      <div class="actionItem" v-if="isiOS" @click="score">
        <div>给App评分</div>
        <icon class="right" src="right_black" />
      </div>
      <div class="actionItem" @click="$router.push('/cache')">
        <div>缓存设置</div>
        <icon class="right" src="right_black" />
      </div>
      <div class="actionItem" @click="$router.push('/accountInfo')">
        <div>账户信息</div>
        <icon class="right" src="right_black" />
      </div>
      <!-- <div class="actionItem" @click="testNotification">
        <div>测试通知</div>
        <icon class="right" src="right_black" />
      </div> -->
    </div>
    <div class="actions" v-if="store.state.main.userInfo && store.state.main.userInfo.account">
      <div class="actionItem" @click="showLogout = true">
        <text class="logoutText" style="text-align: center">退出登陆</text>
      </div>
    </div>
    <div style="flex-grow: 1"></div>
    <div class="argument" @click="$router.push('/agreement')">
      <text class="argument_link">服务协议</text>
      <text class="argument_split">｜</text>
      <text class="argument_link">隐私政策</text>
    </div>
    <div class="sharePic" v-if="showSharePic">
      <div class="sharePicInner">
        <div class="sharePicInner_close" @click="showSharePic = false">
          <img src="close" width="20" height="20" />
        </div>
        <text class="title">分享本软件</text>
        <img class="img" width="400" height="400"
          src="https://img.alicdn.com/imgextra/i1/O1CN01O8n7Kb1YFmmRY9DPp_!!6000000003030-2-tps-260-260.png" />
        <text class="downText">扫码下载</text>
        <div>
          <Button text="分享到其他软件" class="shareButton" @click="sharePanel"></Button>
        </div>
      </div>
    </div>
    <Dialog :show="showLogout" title="您确定要推出" @close="showLogout = false">
      <div class="logout">
        <div class="logoutText">推出后用户信息不会丢失，后续如果需要，可重新登录。</div>
        <div class="tools">
          <Button text="取消" style="width: 40%" @click="showLogout = false"></Button>
          <Button text="确定" style="width: 40%" error @click="loginOut"></Button>
        </div>
      </div>
    </Dialog>
    <Dialog :show="showBuyVip" title="提示" @close="showBuyVip = false">
      <div class="chooseUseType">
        <BuyVIPDesc />
        <VipPriceDesc @buy="showBuyVip = false" @to-invite="showBuyVip = false" />
      </div>
    </Dialog>
  </Page>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { mapActions, mapGetters, useStore } from 'vuex';
import pic from '../components/icon.vue';
import Button from '../components/Button.vue'
import Dialog from '../components/Dialog.vue'
import request from '@/plugin/request'
import share from '@/plugin/share'
import { notification } from "../plugin/notification"
import { showImg } from '../plugin/imagePreview'
import toScore from '@/plugin/toScore';
import BuyVIPDesc from './buyVIPDesc.vue';
import VipPriceDesc from '@/components/vipPriceDesc.vue';
import Page from '@/components/Page.vue';
import Loading from '@/plugin/loading'

const store = useStore<any>()
const router = useRouter()

const userInfo2 = ref<any>({})
const isiOS = navigator.userAgent.includes('iPhone');
const list = ref<any[]>([])
const showSharePic = ref<boolean>(false)
const showLogout = ref<boolean>(false)
const showIsPayed = ref<boolean>(false)
const showBuyVip = ref<boolean>(false)

onMounted(() => {
  if (store.state.main.userInfo && store.state.main.userInfo.account) {
    const loading = Loading();
    request.get('/user/getInfo').then(res => {
      loading.destory()
      userInfo2.value = res;
      setTimeout(() => {
        showIsPayed.value = userInfo2.value && userInfo2.value.isVip;
      }, 200)
    });
  }
})
function login() {
  request.get('/user/getInfo').then(res => {
    userInfo2.value = res;
    setTimeout(() => {
      showIsPayed.value = userInfo2.value && userInfo2.value.isVip;
    }, 200)
  });
}
function score() {
  toScore()
}

function sharePanel() {
  share("松鼠学", "https://api.studying1v1.com/share", '松鼠未来网络科技有限责任公司', 'https://yingshijiaoyusystem.oss-cn-beijing.aliyuncs.com/icons.1024-1.png?x-oss-process=image/resize,m_fill,h_500,w_500')
}
function toAddress() {
  router.push('/address')
}
function toOrder() {
  router.push('/order')
}
function goUserInformation() {
  router.push('/userInformation')
}
function loginOut() {
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  store.dispatch('main/setToken', '')
  store.dispatch('main/setUserInfo', {})
  router.replace({ path: '/mine' });
  showLogout.value = false
}
function previewImg(img: string) {
  showImg(img)
}
function testNotification() {
  notification('mine页面', '通知喽', 23, 20, 20);
}

watch(() => store.state.main.userInfo, () => {
  if (store.state.main.userInfo && store.state.main.userInfo.account) {
    const loading = Loading();
    request.get('/user/getInfo').then(res => {
      loading.destory()
      userInfo2.value = res;
      // 动画是等页面滑动结束后，再展开因为滑动过程这个position: fixed的图标，会造成计算位置错误
      setTimeout(() => {
        showIsPayed.value = userInfo2.value && userInfo2.value.isVip;
      }, 200)
    }).catch(() => {
      loading.destory()
    });
  }
})
</script>
<style scoped lang="less">
.mine {
  display: flex;
  flex-direction: column;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.user {
  width: 100%;
  min-height: 170px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px 50px 0;
  border-top-style: solid;
  border-top-width: 1px;
  border-top-color: grey;
  margin-bottom: 20px;
  flex-shrink: 0;
  box-sizing: border-box;

  &_icon {
    border-radius: 30px;
    overflow: hidden;
    border-style: solid;
    border-width: 1px;
    width: 100px;
    height: 100px;
    border-color: #d5d5d5;
  }

  .loginButton {
    width: 300px;
    height: 80px;
  }

  .payed {
    display: flex;
    flex-direction: column;
    justify-content: center;
    pointer-events: none;
    align-items: center;
    transition: transform 1s;

    >img {
      width: 120px;
      height: 120px;
      border-radius: 60px;
      overflow: hidden;
    }

    >span {
      font-weight: bold;
      font-size: 26px;
    }

    .vipEndDate {
      font-size: 22px;
      color: #aaa;
    }
  }

  .icon {
    width: 120px;
    height: 120px;
  }

  .info {
    height: 80px;
    margin-left: 20px;
    flex: 1;
    color: red;
  }

  .name {
    color: grey;
    font-size: 32px;
  }

  .coin {
    height: 80px;
    width: 130px;
    margin-left: 20px;
    color: red;
    border-left-style: solid;
    border-left-width: 1px;
    border-left-color: #a6a6a6;
    padding-left: 30px;

    &_text {
      color: grey;
      font-size: 32px;
      text-align: center;
    }
  }
}

.actions {
  background: white;
  width: 100%;
  border-radius: 16px;
  box-sizing: border-box;

  .actionItem {
    height: 88px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 28px;
    padding: 0 16px 0 48px;

    &:not(:first-child) {
      border-top: solid 1px rgb(237, 237, 237);
    }

    .right {
      height: 38px;
      opacity: 0.3;
    }
  }

  .logoutText {
    width: 100%;
    color: #a50000;
  }
}

.argument {
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-top: 120px;
  padding-bottom: 60px;

  &_split {
    font-size: 28px;
    color: #688590;
  }

  &_link {
    font-size: 28px;
    color: #7c8690;
  }
}

.sharePic {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgba(18, 18, 18, 0.39);
  display: flex;
  align-items: center;
  justify-content: center;

  &Inner {
    width: 500px;
    padding: 36px;
    background-color: white;
    border-radius: 24px;
    display: flex;
    align-items: center;
    flex-direction: column;
    position: relative;

    .title {
      font-size: 36px;
      text-align: center;
      color: rgba(0, 0, 0, 0.8);
      font-family: PingFangSC-Medium;
    }

    .img {
      margin-top: 32px;
    }

    .downText {
      font-size: 28px;
      text-align: center;
      color: rgba(0, 0, 0, 0.65);
    }

    &_close {
      position: absolute;
      width: 48px;
      height: 48px;
      border-radius: 24px;
      background-color: rgba(0, 0, 0, 0.06);
      top: 30px;
      right: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .shareButton {
      width: 400px;
      margin-top: 32px;
    }
  }
}

@media (min-width: 1025px) {
  .user {
    width: 700PX;
  }

  .actions {
    width: 700PX;

    .actionItem {
      font-size: 16PX;
    }
  }
}

.logout {
  .logoutText {
    font-size: 32px;
    text-indent: 2em;
  }

  .tools {
    margin-top: 28px;
    margin-bottom: 12px;
    display: flex;
    justify-content: space-around;
  }
}
</style>
