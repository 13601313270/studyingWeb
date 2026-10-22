<template>
  <Page :title="title" footActive='source'>
    <div class="content">
      <div class="lessons">
        <div v-for="item in list" :key="item.id" class="lesson_item">
          <text class="lesson_item_title">{{ item.title }}</text>
          <div class="video_list" v-if="item.poi.find(v => v.hasVideo || v.pageUrl)">
            <div class="title">课 程</div>
            <div class="list">
              <div v-for="(poi, key) in item.poi" :key="poi.id" class="item">
                <text class="user_to_poi_item">{{ key + 1 }}、{{ poi.name }}</text>
                <Button class="playButton" text="播放" icon="video" :disabled="!poi.hasVideo && !poi.pageUrl"
                  @click="poiLesson(poi)" />
              </div>
            </div>
          </div>
          <div style="flex-grow: 1;"></div>
          <div class="action_links">
            <button v-if="!item.poi.find(v => v.hasVideo)" class="action-btn" :disabled="!item.hasContent"
              @click="lesson(item)">
              <span class="action-btn-icon action-btn-icon--play" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <span class="action-btn-label">课程</span>
              <span class="action-btn-arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path d="m9 6 6 6-6 6" />
                </svg>
              </span>
            </button>
            <button class="action-btn" @click="gotoQuestion(item)">
              <span class="action-btn-icon action-btn-icon--doc" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6" />
                  <path d="M8 13h8" />
                  <path d="M8 17h8" />
                </svg>
              </span>
              <span class="action-btn-label">题库</span>
              <span class="action-btn-arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path d="m9 6 6 6-6 6" />
                </svg>
              </span>
            </button>
            <button v-if="item.lessonKnowledgeExist" class="action-btn" @click="gotoKnowledge(item)">
              <span class="action-btn-icon action-btn-icon--light" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 18h6" />
                  <path d="M10 22h4" />
                  <path
                    d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
                </svg>
              </span>
              <span class="action-btn-label">知识点</span>
              <span class="action-btn-arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path d="m9 6 6 6-6 6" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Page>
  <Dialog :show="showConinuePoiLesson" title="提示" @close="closeDialog">
    <div class="chooseUseType">
      <BuyVIPDesc />
      <VipPriceDesc @buy="buyVipFinish" @to-invite="toInvite" />
      <div class="split"></div>
      <div class="chooseUseTypeInfo" v-if="showConinuePoiLesson">
        您是免费用户，今日可免费试用次数还剩<span class="time">{{ showConinueTimes.times.poiLesson }}</span>次，是否继续使用？
      </div>
      <Button class="continueUseButton" @click="continueUse" text="继续免费试用"></Button>
    </div>
  </Dialog>

  <teleport to="#teleport">
    <div v-if="showHtmlPreview" class="html-preview-fullscreen">
      <Header title="课件预览" @back="closeHtmlPreview" />
      <div class="html-preview-body">
        <iframe
          v-if="htmlPreviewKey"
          :key="htmlPreviewKey"
          :srcdoc="htmlContent"
          class="html-preview-iframe"
          frameborder="0"
          sandbox="allow-scripts allow-forms allow-popups allow-same-origin"
        ></iframe>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts" setup>
import { mapActions, mapGetters } from 'vuex';
import { ref, onActivated, computed } from 'vue';
import Dialog from '@/components/Dialog.vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import Button from "@/components/Button.vue";
import request from '@/plugin/request'
import BuyVIPDesc from './buyVIPDesc.vue';
import toast from '@/plugin/toast';
import log from '@/plugin/log';
import VipPriceDesc from '@/components/vipPriceDesc.vue';
import Page from '@/components/Page.vue';
import Header from '@/components/Header.vue';
import file from '@/plugin/file';

const router = useRouter();
const route = useRoute();
const store = useStore();

type Poi = {
  id: number;
  name: string;
  hasVideo: boolean;
  pageUrl: string;
  hasContent: boolean;
};

type Detail = {
  id: number;
  title: string;
  hasVideo: boolean;
  hasContent: boolean;
  hasChildPoiVideo: boolean;
  poi: Array<Poi>;
  newContent: string;
  lessonKnowledgeExist: boolean;
}
const list = ref<Detail[]>([]);
const info = ref({});
const score = ref([]);
const title = ref<string>('')

// 确认次数弹窗
const showConinuePoiLesson = ref<Poi | null>(null);
const showConinueTimes = ref({
  isVip: false,
  times: {
    poiLesson: 0,
  }
});

// HTML 课件预览
const showHtmlPreview = ref(false);
const htmlContent = ref('');
const htmlPreviewKey = ref(0);
function closeHtmlPreview() {
  showHtmlPreview.value = false;
  htmlContent.value = '';
  htmlPreviewKey.value = 0;
}

