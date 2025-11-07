<template>
  <div class="app_content">
    <div class="header" v-if="$route.name !== 'welcome'">
      <div class="header_web_name">
        <div class="head_root" v-if="isInRootPage">
          <img class="icon" src="../icons/icons.png" />
          <div class="degreeName" v-if="selectDegreeInfo" @click="degreeListDialogShow = true">
            <span>{{ selectDegreeInfo.name }}</span>
            <img src="../icons/sanjiao-white.svg" />
          </div>
        </div>
        <div v-else class="header_web_name_back" @click="clickBack">
          <img class="header_web_name_back_img" src="../icons/back.png" />
          <!-- <icon class="header_web_name_back_img" width="48" height="48" :src="isInRootPage ? 'icons' : 'back'" /> -->
        </div>
      </div>
      <div class="header_links">
        <template v-if="isInRootPage">
          <text class="header_links_web_name">松鼠学</text>
        </template>
        <template
          v-else-if="['dailyQuestion', 'QQ', 'aboutUs', 'cache', 'agreement', 'informationDetail', 'zhidaoDetail', 'friend'].includes($route.name)">
          <text class="header_links_web_name"></text>
        </template>
        <template v-else>
          <text class="header_links_web_name" v-if="path && path.length > 0">{{ path[path.length - 1].name }}</text>
        </template>
      </div>
      <div class="header_others">
        <div v-if="$route.name === 'addQuestion'">
          <Button @click="add" style="height:34px;" text="发布"></Button>
        </div>
        <div v-else-if="$route.name === 'lessonDetail'" @click="toListenLog">
          <icon src="log" width="56" height="56" />
        </div>
        <!-- <div v-else-if="$route.name === 'friend'" @click="toAddQuestion">
          <icon src="add" width="56" height="56" />
        </div> -->
      </div>
    </div>
    <div v-if="isOffline" class="offline" :class="{ showLogin }">网络连接断开</div>
    <div style="flex: 1;overflow-y: scroll;position: relative;">
      <router-view v-slot="{ Component }" class="page">
        <transition :name="transitionType">
          <keep-alive include="source,sourceDetail,friend,lessonQuestionList,enRead">
            <component :is="Component" />
          </keep-alive>
        </transition>
      </router-view>
    </div>

    <div class="login" :class="{ isOffline }" v-if="showLogin">
      <Login />
    </div>
    <div class="bottom" :style="{}"
      v-if="$route.meta.hideBottom !== true && (!['lessonDetail', 'lessonDetailNew', 'poiLessonDetail', 'lessonAllChildPoiVideo', 'lessonLog'].includes($route.name) && $route.name !== 'welcome')">
      <div class="bottom_link" :class="[tabType === 'source' ? 'bottom_link_active' : 'bottom_link_blur']"
        @click="to('/source')">
        <icon class="bottom_link_icon" :src="tabType === 'source' ? 'main_active' : 'main'" />
        <text class="bottom_link_text"
          :class="[tabType === 'source' ? 'bottom_link_text_active' : 'bottom_link_text_blur']">课程</text>
      </div>
      <div class="bottom_link" :class="[tabType === 'file' ? 'bottom_link_active' : 'bottom_link_blur']"
        @click="to('/file')">
        <icon class="bottom_link_icon" :src="tabType === 'file' ? 'file_active' : 'file'" />
        <text class="bottom_link_text"
          :class="[tabType === 'file' ? 'bottom_link_text_active' : 'bottom_link_text_blur']">资料库</text>
      </div>
      <div class="bottom_link" :class="[tabType === 'friend' ? 'bottom_link_active' : 'bottom_link_blur']"
        @click="to('/friend')" v-if="channel !== 'huawei'">
        <icon class="bottom_link_icon" :src="tabType === 'friend' ? 'friend_active' : 'friend'" />
        <text class="bottom_link_text"
          :class="[tabType === 'friend' ? 'bottom_link_text_active' : 'bottom_link_text_blur']">消息</text>
        <div class="tip" v-if="notUsedInformationCount > 0">
          <text class="tipText">{{ notUsedInformationCount }}</text>
        </div>
      </div>
      <!--<div class="bottom_link" @click="to('/analytics')">-->
      <!--<image class="bottom_link_icon" :src="'xcassets:'+($route.name==='analytics'?'line_active':'line')"/>-->
      <!--<text class="bottom_link_text">分析</text>-->
      <!--</div>-->
      <!--            <div class="bottom_link" @click="to('/mall')">-->
      <!--                <icon class="bottom_link_icon" width="40" height="40" :src="tabType==='mall'?'mall_active':'mall'"/>-->
      <!--                <text class="bottom_link_text" :class="[tabType==='mall'?'bottom_link_text_active':'bottom_link_text_blur']">商城</text>-->
      <!--            </div>-->
      <div class="bottom_link" :class="[tabType === 'mine' ? 'bottom_link_active' : 'bottom_link_blur']"
        @click="to('/mine')">
        <icon class="bottom_link_icon" :src="tabType === 'mine' ? 'user_active' : 'user'" />
        <text class="bottom_link_text"
          :class="[tabType === 'mine' ? 'bottom_link_text_active' : 'bottom_link_text_blur']">我的</text>
      </div>
    </div>
    <ImgPreview v-if="showImgUrl" :url="showImgUrl.replace('http://', 'https://')" @cancel="showImgUrl = ''" />
    <Dialog title="服务协议和隐私政策" :show="showAgree && $route.name !== 'agreement'" hideClose @close="showAgree = false">
      <div class="argument-inner" v-if="showAgree && $route.name !== 'agreement'">
        <div>
          <text class="argument_content">请您务必审慎阅读、充分理解“服务协议”和“隐私政策”各条款。您可以阅读</text>
          <div style="display: flex;flex-direction: row">
            <text class="argument_link" @click="gotoAgreementPage">“服务协议”</text>
            <text class="argument_content">和</text>
            <text class="argument_link" @click="gotoAgreementPage">“隐私政策”</text>
          </div>
          <text class="argument_content">了解详情。如果您同意，请点击“同意”开始接受我们的服务。</text>
        </div>
        <div class="argumentActions">
          <Button @click="agreeDisagree" type="white" text="拒绝" />
          <Button @click="agree" text="同意" primary />
        </div>
      </div>
    </Dialog>
    <div class="argument" v-if="mastUpdate">
      <div class="argument-inner">
        <div>
          <text class="argument-title">软件更新</text>
        </div>
        <div style="height:200px;">
          <text class="argument_content">您本地软件版本需要升级后才能使用</text>
          <text class="argument_content">升级后，将会扩展更多功能，和增强部分功能稳定性</text>
        </div>
        <div style="height:100px;" v-if="lastVersion">
          <text>最新版本：{{ lastVersion.version }}</text>
        </div>
        <div style="display: flex;flex-direction: row;align-items: center;justify-content: center;">
          <!-- <wxc-button @wxcButtonClicked="disagree" type="white" text="暂不" style="width:240px;height:80px;"/>
          <wxc-button @wxcButtonClicked="gotoUpdatePage" text="升级"
                      style="width:240px;height:80px;margin-left: 20px;background-color: #00795c;"/> -->
        </div>
      </div>
    </div>
    <div class="ba" v-if="$route.name === 'source'">
      <a class="ga" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=22020302000326" target="_blank">
        <img src="https://yingshijiaoyusystem.oss-cn-beijing.aliyuncs.com/ga.png" />
        吉公网安备22020302000326号
      </a>
      <a href="https://beian.miit.gov.cn" target="_blank">吉ICP备2024023809号-1</a>
    </div>
  </div>
  <Dialog :show="!showAgree && $route.name !== 'welcome' && degreeListDialogShow" title="选择学位"
    @close="degreeListDialogShow = false">
    <div class="degreeList">
      <div v-for="item in degreeList" class="degreeItem" :key="item.id" :class="{ select: degreeSelect === item.id }"
        @click="changeDegree(item.id)">
        {{ item.name }}
      </div>
    </div>
  </Dialog>
  <Dialog :show="showBuySuccess" title="恭喜您获得VIP权限" @close="showBuySuccess = false">
    <BuyVIPDesc />
    <div class="buySuccess">
      <img src="../icons/isPayed.png" />
      <div>购买成功，恭喜您获得VIP权限！！</div>
      <div class="tools">
        <Button text="继续使用" @click="showBuySuccess = false"></Button>
      </div>
    </div>
  </Dialog>
