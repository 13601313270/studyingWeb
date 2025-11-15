<template>
  <Page title="课程" root>
    <div class="source">
      <div class="subjects">
        <div class="subjects_scroll" ref="subjectScroll">
          <text ref="start" key="start"></text>
          <div class="subjectScroll">
            <div :key="subject.id" v-for="subject in sourceList" @click="changeSubject(subject.id)"
              class="subjects_item" :class="{ active: selectSub === subject.id }">
              <div :key="subject.id">{{ subject.name }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="list" :class="{ englishList: selectSub === 'english' }" v-if="selectSub === 'english'">
        <div class="source_list">
          <div @click="chooseWord" class="englishItem">
            <div class="title">
              超级背单词
              <div class="desc">艾宾浩斯遗忘曲线，制定科学背单词计划</div>
            </div>
            <img class="icon" src="../icons/word.png" />
          </div>
          <div @click="chooseListen" class="englishItem">
            <div class="title">
              听力通
              <div class="desc">1000+听力段落，让你磨足耳朵</div>
            </div>
            <Icon class="icon" src="listen" />
          </div>
          <div @click="toEnGrammar" class="englishItem">
            <div class="title">
              语法册
              <div class="desc">随身携带的语法书</div>
            </div>
            <img class="icon" src="../icons/yf.svg" />
          </div>
          <div @click="chooseWordSearch" class="englishItem">
            <div class="title">
              词典
              <div class="desc">便携词典</div>
            </div>
            <img class="icon" src="../icons/search.svg" />
          </div>
          <div @click="chooseRead" class="englishItem">
            <div class="title">
              阅读
              <div class="desc">提分神器</div>
            </div>
            <img class="icon" src="../icons/enRead.svg" />
          </div>
        </div>
      </div>
      <div class="list" v-else>
        <div class="source_list error" v-if="!loading && loadError">
          <div class="text">加载失败，请点击重试。</div>
          <Button v-if="loadError" @click="refresh" type="white" text="重新加载"></Button>
        </div>
        <div class="source_list" v-else-if="!loading">
          <div v-for="item in list" :key="item.id" class="source_item" @click="choose(item.id)">
            <img class="source_item_img" style="width:100%" v-if="item.img"
              :src="item.img.replace('http://', 'https://') + '?x-oss-process=image/resize,m_fill,h_420,w_650'" />
            <text class="source_item_title">{{ item.name }}</text>
          </div>
        </div>
        <div class="loading" v-else>
          <div>加载中...</div>
        </div>
      </div>
    </div>
  </Page>
</template>
<script>
import { mapGetters } from 'vuex';
import request from '../plugin/request'
import localStorage from '../plugin/localStorage'
import Switch from '../components/switch'
import Button from '../components/Button.vue'
import Icon from '../components/icon.vue'
import log from '@/plugin/log'
import Page from '../components/Page.vue'

export default {
  name: 'source',
  data() {
    return {
      subjects: [],
      userSetSourceList: [],
      showSourceSelect: false,
      selectSub: -1,
      list: [],
      loading: false,
      loadError: false,
    }
  },
  async created() {
    this.subjects = await request.get('/subjectV3?degree=' + this.degree);
    const selectSub = await localStorage.getItem('sourceChoose')
    if (selectSub === 'english') {
      this.selectSub = selectSub
    } else {
      this.selectSub = +selectSub || this.subjects[0].id;
      this.refresh()
    }
    // setTimeout(() => {
    //     const start = this.$refs['start'];
    //     if (start) {
    //         dom.scrollToElement(start, {
    //             offset: this.subjects.map(item => item.id).indexOf(this.selectSub) * 150
    //         })
    //     }
    // }, 100)
  },
  computed: {
    ...mapGetters('main', ['degree']),
    sourceList() {
      return [
        {
          id: 'english',
          name: "英语"
        },
        ...this.subjects
      ];
    }
  },
  methods: {
    changeSubject(id) {
      this.selectSub = id;
      localStorage.setItem('sourceChoose', id)
      if (id === 'english') {
        return
      }
      this.refresh();
    },
    async refresh() {
      this.loading = true;
      try {
        const res = await Promise.all([
          request.get('/subjectSourceV2/' + this.selectSub),
          new Promise(resolve => {
            setTimeout(() => {
              resolve()
            }, 300)// 因为接口太快的话，loading时间太短，loading状态闪现而过。所以方案是，即使接口很快，也等待0.3秒，用户体验更顺滑一些。
          })
        ]);
        this.list = res[0]
        this.loading = false;
      } catch (e) {
        this.loadError = true;
        this.loading = false;
      }
    },
    chooseWord() {
      log('word')
      this.$router.push({ path: '/word' })
    },
    chooseWordSearch() {
      log('wordSearch')
      this.$router.push({ path: '/wordSearch' })
    },
    chooseRead() {
      log('wordSearch')
      this.$router.push({ path: '/enRead' })
    },
    chooseListen() {
      log('listen')
      this.$router.push({ path: '/listen' })
    },
    choose(id) {
      this.$router.push({ path: '/source/' + id })
    },
    toEnGrammar() {
      this.$router.push({ path: '/enGrammar' })
    }
  },
  watch: {
    degree: {
      async handler(val) {
        this.subjects = await request.get('/subjectV3?degree=' + this.degree);
        this.selectSub = 'english';
        localStorage.setItem('sourceChoose', 'english')
      }
    }
  },
  components: {
    Switch, Button, Icon, Page
  }
}
</script>

<style scoped lang="less">
.source {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
}

.subjects {
  width: 100%;
  height: 100px;
  display: flex;
  flex-direction: row;
  border-bottom-color: #afafaf;
  border-bottom-width: 1px;
  border-bottom-style: solid;

  .subjects_scroll {
    width: 100%;
    flex-direction: row;
    align-items: center;
    height: 100%;
    overflow-x: auto;
    position: relative;

    .subjectScroll {
      display: flex;
      flex-direction: row;
      height: 100%;

      >div {
        flex-shrink: 0;
      }
    }

    &::-webkit-scrollbar {
      display: none;
      /* Chrome Safari */
    }
  }

  &_set {
    border-left-style: solid;
    border-left-color: #afafaf;
    border-left-width: 1px;
    width: 100px;
    height: 100px;
    position: relative;

    &_list {
      position: absolute;
      background-color: white;
      border-style: solid;
      border-width: 1px;
      border-color: #afafaf;
      top: 100px;
      right: 0;
      width: 300px;
      z-index: 100;
      padding: 20px;

      &_item {
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: row;

        >text {
          font-size: 32px;
        }
      }
    }
  }

  .subjects_item {
    font-size: 42px;
    min-width: 105px;
    line-height: 70px;
    text-align: center;
    padding: 20px 30px;
    color: rgba(0, 0, 0, 0.42);
    position: relative;

    &.active {
      color: #00795c;
      font-weight: bold;

      &::after {
        content: '';
        display: block;
        width: 100%;
        height: 8px;
        background-color: #04785c;
        border-radius: 4px;
      }
    }
  }
}

.list {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  overflow: auto;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.06);

  .loading {
    font-size: 44px;
    color: #999;
  }

  .icon {
    width: 100px;
  }

  .source_list {
    padding-top: 20px;
    padding-bottom: 100px;
    width: 100%;
    max-width: 940PX;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;

    &.error {
      margin-top: 150px;

      .text {
        text-align: center;
        font-size: 32px;
        margin-bottom: 150px;
      }
    }

    .source_item {
      text-align: left;
      flex-shrink: 0;
      margin-top: 20px;
      margin-bottom: 20px;
      border-radius: 18px;
      width: 650px;
      height: 420px;
      border-style: solid;
      border-color: #e0e0e0;
      border-width: 2px;
      background-color: white;
      box-sizing: border-box;
      position: relative;
      display: flex;
      align-items: flex-start;
      justify-content: flex-end;
      overflow: hidden;

      &_title {
        font-size: 50px;
        background-color: rgba(255, 255, 255, 0.8);
        font-family: PingFangSC-Medium;
        color: #313131;
        text-align: center;
        position: absolute;
        padding: 3px 20px;
        border-radius: 14px;
        top: 24px;
        left: 24px;
      }

      &_img {
        opacity: 0.8;
      }
    }
  }
}

