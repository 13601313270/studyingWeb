<template>
  <Page>
    <div class="content" v-if="poiInfo">
      <div class="lessons">
        <text class="lessons_title">{{ poiInfo.name }}入门</text>
        <div class="lessons_content">
          <text class="question_page_button" v-for="quizIndex in getPageCount(1)"
            @click="quizQuestions(1, quizIndex - 1)">题组 {{ quizIndex }}</text>
        </div>
      </div>
      <div class="lessons">
        <text class="lessons_title">{{ poiInfo.name }}基础</text>
        <div class="lessons_content">
          <text class="question_page_button" v-for="quizIndex in getPageCount(3)"
            @click="quizQuestions(3, quizIndex - 1)">题组 {{ quizIndex }}</text>
        </div>
      </div>
      <div class="lessons">
        <text class="lessons_title">{{ poiInfo.name }}加强</text>
        <div class="lessons_content">
          <text class="question_page_button" v-for="quizIndex in getPageCount(5)"
            @click="quizQuestions(5, quizIndex - 1)">题组 {{ quizIndex }}</text>
        </div>
      </div>
    </div>
  </Page>
</template>

<script setup lang="ts">
import { mapActions } from 'vuex';
import request from '../plugin/request'
import { onActivated, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Page from '@/components/Page.vue';

const route = useRoute();
const router = useRouter();
const id = ref(-1);
const poiInfo = ref<{
  name: string
}>();
const countList = ref<Array<{
  difficult: number,
  count: number
}>>([]);

function init() {
  id.value = Number(route.params.id);
  request.get('/poi/' + route.params.id + '/info').then((res: any) => {
    poiInfo.value = res;
  });
  request.get('/poi/' + route.params.id + '/questionCount').then((res: any) => {
    countList.value = res;
  });
}

function getPageCount(difficult: number): number {
  let item = countList.value.find(item => {
    return item.difficult === difficult;
  });
  if (item) {
    return Math.max(Math.min(Math.round(item.count / 20), 20), 1);
  } else {
    return 0;
  }
}
function quizQuestions(difficult: number, page: number) {
  router.push('/poi/' + route.params.id + '/question/' + difficult + '/' + page);
}
onMounted(() => {
  init()
})
onActivated(() => {
  if (id.value !== Number(route.params.id)) {
    init()
  }
})
</script>

<style scoped lang="less">
.content {
  width: 750px;
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
