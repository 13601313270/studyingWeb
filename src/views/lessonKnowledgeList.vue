<template>
  <Page :title="info ? (info.title + '知识点') : ''">
    <div class="content">
      <div class="lessons" v-for="item in list.filter(item2 => item2.type === 1)" :key="item.id">
        <text class="lessons_title">{{ item.title }}</text>
        <div v-if="item.img" @click="showImgDetail(item)">
          <img class="item_pic" :src="item.img.replace('http://', 'https://')" />
        </div>
      </div>
    </div>
  </Page>
</template>

<script lang="ts" setup>
import request from '../plugin/request'
import { showImg } from '../plugin/imagePreview'
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Page from '@/components/Page.vue';

const info = ref<{
  title: string
}>();
const router = useRouter()
const route = useRoute()
const list = ref<{
  id: number
  title: string
  type: number
  img: string
  content: string
}[]>([]);
const title = ref<string>('');

function showImgDetail(detail: any) {
  console.log(1111, detail)
  if (detail.content && detail.content !== '<p><br></p>') {
    router.push('/lesson/' + route.params.id + '/knowledge/' + detail.id)
  } else {
    showImg(detail.img)
  }
}
onMounted(() => {
  request.get('/lesson/' + route.params.id + '/info').then((res: any) => {
    info.value = res;
    title.value = res.title + '知识点';
  });
  request.get('/knowledge/lesson/' + route.params.id).then((res: any) => {
    list.value = res;
  });
  // this.logAction('lessonKnowledgeList');
})
</script>

<style scoped lang="less">
.content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 88px;
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
  border-radius: 8px;

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

.item_pic {
  border-style: solid;
  border-width: 1px;
  width: 600px;
  border-color: #e2e2e2;
}
</style>
