<template>
  <div class="videoContent" v-if="list.length > 0">
    <!-- {{ allDuration }}+++{{ playIndex }} +++ {{ nowDuration }} -->
    <div class="background" ref="scrollDom" @touchstart="touchstart" @touchend="touchend">
      <div class="banshu" v-if="textIndex > -1">
        <div v-for="(item, key) in list.slice(0, textIndex + 1)" class="item" :class="{ active: (textIndex === key) }">
          <!-- {{ item.duration }} -->
          <text class="h1" v-if="item.deep === 1">{{
            (item.index + 1) + '、' + item.title }}</text>
          <text class="h2" v-else-if="item.deep === 2">{{ (item.index + 1) +
            '.'
            + item.title }}</text>
          <text class="h3" v-else-if="item.deep === 3">{{ (item.index + 1) +
            '.'
            + item.title }}</text>
          <text class="h4" v-else-if="item.deep === 4">{{ (item.index + 1) +
            '.'
            + item.title }}</text>
          <text class="h5" v-else>{{
            (item.index + 1) + '.' + item.title }}</text>
          <text class="desc" v-if="item.desc">{{ item.desc }}</text>
        </div>
      </div>
      <div class="temp_say">
        <img v-for="(item, imgIndex) in loadImg" :key="imgIndex" :src="item.replace(/^http:/,'https:')" style="width: 80%" />
      </div>
      <div class="fillHeight"></div>
    </div>
    <!--底部播放功能条-->
    <div class="tools" v-if="isPlayed">
      <div class="progress" v-if="allHasDuration && allDuration > 1">
        <div class="progressBar">
          <div class="left" :style="{ width: (nowDuration / allDuration * 100) + '%' }"></div>
          <div class="slip" :style="{ left: (nowDuration / allDuration * 100) + '%' }"></div>
        </div>
        <div class="allDuration">
          {{ allDurationFormat }}
        </div>
      </div>

      <div class="toolsInner">
        <div class="button_group">
          <div @click="prev()" class="tools_button">
            <icon src="back" width="40" height="40" />
          </div>
          <div @click="isPlaying ? pauseVideo() : playVideo()" class="tools_button">
            <icon v-if="!isPlaying" src="play" width="40" height="40" />
            <icon v-else src="stop" width="40" height="40" />
          </div>
          <div @click="next()" class="tools_button tools_button_last">
            <icon src="right" width="40" height="40" />
          </div>
        </div>
      </div>
    </div>
    <!--初始中央大播放按钮-->
    <div v-else-if="!isPlaying" class="play_button_content">
      <div @click="firstPlay" class="play_button">
        <icon src="play" width="100" height="100" />
      </div>
    </div>
    <div v-if="playIndex === list.length && list.length !== 0" class="play_button_content">
      <div class="float">
        <Button @click="replay" style="margin-right: 10px;" text="重 新 听" />
        <Button @click="button.action" v-for="button in actions" :key="button.text" :text="button.text" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import Button from '../components/Button.vue'
import icon from '../components/icon.vue';
import { play, pause } from '../plugin/audio'

type Props = {
  content: any,
  actions: any[],
}
const props = defineProps<Props>()

type Leaf = {
  before: any[],
  title: string,
  desc?: string,// 编辑器没有了
  after: Array<{
    type: 'say',
    value: string,
    duration: number,
  } | {
    type: 'img',
    value: string,
  } | {
    type: 'imgClear',
    value: number,
  }>,

  child: Leaf[],
}
const list = ref<Array<Leaf & {
  index: number,
  deep: number,
  duration: number,// 内部所有after说话时间汇总
}>>([])
const scrollDom = ref();
const loadImg = ref<Array<any>>([])
const playIndex = ref<number>(0)
const textIndex = ref<number>(-1)
const isPlaying = ref<boolean>(false)
const isPlayed = ref<boolean>(false)
const allHasDuration = ref<boolean>(false)
const allDuration = ref<number>(0)
const allDurationFormat = ref<string>('')
let scrolling = false;