</template>
<script>
import { useStore, mapActions, mapGetters } from 'vuex';
import { computed, ref } from 'vue'
import icon from '../components/icon.vue'
import Button from '../components/Button.vue'
import Login from './login.vue'
import request from '@/plugin/request'
import { onShowImg } from '../plugin/imagePreview'
import ImgPreview from '../components/imgPreview.vue'
import Dialog from '../components/Dialog.vue'
import event from '../plugin/event';
import umeng from '@/plugin/umeng';
import program from '@/plugin/program';
import isMobileDevice from '@/plugin/isMobileDevice'
import BuyVIPDesc from './buyVIPDesc.vue';
import { setBuyVipCallback } from '@/plugin/buyVip'
import checkNet from '../plugin/checkNet';
import bridge from '@/plugin/bridge';

const agreementKey = 'agreementKey2022-8-7-2'
const degreeSelectCacheKey = 'degreeSelectCacheKey-2025-7-4'
export default {
  data() {
    const match = navigator.userAgent.match(/channel\((.*?)\)/);
    return {
      notUsedInformationCount: 0,
      // rightButtons: [],
      // openPages: [],// 新的页面堆栈，逐渐替换掉router-view，因为无法解决保存原有状态的问题
      isOffline: false, // 是否断网
      transitionType: '',
      showImgUrl: '',
      showAgree: false,
      channel: match ? match[1] : '',
      mastUpdate: false,// 是否需要升级app
      lastVersion: null,// 当前运行最低版本
      isMobileDevice: isMobileDevice(),
      showBuySuccess: false,
      // 学位
      degreeSelect: 1,// 先默认选高中
      degreeListDialogShow: false,
      degreeList: [],
    }
  },
  created() {
    request.__log401callBack__ = () => {
      this.setShowLogin(true)
    }
    window.onClickBack = this.clickBack;

    setBuyVipCallback(() => {
      this.showBuySuccess = true;
    })

    window.addEventListener("offline", () => {
      this.isOffline = true;
    })
    window.addEventListener("online", () => {
      this.isOffline = false;
    })

    this.$router.beforeEach((to, from, next) => {
      console.log(to.name, from.name)

      const newVal = to.name;
      const oldVal = from.name;
      if (oldVal === undefined) {
        next()
      }
      const rootPages = ['source', 'file', 'friend', 'mall', 'mine']
      let sort = [
        ...rootPages,
        'sourceDetail', 'lessonDetail', 'word', 'wordSearch', 'listen', 'lessonDetailNew', 'poiLessonDetail', 'lessonAllChildPoiVideo', 'lessonQuestionList', 'lessonKnowledgeList', 'poiQuestion', 'lessonLog', 'enGrammar', 'enGrammarItem', 'enRead', 'enReadDetail',
        'addQuestion', 'informationDetail', 'dailyQuestion', 'zhidaoDetail', 'lessonKnowledgeDetail', 'chat',
        'address', 'order', 'aboutUs', 'cache', 'agreement', 'QQ', 'userInformation', 'accountInfo', 'develop'
      ];
      if (sort.indexOf(newVal) > sort.indexOf(oldVal)) {
        if (rootPages.includes(newVal) && rootPages.includes(oldVal)) {
          this.transitionType = 'left';
        } else {
          this.transitionType = 'inner';
        }
      } else {
        if (rootPages.includes(newVal) && rootPages.includes(oldVal)) {
          this.transitionType = 'right';
        } else {
          this.transitionType = 'outer';
        }
      }
      next()
    })
    onShowImg((url) => {
      this.showImgUrl = url
    })

    // 初次打开执行
    try {
      const data = localStorage.getItem(agreementKey)
      if (data === null && isMobileDevice()) {
        this.showAgree = true;
      } else {
        umeng.init(false)
        bridge('ad', 'openAd')
      }
    } catch (e) {
      console.log(e)
    }
    window.initFinish = () => {
      // app从后台恢复到前台
      window.appActive = () => {
        checkNet.check()
      }
      // app从前台进入后台
      window.appBackground = () => {
      }
    }
    // 学位选择
    let degreeSelect = localStorage.getItem(degreeSelectCacheKey);
    degreeSelect = degreeSelect ? parseInt(degreeSelect) : 1
    // const selectDegree = localStorage.getItem(degreeSelectCacheKey)
    // if (selectDegree === null) {
    //   // localStorage.setItem(agreementKey, (new Date()).getTime())
    // }
    this.degreeSelect = degreeSelect;
    this.setDegree(degreeSelect)

    request.get('/studying/degree/list').then((list) => {
      this.degreeList = list;
    })

    // const minVersion = await this.axios.get('/globleConfig?keys=minVersion');
    // if (weex && weex.config.env.platform === 'iOS') {
    //     weex.requireModule('DeviceInfo').info(res => {
    //         const localVersion = res.version.split('.')
    //         if (parseInt(localVersion[0]) < minVersion.minVersion[0] || parseInt(localVersion[1]) < minVersion.minVersion[1]) {
    //             this.mastUpdate = true;
    //         }
    //     });
    // } else {
    //     const localVersion = weex.config.env.appVersion.split('.')
    //     if (parseInt(localVersion[0]) < minVersion.minVersion[0] || parseInt(localVersion[1]) < minVersion.minVersion[1]) {
    //         this.axios.get('/app/lastVersion?platform=Android').then(version => {
    //             this.mastUpdate = true;
    //             this.lastVersion = version;
    //         });
    //     }
    // }

  },
  methods: {
    ...mapActions('main', ['setShowLogin', 'setDegree']),
    clickBack() {
      if (this.showImgUrl) {
        // 如果图片再预览状态点击了返回，则先触发图片预览的关闭
        this.showImgUrl = ''
        return;
      }
      if (!this.isInRootPage) {
        this.$router.back()
        return true;
      } else {
        program.exit()
      }
    },
    add() {
      event.emit('add')
    },
    to(path) {
      // this.openPages = [];
      // 没有找到一个方法，清空history，所以多调用几次
      // this.$router.back();
      // if (path === '/friend' && this.tabType !== 'friend') {
      //     updateUsed('information')
      // }
      this.$router.replace(path);
    },
    toListenLog() {
      this.$router.push('/lessonLog/' + this.$route.params.id);
    },
    gotoAgreementPage() {
      this.$router.push('/agreement')
    },
    toAddQuestion() {
      this.$router.push('/addQuestion')
    },
    agreeDisagree() {
      program.exit()
    },
    agree() {
      this.showAgree = false;
      localStorage.setItem(agreementKey, (new Date()).getTime())
      umeng.init(true)
      bridge('ad', 'openAd')
    },
    changeDegree(id) {
      this.degreeSelect = id;
      this.setDegree(id)
      this.degreeListDialogShow = false;

      localStorage.setItem(degreeSelectCacheKey, id)
    }
  },
  computed: {
    ...mapGetters('main', ['showLogin']),
    path() {
      // @ts-ignore
      return this.$store.getters['main/path']
    },
    tabType() {
      if (['source', 'sourceDetail', 'lessonDetail', 'lessonDetailNew', 'poiLessonDetail', 'lessonQuestionList', 'poiQuestion', 'lessonKnowledgeList', 'lessonKnowledgeDetail', 'lessonAllChildPoiVideo', 'listen', 'word', 'enGrammar', 'enGrammarItem', 'wordSearch', 'enRead', 'enReadDetail'].includes(this.$route.name)) {
        return 'source';
      } else if (['file'].includes(this.$route.name)) {
        return 'file';
      } else if (['mine', 'aboutUs', 'address', 'order', 'cache', 'agreement', 'QQ', 'userInformation', 'accountInfo', 'develop'].includes(this.$route.name)) {
        return 'mine';
      } else if (['friend', 'addQuestion', 'informationDetail', 'dailyQuestion', 'zhidaoDetail', 'chat'].includes(this.$route.name)) {
        return 'friend';
      } else if (['mall'].includes(this.$route.name)) {
        return 'mall'
      }
    },
    isInRootPage() {
      // @ts-ignore
      return ['source', 'friend', 'file', 'mall', 'mine'].includes(this.$route.name);
    },
    selectDegreeInfo() {
      console.log('this.degreeList', this.degreeList)
      return this.degreeList.find(v => v.id === this.degreeSelect);
    }
  },
  components: { icon, Button, Login, ImgPreview, Dialog, BuyVIPDesc }
}
</script>
<style lang="less" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.app_content {
  background-color: #fafffd;
  width: 750px;
  height: 100vh;
  display: flex;
  flex-grow: 1;
  flex-direction: column;

  .header {
    line-height: 88px;
    background-color: #00795c;
    color: white;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    flex-shrink: 0;
    flex-grow: 0;
    height: 88px;
    position: relative;
    padding-top: env(safe-area-inset-top);

    .header_web_name {
      display: flex;
      flex: 0;
      flex-direction: row;
      align-items: center;
      height: 100%;
      position: absolute;

      .head_root {
        display: flex;
        align-items: center;
        font-size: 28px;

        .icon {
          width: 48px;
          height: 48px;
          margin: 0 8px;
        }

        .degreeName {
          font-size: 32px;
          display: flex;
          align-items: center;

          >img {
            height: 8px;
            margin-left: 8px;
          }
        }
      }

      &_back {
        min-width: 88px;
        height: 88px;
        opacity: 0.8;
        display: flex;
        align-items: center;
        justify-content: center;

        &_img {
          width: 48px;
          height: 48px;
        }
      }
    }

    &_links {
      display: flex;
      flex: 1;
      font-size: 32px;
      width: 100%;
      height: 100%;
      flex-direction: row;
      color: white;

      &_web_name {
        color: rgba(255, 255, 255, 0.9);
        display: block;
        font-family: PingFangSC-Medium;
        width: 590px;
        flex-grow: 1;
        font-size: 36px;
        text-align: center;
      }
    }

    >.header_others {
      margin-right: 20px;
      height: 100%;
      display: flex;
      align-items: center;
      position: absolute;
      right: 0;

      >div {
        height: 56px;
      }
    }
  }

  .offline {
    background: #f75a5a;
    text-align: center;
    height: 100px;
    line-height: 100px;
    color: white;
    width: 100%;
    z-index: 10000;

    &.showLogin {
      position: fixed;
      top: 0;
    }
  }

  .page {
    height: 100%;
    background: white;
  }
}

