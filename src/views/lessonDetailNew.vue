<template>
  <Page title="课程详情" foot-active="source">
    <div class="home">
      <div v-for="layer in layers" style="flex:1;margin-bottom: 40px;">
        <div v-for="widget in layer" :style="widget.style"
          style="position: absolute;transition-property:left,top,opacity;display: flex" :key="widget.id">
          <image v-if="widget.type === 'image'" :src="widget.src" :style="imgSizeInfo(widget)"
            @load="onImageLoad($event, widget.src)" />
          <div v-else-if="widget.type === 'arrow'">
            <svg width="750" height="1125">
              <defs>
                <marker id="Triangle" viewBox="0 0 20 20" refX="0" refY="10" markerWidth="10" markerHeight="10"
                  orient="auto">
                  <path d="M 0 0 L 20 10 L 0 20 z" />
                </marker>
              </defs>
              <polyline :points="widget.x1 + ',' + widget.y1 + ' ' + widget.x2 + ',' + widget.y2" fill="none" stroke="black"
                stroke-width="4" marker-end="url(#Triangle)" />
            </svg>
          </div>
          <div class="question" v-else-if="widget.type === 'question'">
            <text class="question_title">请回答如下题目</text>
            <scroller class="question_content">
              <div v-for="(question, key) in questions" class="question_content_item"
                :style="{ borderColor: isCheckAnswer && question.answer !== questionAnswer[question.id] ? 'red' : 'rgb(169, 188, 181)', borderWidth: isCheckAnswer && question.answer !== questionAnswer[question.id] ? '2px' : '1px' }">
                <!--<p>{{question.id}}</p>-->
                <div class="question_content_item_title" v-html="question.question"></div>
                <!--<text>{{(key+1)+'、'+question.question.replace(/.{1}nbsp;/g,' ')}}</text>-->
                <text v-if="!['A', 'B', 'C', 'D'].includes(question.answer)">
                  <image style="border: solid 3px #ff8471" :src="question.answer" />
                </text>
                <div class="question_content_item_list">
                  <div v-for="(option, key2) in question.options" :key="key2" class="question_content_item_option"
                    :style="{ backgroundColor: { right: '#50ba5f', wrong: '#df473b', none: 'white', select: '#b0b0b0' }[optionColor(question, question.id, key2)] }"
                    @click="$set(questionAnswer, question.id, key2)">
                    <text>{{ key2 + ':' + option }}</text>
                  </div>
                </div>
                <div v-if="isCheckAnswer">
                  答案是：
                  <p>{{ question.answer }}</p>
                  <div v-if="question.explanation.match(/https?:\/\//)">
                    <image :src="question.explanation" resize="contain" :style="imgSizeInfo2(question.explanation)"
                      @load="onImageLoad($event, question.explanation)" />
                  </div>
                  <div v-else>
                    <div v-html="question.explanation" style="padding: 10px;"></div>
                  </div>
                </div>
              </div>
            </scroller>
            <div class="question_tools">
              <Button style="width: 300px;flex:0;" text="提交答案" @click="isCheckAnswer = true" type="white" />
              <Button style="width: 300px;flex:0;margin-left: 20px;" text="跳过"
                @click="isCheckAnswer = false, setTimeout = 0, play()" type="white" />
            </div>
          </div>
          <div v-else>
            <text :style="{ 'font-size': widget.fontSize + 'px' }">{{ widget.text }}</text>
          </div>
        </div>
      </div>
    </div>
    <div class="time">
      <div class="time_line">
        <div class="time_line_slip" :style="{ left: parseInt(runnedTime / endTime * 700 - 15) + 'px' }"></div>
      </div>
      <div class="time_tools">
        <div v-if="isPlaying === false" class="time_tools_action" @click="play" key="play">
          <pic width="50" height="50" src="play" style="margin-left: 30px;" />
        </div>
        <div @click="stop">
          <text class="time_tools_action" v-if="isPlaying === true" key="stop">||</text>
        </div>
        <text class="time_tools_num">{{ getStringTime(runnedTime) + '/' + getStringTime(endTime) }}</text>
      </div>
    </div>
  </Page>
