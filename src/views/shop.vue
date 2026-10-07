<template>
  <Page title="商店" root foot-active="shop" hide-header>
    <div class="bookList">
      <div v-for="item in allMiniBookList" class="item" @click="toDetail(item.id)">
        <div class="imgPanel"><img :src="item.img" @click.stop="showImgUrl = item.img" /></div>
        <div class="info">
          <div class="title">{{ item.title }}
            <div class="tip">缩印版</div>
            <!-- <div class="pageCount">{{ item.pageCount }}页</div> -->
          </div>
          <div class="desc">缩印版，给书包减重，可单手持握</div>
        </div>
      </div>
    </div>
    <ImgPreview v-if="showImgUrl" :url="showImgUrl.replace('http://', 'https://')" @cancel="showImgUrl = ''" />
  </Page>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import calcNumber from 'calc-number'
import request from '@/plugin/request'
import Page from '@/components/Page.vue';
import Button from '@/components/Button.vue';
import Dialog from '@/components/Dialog.vue';
import toast from '@/plugin/toast';
import Check from '@/components/Check.vue';
import bridge from '@/plugin/bridge'
import Loading from '@/plugin/loading'
import ImgPreview from '@/components/imgPreview.vue';

const router = useRouter();

type bookItem = {
  id: number;
  file: string;
  img: string;
  pageCount: number;
  title: string;
}
interface Address {
  id: number
  name: string
  phone: string
  province: number
  provinceInfo: {
    name: string,
  }
  city: number
  cityInfo: {
    name: string,
  }
  district: number
  districtInfo: {
    name: string,
  }
  detail: string
  isDefault: boolean
}
const allMiniBookList = ref<bookItem[]>([])
const showImgUrl = ref<string>('')
onMounted(() => {
  request.get('/file/allMiniBook').then((res: any) => {
    allMiniBookList.value = res;
  })
})
function toDetail(id: number) {
  router.push('/shopGood/' + id)
}
</script>
<style lang="less" scoped>
.bookList {
  padding: 16px;

  .item {
    border: solid 1PX #6c6c6c;
    border-radius: 8px;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 16px;

    .imgPanel {
      width: 220px;
      height: 220px;
      background-color: #c1c1c1;
      flex-shrink: 0;

      >img {
        width: 220px;
        height: 220px;
        object-fit: contain;
        object-position: center;
      }
    }

    .info {
      margin-left: 8px;

      .title {
        font-size: 32px;
      }

      .tip {
        font-size: 28px;
        line-height: 28px;
        padding: 2px 8px;
        display: inline;
        background-color: #790000;
        color: #fff;
        border-radius: 8px;
        margin-right: 8px;
      }

      .pageCount {
        font-size: 28px;
        line-height: 28px;
        padding: 2px 8px;
        display: inline;
        border: solid 1px #00795c;
        color: #00795c;
        border-radius: 8px;
      }

      .desc {
        font-size: 30px;
        line-height: 30px;
        padding: 2px 8px;
        display: inline;
        color: #b66c26;
      }
    }
  }
}
</style>