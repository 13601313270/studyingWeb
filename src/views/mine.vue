<template>
  <Page title="我的" root foot-active="mine" hide-header>
    <div class="mine">
      <!-- 用户未登录 -->
      <div class="profile-card" v-if="!store.state.main.userInfo || !store.state.main.userInfo.account">
        <div class="profile-avatar profile-avatar--placeholder">
          <span class="profile-avatar-text">?</span>
        </div>
        <div class="profile-info">
          <div class="profile-name">未登录</div>
          <div class="profile-sub">欢迎来到松鼠学</div>
        </div>
        <Button class="profile-btn" text="登录" @click="login" type="white"></Button>
      </div>

      <!-- 用户已登录 -->
      <div v-else>
        <div class="card">
          <!-- 用户卡片 -->
          <div class="profile-card" @click="goUserInformation">
            <div v-if="userInfo2.icon" class="profile-avatar">
              <img
                :src="userInfo2.icon.replace('http://', 'https://') + '?x-oss-process=image/resize,m_fill,h_200,w_200'" />
            </div>
            <div v-else class="profile-avatar profile-avatar--default">
              <span class="profile-avatar-text">{{ (userInfo2.account || '').charAt(0) }}</span>
            </div>
            <div class="profile-info">
              <div class="profile-name">{{ userInfo2.account }}</div>
              <div class="profile-sub">学员 {{ userInfo2.account }}</div>
            </div>
            <div class="profile-edit">编辑资料</div>
          </div>

          <!-- VIP 卡片 -->
          <div class="vip-card" v-if="showIsPayed">
            <div class="vip-card-left">
              <div class="vip-icon">
                <svg clip="icon" aria-hidden="true" class="icon" fill="none" height="19" viewBox="0 0 24 24" width="19">
                  <path d="m3 7 4 4 5-7 5 7 4-4-2 11H5z"></path>
                  <path d="M5 21h14"></path>
                </svg>
              </div>
              <div>
                <div class="vip-title">VIP 会员</div>
                <div class="vip-sub" v-if="userInfo2.vipEndDate">有效期至 {{ userInfo2.vipEndDate.slice(0, 10) }}</div>
                <div class="vip-sub" v-else>尊享全部会员权益</div>
              </div>
            </div>
            <div style="flex-grow: 1;"></div>
            <div class="vip-card-right" @click="showBuyVip = true">查看权益 <span class="chevron">›</span></div>
          </div>
          <div class="vip-card vip-card--inactive" v-else @click="showBuyVip = true">
            <div class="vip-card-left">
              <div class="vip-icon">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="5" y="11" width="14" height="10" rx="2" stroke="#6b7280" stroke-width="2" />
                  <path d="M8 11V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V11" stroke="#6b7280"
                    stroke-width="2" />
                </svg>
              </div>
              <div>
                <div class="vip-title">开通 VIP</div>
                <div class="vip-sub">解锁全部会员权益</div>
              </div>
            </div>
            <div class="vip-card-right">立即开通 <span class="chevron">›</span></div>
          </div>
        </div>

        <!-- 统计数据 -->
        <div class="stats-row" style="display: none;">
          <div class="stat-item">
            <div class="stat-num">--</div>
            <div class="stat-label">学习天数</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-num">--</div>
            <div class="stat-label">收藏资料</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-num">--</div>
            <div class="stat-label">本周学习</div>
          </div>
        </div>

        <!-- 分组菜单 -->
        <div class="menu-group">
          <div class="menu-group-title">账户</div>
          <div class="menu-card">
            <div class="menu-item" @click="$router.push('/accountInfo')">
              <div class="menu-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke="#2563eb" stroke-width="2" />
                  <path d="M4 21C4 16.582 7.582 13 12 13C16.418 13 20 16.582 20 21" stroke="#2563eb" stroke-width="2"
                    stroke-linecap="round" />
                </svg>
              </div>
              <div class="menu-text">账户信息</div>
              <div class="menu-arrow">›</div>
            </div>
            <div class="menu-item" @click="toOrder">
              <div class="menu-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15"
                    stroke="#ea580c" stroke-width="2" stroke-linecap="round" />
                  <rect x="9" y="3" width="6" height="4" rx="1" stroke="#ea580c" stroke-width="2" />
                  <path d="M9 14L11 16L15 12" stroke="#ea580c" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
              </div>
              <div class="menu-text">我的订单</div>
              <div class="menu-arrow">›</div>
            </div>
            <div class="menu-item" @click="toAddress">
              <div class="menu-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M12 22C12 22 5 16 5 10C5 6.13401 8.13401 3 12 3C15.866 3 19 6.13401 19 10C19 16 12 22 12 22Z"
                    stroke="#dc2626" stroke-width="2" />
                  <circle cx="12" cy="10" r="3" stroke="#dc2626" stroke-width="2" />
                </svg>
              </div>
              <div class="menu-text">我的收件地址</div>
              <div class="menu-arrow">›</div>
            </div>
          </div>
        </div>

        <div class="menu-group">
          <div class="menu-group-title">会员</div>
          <div class="menu-card">
            <div class="menu-item" @click="showBuyVip = true">
              <div class="menu-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M3 7L6 12L9 6L12 11L15 6L18 12L21 7V17H3V7Z" stroke="#d97706" stroke-width="2"
                    stroke-linejoin="round" />
                  <path d="M3 19H21" stroke="#d97706" stroke-width="2" stroke-linecap="round" />
                </svg>
              </div>
              <div class="menu-text">我的 VIP</div>
              <div class="menu-right" v-if="userInfo2.vipEndDate && showIsPayed">{{ userInfo2.vipEndDate.slice(0, 10) }}
                到期</div>
              <div class="menu-arrow">›</div>
            </div>
            <div class="menu-item" @click="showBuyVip = true">
              <div class="menu-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M20 12V21H4V12" stroke="#7c3aed" stroke-width="2" stroke-linecap="round" />
                  <path d="M2 7H22V12H2V7Z" stroke="#7c3aed" stroke-width="2" stroke-linejoin="round" />
                  <path d="M12 22V7" stroke="#7c3aed" stroke-width="2" />
                  <circle cx="12" cy="7" r="2" stroke="#7c3aed" stroke-width="2" />
                </svg>
              </div>
              <div class="menu-text">VIP 权益</div>
              <div class="menu-arrow">›</div>
            </div>
          </div>
        </div>

        <div class="menu-group">
          <div class="menu-group-title">社区与应用</div>
          <div class="menu-card">
            <div class="menu-item" @click="sharePanel">
              <div class="menu-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="18" cy="5" r="3" stroke="#059669" stroke-width="2" />
                  <circle cx="6" cy="12" r="3" stroke="#059669" stroke-width="2" />
                  <circle cx="18" cy="19" r="3" stroke="#059669" stroke-width="2" />
                  <path d="M8.59 13.51L15.42 17.49" stroke="#059669" stroke-width="2" stroke-linecap="round" />
                  <path d="M15.41 6.51L8.59 10.49" stroke="#059669" stroke-width="2" stroke-linecap="round" />
                </svg>
              </div>
              <div class="menu-text">分享好友</div>
              <div class="menu-arrow">›</div>
            </div>
            <div class="menu-item" @click="$router.push('/QQ')">
              <div class="menu-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 11.5C21 16.15 17.46 20 13 20H12.5L8 22V20H7C2.53 20 0 16.15 0 11.5C0 6.85 3.53 3 8 3H17C21.47 3 25 6.85 25 11.5"
                    stroke="#0891b2" stroke-width="2" stroke-linejoin="round" />
                  <path d="M8 10C8 11.1 7.1 12 6 12C4.9 12 4 11.1 4 10" stroke="#0891b2" stroke-width="2"
                    stroke-linecap="round" />
                  <path d="M16 10C16 11.1 15.1 12 14 12C12.9 12 12 11.1 12 10" stroke="#0891b2" stroke-width="2"
                    stroke-linecap="round" />
                </svg>
              </div>
              <div class="menu-text">QQ 交流群</div>
              <div class="menu-arrow">›</div>
            </div>
            <div class="menu-item" @click="$router.push('/cache')">
              <div class="menu-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <ellipse cx="12" cy="5" rx="9" ry="3" stroke="#6b7280" stroke-width="2" />
                  <path d="M3 5V19C3 20.6569 7.02944 22 12 22C16.9706 22 21 20.6569 21 19V5" stroke="#6b7280"
                    stroke-width="2" />
                  <path d="M3 12C3 13.6569 7.02944 15 12 15C16.9706 15 21 13.6569 21 12" stroke="#6b7280"
                    stroke-width="2" />
                </svg>
              </div>
              <div class="menu-text">缓存设置</div>
              <div class="menu-arrow">›</div>
            </div>
            <div class="menu-item" v-if="isiOS" @click="score">
              <div class="menu-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                    stroke="#ca8a04" stroke-width="2" stroke-linejoin="round" />
                </svg>
              </div>
              <div class="menu-text">给 App 评分</div>
              <div class="menu-arrow">›</div>
            </div>
            <div class="menu-item" @click="$router.push('/aboutUs')">
              <div class="menu-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#0d9488" stroke-width="2" />
                  <path d="M12 16V12" stroke="#0d9488" stroke-width="2" stroke-linecap="round" />
                  <circle cx="12" cy="8" r="1" fill="#0d9488" />
                </svg>
              </div>
              <div class="menu-text">关于我们</div>
              <div class="menu-arrow">›</div>
            </div>
          </div>
        </div>

        <!-- 退出登录 -->
        <div class="logout-btn" @click="showLogout = true">退出登录</div>
      </div>

      <div style="flex-grow: 1"></div>

      <!-- 底部协议 -->
      <div class="argument" @click="$router.push('/agreement')">
        <text class="argument_link">服务协议</text>
        <text class="argument_split">｜</text>
        <text class="argument_link">隐私政策</text>
      </div>

      <!-- 分享图片弹窗 -->
      <div class="sharePic" v-if="showSharePic">
        <div class="sharePicInner">
          <div class="sharePicInner_close" @click="showSharePic = false">
            <pic src="close" :width="40" :height="40" />
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
    </div>

    <Dialog :show="showLogout" title="您确定要退出" @close="showLogout = false">
      <div class="logout">
        <div class="logoutText">退出后用户信息不会丢失，后续如果需要，可重新登录。</div>
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
import { useStore } from 'vuex';
import pic from '../components/icon.vue';
import Button from '../components/Button.vue'
import Dialog from '../components/Dialog.vue'
import request from '@/plugin/request'
import share from '@/plugin/share'
import toScore from '@/plugin/toScore';
import BuyVIPDesc from './buyVIPDesc.vue';
import VipPriceDesc from '@/components/vipPriceDesc.vue';
import Page from '@/components/Page.vue';
import Loading from '@/plugin/loading'