const emit = defineEmits(["end", 'playStep', 'firstPlay'])
let interval;
onMounted(() => {
  // 判断是否都有音频计算了时间
  let hasDuration = true;

  function update(dataArr: Leaf[], deep: number) {
    dataArr.forEach((data, index) => {
      let item: any = { deep, index };
      let duration = 0;
      if (data.before) {
        item.before = data.before;
      }
      if (data.title) {
        item.title = data.title;
      }
      if (data.desc) {
        item.desc = data.desc;
      }
      if (data.after) {
        item.after = data.after;
        data.after.forEach(v => {
          if (v.type === 'say') {
            if (!v.duration) {
              hasDuration = false;
            } else {
              duration += v.duration;
            }
          }
        })
      }
      item.duration = duration;
      list.value.push(item);
      if (data.child) {
        update(data.child, deep + 1)
      }
    });
  }
  update(props.content, 1);
  allHasDuration.value = hasDuration;
  allDuration.value = Math.round(list.value.map(v => v.duration).reduce((a, b) => a + b))
  // 将时长格式化为分钟和秒
  const minutes = Math.floor(allDuration.value / 60);
  const seconds = Math.floor(allDuration.value % 60);
  const formattedDuration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  allDurationFormat.value = formattedDuration
  textIndex.value = -1;
  loadImg.value = [];
})

function touchstart() {
  console.log(1)
  scrolling = true
}
function touchend() {
  console.log(2)
  scrolling = false
  setTimeout(() => {
    scrollToActive()
  }, 1000)
}
function scrollToActive() {
  if (scrolling === false && isPlaying.value) {
    console.log('scrollToActive', scrollDom.value)
    scrollDom.value.scrollTop = 1000000;
  }
}

async function playStepOfIndex() {
  if (playIndex.value >= list.value.length) {
    emit('end')
    return
  } else {
    emit('playStep', playIndex.value)
  }
  scrollToActive()
  textIndex.value = playIndex.value - 1;
  // 重置当前 playIndex 之前的图片状态
  if (playIndex.value > 0) {
    loadImg.value = [];
    for (let i = 0; i < playIndex.value; i++) {
      // console.log(list.value,i)
      if (list.value[i].before !== undefined) {
        for (let j = 0; j < list.value[i].before.length; j++) {
          let item = list.value[i].before[j];
          if (item.type === 'img') {
            loadImg.value.push(item.value);
          } else if (item.type === 'imgClear') {
            loadImg.value.splice(loadImg.value.length - item.value);
          }
        }
      }
      if (list.value[i].after !== undefined) {
        for (let j = 0; j < list.value[i].after.length; j++) {
          let item = list.value[i].after[j];
          if (item.type === 'img') {
            loadImg.value.push(item.value);
          } else if (item.type === 'imgClear') {
            loadImg.value.splice(loadImg.value.length - item.value);
          }
        }
      }
    }
  }
  if (list.value[playIndex.value] && list.value[playIndex.value].before !== undefined) {
    for (let i = 0; i < list.value[playIndex.value].before.length; i++) {
      let item = list.value[playIndex.value].before[i];
      if (item.type === 'say') {
        try {
          await play(item.value);
        } catch (e) {
          debugger
          return;
        }
      } else if (item.type === 'img') {
        loadImg.value.push(item.value);
      } else if (item.type === 'imgClear') {
        loadImg.value.splice(loadImg.value.length - item.value);
      }
    }
  }
  textIndex.value = playIndex.value;
  if (list.value[playIndex.value] && list.value[playIndex.value].after !== undefined) {
    if (list.value[playIndex.value].after) {
      for (let i = 0; i < list.value[playIndex.value].after.length; i++) {
        let item = list.value[playIndex.value].after[i];
        if (item.type === 'say') {
          try {
            await play(item.value);
          } catch (e) {
            debugger
            return;
          }
        } else if (item.type === 'img') {
          loadImg.value.push(item.value);
        } else if (item.type === 'imgClear') {
          loadImg.value.splice(loadImg.value.length - item.value);
        }
      }
    }
  }
  console.log('==========index==========')
  playIndex.value++;
  playStepOfIndex();
}
function playVideo() {
  isPlaying.value = true;
  isPlayed.value = true;
  playStepOfIndex()
}
async function firstPlay() {
  emit('firstPlay')
  playVideo()
}
function prev() {
  pause();
  playIndex.value--;
  playVideo();
}
function next() {
  pause();
  playIndex.value++;
  playVideo();
}
function replay() {
  playIndex.value = 0;
  playVideo();
}
function pauseVideo() {
  pause();
  isPlaying.value = false;
}
const nowDuration = computed(() => {
  if (playIndex.value === 0) {
    return 0;
  }
  return Math.round(list.value.slice(0, playIndex.value).map(v => v.duration).reduce((a, b) => a + b))
})
</script>

