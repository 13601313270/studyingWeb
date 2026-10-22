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
          <td class="title">课程每日限量</td>
          <td class="warning" v-if="limit">{{ limit.lesson ? (limit.lesson + '次') : '不支持' }}</td>
          <td class="good">不限</td>
        </tr>
        <tr>
          <td class="title">试题AI解析</td>
          <td class="warning" v-if="limit">{{ limit.aiQa ? (limit.aiQa + '次') : '不支持' }}</td>
          <td class="good">支持</td>
        </tr>
        <tr>
          <td class="title">资料下载</td>
          <td class="warning" v-if="limit">{{ limit.fileDown ? (limit.fileDown + '次') : '不支持' }}</td>
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
} | null>(null)

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
  border-radius: 20px;
  border: solid 1PX #eeeeee;
  overflow: hidden;

  table {
    width: 100%;
    border-collapse: collapse;
    overflow: hidden;
    background: var(--white);

    th {
      background-color: #f7f2e8;
      color: #68736d;
      font-size: 22px;
      padding: 10px;
    }

    tr {
      height: 60px;
      border-bottom: 1PX solid #f0ece2;

      &:last-child {
        border-bottom: none;
      }
    }

    td {
      text-align: center;
      font-size: 24px;
      height: 60px;
      padding: 10px;

      &.title {
        font-weight: bold;
      }

      &.warning {
        color: rgb(99, 99, 99);
        font-size: 22px;
        font-weight: bold;
      }

      &.good {
        color: #f09903;
        font-size: 22px;
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