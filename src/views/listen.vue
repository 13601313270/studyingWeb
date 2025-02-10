<template>
  <div class="header_others">
    <div class="logButton" @click="showTimeDialog = true">
      <Icon src="log" width="48" height="48" />
      <span>连读{{ dayContinuous }}天</span>
    </div>
  </div>
  <div class="content">
    <div class="cate">
      <div v-for="item in cateList">
        <div class="cateItem" @click="init(item.id)" :class="{ active: item.id === cateActive }">{{ item.name }}
        </div>
      </div>
    </div>
    <div ref="allDaysList" class="allDaysList">
      <div>
        <Button v-if="cateActive" class="changeButton" text="换一组" @click="init(cateActive)"></Button>
      </div>
      <Dialog :show="showTimeDialog" title="听力时常记录" @close="showTimeDialog = false">
        <Calendar :chooseList="chooseList" />
        <div class="splitLine"></div>
        <div class="setHourTitle">设置每日提醒时间</div>
        <div class="setHourContent">
          <Switch :value="listenHourIsOpen" @input="SwitchListennotification" />
          <Button class="hourText" v-if="listenHourIsOpen" @click="daySelectShow = true" :text="listenHour === null ? '未设置' :
            HourToStr(listenHour)"></Button>
          <Select :show="daySelectShow" title="选择提醒时间" @close="daySelectShow = false" :list="dayHourList"
            @select="Listennotification">
          </Select>
        </div>
      </Dialog>
      <div class="list" @scroll="scroll" ref="scrollDom">
        <div v-for="(item, index) in list" class="item"
          :class="{ active: activeListen && activeListen.id === item.id }">
          <div class="info">
            <div>{{ item.title }}</div>
            <div style="display: flex;flex-direction: row;align-items: center;">
              <div v-if="item.difficult">难度：{{ item.difficult }}</div>
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
          <div v-if="activeListen.content">题目：</div>
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
import { useStore } from 'vuex'
import request from '../plugin/request'
import Button from '../components/Button.vue'
import Icon from '../components/icon.vue'
import { notification, removeNotification } from "../plugin/notification"
import { play, pause, stop } from '../plugin/audio'
import { onMounted, ref, nextTick, onUnmounted, computed } from 'vue'
import Loading from '@/plugin/loading'
import Calendar from '../components/Calendar/index.vue'
import Dialog from '@/components/Dialog.vue'
import Switch from '@/components/switch.vue'
import Select from '@/components/Select.vue'

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

type SoundItem = {
  id: number,
  title: string;
  difficult?: number;
  isReaded: boolean;
  file: {
    content: Array<{
      importArticle: string;
      voice: string;
    }>;
    originUrl: string;
  },
  content?: string;
}

const store = useStore();
const page = ref<number>(1)
const loading = ref<boolean>(false)
const hasEnd = ref<boolean>(false)
const list = ref<Array<SoundItem>>([])
const activeListenIndex = ref<number>(-1)
const activeListen = ref<SoundItem | null>(null)
const activeListenIsRecord = ref<boolean>(false)
const activeIsPlay = ref<boolean>(false)
const allDaysList = ref();
const scrollDom = ref();
const cateActive = ref<cateType>();
const useTime = ref<number>(0)
const chooseList = ref<Array<{
  date: string,
  timeSecond: number,
}>>([])
const showTimeDialog = ref<boolean>(false)
const daySelectShow = ref<boolean>(false)
type HourInfoItem = {
  key: number,
  title: string
}
function HourToStr(hour: number) {
  return hour > 12 ? "下午" + (hour - 12).toString() : "上午" + hour.toString()
}
const dayHourList = ref<Array<HourInfoItem>>(Array(24).fill(null).map((v, i) => {
  return {
    key: i,
    title: HourToStr(i)
  }
}))

type cateType = 'qa' | 'word' | 'difficult' | 'book' | 'speech'

