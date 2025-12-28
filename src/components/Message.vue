<template>
  <div class="MessageBase">
    <icon v-if="icon" :src="icon" width="36" height="36" class="button_img" />
    <text class="button_text">
      <slot></slot>
    </text>
  </div>
</template>

<script>
export default {
  name: "Message",
  props: {
    text: String,
    icon: String,
    primary: Boolean,
    disabled: Boolean,
  }
}
</script>

<style scoped lang="less">
.MessageBase {
  min-height: 88px;
  border-radius: 10px;
  padding-left: 20px;
  padding-right: 20px;
  border-style: solid;
  border-width: 2px;
  background-color: white;
  border-color: #ccd6d2;
  display: flex;
  background-color: white;
  flex-direction: row;
  align-items: center;
}
</style>
