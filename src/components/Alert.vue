<template>
  <teleport to="#teleport" v-if="isShow">
    <div class="alertContent">
      <div class="alertInner">
        <div class="alertBody">
          <div class="title">{{ title }}</div>
          <div class="content">{{ content }}</div>
        </div>
        <div class="footer">
          <div class="action" v-if="type === 'confirm'">取消</div>
          <div class="action" @click="ok">确定</div>
        </div>
      </div>
    </div>
  </teleport>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
const title = ref<string>('');
const content = ref<string>('');
const type = ref<'alert' | 'confirm'>('alert')
const isShow = ref<boolean>(false);
onMounted(() => {
  window.alert = function (newTitle: string) {
    title.value = newTitle
    isShow.value = true;
  }
})
function ok() {
  isShow.value = false;
}
</script>
<style scoped lang="less">
.alertContent {
  position: fixed;
  z-index: 9999;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;

  .alertInner {
    background: white;
    min-width: 500px;
    max-width: 600px;
    border-radius: 16px;
    border: solid 1px #e0e0e0;

    .alertBody {
      min-height: 88px;

      .title {
        font-size: 32px;
        line-height: 80px;
        padding: 0 16px;
        text-align: center;
      }

      .content {
        font-size: 26px;
        padding: 0 22px;
        margin-bottom: 24px;
      }
    }

    .footer {
      border-top: solid 1px #e0e0e0;
      display: flex;
      align-items: center;
      justify-content: center;

      .action {
        flex-grow: 1;
        text-align: center;
        line-height: 88px;

        &:not(:first-child) {
          border-left: solid 1px #e0e0e0;
        }
      }
    }
  }
}
</style>