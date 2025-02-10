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
  width: 128px;
  height: 64px;
  border-radius: 32px;
  background-color: #b1adad;

  &Open {
    background-color: rgb(19, 206, 102);
  }
}

.switchInner {
  width: 56px;
  height: 56px;
  margin-top: 4px;

  margin-left: 4px;
  background-color: white;
  border-radius: 28px;

  &Open {
    margin-left: 68px;
  }
}
</style>