</template>
<script>
import Button from '../components/Button.vue'
import request from '../plugin/request'
// const Nat = {
//     audio: require('../plugins/index')
// };
import pic from '../components/icon.vue';
import Page from '@/components/Page.vue';

// var modal = weex.requireModule('modal');
// modal.toast({
//     'message': JSON.stringify(index),
//     'duration': 2.0
// });

let vueObj;
export default {
  name: 'home',
  created() {
    vueObj = this;
    request.get('/lesson/' + this.$route.params.id + '/newDetail').then(({ content }) => {
      this.saveObjs = content.saveObjs;
      this.actions = content.actions;
    })
    this.logAction('lessonDetailNew');
  },
  data() {
    return {
      saveObjs: [],
      scroll: 0.5,
      secondWidth: 200,// 1秒钟是200宽度
      runnedTime: -1,//-1能触发0时间点绑定的事件
      actions: [],
      lineItem: new line(),
      setTimeout: 0,
      layers: [[]],
      dragObj: {},
      dragOffsetX: 0,// 被拖拽对象触发拖拽点的X位置
      preAction: null,
      questions: [],// 弹出的问题
      questionAnswer: {},// 用户选择的答案
      isCheckAnswer: false,// 是否提示答案
      imgsSize: {},
      isPlaying: false,// 是否正在播放
    }
  },
  methods: {
    optionColor(item, index, k) {
      if (this.isCheckAnswer) {
        if (item.answer === k) {
          return 'right';//'green';
        } else if (this.questionAnswer[index] === k) {
          return 'wrong';//'red';
        } else {
          return 'none';//'white';
        }
      } else {
        if (this.questionAnswer[index] === k) {
          return 'select';//'grey';
        } else {
          return 'none';//'white';
        }
      }
    },
    getStringTime(second) {
      let Newsecond = parseInt(Math.max(second, 0) / 1000);
      if (Newsecond < 60) {
        return '00:' + (Newsecond < 10 ? '0' : '') + Newsecond;
      } else {
        let mi = parseInt(Newsecond / 60);
        Newsecond = Newsecond % 60;
        return (mi < 10 ? '0' : '') + mi + ':' + (Newsecond < 10 ? '0' : '') + Newsecond;
      }

    },
    actionTimeActionStyle(key, action, obj) {
      let top = 0;//key * 22 + 21 + 'px';
      let marginLeft = (action.time - obj.time) / 1000 * this.secondWidth + 'px';
      if (action.action === 'showObject') {
        return {
          marginLeft,
          top,
          width: action.keepTime / 1000 * this.secondWidth + 'px'
        }
      } else if (action.animationDuration) {
        return {
          marginLeft,
          top,
          width: action.animationDuration / 1000 * this.secondWidth + 'px'
        }
      } else {
        return {
          marginLeft,
          top,
          right: 0
        }
      }
    },
    play() {
      this.isPlaying = true;
      let oldVal = this.runnedTime;
      let timeStamp = 20;
      this.runnedTime += timeStamp;
      let val = this.runnedTime;
      let allPromise = [];
      if (val > oldVal) {
        if (this.lineItem.actionList.length > 0 && val <= this.endTime) {
          for (let i = 0; i < this.lineItem.actionList.length; i++) {
            if (oldVal < this.lineItem.actionList[i].time && this.lineItem.actionList[i].time <= val) {
              let actionResult = this.lineItem.actionList[i].action();
              if (actionResult instanceof Promise) {
                allPromise.push(actionResult);
              }
            }
          }
        } else {
          return;
        }
      } else {
        this.rebuild();
        return;
      }

      Promise.all(allPromise).then(res => {
        if (this.setTimeout !== null) {
          this.setTimeout = setTimeout(this.play, timeStamp);
        }
      });
    },
    stop() {
      this.isPlaying = false;
      clearTimeout(this.setTimeout);
    },
    rebuild() {
      rebuilding = true;
      this.lineItem.clear();
      this.actions.forEach(item => {
        if (item.action === 'showObject') {
          this.lineItem.addEvent(item.time, item.time + item.keepTime, showObject(this.objs[item.obj], item.x, item.y, item.animation, item.animationDuration));
          if (item.keepTime) {
            this.lineItem.addEvent(item.time + item.keepTime, item.time + item.keepTime, hideObject(this.objs[item.obj]));
          }
        } else if (item.action === 'moveObject') {
          this.lineItem.addEvent(item.time, item.time + item.animationDuration, moveObject(this.objs[item.obj], item.x, item.y, item.animationDuration));
        } else if (item.action === 'hideObject') {
          this.lineItem.addEvent(item.time, item.time, hideObject(this.objs[item.obj]));
        }
      });
      this.objs.forEach(item => {
        item.hide();
      });
      this.layers = [[]];
      if (this.lineItem.actionList.length > 0 && this.runnedTime <= this.endTime) {
        for (let i = 0; i < this.lineItem.actionList.length; i++) {
          if (this.lineItem.actionList[i].time <= this.runnedTime && this.runnedTime <= this.lineItem.actionList[i].end) {
            this.lineItem.actionList[i].action();
          }
        }
      }
      rebuilding = false;
    },
    onImageLoad(event, src) {
      if (event.success) {
        this.$set(this.imgsSize, src, event.size);
      }
    },
    imgSizeInfo(widget) {
      let src = widget.src;
      if (this.imgsSize[src]) {
        if (widget.style && widget.style.width) {
          return {
            width: parseInt(widget.style.width) + 'px',
            height: (parseInt(widget.style.width) * this.imgsSize[src].naturalHeight / this.imgsSize[src].naturalWidth) + 'px'
          };
        } else {
          return {
            width: this.imgsSize[src].naturalWidth + 'px',
            height: this.imgsSize[src].naturalHeight + 'px'
          };
        }
      } else {
        if (widget.style && widget.style.width) {
          return {
            width: parseInt(widget.style.width) + 'px',
            height: '100px'
          };
        } else {
          return {
            width: '100px', height: '100px'
          };
        }
      }
    },
    imgSizeInfo2(src) {
      let styleWidth = 650;
      if (this.imgsSize[src]) {
        if (styleWidth) {
          return {
            width: parseInt(styleWidth) + 'px',
            height: (parseInt(styleWidth) * this.imgsSize[src].naturalHeight / this.imgsSize[src].naturalWidth) + 'px'
          };
        } else {
          return {
            width: this.imgsSize[src].naturalWidth + 'px',
            height: this.imgsSize[src].naturalHeight + 'px'
          };
        }
      } else {
        if (styleWidth) {
          return {
            width: parseInt(styleWidth) + 'px',
            height: '100px'
          };
        } else {
          return {
            width: '100px', height: '100px'
          };
        }
      }
    }
  },
  computed: {
    showObject() {
      if (this.preAction && this.preAction.action === 'preShowObject') {
        return [...this.actions.filter(item => {
          return item.action === 'showObject'
        }), this.preAction];
      } else {
        return this.actions.filter(item => {
          return item.action === 'showObject'
        });
      }
    },
    endTime() {
      return Math.max(...this.actions.map(item => {
        if (item.action === "showObject") {
          return parseInt(item.time) + parseInt(item.keepTime);
        } else if (item.animationDuration) {
          return parseInt(item.time) + parseInt(item.animationDuration);
        }
      }), 3000);
    },
    objs() {
      let objs = [];
      this.saveObjs.forEach((item, key) => {
        if (item.type === 'img') {
          objs.push(new img(item.src, item.width));
        } else if (item.type === 'text') {
          objs.push(new text(item.text, item.fontSize));
        } else if (item.type === 'arrow') {
          objs.push(new arrow(item.x1, item.y1, item.x2, item.y2));
        } else if (item.type === 'sound') {
          let newSound = new sound(item.text);
          objs.push(newSound);
          if (item.text === '') {
            let action = this.actions.find(ac => {
              return ac.obj === key && ac.action === 'showObject';
            });
            action.keepTime = 10;
            newSound.href = '';
          } else {
            request.post('/audioInfo', {
              text: item.text
            }).then(info => {
              let action = this.actions.find(ac => {
                return ac.obj === key && ac.action === 'showObject';
              });
              action.keepTime = parseInt(info.info.playtime_seconds * 10)
              newSound.href = info.url;
            });
          }
        } else if (item.type === 'emoticon') {
          objs.push(new emoticon(item.emotion, item.width));
        } else if (item.type === 'question') {
          objs.push(new question(item.poi));
        } else {
          console.trace('没有此类型')
        }
      });
      return objs;
    }
  },
  watch: {
    runnedTime(val, oldVal) {
    },
    actions: {
      handler(vals) {
        this.rebuild();
      },
      deep: true,
      immediate: true
    },
    objs: {
      handler(vals) {
        this.rebuild();
      },
      deep: true
    }
  },
  destroyed() {
    // Nat.audio.stop();
    clearTimeout(this.setTimeout);
    this.setTimeout = null;
  },
  components: { Button, pic, Page }
};

