<template>
  <div class="content">
    <div class="cate">
      <div class="cateItem active">考试对话</div>
      <div class="cateItem">单词</div>
      <div class="cateItem">语法</div>
    </div>
    <!-- <div class="title">每日5段</div> -->
    <div ref="allDaysList" class="allDaysList">
      <div class="list" @scroll="scroll" ref="scrollDom">
        <div v-for="(item, index) in list" class="item"
          :class="{ active: activeListen && activeListen.id === item.id }">
          <div class="info">
            <div>{{ item.title }}</div>
            <div style="display: flex;flex-direction: row;align-items: center;">
              <div>难度：{{ item.difficult }}</div>
              <span v-if="item.isReaded" class="listFinish">已完成</span>
            </div>
          </div>
          <div :class="activeListen && activeListen.id === item.id ? 'stop' : 'play'"
            @click="activeListen && activeListen.id === item.id ? stopVue() : playItem(item, index)">
            <Icon :src="activeListen && activeListen.id === item.id ? 'stop' : 'play'" width="42" />
          </div>
        </div>
      </div>
    </div>
    <div v-if="activeListen" class="activeListen">
      <div class="activeBack" @click="stopVue()"></div>
      <div class="inner">
        <div class="activeListenContent">
          <div>听力正文</div>
          <div v-for="item in activeListen.file.content">
            <span class="user">{{ item.voice.charAt(0).toUpperCase() + item.voice.slice(1) }}</span>: {{
              item.importArticle
            }}
          </div>
          <div>题目：</div>
          <div v-html="activeListen.content"></div>
        </div>
        <div class="tools">
          <div class="button" :class="{ finish: activeListenIsRecord }"
            @click="activeListenIsRecord ? notFinish() : finish()">
            {{ activeListenIsRecord ? '已完成' : '完成' }}
          </div>
          <div class="button" @click="replay">
            <Icon src="recycle_white"></Icon>
          </div>
          <div class="button" @click="activeIsPlay ? parse() : playItem(activeListen, activeListenIndex)">
            <Icon :src="activeIsPlay ? 'stop' : 'play'" />
          </div>
          <div class="button" @click="next">
            <Icon src="next_white" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import sqlClass from '@/plugin/sql'
import { mapActions, mapGetters, useStore } from 'vuex'
import request from '../plugin/request'
import Button from '../components/Button.vue'
import Icon from '../components/icon.vue'
import { play, pause, stop } from '../plugin/audio'
import { onMounted, ref, nextTick } from 'vue'

function getTimeStr(sleep = 0) {
  let time = new Date()
  time.setTime(time.getTime() + 86400000 * (sleep))
  let year = time.getFullYear()
  let month: number | string = time.getMonth() + 1
  if (month < 10) {
    month = '0' + month
  }
  let day: number | string = time.getDate()
  if (day < 10) {
    day = '0' + day
  }
  return year + '-' + month + '-' + day
}

const store = useStore();
const page = ref<number>(1)
const loading = ref<boolean>(false)
const hasEnd = ref<boolean>(false)
const list = ref<Array<any>>([])
const activeListenIndex = ref<number>(-1)
const activeListen = ref<any>(null)
const activeListenIsRecord = ref<boolean>(false)
const activeIsPlay = ref<boolean>(false)
const allDaysList = ref();
const scrollDom = ref();

onMounted(() => {
  // this.$logAction('listen');
  store.dispatch('main/setPath', [{ name: '听力通' }])
  init();
})