.englishList {
  display: flex;
  box-sizing: border-box;

  .source_list {
    padding: 24px;

    .englishItem {
      background-color: white;
      width: 100%;
      padding: 32px;
      margin-bottom: 16px;
      box-sizing: border-box;
      font-size: 32px;
      border: solid 1px #00795c;
      color: #00795c;
      border-radius: 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 500PX;

      .title {
        font-size: 42px;
        color: #00795c;

        .desc {
          font-size: 28px;
          margin-top: 8px;
        }
      }
    }
  }
}

.loading {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  padding-top: 50px;
}

@media (min-width: 1025px) {
  .source {
    .subjects {
      height: 66px;

      .subjects_item {
        height: 100%;
        padding: 0;
        font-size: 24px;
        line-height: 66px;
        min-width: 120px;

        &.active {
          color: #00795c;

          &::after {
            content: '';
            display: block;
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 4px;
            background-color: #04785c;
            border-radius: 2px;
          }
        }
      }

      .subjects_set {
        display: none;
      }
    }

    .source_list {
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      padding: 16px;
      width: 100%;
      box-sizing: border-box;
      align-items: center;
      justify-content: center;

      .source_item {
        width: 200PX;
        height: 130PX;
        margin: 12px 22px;

        .source_item_title {
          font-size: 16PX;
          top: 8PX;
          left: 8PX;
          right: 8PX;
        }
      }
    }
  }

  .englishList {
    .source_list {
      max-width: none;

      .englishItem {
        margin: 12px;
        max-width: 400PX;
        padding: 15PX;

        .title {
          font-size: 22PX;

          .desc {
            font-size: 14PX;
          }
        }

        >img {
          width: 48PX;
          height: 48PX;
        }
      }
    }
  }
}
</style>