class line {
  constructor() {
    this.actionList = [];
  }

  addEvent(time, end, action) {
    this.actionList.push({
      time, end, action
    })
  }

  clear() {
    this.actionList = [];
  }
}

class obj {
  constructor() {
    this.id = parseInt(Math.random() * 1000000);
  }

  begin() {
  }

  end() {
  }
}

class showObj extends obj {
  constructor() {
    super();
  }

  show(x, y, type, speed, props) {
    if (!vueObj.layers[0].find(item => {
      return item.id === this.id;
    })) {
      let newVueObj = Object.assign(
        { id: this.id },
        props,
        {
          style: Object.assign({
            left: x + 'px',
            top: y + 'px',
            transitionDuration: 0
          }, props.style)
        },
      );
      if (type === 'fadeIn') {
        newVueObj.style.opacity = 0;
        newVueObj.style.transitionDuration = (speed * 0.6) + 'ms';
      }
      vueObj.layers[0].push(newVueObj);
      vueObj.$nextTick(() => {
        newVueObj.style.opacity = 1;
      });
    }
  }

  hide() {
    let index = vueObj.layers[0].findIndex(item => {
      return item.id === this.id;
    });
    if (index > -1) {
      vueObj.layers[0].splice(index, 1);
    }
  }

  setStyle(style) {
    let index = vueObj.layers[0].findIndex(item => {
      return item.id === this.id;
    });
    if (index > -1) {
      for (let i in style) {
        vueObj.$set(vueObj.layers[0][index].style, i, style[i]);
      }
    }
  }
}

