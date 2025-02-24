<template>
  <div class="content">
    <VideoLesson v-if="content" :content="content" @firstPlay="firstPlay" @playStep="playStep" @end="end"
      :actions="[{ text: '去做题', action: gotoQuestion }]" />
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router';
import { mapActions, mapGetters, useStore } from 'vuex'
import VideoLesson from "../components/video.vue";
import request from '@/plugin/request'
import { stop } from '../plugin/audio'
import { Store } from '@/store';
import Loading from '@/plugin/loading';

const router = useRouter()
const route = useRoute()
const store = useStore<Store>();

const content = ref<any>(null);
const title = ref<string>('');
const course = ref<number>(0);
const loadImg = ref<any[]>([])
const recordId = ref<any>(null)
const isEnd = ref<boolean>(false)

onMounted(() => {
  const handle = Loading()
  request.get('/poi/' + route.params.id + '/video').then((data: any) => {
    console.log('==========1111', data)
    handle.destory()
    content.value = data.content;
    title.value = data.name;
    course.value = data.course;
    request.get('/source/' + course.value + '/info').then((sourceData: any) => {
      store.dispatch('main/setPath', [
        { name: sourceData.name, path: '/source/' + course.value },
        { name: title.value + '课程' },
      ])
    });
    loadImg.value = [];
  });
  // this.logAction('lessonDetail');
})


async function firstPlay() {
  if (store.state.main.userInfo && store.state.main.userInfo.id) {
    recordId.value = await request.post('/lesson/' + route.params.id + '/record', {});
  }
}
function playStep(playIndex: number) {
  isEnd.value = false;
  if (recordId.value) {
    // request.put('/lesson/' + this.recordId + '/recordDetail', {
    //     data: {
    //         playTime: playIndex
    //     }
    // });
  }
}
function end() {
  isEnd.value = true;
}
function gotoQuestion() {
  router.push('/lesson/' + route.params.id + '/questionList');
}
function back() {
  router.replace('/source/' + course.value);
}

onBeforeRouteLeave(() => {
  stop();
})
</script>

<style scoped lang="less">
.content {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  background-color: #39723a !important;
  height: 100%;
  box-sizing: border-box;

  &.ios {
    padding-bottom: 20px;
  }

  :deep(.tools) {
    padding-bottom: env(safe-area-inset-bottom);
  }
}

.float {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  background-color: #f2fcfa;
  border-radius: 8px;

  box-shadow: 0 0 20px 0 #b1b1b1;
  width: 500px;
  left: 125px;
  top: 500px;
  padding: 20px;
  text-align: center;

  &_text {
    width: 460px;
    margin-top: 50px;
    color: #10261e;
  }
}

.background {
  width: 750px;
  color: white;
  flex: 1;
  display: flex;
  overflow: hidden;

  .banshu {
    min-width: 200px;
    max-width: 50%;
    padding: 10px;
    overflow-y: auto;

    .item {
      display: flex;

      span {
        margin-left: 20px;
      }
    }
  }

  .temp_say {
    flex-grow: 1;
    padding: 10px;
    overflow: auto;
    text-align: center;
  }
}

.tools {
  width: 750px;
  flex: 0;
  background-color: #356a36;
  border-top-style: solid;
  border-top-width: 1px;
  border-top-color: #29572a;
  padding-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: center;

  &_button_group {
    display: flex;
    width: 390px;
    height: 60px;
    border-radius: 20px;
    flex-direction: row;
    justify-content: center;
    background-color: #b66320;
  }

  &_button {
    width: 130px;
    height: 60px;
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

.play_button {
  position: absolute;
  z-index: 999;
  top: 500px;
  left: 300px;
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
</style>
