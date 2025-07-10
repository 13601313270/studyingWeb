<template>
  <Page title="阅读">
    <div v-if="info">
      <div class="title">{{ title }}</div>
      <div class="levelContent" v-if="info.contentList && info.contentList.length">
        <div class="levelTitle">难度选择：</div>
        <div class="levelSelectList">
          <div class="item" :class="{ active: useLevel === item.level }" v-for="item in info.contentList"
            @click="useLevel = item.level">
            {{ item.level }}
          </div>
        </div>
      </div>
      <div class="content">
        <div v-for="section in showContent.split('\n')">
          <div v-if="section.substring(0, 2) === '##'"
            style="display: flex;flex-direction: row;flex-wrap: wrap;width: 660px;">
            {{ section }}
            <!-- <text style="float:left;display: inline;margin-right: 10px;font-family: iconfont;font-size: 40px;"
              v-for="word in section.substr(2).split(' ')" :style="{ color: UserInterfaceStyle === 1 ? '#c0c0c0' : 'black' }"
              @longpress="longPressWord(word)">{{ word }}</text> -->
          </div>
          <div class="splitLine" v-else-if="section.substring(0, 10) === '----------'">
          </div>
          <div v-else-if="section.substring(0, 7) === '![Image'">
            <img class="showImg" :src="section.match(/\]\((https?:\/\/.+)\)/)[1]" />
          </div>
          <div v-else>
            {{ section }}
          </div>
        </div>
      </div>
      <div class="question" v-if="info.question && info.answer">
        <div>
          <div class="title">题目</div>
          <div>
            <div v-for="section in info.question.split('\n')">
              {{ section }}</div>
          </div>
        </div>
        <div class="answer">
          <div class="title">答案：</div>
          <div class="showButton" @click="showAnswer = !showAnswer">显示</div>
          <div class="answerRes" v-if="showAnswer">{{ info.answer }}</div>
        </div>
        <div v-if="info.explanation">
          <div style="display: flex;align-items: center;">
            <div class="title">解析：</div>
            <div class="showButton" @click="showExplanation = !showExplanation">显示</div>
          </div>
          <div v-if="showExplanation">
            {{ info.explanation }}
          </div>
        </div>
      </div>
    </div>
  </Page>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import Page from '@/components/Page.vue';
import request from '@/plugin/request';

type Detail = {
  id: number;
  title: string;
  content: string;
  contentList: Array<{
    title: string;
    content: string;
    level: number;
  }>;
  answer: string;
  question: string;
  explanation: string;
}
const route = useRoute()
const info = ref<Detail>()
const useLevel = ref<number>()
const title = ref<string>('')
const showAnswer = ref<boolean>(false)
const showExplanation = ref<boolean>(false)
onMounted(() => {
  const id = route.params.id;
  request.get('/en/read/detail/' + id).then(res => {
    info.value = res as any;
    if (info.value) {
      if (info.value?.title) {
        title.value = info.value.title;
      } else {
        title.value = info.value.content.split('.')[0];
      }
    }
    if (info.value?.contentList && info.value?.contentList.length) {
      const find = info.value?.contentList.find(v => v.level > 950)
      if (find) {
        useLevel.value = find.level
      } else {
        useLevel.value = info.value?.contentList[info.value?.contentList.length - 1].level
      }
    }
  })
})
const showContent = computed<string>(() => {
  if (info.value?.contentList && info.value?.contentList.length) {
    const find = info.value.contentList.find(v => v.level === useLevel.value)
    if (find) {
      return find.content
    }
  }
  if (info.value) {
    return info.value.content;
  } else {
    return ''
  }
})
</script>
<style lang="less" scoped>
.title {
  font-size: 38px;
  padding: 16px;
  font-weight: bold;
}

.levelContent {
  margin-top: 24px;
  margin-bottom: 24px;

  .levelTitle {
    color: #333;
    font-size: 32px;
    margin-left: 16px;
  }

  .levelSelectList {
    display: flex;
    padding: 0 16px;
    margin: 8px 0;

    .item {
      flex-grow: 1;
      text-align: center;
      font-size: 32px;
      border: solid 1px #aaa;
      margin: 0 4px;
      padding: 4px 0;
      border-radius: 4px;

      &.active {
        border: solid 1px #00795c;
        background: #00795c;
        color: white;
        font-weight: bold;
      }
    }
  }
}

.content {
  padding: 16px;
  padding-bottom: 128px;

  .showImg {
    width: 100%;
  }

  .splitLine {
    width: 100%;
    height: 2px;
    background-color: #ccc;
    margin: 24px 0;
  }
}

.question {
  padding: 16px;

  .title {
    font-size: 32px;
  }

  .answer {
    display: flex;
    align-items: center;

    .answerRes {
      font-size: 32px;
    }
  }

  .showButton {
    text-align: center;
    font-size: 32px;
    border: solid 1px #aaa;
    margin: 0 4px;
    display: inline-block;
    padding: 4px 16px;
    border-radius: 4px;
  }
}
</style>