const cateList = ref<Array<{
  id: cateType,
  name: string,
}>>([
  {
    id: 'qa',
    name: '考试对话',
  },
  {
    id: 'word',
    name: '听单词',
  },
  // {
  //   id: 'difficult',
  //   name: '疑难句',
  // },
  // {
  //   id: 'book',
  //   name: '有声读物',
  // },
  // {
  //   id: 'speech',
  //   name: '真人演讲',
  // },
])
const listenHourIsOpen = ref<boolean>(!!localStorage.getItem('listenHour'))
const listenHour = ref<number | null>((() => {
  const hour = localStorage.getItem('listenHour');
  return hour === null ? hour : parseInt(hour)
})())

let date: Date = new Date();
let interval: number = 0;
onMounted(async () => {
  // this.$logAction('listen');
  store.dispatch('main/setPath', [{ name: '听力通' }])
  init('qa');
  interval = setInterval(() => {
    console.log(1)
    if (activeIsPlay.value) {
      useTime.value++;
    }
  }, 1000)
  let handle = new sqlClass('enListenTimeRecord')
  const result: any[] = await handle.select('select * from enListenTimeRecord') as any[]
  // console.log('==========')
  // console.log(result.map(v => v));
  chooseList.value = result;
})
onUnmounted(async () => {
  stopVue();
  if (interval) {
    clearInterval(interval)
  }
  if (useTime.value) {
    let handle = new sqlClass('enListenTimeRecord')
    const result: any[] = await handle.select('select * from enListenTimeRecord where `date`="' + getTimeStr() + '"') as any[]
    if (result.length) {
      handle.run('update enListenTimeRecord set timeSecond=timeSecond+' + useTime.value + ' where `date`="' + getTimeStr() + '"', false)
    } else {
      handle.insert({
        date: getTimeStr(),
        timeSecond: useTime.value,
      })
    }
  }
})

