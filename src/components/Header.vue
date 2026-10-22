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
</template>

<script setup lang="ts">
import { getCurrentInstance } from 'vue';

const emit = defineEmits<{
  (e: 'back'): void;
}>();

const instance = getCurrentInstance();

defineProps<{
  title: string,
  root?: boolean,
  hideHeader?: boolean,
}>();

function clickBack() {
  const hasBackHandler = !!(instance?.vnode.props && 'onBack' in instance.vnode.props);
  if (hasBackHandler) {
    emit('back');
  } else {
    window.onClickBack();
  }
}
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

@media (min-width: 1025px) {
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
}
</style>
