<template>
  <Page title="阅读" foot-active="source">
    <div class="enRead">
      <div>
        <Button class="changeButton" text="换一组" @click="initPage(1)"></Button>
      </div>
      <div class="list" ref="refDom">
        <div v-for="item in list" class="item" @click="toDetail(item.id)">
          <div class="title">
            {{ item.title }}
          </div>
        </div>
      </div>
    </div>
  </Page>
</template>
<script setup lang="ts">
import { onActivated, onMounted, ref } from 'vue';
import request from '../plugin/request'
import Page from '@/components/Page.vue';
import Button from '../components/Button.vue'
import Loading from '@/plugin/loading';
import { useRouter } from 'vue-router';

type Item = {
  id: number;
  title: string;
  content: string;
}
const router = useRouter()
const list = ref<Item[]>([])
const refDom = ref()
const toDetailPage = ref<boolean>(false)
const scrollTop = ref<number>(0)

onMounted(() => {

})
onActivated(() => {
  if (toDetailPage.value) {
    refDom.value.scrollTop = scrollTop.value
  } else {
    initPage(1)
  }
  toDetailPage.value = false;
})
function initPage(page: number) {
  const handle = Loading()
  request.get('/en/readPage/' + page).then(res => {
    handle.destory()
    refDom.value.scrollTop = 0
    list.value = (res as any).map((v: Item) => {
      if (v.title) {
        return v;
      } else {
        const sentences = v.content.split(/(?<=[.!?．])\s+/);
        return {
          ...v,
          title: sentences[0],
        }
      }
    });
  })
}
function toDetail(id: number) {
  toDetailPage.value = true;
  router.push({ path: '/enReadDetail/' + id })
  scrollTop.value = refDom.value.scrollTop;
}
</script>
<style lang="less" scoped>
.enRead {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.changeButton {
  margin: 13px;
}

.list {
  padding: 16px;
  overflow: auto;
  box-sizing: border-box;
  padding-bottom: 48px;

  .item {
    border-bottom: solid 1px #aaa;
    padding: 16px 8px;
    font-size: 32px;
    min-height: 88px;

    .title {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      /* 限制显示的行数 */
      overflow: hidden;
      text-overflow: ellipsis;
    }


    &:last-child {
      border-bottom: none;
    }
  }
}
</style>