const store = useStore<any>()
const router = useRouter()

const userInfo2 = ref<any>({})
const isiOS = navigator.userAgent.includes('iPhone');
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

watch(() => store.state.main.userInfo, () => {
  if (store.state.main.userInfo && store.state.main.userInfo.account) {
    const loading = Loading();
    request.get('/user/getInfo').then(res => {
      loading.destory()
      userInfo2.value = res;
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
  align-items: stretch;
  padding: 44px;
  padding-top: max(env(safe-area-inset-top), 44px);
  box-sizing: border-box;
  gap: 24px;
}

/* ========== 用户卡片 ========== */
.card {
  border-radius: 26px;
  background: white;
  border: 1PX solid rgb(233, 238, 235);
  overflow: hidden;
  box-shadow: rgba(35, 62, 47, 0.07) 0px 8px 28px 0px;
  margin-bottom: 28px;

  .profile-card {
    display: flex;
    align-items: center;
    padding: 34px;

    .profile-avatar {
      width: 108px;
      height: 108px;
      border-radius: 50%;
      overflow: hidden;
      flex-shrink: 0;
      background: rgba(255, 255, 255, 0.25);
      background-color: red;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      &-text {
        font-size: 48px;
        font-weight: bold;
        color: white;
      }
    }

    .profile-info {
      flex: 1;
      min-width: 0;
      margin-left: 26px;

      .profile-name {
        font-size: 40px;
        font-weight: 700;
        color: rgb(23, 33, 28);
        margin-bottom: 8px;
      }

      .profile-sub {
        font-size: 26px;
        color: rgb(154, 164, 159);
      }
    }

    .profile-edit {
      font-size: 24px;
      color: rgb(47, 125, 90);
      padding: 10px 20px;
      margin-right: -20px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 28px;
      flex-shrink: 0;
      white-space: nowrap;
    }

    &--placeholder {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    &--default {
      background: rgba(255, 255, 255, 0.25);
      border: 2px solid rgba(255, 255, 255, 0.5);
    }
  }

  /* ========== VIP 卡片 ========== */
  .vip-card {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 26px 28px;
    color: #6d624d;
    background: #faf3df;

    &--inactive {
      background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
      box-shadow: none;

      .vip-title {
        color: #374151;
      }

      .vip-sub {
        color: #9ca3af;
      }

      .vip-card-right {
        color: #374151;
      }
    }
  }

  .vip-card-left {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .vip-icon {
    width: 66px;
    height: 66px;
    border-radius: 23%;
    background: rgba(255, 255, 255, .65);
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      stroke: #654a1f;
      stroke-width: 1.8;
      width: 40px;
      height: 40px;
    }
  }

  .vip-title {
    font-size: 26px;
    font-weight: 600;
    color: #654a1f;
  }

  .vip-sub {
    font-size: 18px;
    color: rgba(120, 53, 15, 0.7);
    margin-top: 6px;
  }

  .vip-card-right {
    font-size: 22px;
    color: rgb(101, 74, 31);
  }
}

/* ========== 统计数据 ========== */
.stats-row {
  background: white;
  border-radius: 20px;
  padding: 32px 24px;
  display: flex;
  margin-bottom: 48px;
  align-items: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);

  .stat-item {
    flex: 1;
    text-align: center;

    .stat-num {
      font-size: 40px;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 8px;
    }

    .stat-label {
      font-size: 24px;
      color: #9ca3af;
    }
  }

  .stat-divider {
    width: 1px;
    height: 60px;
    background: #e5e7eb;
  }
}

.profile-btn {
  width: 180px;
  height: 72px;
  flex-shrink: 0;
}

/* ========== 通用 chevron ========== */
.chevron {
  font-weight: 300;
  margin-left: 4px;
}

/* ========== 分组菜单 ========== */
.menu-group {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .menu-group-title {
    font-size: 24px;
    color: rgb(104, 115, 109);
    font-weight: 500;
    margin-bottom: 4px;
  }

  .menu-card {
    background: white;
    border-radius: 20px;
    padding: 0 24px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
    margin-bottom: 38px;

    .menu-item {
      display: flex;
      align-items: center;
      padding: 21px 0;
      gap: 20px;

      &:not(:last-child) {
        border-bottom: 1px solid #f3f4f6;
      }
    }

    .menu-icon {
      width: 62px;
      height: 62px;
      border-radius: 16px;
      background-color: rgb(238, 245, 241);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      svg {
        width: 36px;
        height: 36px;
      }
    }

    .menu-text {
      flex: 1;
      font-size: 28px;
      color: #1f2937;
    }

    .menu-right {
      font-size: 22px;
      color: #9ca3af;
      margin-right: 8px;
    }

    .menu-arrow {
      font-size: 36px;
      color: #d1d5db;
      font-weight: 300;
    }
  }
}

/* ========== 退出登录 ========== */
.logout-btn {
  background: white;
  border-radius: 20px;
  padding: 32px;
  text-align: center;
  font-size: 28px;
  color: #dc2626;
  font-weight: 500;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

/* ========== 底部协议 ========== */
.argument {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-top: 20px;
  padding-bottom: 20px;

  &_split {
    font-size: 24px;
    color: #9ca3af;
  }

  &_link {
    font-size: 24px;
    color: #9ca3af;
  }
}

/* ========== 分享弹窗 ========== */
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

/* ========== Dialog 内的退出确认 ========== */
.logout {
  .logoutText {
    font-size: 28px;
    text-indent: 2em;
  }

  .tools {
    margin-top: 28px;
    margin-bottom: 12px;
    display: flex;
    justify-content: space-around;
  }
}

/* ========== 桌面端适配 ========== */
@media (min-width: 1025px) {
  .mine {
    max-width: 700px;
    margin: 0 auto;
  }

  .profile-card {
    padding: 28px;
    border-radius: 16px;
  }

  .profile-avatar {
    width: 80px;
    height: 80px;

    &-text {
      font-size: 32px;
    }
  }

  .profile-name {
    font-size: 20px;
  }

  .profile-sub {
    font-size: 14px;
  }

  .profile-edit {
    font-size: 13px;
    padding: 6px 14px;
  }

  .vip-card {
    border-radius: 14px;
    padding: 18px 20px;
  }

  .vip-icon {
    width: 42px;
    height: 42px;

    svg {
      width: 24px;
      height: 24px;
    }
  }

  .vip-title {
    font-size: 16px;
  }

  .vip-sub {
    font-size: 12px;
  }

  .vip-card-right {
    font-size: 13px;
  }

  .stats-row {
    padding: 20px 16px;
    border-radius: 14px;
  }

  .stat-num {
    font-size: 22px;
  }

  .stat-label {
    font-size: 13px;
  }

  .menu-group-title {
    font-size: 13px;
  }

  .menu-card {
    border-radius: 14px;
  }

  .menu-item {
    padding: 16px 20px;
  }

  .menu-icon {
    width: 38px;
    height: 38px;
    border-radius: 10px;

    svg {
      width: 22px;
      height: 22px;
    }
  }

  .menu-text {
    font-size: 15px;
  }

  .menu-right {
    font-size: 12px;
  }

  .menu-arrow {
    font-size: 22px;
  }

  .logout-btn {
    border-radius: 14px;
    padding: 18px;
    font-size: 15px;
  }

  .argument {
    padding: 12px;

    &_split,
    &_link {
      font-size: 12px;
    }
  }
}
</style>
