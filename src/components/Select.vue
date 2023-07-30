<template>
  <Popup
    :title="title"
    :show="show"
    :zIndex="zIndex"
    @close="$emit('close')"
  >
    <div :key="item.key" class="item" v-for="item in list" @click="$emit('select',item)">
      {{item.title}}
    </div>
  </Popup>
</template>
<script>
import Popup from '@/components/Popup.vue'
export default {
  props: {
    title: String,
    show: Boolean,
    zIndex: Number,
    list: Array,
  },
  components: {Popup}
}
</script>
<style scoped lang="less">
.item {
  width: 700px;
  margin-left: 25px;
  height: 88px;
  line-height: 88px;
  text-align: center;
  font-size: 28px;
  border-bottom: solid 1px rgba(236, 236, 236);
  &:last-child {
    border-bottom: none;
  }
}
</style>