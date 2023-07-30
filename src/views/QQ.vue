<template>
  <scroller style="height: 100%">
    <div
      class="group"
      v-for="group in allQQGroup"
      :key="group.number"
    >
      <div class="info">
        <div class="title">{{group.title}}</div>
        <div class="number">{{group.number}}</div>
      </div>
      <Button text="复制群号" @click="initQuestion(group.number)" type="white"/>
    </div>
  </scroller>
</template>

<script>
import Button from '../components/Button.vue'
import toast from '../plugin/toast'
import request from '../plugin/request'
import {mapActions} from 'vuex';

// const clipboard = weex.requireModule('clipboard');
export default {
  name: 'mine',
  data() {
      return {
          info: {
              title: '',
              content: ''
          },
          allQQGroup: []
      }
  },
  mounted() {
      // this.logAction('QQ');
      request.get('/globleConfig?keys=allQQGroup').then(list => {
          this.allQQGroup = [
              ...list.allQQGroup
          ];
      })
  },
  methods: {
      ...mapActions('main', ['setPath']),
      initQuestion(number) {
          // clipboard.setString(number.toString());
          toast({
              'message': '复制成功',
              'duration': 2.0
          })
      }
  },
  components: {Button}
}
</script>

<style scoped lang="less">
.group {
  margin-top: 20px;
  width: 650px;
  margin-left: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  .info {
    flex-grow: 1;
  }
  .title {
    line-height: 40px;
    font-size: 40px;
    flex: 1;
  }
  .number {
    line-height: 30px;
    font-size: 30px;
    flex: 1;
    color:grey;
  }
}
</style>
