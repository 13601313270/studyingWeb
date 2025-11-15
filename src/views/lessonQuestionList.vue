<template>
  <Page title="题库">
    <div style="height: 100%">
      <div class="content">
        <div class="lessons" v-for="item in pois">
          <text class="lessons_title">{{ item.name }}入门</text>
          <div class="lessons_content">
            <text class="question_page_button" v-for="quizIndex in getPageCount(item.poi, 1)"
              @click="quizQuestions(item.poi, 1, quizIndex - 1)">题组 {{ quizIndex }}</text>
          </div>
        </div>
        <div class="lessons" v-for="item in pois">
          <text class="lessons_title">{{ item.name }}基础</text>
          <div class="lessons_content">
            <text class="question_page_button" v-for="quizIndex in getPageCount(item.poi, 3)"
              @click="quizQuestions(item.poi, 3, quizIndex - 1)">题组 {{ quizIndex }}</text>
          </div>
        </div>
        <div class="lessons" v-for="item in pois">
          <text class="lessons_title">{{ item.name }}加强</text>
          <div class="lessons_content">
            <text class="question_page_button" v-for="quizIndex in getPageCount(item.poi, 5)"
              @click="quizQuestions(item.poi, 5, quizIndex - 1)">题组
              {{ getPageCount(item.poi, 5) > 1 ? quizIndex : '' }}</text>
          </div>
        </div>
      </div>
    </div>
  </Page>
</template>

<script setup lang="ts">
import Page from '@/components/Page.vue';
import request from '../plugin/request'
import { onActivated, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const id = ref<number>(-1);
const pois = ref<{ poi: number, name: string }[]>([]);
const countList = ref<{ poi: number, difficult: number, count: number }[]>([]);

onMounted(() => {
  init()
})
onActivated(() => {
  init()
})
const route = useRoute();
const router = useRouter();
function init() {
  id.value = Number(route.params.id);
  request.get('/lesson/' + route.params.id + '/poi').then((res: any) => {
    pois.value = res;
  });
  request.get('/lesson/' + route.params.id + '/question/countListV2').then((res: any) => {
    countList.value = res;
  });
}
function getPageCount(poi: any, difficult: number): number {
  let item = countList.value.find(item => {
    return item.difficult === difficult && poi === item.poi;
  });
  if (item) {
    return Math.max(Math.min(Math.round(item.count / 20), 20), 1);
  } else {
    return 0;
  }
}
function quizQuestions(poi: any, difficult: number, page: number) {
  router.push('/poi/' + poi + '/question/' + difficult + '/' + page);
}
</script>

<style scoped lang="less">
.content {
  width: 100vw;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f8f8f8;
}

.lessons {
  display: flex;
  margin: 15px;
  position: relative;
  flex-direction: column;
  width: 650px;
  border-style: solid;
  border-color: #e0e0e0;
  border-width: 2px;
  background-color: white;
  float: left;
  flex-shrink: 0;
  padding: 30px 20px 10px;
  box-sizing: border-box;
  border-radius: 18px;

  &_title {
    font-size: 42px;
    text-align: center;
    margin-bottom: 30px;
  }

  &_content {
    display: flex;
    width: 600px;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap
  }
}

.question_page {
  display: flex;
  flex-direction: row;

  &_button {
    width: 160px;
    text-align: center;
    line-height: 80px;
    font-size: 32px;
    color: #353535;
    float: left;
    height: 80px;
    border-style: solid;
    border-width: 1px;
    border-color: #54796e;
    border-radius: 20px;
    margin: 10px;
  }
}

@media (min-width: 1025px) {
  .content {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    .lessons {
      width: 325px;
      padding: 16px;
      margin: 16px;
      height: 464px;

      .lessons_title {
        font-size: 24px;
        margin-bottom: 8px;
      }

      .lessons_content {
        width: 100%;

        .question_page_button {
          font-size: 20px;
          height: 40px;
          line-height: 44px;
          width: 84px;
          margin: 4px;
        }
      }
    }
  }
}
</style>