.bottom {
  width: 100vw;
  background-color: #fcfcfc;
  border-top-style: solid;
  border-top-width: 1px;
  border-top-color: #a5afab;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding-bottom: env(safe-area-inset-bottom);

  &_link {
    height: 100px;
    flex: 1;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    &_icon {
      width: 44px;
      height: 44px;
    }

    &_text {
      font-size: 28px;
      line-height: 28px;
      height: 24px;
      color: #5a5e5d;
      text-align: center;
      margin-left: 8px;

      &_active {
        color: #1a2e27;
        font-weight: bold;
      }
    }
  }
}

.login {
  position: fixed;
  width: 100vw;
  background-color: white;
  top: 0;
  bottom: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;

  &.isOffline {
    top: 88px;
  }
}

.argument {
  &-inner {
    display: flex;
    flex-direction: column;
  }

  &-title {
    font-family: PingFangSC-Semibold;
    text-align: center;
    margin-bottom: 20px;
    font-size: 36px;
    color: rgba(0, 0, 0, 0.84);
  }

  &_content {
    font-size: 28px;
    color: #3d3d3d;
  }

  &_link {
    font-size: 28px;
    color: blue;
  }
}

.argumentActions {
  margin-top: 32px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  >* {
    flex-grow: 1;

    &:not(:first-child) {
      margin-left: 20px;
    }
  }
}

