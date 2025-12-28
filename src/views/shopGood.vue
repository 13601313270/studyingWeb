<template>
  <Page title="商品" foot-active="shop">
    <div class="goodPage" v-if="goodInfo">
      <!-- {{ goodInfo }} -->
      <div class="content">
        <div class="goodImg">
          <img :src="goodInfo.img + '?x-oss-process=image/resize,m_fill,w_600'" />
        </div>
        <div class="goodConent">
          <div class="title">{{ goodInfo.title }}</div>
          <div v-html="goodInfo.content"></div>
        </div>
      </div>
      <div class="bottomTool">
        <div class="pageCount">总页数<span class="number">{{ goodInfo.pageCount }}</span></div>
        <div class="price">价格<span class="number">{{ calcNumber(`${goodInfo.price} / 100`) }}</span></div>
        <div style="flex-grow: 1;"></div>
        <Button class="buyBtn" @click="printFile([goodInfo])">购买</Button>
      </div>
    </div>
    <Dialog :show="showPrintAllDialog" title="提示" @close="showPrintAllDialog = false">
      <div class="printDialog">
        <!-- <div class="title">
          是否确认打印？
        </div>
        <div class="list">
          <div v-for="file in waitPrintFileList" :key="file.id" class="listItem">
            <div style="flex-grow: 1;">{{ file.title }}</div>
          </div>
        </div> -->
        <div class="addressTitle">请选择收获地址：</div>
        <div class="addressList">
          <div v-if="addressList.length === 0">
            暂无地址
            <Button class="addBtn" @click="toAddAddress">添加地址</Button>
          </div>
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
          <div class="payWay">
            <img src="../icons/alipay.png" />
            支付方式：支付宝
          </div>
          <Button class="print" @click="printSent" :text="'确认打印，邮寄到家(' + allPriceAll + '元)'"></Button>
        </div>
      </div>
    </Dialog>

  </Page>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import request from '@/plugin/request';
import Page from '@/components/Page.vue';
import calcNumber from 'calc-number'
import Loading from '@/plugin/loading'
import Dialog from '@/components/Dialog.vue';
import toast from '@/plugin/toast';
import Button from '@/components/Button.vue';

const route = useRoute();
const router = useRouter()

type goodItem = {
  id: number,
  img: string,
  title: string,
  pageCount: number,
  content: string | null,
  // desc: string,
  price: number,
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

const goodInfo = ref<goodItem>();
const paperSize = ref<number>(2)
const addressList = ref<Address[]>([])
const waitPrintFileList = ref<goodItem[]>([])
const showPrintAllDialog = ref<boolean>(false)
const chooseAddress = ref<number>()
const printPrice = ref<number>(0)
const allPriceAll = ref<number>(0)
const postPrice = ref<number>(0)
import bridge from '@/plugin/bridge'

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
onMounted(() => {
  request.get('/file/bookItem/' + route.params.id + '?paperSize=' + paperSize.value).then((res: any) => {
    goodInfo.value = res;
  })
})
const printFile = (files: goodItem[]) => {
  request.get('/studying/address/myAddress').then(res => {
    addressList.value = res as any;
  })
  waitPrintFileList.value = files;
  getFilePrice();
  showPrintAllDialog.value = true;
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
      }).then((res: any) => {
        console.log('下单结果', res)
        if (res.code === 405) {
          toast({
            'message': res.data,
            'duration': 3000
          })
        } else {
          toast({
            'message': '下单成功',
            'duration': 3000
          })
          showPrintAllDialog.value = false;
        }

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
function toAddAddress() {
  router.push('/address')
}
</script>
<style lang="less" scoped>
.goodPage {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.content {
  flex: 1;
  overflow: auto;

  .goodImg {
    >img {
      width: 100%;
    }
  }

  .goodConent {
    padding: 24px;

    :deep(img) {
      max-width: 100%;
    }

    :deep(p) {
      font-size: 36px;
      line-height: 36px;
      margin-top: 12px;
      margin-bottom: 12px;
    }
  }
}

.bottomTool {
  flex-shrink: 0;
  border-top: solid 2px #959595;
  padding: 18px;
  display: flex;
  flex-direction: row;
  align-items: center;

  .number {
    font-weight: bold;
    margin-left: 4px;
    color: #ffa400;
  }

  .pageCount {
    font-size: 36px;
  }

  .price {
    margin-left: 16px;
    font-size: 36px;
  }

  .buyBtn {
    width: 300px;
    background-color: #ffa400;
    border: none;

    :deep(.button_text) {
      color: white;
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

    .payWay {
      font-size: 32px;
      line-height: 46px;
      display: flex;
      align-items: center;

      >img {
        width: 66px;
        margin-right: 12px;
      }
    }

    .print {
      margin-top: 8px;
    }
  }
}
</style>