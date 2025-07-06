<template>
  <Page title="词典">
    <div class="content">
      <Input placeholder="请输入单词" @input="search" v-model="searchWord" />
      <div class="searchList">
        <div v-for="item in searchList" class="searchItem" :key="item.word" :class="{ equal: item.word === searchWord }"
          @click="choose(item.word)">
          <div class="word">{{ item.word }}</div>
          <div class="meaning">
            <div v-for="mean in item.meaning">
              {{ mean.part }}{{ mean.part ? '：' : '' }}{{ mean.means.join('; ') }}
            </div>
            <div v-if="item.word === searchWord">
              <div v-if="item.word_pl">复数：{{ item.word_pl }}</div>
              <div v-if="item.word_past">过去时：{{ item.word_past }}</div>
              <div v-if="item.word_done">完成时：{{ item.word_done }}</div>
              <div v-if="item.word_ing">进行时：{{ item.word_ing }}</div>
              <div v-if="item.word_third">三单：{{ item.word_third }}</div>
              <div v-if="item.ph_en" class="ph">
                音标(英):{{ item.ph_en }}<img class="playImg" src="../icons/play.png" @click="playAudio(item.en_mp3)" />
              </div>
              <div v-if="item.ph_am" class="ph">
                音标(美):{{ item.ph_am }}<img class="playImg" src="../icons/play.png" @click="playAudio(item.am_mp3)" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Page>
</template>
<script setup lang="ts">
import Page from '@/components/Page.vue';
import Input from '@/components/Input.vue';
import request from '@/plugin/request'
import { play } from '@/plugin/audio';
// @ts-ignore
import { debounce } from 'throttle-debounce'
import { ref } from 'vue';

type SearchItem = {
  word: string;
  am_mp3: string;
  en_mp3: string;
  meaning: Array<{
    part: string;
    means: Array<string>
  }>;
  origin: string;
  ph_am: string;
  ph_en: string;
  word_done: string;
  word_est: string;
  word_ing: string;
  word_past: string;
  word_pl: string;
  word_third: string;
}
const searchList = ref<SearchItem[]>([]);
const searchWord = ref<string>('')

const search = debounce(300, (word: any) => {
  request.get('/en/word/search/' + word.target.value).then(res => {
    searchList.value = res as any;
  })
})
function playAudio(url: string) {
  play(url)
}
function choose(word: string) {
  if (word !== searchWord.value) {
    searchWord.value = word;
    request.get('/en/word/search/' + word).then(res => {
      searchList.value = res as any;
    })
  }
}
</script>
<style lang="less" scoped>
.content {
  padding: 16px;

  .searchList {
    margin-top: 16px;

    .searchItem {
      border: solid 1px rgb(98, 98, 98);
      margin-bottom: 16px;
      padding: 8px 16px;
      border-radius: 8px;

      .word {
        font-size: 38px;
        font-weight: bold;
        color: rgb(110, 110, 110);
      }

      .meaning {
        margin-top: 4px;
        font-size: 32px;
        color: rgb(77, 77, 77);

        .ph {
          display: flex;
          align-items: center;

          .playImg {
            margin-left: 16px;
            height: 52px;
            filter: invert(50%);
          }
        }
      }

      &.equal {
        border: solid 4px rgb(0, 121, 92);
        padding: 16px 24px;

        .word {
          font-size: 56px;
          color: black;
        }
      }
    }
  }
}
</style>