class img extends showObj {
  constructor(src, width) {
    super(src);
    this.src = src;
    this.width = width;
  }

  show(x, y, type, speed) {
    super.show(x, y, type, speed, {
      type: 'image',
      src: this.src,
      style: {
        width: this.width + 'px'
      }
    });
  }

}

class emoticon extends showObj {
  constructor(type, width) {
    super(type);

    if (type === '?') {
      this.src = "http://yingshijiaoyuimg.oss-cn-beijing.aliyuncs.com/f6f142c0957cc37d728bed8c9d5c31e7.png";
    } else {
      console.error('未知类型');
    }
    this.width = width;
  }

  show(x, y, type, speed) {
    super.show(x, y, type, speed, {
      type: 'image',
      src: this.src,
      style: {
        width: this.width + 'px'
      }
    });
  }
}

class question extends showObj {
  constructor(poi) {
    super(poi);
    this.poi = poi;
  }

  show(x, y, type, speed) {
    super.show(35, 35, type, speed, {
      type: 'question',
      poi: this.poi,
      style: {
        right: '35px',
        bottom: '200px'
      }
    });
    request.get('/poi/' + this.poi + '/lessonQuestion').then(questions => {
      vueObj.questions = questions;
    });
    clearTimeout(vueObj.setTimeout);
    vueObj.setTimeout = null;
  }
}

class text extends showObj {
  constructor(text, fontSize) {
    super(text);
    this.text = text;
    this.fontSize = fontSize;
  }

  show(x, y, type, speed) {
    super.show(x, y, type, speed, {
      type: 'text',
      text: this.text,
      fontSize: this.fontSize
    });
  }
}

