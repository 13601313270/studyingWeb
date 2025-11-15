<template>
  <div class="MaskLoading">
    <img class="loadingImg" src="../icons/loading.png" />
    <text class="button_text">
      <div class="message">{{ text }}</div>
      <slot></slot>
    </text>
  </div>
</template>

<script lang="ts" setup>
type Props = {
  text: string;
  icon?: string;
  primary?: boolean;
  disabled?: boolean;
}
const props = defineProps<Props>()
</script>

<style scoped lang="less">
.MaskLoading {
  height: 100vh;
  width: 100vw;
  background-color: #41404085;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(1px);

  @keyframes rotateIcon {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  .loadingImg {
    width: 66px;
    height: 66px;
    animation: rotateIcon 2s linear infinite;
  }

  .button_text {
    margin-top: 32px;
    color: white;
    font-size: 32px;
  }
}
</style>
