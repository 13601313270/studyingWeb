<template>
  <div class="content">
    <scroller>
      <div class="lessons">
        <div v-for="item in list" :key="item.id" class="lesson_item">
          <text class="lesson_item_title">{{ item.title }}</text>

          <div class="video_list">
            <div class="title">课 程</div>
            <div class="list">
              <div v-for="(poi, key) in item.poi" :key="poi.id" class="item">
                <text class="user_to_poi_item">{{ key + 1 }}、{{ poi.name }}</text>
                <Button class="playButton" text="播放" icon="video" :disabled="!poi.hasVideo"
                  @click="lesson(poi)" />
              </div>
            </div>
          </div>
          <div class="action_links">
            <Button text="题   库" icon="question" @click="gotoQuestion(item)" />
            <Button v-if="item.lessonKnowledgeExist" text="知识点" icon="light" @click="gotoKnowledge(item)" />
            <!--<wxc-button class="action_link" text="掌握统计" @wxcButtonClicked="$set(item,'isShow',!item.isShow)" type="white"/>-->
          </div>
          <div v-if="item.isShow" class="data_list">
            <div class="data_list_tip"></div>
            <div class="data_list_tip2"></div>
            <div v-for="(poi, key) in item.poi" :key="poi.id" style="position:relative;">
              <text class="user_to_poi_item">{{ key + 1 }}、{{ poi.name }}</text>
              <div class="score" v-if="true || getPoiScore(poi.id) !== false">
                <text class="tip" :style="{ flex: getPoiScore(poi.id).good, minWidth: '100px' }"
                  style="background-color: #7ac29c;"></text>
                <text class="tip" :style="{ flex: getPoiScore(poi.id).bad }" style="background-color: #d46c56;"></text>
              </div>
              <div class="score" v-if="true || getPoiScore(poi.id) !== false"
                style="position:absolute;top:45px;width:550px;">
                <text class="tip" :style="{ flex: 1 }">{{ getPoiScore(poi.id).good }}正确
                </text>
                <text class="tip" :style="{ flex: 1 }" style="text-align: right;">{{ getPoiScore(poi.id).bad }}错误
                </text>
              </div>
              <div v-else class="no_score">
                <text style="color:#888888;font-size: 30px;">未进行过测验</text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </scroller>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Button from "@/components/Button";
import Pic from "@/components/icon";
import request from '@/plugin/request'

export default {
  name: 'sourceDetail',
  async activated() {
    this.refresh();
    // this.logAction('sourceDetail');
  },
  data() {
    return {
      list: [],
      info: {},
      poi: [],
      question: [],
      nameRules: [
        v => !!v || 'email is required',
        v => v.length <= 30 || 'Name must be less than 10 characters'
      ],
      score: [],
      poiScore: [],
      buyError: '',
      moreVideoIsOpen: {}
    }
  },
  methods: {
    ...mapActions('main', ['setPath']),
    refresh() {
      request.get('/source/' + this.$route.params.id + '/info').then(data => {
        this.info = data;
        this.setPath([{ name: this.info.name }]);
      });
      request.get('/source/' + this.$route.params.id + '/lessonsV3').then(data => {
        this.list = data;
      });
      // request.get('/source/' + this.$route.params.id + '/poi').then(data => {
      //     this.poi = data;
      //     request.post('/userInPois', {
      //         ids: this.poi.map(item => parseInt(item.id))
      //     }).then(res => {
      //         // weex.requireModule('MyModule').alertMe(JSON.stringify(res));
      //         this.poiScore = res;
      //     });
      // });
      request.get('/userInLesson?course=' + this.$route.params.id).then(data => {
        if (data.error) {

        } else {
          this.score = data;
        }
      });
    },
    lesson(item) {
      
      if (!item.hasVideo) {
        // alert('维护中')
        return;
      }
      console.log('item,item', item)
      this.$router.push('/poiLesson/' + item.id);
      // if (item.hasVideo) {
      //   alert(this.moreVideoIsOpen[item.id + ''])
      //   this.moreVideoIsOpen[item.id + ''] = true;//!this.moreVideoIsOpen[item.id+''];
      // } else {
      // }
    },
    lessonAllChildPoiVideo(item) {
      this.$router.push('/lessonAllChildPoiVideo/' + item.id);
    },
    gotoQuestion(item) {
      this.$router.push('/lesson/' + item.id + '/questionList');
    },
    gotoKnowledge(item) {
      this.$router.push('/lesson/' + item.id + '/knowledge');
    },
    getScore(lessonId) {
      let data = this.score.filter(item => parseInt(item.lesson) == parseInt(lessonId));
      if (!data.find(item => parseInt(item.difficult) === 1)) {
        data.push({ "lesson": lessonId, "difficult": 1, "score": 0 })
      }
      if (!data.find(item => parseInt(item.difficult) === 3)) {
        data.push({ "lesson": lessonId, "difficult": 3, "score": 0 })
      }
      if (!data.find(item => parseInt(item.difficult) === 5)) {
        data.push({ "lesson": lessonId, "difficult": 5, "score": 0 })
      }
      data.sort((a, b) => {
        return parseInt(a.difficult) - parseInt(b.difficult);
      });
      return data;
    },
    getPoiScore(id) {
      let temp = this.poiScore.find(item => {
        return item.poi === parseInt(id)
      });
      if (temp !== null) {
        if (typeof temp === 'object') {
          return temp;
        } else {
          return false;
        }
      } else {
        return false
      }
    }
  },
  computed: {
    ...mapGetters('main', ['userInfo'])
  },
  components: { Pic, Button }
}
</script>