const refresh = () => {
  request.get('/source/' + route.params.id + '/info').then(data => {
    Object.assign(info, data);
    // @ts-ignore
    title.value = data.name;
  });

  request.get('/source/' + route.params.id + '/lessonsV4').then(data => {
    // @ts-ignore
    list.value = data;
  });

  request.get('/userInLesson?course=' + route.params.id).then(data => {
    // @ts-ignore
    if (!data.error) {
      // @ts-ignore
      score.value = data;
    }
  });
};

async function poiLesson(item: Poi) {
  const data = await request.get('/user/checkFuncTimes');
  // @ts-ignore
  showConinueTimes.value = data as any;
  if (item.pageUrl) {
    const html = await request.get('/poi/' + item.id + '/html');
    // @ts-ignore
    htmlContent.value = typeof html === 'string' ? html : (html?.data ?? html?.html ?? '');
    htmlPreviewKey.value++;
    showHtmlPreview.value = true;
    return;
  }
  if (!item.hasVideo) {
    alert('课程维护中');
    return;
  }
  if (showConinueTimes.value.isVip) {
    router.push('/poiLesson/' + item.id);
  } else {
    log('vipUseSource');
    showConinuePoiLesson.value = item;
  }
};

const lesson = (item: Detail) => {
  if (!item.hasContent) {
    return;
  }
  router.push('/lesson/' + item.id);
};

const gotoQuestion = (item: Detail) => {
  router.push('/lesson/' + item.id + '/questionList');
};

const gotoKnowledge = (item: Detail) => {
  router.push('/lesson/' + item.id + '/knowledge');
};

onActivated(() => {
  refresh();
});
function closeDialog() {
  showConinuePoiLesson.value = null
}
function buyVipFinish() {
  closeDialog();
}
function toInvite() {
  closeDialog();
}
async function continueUse() {
  if (showConinuePoiLesson.value) {
    const result = await request.post('/user/useFuncTimes', {
      func: 'poiLesson'
    });
    if (result) {
      router.push('/poiLesson/' + showConinuePoiLesson.value.id);
      showConinuePoiLesson.value = null
    } else {
      toast({
        'message': '今日免费权限用尽',
        'duration': 3000
      })
    }
  }
}

</script>

<style scoped lang="less">
.content {
  height: 100%;
  overflow: auto;
  background-color: #f5f6f7;
}

.useCoin {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 00px;
  right: 0;
  background-color: rgba(82, 82, 82, 0.56);
  display: flex;
  align-items: center;
  justify-content: center;
}

.useCoin2 {
  background-color: white;
  border-style: solid;
  border-width: 1px;
  border-color: #757575;
  border-radius: 20px;
  box-shadow: 0 10px 25px -10px rgba(110, 117, 114, 0.4);
  display: flex;
  padding-bottom: 20px;
  width: 680px;
  height: 800px;
}

.lessons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  min-height: 1200px;
  padding-top: 18px;
  padding-bottom: 18px;
}

.lesson_item {
  display: flex;
  overflow: hidden;
  margin: 18px;
  position: relative;
  flex-direction: column;
  width: 650px;
  min-height: 300px;
  border-style: solid;
  border-color: rgb(233, 238, 235);
  border-width: 1PX;
  background-color: white;
  float: left;
  flex-shrink: 0;
  padding: 36px 32px;
  border-radius: 18px;
  box-sizing: border-box;

  .lesson_item_title {
    font-size: 34px;
    color: #08130e;
    font-weight: 650;
  }

  &_free {
    position: absolute;
    width: 80px;
    height: 80px;
    line-height: 70px;
    font-size: 26px;
    color: rgba(13, 104, 74, 0.65);
    right: 5px;
    top: 2px;
  }

  &_noBuy {
    position: absolute;
    width: 80px;
    height: 80px;
    line-height: 70px;
    font-size: 26px;
    text-align: center;
    border-radius: 50px;
    background-color: #e86e5d;
    color: white;
    right: 5px;
    top: 2px;
  }
}

.poi_panel .item {
  height: 30px;
  border: solid 1px #c7c7c7;
}

.action_links {
  display: flex;
  gap: 12px;
  border-top-style: solid;
  border-top-width: 2px;
  border-top-color: #e9e9e9;
  margin-top: 35px;
  padding-top: 20px;
  flex-direction: row;
  justify-content: space-around;
}

.action-btn {
  flex: 1 1 0;
  min-width: 0;
  height: 88px;
  padding: 0 16px;
  border: none;
  border-radius: 16px;
  background-color: #f5f7f5;
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  transition: background-color .15s;
  box-sizing: border-box;

  &:active:not(:disabled) {
    background-color: #e6e7e8;
  }

  &:disabled {
    opacity: .45;
    cursor: not-allowed;
  }
}

