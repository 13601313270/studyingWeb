<template>
  <div class="friendList">
    <!-- 邀请横幅 -->
    <div class="inviteBanner" @click="inviteDialogShow = true">
      <div class="bannerIcon">
        🎁
      </div>
      <div class="bannerContent">
        <div class="bannerTitle">一起学习，更有动力</div>
        <div class="bannerDesc">邀请好友，双方可获赠 2 个月 VIP</div>
      </div>
      <div class="bannerArrow">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M9 6l6 6-6 6" stroke="#b8963a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
    </div>

    <!-- 学习伙伴标题 -->
    <div class="sectionHeader">
      <div class="sectionTitle">学习伙伴</div>
      <div class="sectionRight">
        <div class="sectionCount">{{ frindList.length }} 位好友</div>
        <div class="refreshBtn" :class="{ spinning: refreshing }" @click="onRefresh" title="刷新">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M21 12a9 9 0 1 1-3-6.7L21 8" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M21 3v5h-5" stroke="#666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- 好友列表卡片 -->
    <div class="friendsCard">
      <div v-for="(item, index) in frindList" :key="item.id" class="friendItem"
        :class="{ 'friendItem--divider': index < frindList.length - 1 }">
        <div class="avatar" :style="{ backgroundColor: nameColor(item.name || item.account) }">
          <span class="avatarText">{{ getInitials(item.name || item.account) }}</span>
          <span class="avatarDot" v-if="index % 2 === 0"></span>
        </div>
        <div class="info">
          <div class="name">{{ item.name || item.account }}</div>
          <div class="meta">
            {{ item.city || '未知' }}<template v-if="item.sex !== undefined && item.sex !== 2">
              · {{ item.sex === 1 ? '女生' : '男生' }}
            </template>
          </div>
        </div>
        <div class="action" @click="toChat(item)">
          <span>发私信</span>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="frindList.length === 0" class="emptyState">
        暂无好友，快去邀请吧～
      </div>
    </div>
  </div>

  <!-- 受邀确认弹窗：从 beInviteList 中选一位真正邀请人 -->
  <Dialog :show="beInviteShow" title="邀请您安装App的用户" @close="beInviteShow = false">
    <div class="beInviteTitle" v-if="myInfo && !myInfo.beInviteFinish && myBeInviteList.length">
      这些人邀请您过您安装App，请选择一位真正邀请人，双方各获得<span style="font-weight: bold;color: red">2个月</span>VIP。
    </div>
    <div class="beInviteList">
      <div v-for="item in myBeInviteList" class="beInviteItem">
        <div class="beInviteItem-icon">
          <img :src="item.user1.icon + '?x-oss-process=image/resize,m_fill,h_200,w_200'" />
        </div>
        <div class="beInviteItem-info">
          <div class="name">{{ item.user1.name || item.user1.account }}</div>
          <div class="content">{{ item.content }}</div>
          <div class="inviteTime">{{ item.inviteTime }}</div>
        </div>
        <div class="beInviteItem-action">
          <Button warning @click="beUseInvite(item.id)" text="确认受邀"></Button>
        </div>
      </div>
    </div>
  </Dialog>

  <!-- 邀请弹窗 -->
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

// 头像背景色池
const AVATAR_COLORS = [
  '#A8D8B9', // 薄荷绿
  '#B4C7E7', // 淡蓝
  '#F4C2C2', // 淡粉
  '#D4C5E9', // 淡紫
  '#FFD6A5', // 淡橙
  '#CFE8A9', // 黄绿
  '#F8E8A0', // 淡黄
  '#C9D9F9', // 天蓝
]

// 根据名字哈希选背景色
function nameColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

// 提取头像显示文字：英文名取首字母缩写，中文名/数字取前2字符
function getInitials(name: string): string {
  if (!name) return '?';
  const trimmed = name.trim();
  // 纯数字（大概率是手机号），用通用占位
  if (/^\d+$/.test(trimmed)) return '好友';
  // 英文名：取前两个字母的大写
  if (/^[a-zA-Z]/.test(trimmed)) {
    const parts = trimmed.split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return trimmed.slice(0, 2).toUpperCase();
  }
  // 中文名：取前两个字
  return trimmed.slice(0, 2);
}

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
const refreshing = ref<boolean>(false)

