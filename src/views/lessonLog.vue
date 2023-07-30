<template>
  <div style="">
      <div>
          <text v-if="count>maxCount" style="text-align: center;color:grey;margin-top: 10px;">
              {{'最近'+maxCount+'条记录'}}
          </text>
      </div>
      <!--        <text>{{listLesson.map(item=>item.title)}}</text>-->
      <div class="actions">
          <div class="item" v-for="item in list">
              <div class="item_in">
                  <text class="name">开始时间:</text>
                  <text class="value">{{item.ctime}}</text>
              </div>
              <div class="item_in">
                  <text class="name">上次听到:</text>
                  <text class="value">{{listLesson.map(item=>item.title)[item.playTime]}}</text>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
  import {mapActions} from 'vuex';
  import request from '../plugin/request'
  export default {
      name: 'mine',
      data() {

          return {
              id: 0,
              content: '',
              page: 0,
              list: [],
              listLesson: [],
              maxCount: 10,
              count: 0,
          }
      },
      mounted() {
          this.id = this.$route.params.id;
          const self = this;
          request.get('/lesson/' + this.$route.params.id + '/detail').then(data => {
              self.content = data.content;
              const lessonList = [];

              function update(dataArr, deep) {
                  dataArr.forEach((data, index) => {
                      let item = {deep, index};
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
              self.listLesson = lessonList;
          });
          request.get('/lesson/' + this.id + '/record?page=' + this.page).then(res => {
              this.list = res.list;
              this.count = res.count;
          });
          // this.logAction('lessonLog');
      },
      methods: {
          ...mapActions('main', ['setPath']),
      },
      components: {}
  }
</script>

<style scoped lang="less">
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