.action-btn-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #0f5132;
  color: #fff;
  flex-shrink: 0;
  display: grid;
  place-items: center;

  svg {
    width: 24px;
    height: 24px;
  }

  &--doc {
    background-color: #8ca18c;
  }

  &--light {
    background-color: #b45309;
  }
}

.action-btn-label {
  flex: 1;
  font-size: 24px;
  font-weight: 300;
  color: #08130e;
  text-align: left;
  white-space: nowrap;
}

.action-btn-arrow {
  color: #9aa0a6;
  flex-shrink: 0;
  display: grid;
  place-items: center;
}

.video_list {
  margin-top: 15px;
  margin-bottom: 15px;
  padding: 20px;
  border-radius: 10px;
  background-color: rgba(74, 121, 108, 0.2);

  .title {
    font-size: 30px;
    padding-left: 30px;
    margin-bottom: 15px;
  }

  .list {
    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 40px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .user_to_poi_list {}

    .playButton {
      flex-shrink: 0;
    }
  }
}

.action_link {
  display: flex;
  float: left;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 180px;
  height: 79px;
  line-height: 79px;
  border-radius: 10px;
  text-align: center;
  box-sizing: border-box;
  border-color: #ccd6d2;
  border-width: 2px;

  &_text {
    color: #112a21;
  }
}

.user_to_poi {
  &_list {
    margin-top: 30px;
    margin-left: 50px;
  }

  &_item {
    color: #293c34;
    font-size: 30px;
  }
}

.score {
  display: flex;
  flex-direction: row;
  border-radius: 10px;
  overflow: hidden;
}

.tip {
  display: inline-block;
  color: white;
  padding-right: 10px;
  padding-left: 10px;
  height: 45px;
  font-size: 30px;
}

.no_score {
  display: flex;
  flex-direction: row;
  border-radius: 10px;
  overflow: hidden;
  background-color: #ededed;
  align-items: center;
  justify-content: center
}

.data_list {
  width: 600px;
  margin-top: 30px;
  padding: 20px;
  border-radius: 8px;
  background-color: #ebf2f0;
  border-style: solid;
  border-color: #e0e0e0;
  border-width: 2px;
}

.data_list_tip {
  position: absolute;
  width: 40px;
  height: 40px;
  right: 76px;
  top: -22px;
  /*border-top-left-radius: 30px;*/
  /*border-top-right-radius: 30px;*/
  transform: rotate(45deg);
  background-color: #ebf2f0;
  border-style: solid;
  border-color: #e0e0e0;
  border-width: 2px;
}

.data_list_tip2 {
  position: absolute;
  transition: transform;
  z-index: 9999;
  width: 100px;
  height: 30px;
  right: 46px;
  top: -2px;
  background-color: #ebf2f0;
}

@media (min-width: 1025px) {
  .lessons {
    padding-top: 18px;
    padding-bottom: 18px;
    min-height: auto;
    align-items: normal;

    .lesson_item {
      width: 400px;
      // height: 300px;
      padding: 12px;
      margin: 16px;
      display: flex;
      border-radius: 16px;

      .lesson_item_title {
        font-size: 26px;
        padding-top: 0;
        margin-bottom: 4px;
      }

      .user_to_poi_list {
        margin-top: 12px;
        margin-left: 12px;
        margin-right: 12px;
        flex-grow: 1;

        .user_to_poi_item {
          font-size: 22px;
        }
      }

      .video_list {
        margin-top: 8px;
        margin-bottom: 8px;
        padding-top: 4px;
        padding-bottom: 4px;
        flex-grow: 1;

        .title {
          font-size: 26px;
          margin-bottom: 0px;
        }

        .list {
          .item {
            margin-bottom: 8px;

            .user_to_poi_item {
              font-size: 20px;
            }
          }
        }
      }

      .action_links {
        margin-top: 12px;
        padding-top: 8px;
        padding-bottom: 8px;
        height: auto;
        gap: 8px;

        .action-btn {
          height: 44px;
          padding: 0 10px;
          gap: 8px;
          border-radius: 10px;

          &-icon {
            width: 28px;
            height: 28px;

            svg {
              width: 14px;
              height: 14px;
            }
          }

          &-label {
            font-size: 14px;
          }

          &-arrow svg {
            width: 12px;
            height: 12px;
          }
        }
      }
    }
  }
}

.chooseUseType {
  .chooseUseTypeInfo {
    margin-bottom: 8px;
    font-size: 36px;

    .time {
      font-weight: bold;
      color: red;
      font-size: 38px;
      margin: 0 8px;
    }
  }

  .split {
    width: 100%;
    height: 2px;
    background-color: #b2b2b2;
    margin: 32px 0;
  }

  .continueUseButton {
    :deep(.button_text) {
      font-weight: bold;
    }
  }
}

.html-preview-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.html-preview-body {
  flex: 1;
  overflow: hidden;
}

.html-preview-iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
  background-color: #fff;
}
</style>
