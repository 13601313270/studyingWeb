<template>
  <Page title="学习记录">
    <div class="title">
      <text v-if="count > maxCount">
        {{ '最近' + maxCount + '条记录' }}
      </text>
    </div>
    <div class="actions">
      <div class="item" v-for="item in list">
        <div class="item_in">
          <text class="name">开始时间:</text>
          <text class="value">{{ item.ctime }}</text>
        </div>
        <div class="item_in">
          <text class="name">上次听到:</text>
          <text class="value">{{listLesson.map(item => item.title)[item.playTime]}}</text>
        </div>
      </div>
    </div>
  </Page>
</template>

<script lang="ts" setup>
import request from '../plugin/request'
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Page from '@/components/Page.vue';

const id = ref(0);
const content = ref('');
const page = ref(0);
const list = ref<Array<{
  ctime: string,
  playTime: number
}>>([]);
const listLesson = ref<Array<{
  deep: number,
  index: number,
  before?: string,
  title?: string,
  desc?: string,
  after?: string,
}>>([]);
const maxCount = ref(10);
const count = ref(0);
const route = useRoute();

onMounted(() => {
  id.value = +route.params.id;
  request.get('/lesson/' + route.params.id + '/detail').then((data: any) => {
    content.value = data.content;
    const lessonList: any[] = [];

    function update(dataArr: any[], deep: number) {
      dataArr.forEach((data: any, index: number) => {
        let item: any = { deep, index };
        if (data.before) {
          item.before = data.before;
        }
        if (data.title) {
          item.title = data.title;
        }
        if (data.desc) {
          item.desc = data.desc;
        }
        if (data.after) {
          item.after = data.after;
        }
        lessonList.push(item);
        if (data.child) {
          update(data.child, deep + 1)
        }
      });
    }

    update(data.content, 1);
    listLesson.value = lessonList;
  });
  request.get('/lesson/' + id.value + '/record?page=' + page.value).then((res: any) => {
    list.value = res.list;
    count.value = res.count;
  });
  // this.logAction('lessonLog');
})
</script>

<style scoped lang="less">
.title {
  text-align: center;
  color: grey;
  margin-top: 10px;
}

.item {
  border-bottom-style: solid;
  border-bottom-color: #cdcdcd;
  border-bottom-width: 1px;
  padding: 20px 20px 20px 50px;
}

.item_in {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
}

.name {
  font-size: 32px;
  margin-right: 70px;
  width: 150px;
  color: #343434;
}

.value {
  font-size: 32px;
  flex: 1;
  color: #5d5d5d;
}
</style>
