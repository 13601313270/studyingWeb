<template>
  <div class="content">
    <!-- <div class="title">每日5段</div> -->
    <div ref="allDaysList" class="allDaysList">
      <div class="list">
        <div v-for="(item, index) in list" class="item" :class="{ active: activeListen && activeListen.id === item.id }">
          <div class="info">
            <div>{{ item.title }}</div>
            <div style="display: flex;flex-direction: row;align-items: center;">
              <div>难度：{{ item.difficult }}</div>
              <span v-if="item.isReaded" class="listFinish">已完成</span>
            </div>
          </div>
          <div :class="activeListen && activeListen.id === item.id ? 'stop' : 'play'"
            @click="activeListen && activeListen.id === item.id ? stop() : play(item, index)">
            <Icon :src="activeListen && activeListen.id === item.id ? 'stop' : 'play'" width="42" />
          </div>
        </div>
      </div>
    </div>
    <div v-if="activeListen" class="activeListen">
      <div class="activeBack" @click="stop()"></div>
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
          <div class="button" @click="activeIsPlay ? parse() : play(activeListen)">
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

<script>
import sqlClass from '@/plugin/sql'
import { mapGetters } from 'vuex'
import request from '../plugin/request'
import Button from '../components/Button'
import Icon from '../components/icon'
import { play, pause, stop } from '../plugin/audio'
import storage from '../plugin/localStorage.ts'

function getTimeStr(sleep = 0) {
  let time = new Date()
  time.setTime(time.getTime() + 86400000 * (sleep))
  let year = time.getYear() + 1900
  let month = time.getMonth() + 1
  if (month < 10) {
    month = '0' + month
  }
  let day = time.getDate()
  if (day < 10) {
    day = '0' + day
  }
  return year + '-' + month + '-' + day
}

export default {
  name: 'word',
  data() {
    return {
      page: 1,
      list: [],
      activeListenIndex: -1,
      activeListen: null,
      activeListenIsRecord: false,
      activeIsPlay: false,
    }
  },
  async created() {
    this.$logAction('listen');
    this.init();
  },
  methods: {
    async play(item, index) {
      this.activeListenIndex = index;
      this.activeListen = item;
      this.activeListenIsRecord = await this.getIsRecord(this.activeListen.id);

      this.activeIsPlay = true;
      play(item.file.originUrl)
    },
    async getIsRecord(id) {
      const listenRecord = new sqlClass('enListenRecord')
      const isReaded = await listenRecord.select('select * from enListenRecord where id=' + id)
      console.log(isReaded);
      if (isReaded.length > 0) {
        return true;
      } else {
        return false;
      }
    },
    parse() {
      this.activeIsPlay = false;
      pause()
    },
    stop() {
      this.activeListen = null;
      this.activeIsPlay = false;
      pause()
    },
    replay() {
      stop()
      this.activeIsPlay = true;
      play(this.activeListen.file.originUrl)
    },
    next() {
      const nextIndex = this.activeListenIndex === this.list.length - 1 ? 0 : this.activeListenIndex + 1
      this.stop();
      const next = this.list[nextIndex]
      this.play(next, nextIndex);
    },
    async init() {
      this.list = await request.get('/en/listen/enListenSourceList?page=' + this.page)
      this.initListRecord();
      this.$nextTick(() => {
        this.domLoad()
      })
    },
    async initListRecord() {
      for (let i = 0; i < this.list.length; i++) {
        const isReaded = await this.getIsRecord(this.list[i].id)
        this.list[i].isReaded = isReaded;
      }
    },
    domLoad() {
      var container = this.$refs.allDaysList
      console.log('container', container)
      if (container) {
        container.scrollLeft = container.scrollWidth;
      }
    },
    async finish() {
      console.log(this.activeListen.id)
      let listenRecord = new sqlClass('enListenRecord')
      await listenRecord.insert({
        id: this.activeListen.id,
        date: getTimeStr(),
      })
      this.activeListenIsRecord = await this.getIsRecord(this.activeListen.id);
      this.initListRecord()
      // let option = new sqlClass('option')
      // let config = await option.select('select * from option where name="perDay"')
      // let perDay = parseInt(config[0].val)
    },
    async notFinish() {
      console.log(this.activeListen.id)
      const listenRecord = new sqlClass('enListenRecord')
      const isReaded = await listenRecord.select('delete from enListenRecord where id=' + this.activeListen.id)
      this.activeListenIsRecord = await this.getIsRecord(this.activeListen.id);
      this.initListRecord()
    },
  },
  computed: {
    ...mapGetters('main', ['UserInterfaceStyle']),
  },
  components: { Button, Icon },
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
  }

  .list {
    width: 750px;
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
