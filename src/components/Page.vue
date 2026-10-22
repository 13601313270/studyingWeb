<template>
  <Header :title="props.title" :root="props.root" :hide-header="props.hideHeader">
    <template #before><slot name="before" /></template>
    <template #others><slot name="others" /></template>
  </Header>
  <div v-if="isOffline" class="offline" :class="{}">网络连接断开</div>
  <div class="pageContent">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { onActivated, onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { FootActiveEnum } from '@/store';
import Header from './Header.vue';

const store = useStore();

const props = defineProps<{
  title: string,
  root?: boolean,
  footActive: FootActiveEnum,
  hideHeader?: boolean,
}>();
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
watch(() => props.title, (newTitle) => {
  console.log(newTitle)
  store.dispatch('main/setPath', [{ name: newTitle }]);
})
onActivated(() => {
  if (props.footActive) {
    store.dispatch('main/setFootActive', props.footActive);
  }
})
</script>
<style lang="less" scoped>
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