class arrow extends showObj {
  constructor(x1, y1, x2, y2) {
    super(x1, y1, x2, y2);
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }

  show(x, y, type, speed) {
    super.show(x, y, type, speed, {
      type: 'arrow',
      x1: this.x1,
      y1: this.y1,
      x2: this.x2,
      y2: this.y2
    });
  }
}

let rebuilding = false;

class sound extends showObj {
  constructor(text) {
    super(text);
    this.text = text;
    this.href = '';
  }

  show(x, y, type, speed) {
    if (!rebuilding) {
      return new Promise((resolve, reject) => {
        // Nat.audio.play(this.href, (err) => {
        //     if(err === null) {
        //         resolve();
        //     } else {
        //         reject();
        //     }
        // });
      });
    }
  }

  hide() {
    if (!rebuilding) {
      // Nat.audio.stop();
    }
  }
}

function showObject(obj, x, y, type, speed) {
  return function () {
    return obj.show(x, y, type, speed);
  }
}

function moveObject(obj, x, y, speed) {
  return function () {
    obj.setStyle({
      left: x + 'px',
      top: y + 'px',
      transitionDuration: (speed * 0.6) + 'ms'
    });
  }
}

function hideObject(obj) {
  return function () {
    obj.hide();
  }
}
</script>
<style scoped lang="less">
.home {
  width: 750px;
  flex: 1;
}

.question {
  /*background-color: #ffffff;*/
  background-color: rgba(255, 255, 255, 0.93);
  border-style: solid;
  border-width: 1px;
  border-color: #000000;
  border-radius: 10px;
  height: 100%;
  flex: 1;
  padding: 10px;

  &_title {
    text-align: center;
    width: 680px;
    font-size: 50px;
    line-height: 80px;
    margin-top: 30px;
  }

  &_content {
    /*height: 900px;*/
    font-size: 30px;
    height: 100%;
    margin-top: 20px;
    margin-bottom: 20px;

    &_item {
      padding: 20px;
      margin: 20px 0;
      background-color: rgba(35, 80, 63, 0.1);
      border-style: solid;
      border-color: rgb(169, 188, 181);
      border-width: 1px;
      border-radius: 5px;

      &_title {
        padding: 15px;
      }

      &_list {
        display: flex;
        width: 640px;
        background-color: rgba(134, 180, 161, 0.3);
        padding: 20px;
      }

      &_option {
        padding: 2px 5px;
        cursor: pointer;
        border-radius: 5px;
        margin-bottom: 5px;
        background-color: #ffffff;

        &.active {
          background-color: #aeb6ad;
          border-radius: 5px;
          font-weight: bold;
        }

        &.a_right {
          background-color: rgba(67, 128, 59, 0.6);
        }

        &.error {
          background-color: red;
        }
      }
    }
  }

  &_tools {
    display: flex;
    flex-direction: row;
    width: 680px;
    align-items: center;
    justify-content: center;
  }
}


.time {
  position: absolute;
  bottom: 0;
  display: flex;
  flex-direction: column;
  width: 750px;
  height: 280px;
  padding-top: 120px;
  background-image: linear-gradient(to top, rgb(0, 0, 0), rgba(255, 255, 255, 0));
  /*background-color: rgba(51, 119, 94, 1);*/

  &_line {
    width: 700px;
    height: 5px;
    background-color: #33775e;
    margin-left: 25px;
    position: relative;
    z-index: 11;

    &_slip {
      position: absolute;
      z-index: 111;
      width: 30px;
      height: 30px;
      border-radius: 15px;
      margin-top: -12px;
      background-color: rgb(220, 110, 98);
      border-style: solid;
      border-color: white;
      border-width: 3px;
    }
  }

  &_tools {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-top: 20px;

    &_action {
      width: 100px;
      height: 60px;
      margin-left: 20px;
      /*background-color: #de7444;*/
      border-radius: 30px;
      text-align: center;
      line-height: 50px;
      cursor: pointer;
      font-size: 40px;
      color: white;
    }

    &_num {
      height: 60px;
      line-height: 60px;
      font-size: 35px;
      color: white;
      margin-left: 20px;
    }
  }
}
</style>
