<template>
  <div @click="showImgDetail" class="imgContent">
    <img :src="info.img.replace('http://','https://')" style="width: 100%"/>
  </div>
  <div v-html="info.content" class="htmlContent"></div>
</template>
<script>
import request from '@/plugin/request'
import {showImg} from '@/plugin/imagePreview'
export default {
  name: 'lessonKnowledgeDetail',
  created() {
    request.get('/knowledge/getInfo/' + this.$route.params.id).then(res => {
      this.info = res;
    });
  },
  data(){
    return {
      info: {

      }
    }
  },
  methods:{
    showImgDetail(){
      showImg(this.info.img)
    }
  }
}
</script>
<style scoped>
.imgContent {
  border-bottom: solid 1px rgb(204, 204, 204);
  box-shadow: 1px 1px 4px 0px rgb(163, 163, 163);
}
.htmlContent {
  padding: 24px;
}
</style>