async function playItem(item: any, index: number) {
  activeListenIndex.value = index;
  activeListen.value = item;
  activeListenIsRecord.value = await getIsRecord(activeListen.value.id);

  activeIsPlay.value = true;
  play(item.file.originUrl)
}
async function getIsRecord(id: number) {
  const listenRecord = new sqlClass('enListenRecord')
  // console.log('isReaded---0');
  const isReaded: any = await listenRecord.select('select * from enListenRecord where id=' + id)
  // console.log('isReaded---1', isReaded);
  if (isReaded.length > 0) {
    return true;
  } else {
    return false;
  }
}
function parse() {
  activeIsPlay.value = false;
  pause()
}
function stopVue() {
  activeListen.value = null;
  activeIsPlay.value = false;
  pause()
}
function replay() {
  stop()
  activeIsPlay.value = true;
  play(activeListen.value.file.originUrl)
}
function next() {
  const nextIndex = activeListenIndex.value === list.value.length - 1 ? 0 : activeListenIndex.value + 1
  stopVue();
  const next = list.value[nextIndex]
  playItem(next, nextIndex);
}
async function init() {
  if (hasEnd.value || loading.value) {
    return;
  }
  loading.value = true;
  list.value = await request.get('/en/listen/enListenSourceList?page=' + page.value)
  if (list.value.length === 0) {
    hasEnd.value = true;
  }
  initListRecord();
  loading.value = false;
  setTimeout(() => {

  })
  nextTick(() => {
    domLoad()
  })
}
async function initListRecord() {
  for (let i = 0; i < list.value.length; i++) {
    const isReaded = await getIsRecord(list.value[i].id)
    list.value[i].isReaded = isReaded;
  }
}
function domLoad() {
  var container = allDaysList.value
  console.log('container', container)
  if (container) {
    container.scrollLeft = container.scrollWidth;
  }
}
async function finish() {
  console.log(activeListen.value.id)
  let listenRecord = new sqlClass('enListenRecord')
  console.log(getTimeStr())
  // await listenRecord.insert({
  //   id: activeListen.value.id,
  //   date: getTimeStr(),
  // })
  // activeListenIsRecord.value = await getIsRecord(activeListen.value.id);
  // initListRecord()




  // let option = new sqlClass('option')
  // let config = await option.select('select * from option where name="perDay"')
  // let perDay = parseInt(config[0].val)
}
async function notFinish() {
  console.log(activeListen.value.id)
  const listenRecord = new sqlClass('enListenRecord')
  const isReaded = await listenRecord.select('delete from enListenRecord where id=' + activeListen.value.id)
  activeListenIsRecord.value = await getIsRecord(activeListen.value.id);
  initListRecord()
}
async function scroll() {
  if (hasEnd.value || loading.value) {
    return;
  }
  const scrollDom2 = scrollDom.value;
  scrollDom2.scrollTop
  scrollDom2.clientHeight
  if (scrollDom2.scrollHeight - scrollDom2.scrollTop - scrollDom2.clientHeight < 100) {
    loading.value = true;
    page.value++;
    const listRes: any[] = await request.get('/en/listen/enListenSourceList?page=' + page.value)
    if (listRes.length === 0) {
      hasEnd.value = true;
      return;
    }
    list.value = [...list.value, ...listRes];
    setTimeout(() => {
      loading.value = false;
    }, 1000)
  }
  // console.log(scrollDom2.scrollHeight - scrollDom2.scrollTop - scrollDom2.clientHeight)
}
</script>

<style scoped lang="less">
.content {
  height: 100%;
  width: 750px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow-y: hidden;
  flex-direction: row;

  .cate {
    width: 200px;
    flex-shrink: 0;
    background-color: #cbcbcb;

    .cateItem {
      height: 88px;
      line-height: 88px;
      text-align: center;

      &.active {
        background-color: white;
      }
    }
  }

  .title {
    margin: 32px;
    padding: 16px 30px;
    font-size: 36px;
    text-align: center;
  }

  .allDaysList {
    display: flex;
    overflow-y: auto;
    flex-direction: row;
    // overflow-x: auto;
    // scroll-snap-type: x mandatory;

    /* 隐藏水平滚动条 */
    &::-webkit-scrollbar {
      height: 0;
    }

    .list {
      width: 100%;
      flex-shrink: 0;
      // margin: 25px;
      padding: 12px;
      box-sizing: border-box;
      overflow-y: auto;
      // border: solid 1px black;
      border-radius: 8px;
      // scroll-snap-align: center;

      &:first-child {
        // margin-left: 100px;
      }

      &:last-child {
        // margin-right: 100px;
      }
    }
  }

  .play {
    background-color: #00795c;
    width: 88px;
    height: 88px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 44px;
    flex-shrink: 0;

    >img {
      margin-left: 12px; // 三角重心在左侧，所以向右移动一点点
    }
  }

  .stop {
    background-color: #00795c;
    width: 88px;
    height: 88px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 44px;
    flex-shrink: 0;
  }

  .item {
    border: solid 1px transparent;
    padding: 16px;
    display: flex;
    flex-direction: row;
    align-items: center;

    &:not(:last-child) {
      border-bottom: solid 1px #dfdfdf;
    }

    .info {
      flex-grow: 1;
    }

    .play {
      flex-shrink: 0;
      margin-left: 8px;
    }
  }

  .active {
    background-color: #00795c66;
  }
}

.activeListen {
  height: 100%;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  box-sizing: border-box;
  background-color: rgba(0, 0, 0, 0.5);
  font-size: 32px;
  color: white;
  display: flex;
  flex-direction: column;
  z-index: 9;

  .activeBack {
    flex-grow: 1;
    background-color: transparent;
  }

  .inner {
    height: 60%;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    box-sizing: border-box;
    background-color: #00795c;
    border-radius: 32px 32px 0 0;
    font-size: 32px;
    color: white;
    display: flex;
    flex-direction: column;

    .activeListenContent {
      padding: 32px;
      overflow-y: auto;
      flex-grow: 1;
    }

    .tools {
      width: 100%;
      height: 188px;
      background-color: #6ea99b;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      border-radius: 24px 24px 0 0;
      justify-content: space-around;
      padding-bottom: calc(env(safe-area-inset-bottom) / 2);

      .button {
        width: 160px;
        height: 120px;
        background-color: #00795c;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 32px;

        &.finish {
          background-color: #FFD700;
          color: #00795c;
        }

        >img {
          width: 66px;
          height: 66px;
        }
      }
    }
  }

  .user {
    font-weight: bold;
  }
}

.listFinish {
  display: inline;
  background-color: #FFD700;
  color: #00795c;
  padding: 8px;
  border-radius: 4px;
  margin-left: 32px;
}
</style>
