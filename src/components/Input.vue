<template>
  <div>
    <input :placeholder="placeholder" class="inputBase" v-model="valueInner" />
  </div>
</template>
<script>
export default {
  name: 'Input',
  props: {
    placeholder: {
      type: String
    },
    modelValue: String,
  },
  data() {
    console.log(this.modelValue)
    return {
      valueInner: this.modelValue
    }
  },
  watch: {
    value(val) {
      console.log(111, val)
      this.valueInner = val;
    },
    valueInner(val) {
      console.log('输入变化', val)
      this.$emit('update:modelValue', val)
    }
  }
}
</script>

<style scoped>
.InputContent {}

.inputBase {
  min-width: 100px;
  width: 100%;
  height: 88px;
  border-radius: 10px;
  text-align: left;
  color: #5d5d5d;
  padding-left: 10px;
  font-size: 32px;
  border: solid 1px #5d5d5d;
  box-sizing: border-box;
}
</style>