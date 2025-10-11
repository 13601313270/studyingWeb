<template>
  <div>
    <div class="vipTitle">成为VIP所有功能不限量</div>
    <div class="chooseUseTypeTools">
      <div @click="callBuyVip('studyingMonthVIP')" class="buyVip">
        <div>月度会员</div>
        <div class="price">¥<span class="priceNum">15</span></div>
      </div>
      <div @click="callSubscribe()" class="buyVip">
        <div>连续包月</div>
        <div class="price">¥<span class="priceNum">12</span></div>
      </div>
      <div @click="callBuyVip('studyingYearVIP')" class="buyVip">
        <div>年度会员</div>
        <div class="price">¥<span class="priceNum">88</span></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { buyVip, subscribe } from '@/plugin/buyVip';
import request from '@/plugin/request';

const router = useRouter();
const store = useStore<any>()
const emits = defineEmits(['buy', 'toInvite'])

function callBuyVip(product: 'studyingMonthVIP' | 'studyingYearVIP') {
  buyVip(product).then(() => {
    request.get('/user/getInfo')
      .then(res => {
        store.dispatch('main/setUserInfo', res)
        emits('buy')
      })
  })
}
function callSubscribe() {
  subscribe('studyingVIPMonth').then(() => {
    request.get('/user/getInfo')
      .then(res => {
        store.dispatch('main/setUserInfo', res)
        emits('buy')
      })
  })
}
</script>
<style lang="less" scoped>
.vipTitle {
  font-size: 38px;
  margin-bottom: 16px;
  color: rgb(64, 64, 64);
  text-align: center;
}

.chooseUseTypeTools {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  >div:not(:first-child) {
    margin-left: 16px;
  }

  .buyVip {
    /* background: #00795c; */
    border: none;
    height: 170px;
    border-radius: 10px;
    padding-left: 20px;
    padding-right: 20px;
    border-style: solid;
    border-width: 2px;
    border-color: #ccd6d2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    font-size: 32px;
    color: rgb(24, 24, 24);
    text-align: center;
    width: 50%;
    flex-grow: 1;

    .price {
      font-size: 26px;
      color: #f08503;
      color: #4a4a4a;

      .priceNum {
        font-weight: bold;
        font-size: 48px;
        margin-left: 8px;
        margin-right: 24px;
      }
    }
  }
}
</style>