<template>
  <div class="switch" :class="[value?'switchOpen':'']" @click="change">
    <div class="switchInner" :class="[value?'switchInnerOpen':'']"></div>
  </div>
</template>

<script>
export default {
  name: "switch",
  props: {
    value: Boolean
  },
  methods: {
    change() {
      this.$emit('input', !this.value);
    }
  }
}
</script>

<style scoped lang="less">
.switch {
  width: 64px;
  height: 32px;
  border-radius: 16px;
  background-color: #b1adad;

  &Open {
    background-color: rgb(19, 206, 102);
  }
}

.switchInner {
  width: 28px;
  height: 28px;
  margin-top: 2px;

  margin-left: 2px;
  background-color: white;
  border-radius: 14px;

  &Open {
    margin-left: 33px;
  }
}
</style>
