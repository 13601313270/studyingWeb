<template>
  <div class="mine">
    <!-- <div @click="downEnglish" v-if="isiOS">
            <slot name="label">
                <div class="english_ad">
                    <icon class="icon" src="english" width="120" height="120"/>
                    <div style="flex: 1">
                        <div class="english_text title">松鼠高中英语</div>
                        <div class="english_text">英语提分神器</div>
                    </div>
                    <text class="english_download">立即下载</text>
                </div>
            </slot>
        </div> -->
    <div class="user" v-if="userInfo && userInfo.account">
      <div v-if="userInfo2.icon" class="user_icon" @click="previewImg">
        <pic @click="showImgDetail(userInfo2.icon.replace('http://', 'https://'))"
          :src="userInfo2.icon.replace('http://', 'https://') + '?x-oss-process=image/resize,m_fill,h_100,w_100'"
          :width="100" />
      </div>
      <div class="info" v-if="userInfo2" @click="goUserInformation">
        <text class="name">学员：</text>
        <text class="name">{{ userInfo2.account }}</text>
      </div>
      <!--            <div class="coin" v-if="userInfo2">-->
      <!--                <text class="coin_text">金币</text>-->
      <!--                <text class="coin_text">{{userInfo2.coin}}</text>-->
      <!--            </div>-->
      <div class="payed" :style="{ opacity: showIsPayed ? '1' : '0', transform: showIsPayed ? '' : 'scale(2)' }">
        <img src="../icons/isPayed.png" />
        <span>金主爸爸</span>
      </div>
    </div>
    <div v-else class="user">
      <div class="info" style="display: flex;flex-direction: row;align-items: center;">
        <text class="name">学员：</text>
        <Button class="loginButton" text="登陆" @click="login" type="white"></Button>
      </div>
    </div>
    <div class="actions">
      <div class="actionItem" v-if="userInfo && userInfo.account" :has-top-border="true" :has-arrow="true"
        @click="$router.push('/userInformation')">
        <div>用户信息</div>
        <icon class="right" src="right_black" />
      </div>
      <div class="actionItem" @click="sharePanel">
        <div>分享好友</div>
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
      <div class="actionItem" @click="pay" v-if="userInfo && userInfo.account">
        <div>打赏作者</div>
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
    <div class="actions" v-if="userInfo && userInfo.account">
      <div class="actionItem" @click="showLogout = true">
        <slot name="label">
          <text class="logoutText" style="text-align: center">退出登陆</text>
        </slot>
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
          <pic src="close" width="20" height="20" />
        </div>
        <text class="title">分享本软件</text>
        <pic class="img" width="400" height="400"
          src="https://img.alicdn.com/imgextra/i1/O1CN01O8n7Kb1YFmmRY9DPp_!!6000000003030-2-tps-260-260.png" />
        <text class="downText">扫码下载</text>
        <div>
          <Button text="分享到其他软件" class="shareButton" @click="share"></Button>
        </div>
      </div>
    </div>
    <Dialog :show="showLogout" title="您确定要推出">
      <div style="margin: 20px">推出后用户信息不会丢失，后续如果需要，可重新登录</div>
      <div style="display:flex;justify-content: space-around;">
        <Button text="取消" style="width: 40%" @click="showLogout = false"></Button>
        <Button text="确定" style="width: 40%" @click="loginOut"></Button>
      </div>
    </Dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
// import Nat from 'natjs';
import pic from '../components/icon';
import Button from '../components/Button.vue'
import Dialog from '../components/Dialog.vue'
import request from '@/plugin/request'
import share from '@/plugin/share'
import { notification } from "../plugin/notification"
import { showImg } from '../plugin/imagePreview'
import toScore from '@/plugin/toScore';
import { buyVip } from '@/plugin/buyVip';
import toast from '@/plugin/toast'

// var modal = weex.requireModule('modal');
// const localStorage = weex.requireModule('storage');
// const clipboard = weex.requireModule('clipboard');