<style scoped lang="less">
.content {
  flex: 1;
  background-color: #f5f6f7;
}

.useCoin {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 00px;
  right: 0;
  background-color: rgba(82, 82, 82, 0.56);
  display: flex;
  align-items: center;
  justify-content: center;
}

.useCoin2 {
  background-color: white;
  border-style: solid;
  border-width: 1px;
  border-color: #757575;
  border-radius: 20px;
  box-shadow: 0 10px 25px -10px rgba(110, 117, 114, 0.4);
  display: flex;
  padding-bottom: 20px;
  width: 680px;
  height: 800px;
}

.lessons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  min-height: 1200px;
  padding-top: 18px;
  padding-bottom: 18px;
}

.lesson_item {
  display: flex;
  overflow: hidden;
  margin: 18px;
  position: relative;
  flex-direction: column;
  width: 650px;
  border-style: solid;
  border-color: #e0e0e0;
  border-width: 1px;
  background-color: white;
  float: left;
  flex-shrink: 0;
  padding: 20px;
  border-radius: 18px;
  box-sizing: border-box;

  &_title {
    padding-top: 40px;
    font-size: 50px;
    text-align: center;
    color: #08130e;
  }

  &_free {
    position: absolute;
    width: 80px;
    height: 80px;
    line-height: 70px;
    font-size: 26px;
    color: rgba(13, 104, 74, 0.65);
    right: 5px;
    top: 2px;
  }

  &_noBuy {
    position: absolute;
    width: 80px;
    height: 80px;
    line-height: 70px;
    font-size: 26px;
    text-align: center;
    border-radius: 50px;
    background-color: #e86e5d;
    color: white;
    right: 5px;
    top: 2px;
  }
}

.poi_panel .item {
  height: 30px;
  border: solid 1px #c7c7c7;
}

.action_links {
  display: flex;
  border-top-style: solid;
  border-top-width: 2px;
  border-top-color: #e9e9e9;
  margin-top: 35px;
  height: 102px;
  padding-top: 20px;
  padding-bottom: 20px;
  flex-direction: row;
  justify-content: space-around;
}

.video_list {
  margin-top: 15px;
  margin-bottom: 15px;
  padding: 20px;
  border-radius: 10px;
  background-color: rgba(74, 121, 108, 0.2);

  .title {
    font-size: 30px;
    padding-left: 30px;
    margin-bottom: 15px;
  }

  .list {
    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 40px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .user_to_poi_list {}

    .playButton {
      flex-shrink: 0;
    }
  }
}

.action_link {
  display: flex;
  float: left;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 180px;
  height: 79px;
  line-height: 79px;
  border-radius: 10px;
  text-align: center;
  box-sizing: border-box;
  border-color: #ccd6d2;
  border-width: 2px;

  &_text {
    color: #112a21;
  }
}

.user_to_poi {
  &_list {
    margin-top: 30px;
    margin-left: 50px;
  }

  &_item {
    color: #293c34;
    font-size: 30px;
  }
}

.score {
  display: flex;
  flex-direction: row;
  border-radius: 10px;
  overflow: hidden;
}

.tip {
  display: inline-block;
  color: white;
  padding-right: 10px;
  padding-left: 10px;
  height: 45px;
  font-size: 30px;
}

.no_score {
  display: flex;
  flex-direction: row;
  border-radius: 10px;
  overflow: hidden;
  background-color: #ededed;
  align-items: center;
  justify-content: center
}

.data_list {
  width: 600px;
  margin-top: 30px;
  padding: 20px;
  border-radius: 8px;
  background-color: #ebf2f0;
  border-style: solid;
  border-color: #e0e0e0;
  border-width: 2px;
}

.data_list_tip {
  position: absolute;
  width: 40px;
  height: 40px;
  right: 76px;
  top: -22px;
  /*border-top-left-radius: 30px;*/
  /*border-top-right-radius: 30px;*/
  transform: rotate(45deg);
  background-color: #ebf2f0;
  border-style: solid;
  border-color: #e0e0e0;
  border-width: 2px;
}

.data_list_tip2 {
  position: absolute;
  transition: transform;
  z-index: 9999;
  width: 100px;
  height: 30px;
  right: 46px;
  top: -2px;
  background-color: #ebf2f0;
}

@media (min-width: 1025px) {
  .lessons {
    padding-top: 18px;
    padding-bottom: 18px;
    min-height: auto;

    .lesson_item {
      width: 400px;
      height: 300px;
      padding: 12px;
      margin: 16px;
      display: flex;
      border-radius: 16px;

      .lesson_item_title {
        font-size: 24px;
        padding-top: 0;
      }

      .user_to_poi_list {
        margin-top: 12px;
        margin-left: 12px;
        margin-right: 12px;
        flex-grow: 1;

        .user_to_poi_item {
          font-size: 22px;
        }
      }

      .video_list {
        margin-top: 8px;
        margin-bottom: 8px;
        padding-top: 4px;
        padding-bottom: 4px;

        .title {
          font-size: 26px;
          margin-bottom: 0px;
        }
      }

      .action_links {
        margin-top: 12px;
        padding-top: 8px;
        padding-bottom: 8px;
        height: auto;
      }
    }
  }
}
</style>