async function playItem(item: SoundItem, index: number) {
  activeListenIndex.value = index;
  activeListen.value = item;
  activeListenIsRecord.value = await getIsRecord(activeListen.value.id);

  activeIsPlay.value = true;
  console.log('play-')
  date = new Date()
  play(item.file.originUrl)
}
async function getIsRecord(id: number) {
  const listenRecord = new sqlClass('enListenRecordNew')
  // console.log('isReaded---0---' + id);
  const isReaded: any = await listenRecord.select('select * from enListenRecordNew where id=' + id + ' and cate="' + cateActive.value + '"')
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
  if (activeListen.value) {
    play(activeListen.value.file.originUrl)
  }
}
function next() {
  const nextIndex = activeListenIndex.value === list.value.length - 1 ? 0 : activeListenIndex.value + 1
  stopVue();
  const next = list.value[nextIndex]
  playItem(next, nextIndex);
}
function SwitchListennotification(val: boolean) {
  listenHourIsOpen.value = val;
  if (val === false) {
    localStorage.removeItem('listenHour')
    // alert('关闭')
    listenHour.value = null;
    removeNotification()
  }
}
function Listennotification(type: HourInfoItem) {
  listenHour.value = type.key;
  daySelectShow.value = false;
  localStorage.setItem('listenHour', type.key.toString())
  notification('听力通知', '坚持每天听力，能够快速提升听力水平', type.key, 0, 0).then(() => {
    alert('添加提醒成功')
  }).catch(() => {
    alert('添加提醒失败，请检查权限设置')
  })
}
async function getListPage() {
  let result: SoundItem[] = [];
  if (cateActive.value === 'word') {
    const resultWord: any[] = await request.get('/en/listen/word?page=' + page.value + '&pageSize=10')
    console.log(result)
    result = resultWord.map(item => {
      return {
        id: item.id,
        title: item.word,
        // difficult: item.count / 100,
        isReaded: false,
        file: {
          content: [{
            importArticle: item.word,
            voice: '单词',
          }, {
            importArticle: item.exampleSentence,
            voice: '例句',
          }],
          originUrl: item.exampleSentenceUrl,
        },
        // content: item.exampleSentence,
      };
    })
  } else {
    result = await request.get('/en/listen/enListenSource?page=' + page.value + '&pageSize=10')
  }
  return result;
}
async function init(cateId: cateType) {
  const handle = Loading()
  hasEnd.value = false;
  page.value = 1;
  cateActive.value = cateId
  if (loading.value) {
    return;
  }
  loading.value = true;
  let result: SoundItem[] = await getListPage()
  scrollDom.value.scrollTop = 0;
  list.value = result;
  if (list.value.length === 0) {
    hasEnd.value = true;
  }
  initListRecord();
  handle.destory();
  loading.value = false;
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
  let listenRecord = new sqlClass('enListenRecordNew')
  if (activeListen.value === null) {
    return
  }

  console.log(getTimeStr())
  await listenRecord.insert({
    id: activeListen.value.id,
    cate: cateActive.value,
    date: getTimeStr(),
  })
  activeListenIsRecord.value = await getIsRecord(activeListen.value.id);
  initListRecord()
  // let option = new sqlClass('option')
  // let config: any = await option.select('select * from option where name="perDay"')
  // let perDay = parseInt(config[0].val)
}
async function notFinish() {
  if (activeListen.value === null) {
    return;
  }
  console.log(activeListen.value.id)
  const listenRecord = new sqlClass('enListenRecordNew')
  const isReaded = await listenRecord.select('delete from enListenRecordNew where id=' + activeListen.value.id)
  activeListenIsRecord.value = await getIsRecord(activeListen.value.id);
  initListRecord()
}
async function scroll() {
  if (hasEnd.value || loading.value) {
    return;
  }
  return;// 改成了按钮点击，而不是滚动加载
  console.log(1)
  const scrollDom2 = scrollDom.value;
  scrollDom2.scrollTop
  scrollDom2.clientHeight
  if (scrollDom2.scrollHeight - scrollDom2.scrollTop - scrollDom2.clientHeight < 100) {
    loading.value = true;
    page.value++;
    const listRes: SoundItem[] = await getListPage()
    loading.value = false;
    if (listRes.length === 0) {
      hasEnd.value = true;
      return;
    }
    list.value = [...list.value, ...listRes];
    initListRecord()
    setTimeout(() => {
      loading.value = false;
    }, 1000)
  }
  // console.log(scrollDom2.scrollHeight - scrollDom2.scrollTop - scrollDom2.clientHeight)
}
const dayContinuous = computed(() => {
  const allDate = chooseList.value.map(v => v.date);
  let dayCount = 0;
  for (let i = 1; i < 10; i++) {
    const dayStrItem = getTimeStr(i * -1);
    if (allDate.includes(dayStrItem)) {
      dayCount++
    } else {
      break;
    }
  }
  // 算上今天
  if (allDate.includes(getTimeStr())) {
    dayCount++
  }
  return dayCount;
})
</script>

<style scoped lang="less">
.header_others {
  margin-right: 8px;
  height: 88px;
  top: env(safe-area-inset-top);
  display: flex;
  align-items: center;
  position: fixed;
  right: 0;

  .logButton {
    height: 56px;
    border: solid 1px white;
    border-radius: 8px;
    display: flex;
    align-items: center;
    color: white;
    padding: 4px 8px;
  }
}

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
    flex-direction: column;
    flex-grow: 1;

    // overflow-x: auto;
    // scroll-snap-type: x mandatory;
    /* 隐藏水平滚动条 */
    &::-webkit-scrollbar {
      height: 0;
    }

    .changeButton {
      margin: 16px;
    }

    .list {
      width: 100%;
      flex: 1;
      overflow-y: auto;
      padding: 12px;
      box-sizing: border-box;
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

.splitLine {
  width: 100%;
  height: 1px;
  background-color: #c8c8c8;
}

.setHourTitle {
  font-size: 32px;
  margin-top: 16px;
  margin-bottom: 16px;
  text-align: center;
}

.setHourContent {
  display: flex;
  align-items: center;
  justify-content: center;

  .hourText {
    margin-left: 16px;
  }
}
</style>
