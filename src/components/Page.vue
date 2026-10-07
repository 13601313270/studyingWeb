<template>
  <div class="header" v-if="hideHeader !== true">
    <div class="header_web_name">
      <div class="head_root" v-if="root">
        <img class="icon" src="../icons/icons.png" />
        <slot name="before"></slot>
      </div>
      <div v-else class="header_web_name_back" @click="clickBack">
        <div class="circle">
          <img class="header_web_name_back_img" src="../icons/circleBack.svg" />
        </div>
      </div>
    </div>
    <div class="header_links">
      <template v-if="root">
        <div class="header_links_web_name">松鼠学</div>
      </template>
      <template v-else>
        <div class="header_links_web_name">{{ title }}</div>
      </template>
    </div>
    <div class="header_others">
      <slot name="others"></slot>
    </div>
  </div>
  <div v-if="isOffline" class="offline" :class="{}">网络连接断开</div>
  <div class="pageContent">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { computed, onActivated, onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { FootActiveEnum } from '@/store';

const store = useStore();

const props = defineProps<{
  title: string,
  root?: boolean,
  footActive: FootActiveEnum,
  hideHeader?: boolean,
}>();
const title = ref<string>(props.title || '');
const isOffline = ref<boolean>(false);

onMounted(() => {
  console.log(props.title)
  store.dispatch('main/setPath', [{ name: props.title }]);
  if (props.footActive) {
    store.dispatch('main/setFootActive', props.footActive);
  }
  window.addEventListener("offline", () => {
    isOffline.value = true;
  })
  window.addEventListener("online", () => {
    isOffline.value = false;
  })
})
function clickBack() {
  window.onClickBack()
}
watch(() => props.title, (newTitle) => {
  console.log(newTitle)
  title.value = newTitle || '';
  store.dispatch('main/setPath', [{ name: newTitle }]);
})
onActivated(() => {
  if (props.footActive) {
    store.dispatch('main/setFootActive', props.footActive);
  }
})
</script>
<style lang="less" scoped>
.header {
  line-height: 88px;
  // background-color: #00795c;
  color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  flex-shrink: 0;
  flex-grow: 0;
  height: 120px;
  position: relative;
  border-bottom: solid 1PX rgba(233, 238, 235, 0.8);
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
      min-width: 120px;
      height: 120px;
      opacity: 0.8;
      display: flex;
      align-items: center;
      justify-content: center;
      transform: rotate(180deg);

      .circle {
        width: 76px;
        height: 76px;
        border: 1PX solid rgb(233, 238, 235);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: white;

        &_img {
          width: 48px;
          height: 48px;
        }
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
      color: rgb(23, 33, 28);
      display: block;
      font-family: PingFangSC-Medium;
      width: 590px;
      flex-grow: 1;
      line-height: 119px;
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
  font-size: 32px;
  line-height: 100px;
  color: white;
  width: 100%;
  z-index: 10000;

  &.showLogin {
    position: fixed;
    top: 0;
  }
}

.pageContent {
  flex: 1 1 0%;
  overflow-y: scroll;
  position: relative;
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
</style>