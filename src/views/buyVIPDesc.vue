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
          <td class="warning">5次</td>
          <td class="good">不限</td>
        </tr>
        <tr>
          <td>试题AI解析每日</td>
          <td class="warning">10次</td>
          <td class="good">不限</td>
        </tr>
        <tr>
          <td>资料下载</td>
          <td class="warning">10次</td>
          <td class="good">不限</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
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
    </style>