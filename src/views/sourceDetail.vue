<template>
  <Page :title="title">
    <div class="content">
      <div class="lessons">
        <div v-for="item in list" :key="item.id" class="lesson_item">
          <text class="lesson_item_title">{{ item.title }}</text>
          <div class="video_list" v-if="item.poi.find(v => v.hasVideo)">
            <div class="title">课 程</div>
            <div class="list">
              <div v-for="(poi, key) in item.poi" :key="poi.id" class="item">
                <text class="user_to_poi_item">{{ key + 1 }}、{{ poi.name }}</text>
                <Button class="playButton" text="播放" icon="video" :disabled="!poi.hasVideo" @click="poiLesson(poi)" />
              </div>
            </div>
          </div>
          <div style="flex-grow: 1;"></div>
          <div class="action_links">
            <Button v-if="!item.poi.find(v => v.hasVideo)" text="课   程" icon="video" :disabled="!item.hasContent"
              @click="lesson(item)" />
            <Button text="题   库" icon="question" @click="gotoQuestion(item)" />
            <Button v-if="item.lessonKnowledgeExist" text="知识点" icon="light" @click="gotoKnowledge(item)" />
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

const router = useRouter();
const route = useRoute();
const store = useStore();

type Poi = {
  id: number;
  name: string;
  hasVideo: boolean;
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

const refresh = () => {
  request.get('/source/' + route.params.id + '/info').then(data => {
    Object.assign(info, data);
    // @ts-ignore
    title.value = data.name;
  });

  request.get('/source/' + route.params.id + '/lessonsV3').then(data => {
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
  console.log(data, data)
  // @ts-ignore
  showConinueTimes.value = data as any;
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
  border-color: #e0e0e0;
  border-width: 1px;
  background-color: white;
  float: left;
  flex-shrink: 0;
  padding: 20px;
  border-radius: 18px;
  box-sizing: border-box;

  &_title {
    padding-top: 40px;
    font-size: 50px;
    text-align: center;
    color: #08130e;
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
  border-top-style: solid;
  border-top-width: 2px;
  border-top-color: #e9e9e9;
  margin-top: 35px;
  height: 102px;
  padding-top: 20px;
  padding-bottom: 20px;
  flex-direction: row;
  justify-content: space-around;
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
      }
    }
  }
}

.chooseUseType {
  .chooseUseTypeInfo {
    margin-bottom: 8px;

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
</style>
