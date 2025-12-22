<template>
  <Page title="商店" root>
    <div class="bookList">
      <div v-for="item in allMiniBookList" class="item">
        <div class="imgPanel"><img :src="item.img" /></div>
        <div class="info">
          <div class="title">{{ item.title }}<div class="pageCount">{{ item.pageCount }}页</div>
          </div>
          <div class="desc">缩印版，给书包减重，查阅更方便</div>
          <div>
            <Button @click="printFile([item])">云打印</Button>
          </div>
        </div>
      </div>
    </div>
    <Dialog :show="showPrintAllDialog" title="提示" @close="showPrintAllDialog = false">
      <div class="printDialog">
        <div class="title">
          是否确认打印？
        </div>
        <div class="list">
          <div v-for="file in waitPrintFileList" :key="file.id" class="listItem">
            <div style="flex-grow: 1;">{{ file.title }}</div>
          </div>
        </div>
        <div class="addressTitle">请选择打印地址：</div>
        <div class="addressList">
          <div v-for="address in addressList" :key="address.id" class="addressItem"
            :class="{ active: chooseAddress === address.id }" @click="chooseAddress = address.id">
            <Check class="check" :value="chooseAddress === address.id" />
            <div>
              <div class="name">{{ address.name }} {{ address.phone }}</div>
              <div>{{ address.provinceInfo.name }} {{ address.cityInfo.name }} {{ address.districtInfo.name }} {{
                address.detail }}</div>
            </div>
          </div>
        </div>
        <div class="pageCount">
          <div>
            共<span class="num">{{waitPrintFileList.reduce((total, file) => total + file.pageCount, 0)}}</span>页纸张
          </div>
          <div class="priceDesc">
            打印费<span class="num">{{ printPrice }}</span>元，邮寄费<span class="num">{{ postPrice }}</span>元，共计<span
              class="num">{{ allPriceAll
              }}</span>元
          </div>
        </div>
        <div class="tools">
          <Button class="print" @click="printSent" :text="'确认打印，邮寄到家(' + allPriceAll + '元)'"></Button>
        </div>
      </div>
    </Dialog>
  </Page>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import request from '@/plugin/request'
import Page from '@/components/Page.vue';
import Button from '@/components/Button.vue';
import calcNumber from 'calc-number'
import Dialog from '@/components/Dialog.vue';
import toast from '@/plugin/toast';
import Check from '@/components/Check.vue';
import bridge from '@/plugin/bridge'
import Loading from '@/plugin/loading'

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
onMounted(() => {
  request.get('/file/allMiniBook').then((res: any) => {
    allMiniBookList.value = res;
  })
})
const addressList = ref<Address[]>([])
const paperSize = ref<number>(2)
const chooseAddress = ref<number>()
const waitPrintFileList = ref<bookItem[]>([])

const showPrintAllDialog = ref<boolean>(false)

const printFile = (files: bookItem[]) => {
  request.get('/studying/address/myAddress').then(res => {
    addressList.value = res as any;
  })
  waitPrintFileList.value = files;
  getFilePrice();
  showPrintAllDialog.value = true;
}
const printPrice = ref<number>(0)
const allPriceAll = ref<number>(0)
const postPrice = ref<number>(0)
function getFilePrice() {
  request.post('/studying/print/getFilePrice', {
    paperSize: paperSize.value,
    files: waitPrintFileList.value.map(v => v.id),
    address: chooseAddress.value,
  }).then((res: any) => {
    allPriceAll.value = calcNumber(`${res.totalPrice} / 100`);
    printPrice.value = calcNumber(`${res.printPrice} / 100`);
    postPrice.value = calcNumber(`${res.postPrice} / 100`);
  })
}
const printSent = async () => {
  if (!chooseAddress.value) {
    toast({
      'message': '请选择地址',
      'duration': 3000
    })
    return;
  }
  const { token, printOrderID } = await request.post('/studying/print/aliToken', {
    paperSize: paperSize.value,
    files: waitPrintFileList.value.map(v => v.id),
    address: chooseAddress.value,
  }) as any;
  console.log('!!!!', token, printOrderID);
  const handle = Loading();
  bridge('pay', 'alipay', { token }).then((res) => {
    console.log('支付结果', res)
    handle.destory()
    if (res.result === true) {
      toast({
        'message': '支付完成',
        'duration': 3000
      })
      request.post('/studying/print/file', {
        orderId: printOrderID,
        files: waitPrintFileList.value.map(v => v.id),
        address: chooseAddress.value,
      }).catch(err => {
        toast({
          'message': '打印失败:' + err.message,
          'duration': 3000
        })
      })
    } else {
      toast({
        'message': '未支付成功',
        'duration': 3000
      })
    }
  }).catch((err) => {
    handle.destory()
    toast({
      'message': err.message || '支付失败',
      'duration': 3000
    })
  })
}
</script>
<style lang="less" scoped>
.bookList {
  padding: 16px;

  .item {
    border: solid 1px #333;
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
        font-size: 28px;
        line-height: 28px;
        padding: 2px 8px;
        display: inline;
      }
    }
  }
}

.printDialog {
  .title {
    font-size: 36px;
    line-height: 72px;

    .num {
      font-weight: bold;
      color: #bb1a1a;
    }
  }

  .list {
    font-size: 32px;
    line-height: 52px;
    padding: 8px;
    max-height: 400px;
    overflow: auto;
    border: solid 3px #d5d5d5;
    border-radius: 8px;

    .listItem {
      padding: 8px;
      text-align: left;
      border: solid 1px #d5d5d5;
      background-color: #f0f0f0;
      border-radius: 4px;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;

      .pageCountItem {
        border: solid 2px #d5d5d5;
        flex-shrink: 0;
        padding: 0 4px;
        margin-right: 4px;
      }

      .close {
        width: 44px;
        height: 44px;
        margin-left: 16px;
        flex-shrink: 0;

        >img {
          width: 32px;
          height: 32px;
        }
      }
    }

    :last-child {
      margin-bottom: 0;
    }
  }

  .pageCount {
    margin-top: 20px;
    font-size: 32px;

    .priceDesc {
      font-size: 32px;
      color: #333;
    }

    .num {
      font-weight: bold;
      color: #bb1a1a;
    }
  }

  .addressTitle {
    font-size: 36px;
    line-height: 72px;
    margin-top: 16px;
  }

  .addressList {
    font-size: 32px;
    line-height: 52px;
    padding: 8px;
    max-height: 400px;
    overflow: auto;
    border: solid 3px #d5d5d5;
    border-radius: 8px;

    .addressItem {
      display: flex;
      flex-direction: row;
      padding: 12px;
      text-align: left;
      border: solid 2px #d5d5d5;
      background-color: #f0f0f0;
      border-radius: 4px;
      margin-bottom: 8px;

      .check {
        margin-right: 16px;
        flex-shrink: 0;
      }

      &.active {
        border: solid 2px #00795c;
        box-shadow: 0 0 4px #00795c;
        font-weight: bold;
        color: #00795c;
      }

      .name {
        font-size: 32px;
        line-height: 46px;
      }
    }

    :last-child {
      margin-bottom: 0;
    }
  }

  .tools {
    margin-top: 32px;

    .print {
      margin-top: 8px;
    }
  }
}
</style>