.ba {
  display: none;
}

.inner-leave-active {
  position: absolute;
  z-index: 1;
  top: 0;
  width: 750px;
  transition: transform .3s;
}

.inner-leave-from {
  /*定义进入结束和离开开始的透明度为1*/
  transform: translateX(0px);
}

.inner-leave-to {
  transform: translateX(-300px);
}

.inner-enter-active {
  position: absolute;
  z-index: 2;
  width: 750px;
  border-left: solid 1px rgb(175, 175, 175);
  top: 0;
  transition: opacity .1s, transform .3s;
}

.inner-enter-from {
  /*定义进入结束和离开开始的透明度为1*/
  opacity: 0;
  transform: translateX(750px);
}

.inner-enter-to {
  opacity: 1;
  transform: translateX(0px);
}


.outer-leave-active {
  position: absolute;
  top: 0;
  width: 750px;
  z-index: 2;
  transition: opacity .3s, transform .3s;
}

.outer-leave-from {
  /*定义进入结束和离开开始的透明度为1*/
  transform: translateX(0px);
}

.outer-leave-to {
  transform: translateX(750px);
}

.outer-enter-active {
  position: absolute;
  top: 0;
  width: 750px;
  z-index: 1;
  transition: transform .3s;
}

.outer-enter-from {
  /*定义进入结束和离开开始的透明度为1*/
  transform: translateX(-200px);
}