export default {
  name: 'mine',
  created() {
    if (this.userInfo && this.userInfo.account) {
      request.get('/user/getInfo').then(res => {
        this.userInfo2 = res;
        setTimeout(() => {
          this.showIsPayed = this.userInfo2 && this.userInfo2.isVip;
        }, 200)
      });
    }
  },
  data() {
    return {
      userInfo2: {},
      isiOS: navigator.userAgent.includes('iPhone'),
      list: [],
      showSharePic: false,
      showLogout: false,
      showIsPayed: false,
    }
  },
  computed: {
    ...mapGetters('main', ['userInfo'])
  },
  methods: {
    ...mapActions('main', ['setPath', 'setToken', 'setUserInfo']),
    login() {
      request.get('/user/getInfo').then(res => {
        this.userInfo2 = res;
        setTimeout(() => {
          this.showIsPayed = this.userInfo2 && this.userInfo2.isVip;
        }, 200)
      });
    },
    score() {
      toScore()
    },
    pay() {
      buyVip().then(() => {
        request.get('/user/getInfo')
          .then(res => {
            self.showIsPayed = false;
            this.setUserInfo(res);
          })
      })
    },
    refresh() {
      request.get('/source/list').then(res => {
        // modal.toast({
        //     'message': JSON.stringify(res),
        //     'duration': 2.0
        // })
        this.list = res;
      });
    },
    choose(id) {
      this.$router.push({ path: '/source/' + id })
    },
    sharePanel() {
      share("松鼠高中-松鼠高中网校", "https://api.studying1v1.com/share", '松鼠未来网络科技有限责任公司', 'https://yingshijiaoyusystem.oss-cn-beijing.aliyuncs.com/icons.1024-1.png?x-oss-process=image/resize,m_fill,h_500,w_500')
      // this.showSharePic = true
      // if(iOS){
      //     this.showSharePic = true
      // } else {
      //     modal.toast({
      //         'message': typeof weex.requireModule('UMeng').share,
      //         'duration': 2.0
      //     })
      //     weex.requireModule('UMeng').share();
      // }
    },
    share() {
      this.showSharePic = false;
      share("松鼠高中-松鼠高中网校", "https://api.studying1v1.com/share", '松鼠未来网络科技有限责任公司', 'https://yingshijiaoyusystem.oss-cn-beijing.aliyuncs.com/icons.1024-1.png?x-oss-process=image/resize,m_fill,h_500,w_500')
    },
    goUserInformation() {
      // this.$router.push({path: '/userInformation'})
    },
    loginOut() {
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      this.setToken('');
      this.setUserInfo({});
      this.$router.replace({ path: '/mine' });
      this.showLogout = false
    },
    previewImg() {
      // Nat.image.preview(this.userInfo2.icon);
    },
    downEnglish() {
      weex.requireModule('toAppStore').active();
    },
    showImgDetail(img) {
      showImg(img)
    },
    testNotification() {
      notification('mine页面', '通知喽', 23, 20, 20);
    }
  },
  components: { pic, Button, Dialog },
  watch: {
    userInfo() {
      if (this.userInfo && this.userInfo.account) {
        request.get('/user/getInfo').then(res => {
          this.userInfo2 = res;
          // 动画是等页面滑动结束后，再展开因为滑动过程这个position: fixed的图标，会造成计算位置错误
          setTimeout(() => {
            this.showIsPayed = this.userInfo2 && this.userInfo2.isVip;
          }, 200)
        });
      }
    }
  }
}
</script>
<style scoped lang="less">
.mine {
  display: flex;
  flex-direction: column;
  width: 750px;
  min-height: 100%;
  background-color: rgba(0, 0, 0, 0.06);
}

.user {
  width: 750px;
  height: 170px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px 50px 0;
  border-top-style: solid;
  border-top-width: 1px;
  border-top-color: grey;
  margin-bottom: 20px;
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
}

.icon_panel {
  width: 120px;
  height: 120px;
  border-style: solid;
  border-color: #717171;
  border-width: 1px;
  border-radius: 20px;
  overflow: hidden;
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

.payed {
  display: flex;
  flex-direction: column;
  justify-content: center;
  pointer-events: none;
  align-items: center;
  position: fixed;
  z-index: 2000;
  top: calc(var(--safe-area-inset-top) + 108px);
  right: 32px;
  transition: transform 1s;

  >img {
    width: 120px;
    height: 120px;
    border-radius: 60px;
    overflow: hidden;
  }

  >span {
    font-size: 26px;
  }
}

.actions {
  background: white;
  margin: 10px;
  border-radius: 16px;

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
    width: 700px;
    color: #a50000;
  }
}

.argument {
  display: flex;
  width: 750px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 120px;
  margin-bottom: 60px;

  &_split {
    font-size: 28px;
    color: #688590;
  }

  &_link {
    font-size: 28px;
    color: #7c8690;
  }
}

.english_ad {
  background-color: #37977e;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 750px;
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 40px;
  box-sizing: border-box;

  .icon {
    border-radius: 30px;
  }
}

.english_text {
  font-size: 28px;
  color: white;
  margin-left: 50px;

  &.title {
    font-size: 40px;
  }
}

.english_download {
  background-color: white;
  padding: 10px 20px;
  border-radius: 10px;
  margin-right: 30px;
  color: #2d2d2d;
}

.sharePic {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: 750px;
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
</style>