<style scoped lang="less">
.videoContent {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  background-color: #39723a;
  position: relative;
  height: 100%;
}

.float {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f2fcfa;
  border-radius: 8px;

  box-shadow: 0 0 20px 0 #b1b1b1;
  width: 500px;
  padding: 20px;
  text-align: center;

  &_text {
    width: 460px;
    margin-top: 50px;
    color: #10261e;
  }
}

.background {
  color: white;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  scroll-behavior: smooth;

  .banshu {
    min-width: 200px;
    padding: 10px;

    .item {
      display: flex;

      span {
        margin-left: 20px;
      }

      .h1 {
        font-size: 34px;
        margin-bottom: 10px;
        padding-left: 20px;
        color: white;
      }

      .h2 {
        font-size: 30px;
        margin-bottom: 10px;
        color: white;
        padding-left: 40px;
      }

      .h3 {
        font-size: 26px;
        margin-bottom: 10px;
        color: white;
        padding-left: 60px;
      }

      .h4 {
        font-size: 24px;
        margin-bottom: 10px;
        color: white;
        padding-left: 80px;
      }

      .h5 {
        font-size: 22px;
        margin-bottom: 10px;
        color: white;
        padding-left: 100px;
      }

      &.active {
        background-color: #64a466;
        padding: 4px 12px;
        border-radius: 4px;
        font-weight: bold;

        >* {
          margin-bottom: auto !important;
        }
      }

      .desc {
        font-size: 20px;
        margin-bottom: 10px;
        color: white;
        padding-left: 20px;
        float: left
      }
    }
  }

  .temp_say {
    padding: 10px;
    text-align: center;
  }

  .fillHeight {
    height: 30vh;
    flex-shrink: 0;
  }
}

.tools {
  background-color: #356a36;
  border-top: solid 1px #29572a;
  padding-top: 10px;
  padding-bottom: calc(env(safe-area-inset-bottom) + 10px) !important;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-grow: 0;
  flex-shrink: 0;
  position: relative;

  .progress {
    width: 100%;
    box-sizing: border-box;
    padding-left: 4%;
    padding-right: 4%;
    display: flex;
    align-items: center;
    margin-top: 12px;
    margin-bottom: 24px;
    position: relative;

    .progressBar {
      flex-grow: 1;
      height: 6px;
      background-color: #b7b7b7;
      border-radius: 3px;
      position: relative;

      .left {
        position: absolute;
        height: 6px;
        background-color: #043505;
      }

      .slip {
        position: absolute;
        width: 16px;
        height: 16px;
        border-radius: 8px;
        background-color: #043505;
        // background-color: #04350547;
        transform: translate(-5px, -5px);
      }
    }

    .allDuration {
      flex-shrink: 0;
      position: absolute;
      right: 4%;
      bottom: -40px;
      color: #b7b7b7;
    }
  }

  .toolsInner {
    display: flex;
    flex-direction: row;
    justify-content: center;

    .button_group {
      display: flex;
      width: 390px;
      height: 80px;
      border-radius: 20px;
      flex-direction: row;
      justify-content: center;
      background-color: #b66320;
    }
  }

  &_button {
    width: 130px;
    height: 80px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 50px;
    cursor: pointer;
    font-size: 20px;
    color: white;
    border-right-color: #904e19;
    border-right-style: solid;
    border-right-width: 4px;
  }

  &_button_last {
    border-right-style: none;
    border-right-width: 0;
  }
}

.play_button_content {
  position: absolute;
  z-index: 999;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.play_button {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding-left: 16px;
  width: 150px;
  height: 150px;
  background-color: #a2b89f;
  border-style: solid;
  border-color: #cee2cb;
  border-width: 2px;
  box-shadow: 0 0 100px -5px rgba(236, 220, 204, 0.55);
  border-radius: 80px;
  text-align: center;
  line-height: 150px;
  cursor: pointer;
  font-size: 100px;
  color: black;
}

.play_button_img {
  margin-top: 23px;
  margin-left: 30px;
}
</style>
