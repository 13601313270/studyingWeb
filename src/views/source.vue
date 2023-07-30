<template>
  <div style="display:flex;flex-direction: column;">
    <div class="subjects">
      <div class="subjects_scroll" ref="subjectScroll">
        <text ref="start" key="start"></text>
        <div class="subjectScroll">
          <div
            :key="subject.id"
            v-for="subject in selectSourceList"
            @click="changeSubject(subject.id)"
            class="subjects_item"
          >
            <text :key="subject.id" :class="[selectSub===subject.id?'subjects_item_select':'']">{{subject.name}}</text>
          </div>
        </div>
        <div
            key="end"
            class="subjects_item_bottomBorder"
            ref="subjectBorder"
            :style="{left:selectSourceList.map(item=>item.id).indexOf(selectSub)*24+5+'vw'}"
        ></div>
      </div>
      <div class="subjects_set">
        <div @click="showSourceSelect=!showSourceSelect">
          <icon src="more" width="100" height="100"/>
        </div>
        <div class="subjects_set_list" v-if="showSourceSelect">
            <div v-for="subject in subjects" :key="subject.id" class="subjects_set_list_item">
                <text>{{subject.name}}</text>
                <Switch
                    :value="userSetSourceList.includes(subject.id)"
                    @input="(value)=>{chooseSetList(subject.id,value)}"
                />
            </div>
        </div>
      </div>
    </div>
    <scroller class="list">
      <div class="source_list" v-if="!loading">
        <div
          v-for="item in list"
          :key="item.id"
          class="source_item"
          @click="choose(item.id)"
        >
          <img class="source_item_img" style="width:100%" v-if="item.img"
                :src="item.img.replace('http://','https://')"/>
          <text class="source_item_title">{{item.name}}</text>
        </div>
      </div>
      <div class="loading" v-else>
          <text style="font-size:32px;">loading...</text>
          <Button style="margin-top: 100px;width:200px;" @click="refresh"
                      type="white">重新加载</Button>
      </div>
    </scroller>
  </div>
</template>
<script>
import request from '../plugin/request'
import localStorage from '../plugin/localStorage'
import Switch from '../components/switch'
import Button from '../components/Button.vue'

const userSetSourceListKey = 'saveSetSourceList';

export default {
  name: 'source',
  data() {
    return {
      subjects: [],
      userSetSourceList: [],
      showSourceSelect: false,
      selectSub: -1,
      list: [],
      loading: false
    }
  },
  async created() {
    this.subjects = await request.get('/subjectV2');
    const e = await localStorage.getItem(userSetSourceListKey);
    if (e === null) {
      this.userSetSourceList = [this.subjects[0].id];
    } else {
      if (typeof e === 'string') {
          this.userSetSourceList = JSON.parse(e);
      } else {
          this.userSetSourceList = e;
      }
    }
    const selectSub = await localStorage.getItem('sourceChoose')
    this.selectSub = +selectSub || this.subjects[0].id;
    this.refresh()

    // setTimeout(() => {
    //     const start = this.$refs['start'];
    //     if (start) {
    //         dom.scrollToElement(start, {
    //             offset: this.subjects.map(item => item.id).indexOf(this.selectSub) * 150
    //         })
    //     }
    // }, 100)
  },
  computed: {
    selectSourceList() {
      return this.subjects.filter(item => {
          return this.userSetSourceList.includes(item.id)
      })
    }
  },
  methods: {
    changeSubject(id) {
      this.selectSub = id;
      localStorage.setItem('sourceChoose', id)
      this.refresh();
    },
    async refresh() {
      this.loading = true;
      this.list = await request.get('/subjectSourceV2/' + this.selectSub);
      this.loading = false;
    },
    choose(id) {
      this.$router.push({path: '/source/' + id})
    },
    chooseSetList(id, value) {
      if (value) {
        if (!this.userSetSourceList.includes(id)) {
            this.userSetSourceList.push(id)
        }
      } else {
        if (this.userSetSourceList.includes(id)) {
          this.userSetSourceList.splice(this.userSetSourceList.indexOf(id), 1);
          if (!this.userSetSourceList.includes(this.selectSub)) {
            this.changeSubject(this.userSetSourceList[0])
          }
        }
      }
      localStorage.setItem(userSetSourceListKey, JSON.stringify(this.userSetSourceList));
    }
  },
  components: {
    Switch, Button
  }
}
</script>

<style scoped lang="less">
  .active {
    color: #00795c;
    border-bottom-style: solid;
    border-bottom-width: 4px;
    border-bottom-color: #00795c;
  }

  .noActive {
    color: rgba(0, 0, 0, 0.42);
  }

  .subjects {
    width: 750px;
    height: 100px;
    display: flex;
    flex-direction: row;
    border-bottom-color: #afafaf;
    border-bottom-width: 1px;
    border-bottom-style: solid;

    &_scroll {
      width: 650px;
      flex-direction: row;
      align-items: center;
      height: 100px;
      overflow-x: auto;
      position: relative;
      .subjectScroll {
        display: flex;
        flex-direction: row;
        height:100%;
        > div {
          flex-shrink: 0;
        }
      }
      &::-webkit-scrollbar {
        display: none; /* Chrome Safari */
      }
    }

    &_set {
      border-left-style: solid;
      border-left-color: #afafaf;
      border-left-width: 1px;
      width: 100px;
      height: 100px;
      position: relative;

      &_list {
        position: absolute;
        background-color: white;
        border-style: solid;
        border-width: 1px;
        border-color: #afafaf;
        top: 100px;
        right: 0;
        width: 300px;
        z-index: 100;
        padding: 20px;

        &_item {
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-direction: row;
          > text {
            font-size:32px;
          }
        }
      }
    }

    &_item {
      font-size: 42px;
      min-width: 120px;
      line-height: 70px;
      text-align: center;
      padding: 20px 30px;
      color: rgba(0, 0, 0, 0.42);

      &_select {
        color: #00795c;
      }

      &_bottomBorder {
        width: 100px;
        background-color: #00795c;
        height: 8px;
        bottom: 2px;
        border-radius: 4px;
        position: absolute;
        left: 0;
      }
    }
  }

  .list {
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    justify-content: center;
    overflow: auto;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.06);
  }

  .source_list {
    padding-top: 20px;
    padding-bottom: 100px;
    padding-left: 50px;
    width: 650px;
  }

  .source_item {
    text-align: left;
    flex-shrink: 0;
    margin-top: 20px;
    margin-bottom: 20px;
    border-radius: 18px;
    width: 650px;
    height: 420px;
    border-style: solid;
    border-color: #e0e0e0;
    border-width: 2px;
    background-color: white;
    box-sizing: border-box;
    position: relative;
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    overflow: hidden;

    &_title {
      font-size: 50px;
      background-color: rgba(255, 255, 255, 0.8);
      font-family: PingFangSC-Medium;
      color: #313131;
      text-align: center;
      position: absolute;
      padding: 3px 20px;
      border-radius: 14px;
      top: 24px;
      left: 24px;
    }

    &_img {
      opacity: 0.8;
    }
  }

  .loading {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 300px;
    padding-top: 50px;
  }
</style>
