<template>
  <div class="Check" :class="{button_disabled:disabled,primary}" @click="check">
    <icon v-if="value" src="check" width="32" height="32"/>
    <text class="button_text">{{text}}</text>
  </div>
</template>

<script>
  export default {
    name: "Check",
    props: {
      value: Boolean,
      text: String,
      disabled: Boolean,
    },
    methods: {
      check() {
        this.$emit('check', !this.value)
      }
    }
  }
</script>

<style scoped lang="less">
.Check {
  width: 46px;
  height: 46px;
  border-radius: 8px;
  box-sizing: border-box;
  border: solid 5px #00795c;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
