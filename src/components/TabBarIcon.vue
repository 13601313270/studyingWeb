<template>
  <svg
    class="tab-bar-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <!-- 学科：两本书 -->
    <template v-if="name === 'source'">
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5z" />
      <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5z" />
    </template>
    <!-- 资料：书本/文件夹 -->
    <template v-else-if="name === 'file'">
      <path d="M4 5h5v15H4z" />
      <path d="M15 4l4 1-2 15-4-1z" />
      <path d="M9 8h4v12H9z" />
    </template>
    <!-- 商店：购物袋 -->
    <template v-else-if="name === 'shop'">
      <path d="M5 8h14l-1 13H6z" />
      <path d="M9 9V6a3 3 0 0 1 6 0v3" />
    </template>
    <!-- 消息：对话气泡 -->
    <template v-else-if="name === 'friend'">
      <path d="M20 15a3 3 0 0 1-3 3H9l-5 3v-6a3 3 0 0 1-1-2V7a3 3 0 0 1 3-3h11a3 3 0 0 1 3 3z" />
      <path d="M8 10h.01M12 10h.01M16 10h.01" />
    </template>
    <!-- 我的：人头 -->
    <template v-else-if="name === 'mine'">
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
    </template>
  </svg>
</template>

<script lang="ts" setup>
defineProps({
  name: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.tab-bar-icon {
  width: 44px;
  height: 44px;
  display: block;
}
</style>