.outer-enter-to {
  transform: translateX(0px);
}



.left-leave-active {
  position: absolute;
  width: 750px;
  z-index: 1;
  top: 0;
  transition: transform .3s;
}

.left-leave-from {
  /*定义进入结束和离开开始的透明度为1*/
  transform: translateX(0px);
}

.left-leave-to {
  transform: translateX(-750px);
}

.left-enter-active {
  position: absolute;
  width: 750px;
  z-index: 2;
  top: 0;
  transition: transform .3s;
}

.left-enter-from {
  transform: translateX(750px);
}

.left-enter-to {
  transform: translateX(0px);
}




.right-leave-active {
  position: absolute;
  top: 0;
  width: 750px;
  transition: transform .3s;
}

.right-leave-from {
  /*定义进入结束和离开开始的透明度为1*/
  transform: translateX(0px);
}

.right-leave-to {
  transform: translateX(750px);
}

.right-enter-active {
  position: absolute;
  top: 0;
  width: 750px;
  transition: transform .3s;
}

.right-enter-from {
  /*定义进入结束和离开开始的透明度为1*/
  transform: translateX(-750px);
}

.right-enter-to {
  transform: translateX(0px);
}

@media (min-width: 1025px) {

  /* 中等屏幕宽度下的样式 */
  .app_content {
    .header {
      height: 66px;

      .header_web_name {
        min-width: 66px;

        .header_web_name_back {
          min-width: 66px;
          height: 66px;
          display: flex;
          align-items: center;
          justify-content: center;

          .header_web_name_back_img {
            margin: 0;
            width: 48px !important;
            height: 48px !important;
          }
        }

        .head_root {
          .degreeName {
            margin-left: 80PX;
            font-size: 14PX;
          }
        }
      }

      .header_links {
        flex-grow: 0;
        width: 275px;

        .header_links_web_name {
          width: auto;
          position: absolute;
          margin-left: 44PX;
          font-size: 0.37333rem;
          line-height: 0.88rem;
        }
      }
    }

    .bottom {
      height: 66px;
      left: 300px;
      width: 640px;
      // right: 0;
      position: absolute;
      border: none;
      top: 0;

      .bottom_link {
        height: 66px;

        .bottom_link_icon {
          width: 44px !important;
          height: 44px !important;
        }

        .bottom_link_text {
          font-size: 22px;
          margin: 0;
        }

        &.bottom_link_blur {
          background-color: #00795c;

          .bottom_link_icon {
            display: none;
          }

          .bottom_link_text {
            color: white;
          }
        }
      }
    }

    .ba {
      display: flex;
      flex-direction: row;
      padding: 8px;
      border-top: solid 1px #eee;

      a {
        color: #333;
        font-size: 14px;
        text-decoration: none;
        display: flex;
        align-items: center;
        margin-right: 12px;
      }

      .ga {
        img {
          height: 14px;
        }
      }
    }
  }
}

.buySuccess {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 32px;

  >img {
    width: 300px;
    height: 300px;
    border-radius: 50%;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .tools {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
}

.degreeList {
  .degreeItem {
    border: solid 1px rgb(141, 141, 141);
    color: rgb(101, 101, 101);
    padding: 16px 32px;
    font-size: 38px;
    border-radius: 16px;
    margin-bottom: 16px;

    &.select {
      border: none;
      background-color: #00795c;
      color: white;
    }
  }
}
</style>