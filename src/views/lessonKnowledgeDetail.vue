<template>
  <Page :title="info ? info.title : ''" foot-active="source">
    <div @click="showImgDetail" class="imgContent" v-if="info">
      <img :src="info.img.replace('http://', 'https://')" style="width: 100%" />
    </div>
    <div v-if="info" v-html="info.content" class="htmlContent"></div>
  </Page>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import request from '@/plugin/request'
import { showImg } from '@/plugin/imagePreview'
import Page from '@/components/Page.vue';

const route = useRoute()
const info = ref<{
  title: string
  img: string
  content: string
}>();

function showImgDetail() {
  if (info.value) {
    showImg(info.value.img)
  }
}
onMounted(() => {
  request.get('/knowledge/getInfo/' + route.params.id).then((res: any) => {
    info.value = res;
  });
})
</script>
<style scoped lang="less">
.imgContent {
  border-bottom: solid 1px rgb(204, 204, 204);
  box-shadow: 1px 1px 4px 0px rgb(163, 163, 163);
}

.htmlContent {
  padding: 24px;
}
</style>