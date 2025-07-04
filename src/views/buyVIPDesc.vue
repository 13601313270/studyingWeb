<template>
  <div class="popBuyVipSuccess">
    <table>
      <tbody>
        <tr>
          <th>功能</th>
          <th style="width: 25%">免费用户</th>
          <th style="width: 35%">VIP</th>
        </tr>
        <tr>
          <td>课程每日限量</td>
          <td class="warning">{{ limit.lesson || '不支持' }}次</td>
          <td class="good">不限</td>
        </tr>
        <tr>
          <td>试题AI解析</td>
          <td class="warning">{{ limit.aiQa || '不支持' }}</td>
          <td class="good">支持</td>
        </tr>
        <tr>
          <td>资料下载</td>
          <td class="warning">{{ limit.fileDown || '不支持' }}次</td>
          <td class="good">不限</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import request from '../plugin/request'
const limit = ref<{
  aiQa: number,
  fileDown: number,
  lesson: number
}>({
  aiQa: 0,
  fileDown: 0,
  lesson: 0
})

onMounted(() => {
  request.get('user/vipLimitNum').then(res => {
    limit.value = res as any;
  })
})
</script>
<style lang="less" scoped>
.popBuyVipSuccess {
  margin-bottom: 20px;
  overflow: auto;
  border-radius: 10px;
  border: solid 1px #eeeeee;
  overflow: hidden;

  table {
    width: 100%;
    border-collapse: collapse;

    th {
      background-color: #00795c;
      color: white;
      font-size: 28px;
      padding: 10px;
    }

    td {
      text-align: center;
      font-size: 28px;
      padding: 10px;

      &.warning {
        color: red;
      }

      &.good {
        color: green;
        font-size: 32px;
        font-weight: bold;
      }
    }
  }
}

.price {
  font-weight: bold;
  // margin: 0 8px;
}
</style>