function onRefresh() {
  if (refreshing.value) return
  refreshing.value = true
  initList().finally(() => {
    refreshing.value = false
  })
}

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
.friendList {
  flex: 1;
  padding: 32px;
  padding-top: max(env(safe-area-inset-top), 32px);

  /* 邀请横幅 */
  .inviteBanner {
    background: linear-gradient(135deg, #fdf3d7 0%, #fce9b8 100%);
    border-radius: 20px;
    padding: 28px 24px;
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-bottom: 40px;
    box-sizing: border-box;

    .bannerIcon {
      width: 80px;
      height: 80px;
      border-radius: 16px;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 44px;
      margin-right: 24px;
      flex-shrink: 0;
    }

    .bannerContent {
      flex: 1;
      min-width: 0;

      .bannerTitle {
        font-size: 32px;
        font-weight: 600;
        color: #4a3a1a;
        margin-bottom: 8px;
      }

      .bannerDesc {
        font-size: 24px;
        color: #8b7a50;
      }
    }

    .bannerArrow {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  /* 学习伙伴标题 */
  .sectionHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;

    .sectionTitle {
      font-size: 36px;
      font-weight: 700;
      color: #1a1a1a;
    }

    .sectionRight {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .sectionCount {
      font-size: 26px;
      color: #999;
    }

    .refreshBtn {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background-color 0.2s;

      &:active {
        background-color: #f0f0f0;
      }

      &.spinning svg {
        animation: spin 0.8s linear infinite;
      }
    }
  }

  /* 好友卡片容器 */
  .friendsCard {
    background-color: white;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  }

  /* 好友项 */
  .friendItem {
    display: flex;
    align-items: center;
    padding: 28px 28px;
    gap: 24px;

    /* 分隔线 */
    &--divider::after {
      content: '';
      position: absolute;
      left: 152px;
      right: 28px;
      bottom: 0;
      height: 1px;
      background-color: #f0f0f0;
    }

    position: relative;

    .avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      position: relative;

      .avatarText {
        font-size: 32px;
        font-weight: 600;
        color: #333;
        letter-spacing: 1px;
      }

      .avatarDot {
        position: absolute;
        bottom: 2px;
        right: 2px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: #3BA55D;
        border: 3px solid white;
      }
    }

    .info {
      flex: 1;
      min-width: 0;

      .name {
        font-size: 30px;
        font-weight: 600;
        color: #1a1a1a;
        margin-bottom: 6px;
      }

      .meta {
        font-size: 24px;
        color: #999;
      }
    }

    .action {
      flex-shrink: 0;
      padding: 12px 28px;
      background-color: #E8F5E9;
      border-radius: 20px;
      cursor: pointer;
      transition: background-color 0.2s;
      display: flex;
      align-items: center;
      height: 52px;

      &:active {
        background-color: #C8E6C9;
      }

      span {
        font-size: 24px;
        color: #2E7D32;
        font-weight: 500;
      }
    }
  }

  /* 空状态 */
  .emptyState {
    padding: 80px 0;
    text-align: center;
    font-size: 28px;
    color: #999;
  }
}

/* Dialog 内受邀用户列表样式 */
.beInviteTitle {
  width: 100%;
  margin-bottom: 32px;
  font-size: 32px;
  color: #333;
}

.beInviteList {
  .beInviteItem {
    background-color: #f9f9f9;
    display: flex;
    margin-bottom: 24px;
    border-radius: 16px;
    padding: 24px;
    align-items: center;

    &:last-child {
      margin-bottom: 0;
    }

    .beInviteItem-icon {
      width: 120px;
      height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      border-radius: 60px;
      border: solid 1px #eee;
      flex-shrink: 0;

      >img {
        width: 120px;
      }
    }

    .beInviteItem-info {
      margin-left: 24px;
      flex-grow: 1;

      .name {
        font-size: 30px;
        font-weight: 600;
        color: #1a1a1a;
      }

      .content {
        color: #666;
        font-size: 24px;
        margin-top: 6px;
      }

      .inviteTime {
        color: #999;
        font-size: 22px;
        margin-top: 4px;
      }
    }

    .beInviteItem-action {
      flex-shrink: 0;
    }
  }
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

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
