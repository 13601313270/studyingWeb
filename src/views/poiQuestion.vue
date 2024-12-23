<template>
  <div class="content">
    <scroller class="item_list" v-if="!isCheck">
      <div class="item_list_item" v-for="(item, index) in question" :key="item.id"
        :style="{ borderColor: isCheck && item.answer !== chooseResult[index] ? 'red' : 'rgba(35, 80, 63, 0.1)', borderWidth: isCheck && item.answer !== chooseResult[index] ? '2px' : '1px' }">
        <text v-if="item.is_simple === 1" class="item_list_question">{{ item.question.replace(/&nbsp;/, ' ') }}</text>
        <div v-else class="item_list_question" v-html="item.question.replace(/http:\/\//g, 'https://')"></div>
        <div v-if="item.list && item.list.length">
          <div v-for="(itemQA, indexQA) in item.list" class="item_list_option_list" :class="{ check: isCheck }">
            <div v-html="itemQA.question"></div>
            <div v-for="(k) in Object.keys(itemQA.options).sort()" :key="k">
              <div class="question_option"
                :style="{ backgroundColor: { right: '#50ba5f', wrong: '#df473b', none: 'white', select: '#b0b0b0' }[optionColorMulti(item, index, indexQA, k)] }"
                @click="chooseOptionMulti(index, indexQA, k)">
                <text style="">{{ k + ' : ' }}</text>
                <text v-if="itemQA.is_simple === 1" style="line-height: 46px;font-size: 32px;flex:1">{{
                  itemQA.options[k] }}</text>
                <div v-else v-html="itemQA.options[k]" class="question_option_value"></div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="item_list_option_list" :class="{ check: isCheck }">
            <div v-for="(k) in Object.keys(item.options).sort()" :key="k">
              <div class="question_option"
                :style="{ backgroundColor: { right: '#50ba5f', wrong: '#df473b', none: 'white', select: '#b0b0b0' }[optionColor(item, index, k)] }"
                @click="chooseOption(index, k)">
                <text style="">{{ k + ' : ' }}</text>
                <text v-if="item.is_simple === 1" style="line-height: 46px;font-size: 32px;flex:1">{{ item.options[k]
                  }}</text>
                <div v-else v-html="item.options[k]" class="question_option_value"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </scroller>
    <div v-else class="item_list_check">
      <div class="item_list_check_allResult">
        <div v-if="!isOnlyLookResult">
          <div class="item_list_check_allResult_title">正确率：{{ rightCount / question.length * 100 + '%' }}</div>
        </div>
        <div class="item_list_check_allResult_item" v-for="(item, index) in question" :key="item.id"
          :style="checkSelectStyle(lookQaIndex, item, index)" @click="chooseLook(index)">
          <text class="number">{{ index + 1 }}</text>
          <!--                    <div v-if="index===lookQaIndex" class="item_list_check_allResult_item_plot"></div>-->
        </div>
      </div>
      <scroller class="scroller">
        <div>
          <div class="item_list_check_item_nav">
            <text class="item_list_check_item_title">题目:</text>
            <Button class="shareButton" @click="share(lookQuestion.id)" icon="share" text="分享此题目" />
          </div>
          <div class="item_list_check_item">
            <text v-if="lookQuestion.is_simple === 1" class="item_list_check_question">
              {{ lookQuestion.question.replace(/&nbsp;/, ' ') }}
            </text>
            <div v-else class="item_list_check_question"
              v-html="lookQuestion.question.replace(/http:\/\//g, 'https://')"></div>
            <div v-if="lookQuestion.list && lookQuestion.list.length">
              <div v-for="(lookQuestionQA, lookQuestionQAIndex) in lookQuestion.list">
                <div class="lookQuestionQAText" v-html="lookQuestionQA.question"></div>
                <div class="item_list_check_option_list" :class="{ check: isCheck }">
                  <div v-for="(k) in Object.keys(lookQuestionQA.options).sort()" :key="k">
                    <div class="question_option"
                      :style="{ backgroundColor: { right: '#50ba5f', wrong: '#df473b', none: 'white', select: '#b0b0b0' }[optionColorMulti(lookQuestion, lookQaIndex, lookQuestionQAIndex, k)] }"
                      @click="chooseOption(index, k)">
                      <span>{{ k + ' : ' }}</span>
                      <text v-if="lookQuestionQA.is_simple === 1" style="line-height: 46px;font-size: 32px;flex:1">{{
                        lookQuestion.options[k] }}</text>
                      <div v-else v-html="lookQuestionQA.options[k]" class="question_option_value"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <div class="item_list_check_option_list" :class="{ check: isCheck }">
                <div v-for="(k) in Object.keys(lookQuestion.options).sort()" :key="k">
                  <div class="question_option"
                    :style="{ backgroundColor: { right: '#50ba5f', wrong: '#df473b', none: 'white', select: '#b0b0b0' }[optionColor(lookQuestion, lookQaIndex, k)] }"
                    @click="chooseOption(index, k)">
                    <span>{{ k + ' : ' }}</span>
                    <text v-if="lookQuestion.is_simple === 1" style="line-height: 46px;font-size: 32px;flex:1">{{
                      lookQuestion.options[k] }}</text>
                    <div v-else v-html="lookQuestion.options[k]" class="question_option_value"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <text class="item_list_check_item_title">正确答案:</text>
            <text class="item_list_check_item_answer" v-if="lookQuestion.list && lookQuestion.list.length">
              {{ lookQuestion.list.map(v => v.answer).join('') }}
            </text>
            <text class="item_list_check_item_answer" v-else>{{ lookQuestion.answer }}</text>
          </div>
          <text v-if="lookQuestion.childPoi.length > 0" class="item_list_check_item_title">题型:</text>
          <div v-if="lookQuestion.childPoi.length > 0" class="item_list_check_item_poiTypeList">
            <childPoiButton v-for="childPoi in lookQuestion.childPoi" :child-poi="childPoi"
              style="margin-right: 10px;margin-bottom: 10px" />
          </div>
          <text class="item_list_check_item_title">解答:</text>
          <div v-if="isCheck" style="padding: 20px;">
            <div v-if="lookQuestion.list && lookQuestion.list.length">

              <div v-for="qaItem in lookQuestion.list">
                <div v-if="qaItem.explanation && qaItem.explanation.match(/https?:\/\//)">
                  <div @click="showImgDetail(qaItem.explanation)">
                    <pic style="margin-left: -18px;" :src="qaItem.explanation.replace('http://', 'https://')"
                      width="700" />
                  </div>
                </div>
                <div v-else>
                  <div v-html="qaItem.explanation" style="padding: 10px;"></div>
                </div>
              </div>
            </div>
            <div v-else-if="lookQuestion.explanation && lookQuestion.explanation.match(/https?:\/\//)">
              <div @click="showImgDetail(lookQuestion.explanation)">
                <pic style="margin-left: -18px;" :src="lookQuestion.explanation.replace('http://', 'https://')"
                  width="700" />
              </div>
            </div>
            <div v-else>
              <div v-html="lookQuestion.explanation" style="padding: 10px;"></div>
            </div>
          </div>
          <div class="shareBottom">
            <Button @click="share(lookQuestion.id)" icon="share" text="点击分享此题目，看看朋友们会不会？" />
          </div>
        </div>
      </scroller>
    </div>
    <div v-if="!isCheck" class="float">
      <div class="float_submit">
        <text class="count">{{ '已答题' + chooseResult.length + '/' + question.length }}</text>
        <Button class="button" text="直接看答案" @click="checkOptions" type="white" />
        <Button class="button" text="提交答案" @click="checkOptionsAndCheck" type="white" />
      </div>
    </div>
    <div class="imgFloat" v-if="floatImg" @click="floatImg = ''">
      <scroller scroll-direction="horizontal" style="width:750px;flex-direction:row;padding:10px;align-items: center;"
        @click="floatImg = ''">
        <image :src="floatImg" @click="floatImg = ''" resize="contain" :style="imgSizeInfo(floatImg)"
          @load="onImageLoad($event, floatImg)" />
      </scroller>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import childPoiButton from "../components/childPoiButton.vue";
import pic from '../components/icon';
import Button from "@/components/Button";
import request from '../plugin/request'
import share from '../plugin/share'
import { showImg } from '../plugin/imagePreview'

export default {
  name: 'poiQuestion',
  mounted() {
    this.chooseResult = [];
    this.isCheck = false;
    request.get('/poi/' + this.$route.params.id + '/question?page=' + this.$route.params.page + '&difficult=' + this.$route.params.difficult).then(data => {
      this.question = data;
    });
    // this.logAction('poiQuestion');
  },
  data() {
    return {
      question: [],
      chooseResult: [],
      isCheck: false,
      isOnlyLookResult: false,
      path: [],
      imgsSize: {},
      floatImg: '',
      lookQaIndex: 0,
      iOS: navigator.userAgent.includes('iPhone')
    }
  },
  computed: {
    rightCount() {
      let wrightCount = 0;
      this.question.forEach((item, key) => {
        if (item.list && item.list.length) {
          let isAllRight = true;
          item.list.forEach((v, index) => {
            if (!this.chooseResult[key] || v.answer !== this.chooseResult[key][index]) {
              isAllRight = false
            }
          })
          if (isAllRight) {
            wrightCount++;
          }
        } else {
          if (item.answer === this.chooseResult[key]) {
            wrightCount++;
          }
        }
      });
      return wrightCount;
    },
    lookQuestion() {
      return this.question[this.lookQaIndex]
    }
  },
  methods: {
    ...mapActions('main', ['setPath']),
    matchImg(content) {
      let match = content.match(/src=['|"]([^"|']+)['|"]/);
      if (content.slice(0, 5) === '<img ' && match) {
        return match[1]
      } else {
        return false;
      }
    },
    optionColor(item, index, k) {
      if (this.isCheck) {
        if (item.answer === k) {
          return 'right';//'green';
        } else if (this.chooseResult[index] === k) {
          return 'wrong';//'red';
        } else {
          return 'none';//'white';
        }
      } else {
        if (this.chooseResult[index] === k) {
          return 'select';//'grey';
        } else {
          return 'none';//'white';
        }
      }
    },
    optionColorMulti(item, index, indexQA, k) {
      if (this.isCheck) {
        if (item.list[indexQA].answer === k) {
          return 'right';//'green';
        } else if (this.chooseResult[index] && this.chooseResult[index][indexQA] === k) {
          return 'wrong';//'red';
        } else {
          return 'none';//'white';
        }
      } else {
        if (this.chooseResult[index] && this.chooseResult[index][indexQA] === k) {
          return 'select';//'grey';
        } else {
          return 'none';//'white';
        }
      }
    },
    chooseOption(index, k) {
      if (this.isCheck === false) {
        this.chooseResult[index] = k
      }
    },
    chooseOptionMulti(index, indexQA, k) {
      if (this.isCheck === false) {
        if (!this.chooseResult[index]) {
          this.chooseResult[index] = [];
        }
        this.chooseResult[index][indexQA] = k
      }
    },
    checkOptions() {
      this.isOnlyLookResult = true;
      if (this.isCheck === false) {
        this.isCheck = true;
      }
    },
    checkOptionsAndCheck() {
      this.isOnlyLookResult = false;
      if (this.isCheck === false) {
        this.isCheck = true;
        // request.post('/lesson/' + this.$route.params.id + '/question/check', {
        //     id: this.question.map(item => item.id),
        //     check: this.chooseResult
        // });
      }
    },
    gotoLesson() {
      this.$router.push('/lesson/' + this.$route.params.id + '/');
    },
    onImageLoad(event, src) {
      if (event.success) {
        this.imgsSize[src] = {
          naturalWidth: event.size.naturalWidth * 2,
          naturalHeight: event.size.naturalHeight * 2
        }
      }
    },
    imgSizeInfo(src) {
      let styleWidth = 650;
      if (this.imgsSize[src]) {
        return {
          width: this.imgsSize[src].naturalWidth + 'px',
          height: this.imgsSize[src].naturalHeight + 'px'
        };
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
    },
    showImgDetail(img) {
      showImg(img)
      // this.floatImg = img;
    },
    chooseLook(index) {
      this.lookQaIndex = index;
    },
    share(id) {
      const url = 'https://api.studying1v1.com/page/question/' + id
      share('题目', url, '高中试题分享')
    },
    checkSelectStyle(lookQaIndex, item, index) {
      let isAllRight = true;
      if (item.list && item.list.length) {
        if (!this.isOnlyLookResult) {
          item.list.forEach((v, index2) => {
            if (!this.chooseResult[index] || v.answer !== this.chooseResult[index][index2]) {
              isAllRight = false
            }
          })
        }
      } else {
        isAllRight = (item.answer === this.chooseResult[index] || this.isOnlyLookResult)
      }
      return {
        backgroundColor: index === lookQaIndex ? (
          isAllRight ? 'rgb(78,156,83)' : 'rgb(237,182,173)'
        ) : 'white',
        borderColor: isAllRight ? 'rgb(43,106,42)' : 'rgb(237,36,21)',
        color: isAllRight ? 'rgb(23,56,22)' : 'rgb(164,63,26)'
      }
    }
  },
  components: { Button, childPoiButton, pic }
}
</script>

<style scoped lang="less">
.content {
  display: flex;
  flex: 1;
  height: 100%;
  overflow: hidden;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.item_list {
  padding-bottom: 10px;
  flex: 1;
  width: 750px;
  overflow: auto;

  &_item {
    margin: 20px 0;
    background-color: rgba(35, 80, 63, 0.1);
    border-style: solid;
    border-color: rgb(169, 188, 181);
    border-width: 1px;
    border-radius: 18px;
    overflow: hidden;
    width: 710px;
    margin-left: 20px;
  }

  &_question {
    flex: 1;
    flex-wrap: wrap;
    font-size: 34px;
    color: #1d1d1d;
    padding: 15px;
  }

  &_option_list {
    display: flex;
    width: 670px;
    background-color: rgba(134, 180, 161, 0.3);
    padding: 20px;
    display: flex;
    flex-direction: column;

    >* {
      flex-grow: 1;
      cursor: pointer;
      padding: 5px;
      border-radius: 5px;

      &:hover {
        background-color: #c3d6e2;
      }

      &.select {
        background-color: #c3d6e2;
      }
    }

    &.check {
      >.select {
        background-color: #ff6f70;

        &.right {
          background-color: #a3cde2;
          border: solid 2px green;
        }
      }

      >.right {
        border: solid 2px green;
      }
    }
  }
}

.item_list_check {
  width: 750px;
  height: 100%;
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;

  &_allResult {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    background-color: #00795c;
    padding-top: 20px;
    padding-bottom: 10px;
    padding-left: 30px;

    &_title {
      color: white;
      width: 750px;
      margin-bottom: 20px;
    }

    &_item {
      text-align: center;
      position: relative;
      background-color: white;
      border-color: #6db769;
      color: #0b270b;
      border-radius: 10px;
      width: 60px;
      height: 60px;
      border-width: 4px;
      margin-right: 10px;
      margin-bottom: 10px;

      &_plot {
        position: absolute;
        bottom: 4px;
        left: 20px;
        width: 10px;
        height: 10px;
        border-radius: 5px;
        background-color: #525252;
      }

      .number {
        text-align: center;
        line-height: 60px;
        font-size: 30px;
      }
    }
  }

  .scroller {
    overflow: scroll;
  }

  &_item {
    width: 690px;
    margin-left: 32px;
    border-style: solid;
    border-color: rgb(169, 188, 181);
    border-width: 1px;
    border-radius: 5px;

    &_nav {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding-right: 28px;
      height: 100px;

      .shareButton {
        height: 60px;
      }
    }

    &_title {
      font-size: 36px;
      margin-top: 20px;
      margin-bottom: 10px;
      margin-left: 10px;
    }

    &_answer {
      margin-left: 32px;
      font-size: 36px;
    }

    &_poiTypeList {
      padding-top: 12px;
      padding-left: 32px;
      padding-right: 32px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center
    }
  }

  &_question {
    flex: 1;
    flex-wrap: wrap;
    margin: 4px;
    font-size: 34px;
    color: #1d1d1d;
    padding: 15px;
    width: 660px;
  }

  &_option_list {
    display: flex;
    background-color: rgba(134, 180, 161, 0.2);
    padding: 20px;
    flex-direction: column;

    >* {
      flex-grow: 1;
      cursor: pointer;
      padding: 5px;
      border-radius: 5px;

      &:hover {
        background-color: #c3d6e2;
      }

      &.select {
        background-color: #c3d6e2;
      }
    }

    &.check {
      >.select {
        background-color: #ff6f70;

        &.right {
          background-color: #a3cde2;
          border: solid 2px green;
        }
      }

      >.right {
        border: solid 2px green;
      }
    }
  }
}

.shareBottom {
  padding: 30px;
  margin-bottom: 130px;

  .button {
    height: 120px;
    padding: 0 13px;
  }
}

.float {
  left: 0;
  width: 750px;
  background-color: #b1bab7;
  border-bottom-style: solid;
  border-bottom-color: #6d7485;
  border-bottom-width: 1px;
  z-index: 111;

  &_submit {
    display: flex;
    padding: 11px 20px;
    height: 110px;
    flex-direction: row;
    align-items: center;

    .count {
      color: #0a1712;
      font-size: 36px;
      flex-grow: 1;
    }

    .button {
      margin-left: 5px;
    }
  }

  &_tools {
    height: 160px;
    padding: 11px 20px;
    text-align: center;
  }
}

.imgFloat {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(130, 133, 130, 0.75);
}

.question_option {
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  font-size: 32px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
}

.question_option_value {
  flex: 1;
  flex-wrap: wrap;
}

.lookQuestionQAText {
  margin-top: 12px;
  margin-left: 12px;
  margin-bottom: 8px;
  font-size: 32px;
}

@media (min-width: 1025px) {
  .item_list {
    :deep(.innerElement) {
      display: flex;
      flex-direction: column;
      align-items: center;

      .item_list_item {
        width: 600px;

        .item_list_question {
          font-size: 24px;
        }

        .item_list_option_list {
          width: 100%;
          box-sizing: border-box;

          .question_option {
            font-size: 24px;
          }
        }
      }
    }
  }

  .item_list_check {
    .item_list_check_allResult {
      .item_list_check_allResult_item {
        width: 40px;
        height: 40px;
        border-radius: 8px;

        .number {
          font-size: 24px;
          line-height: 40px;
        }
      }
    }

    .item_list_check_item_nav {
      height: 44px;

      .item_list_check_item_title {
        font-size: 24px;
        margin: 0;
      }

      .shareButton {
        height: 44px;
        display: none;
      }
    }

    .item_list_check_item {
      width: 600px;

      .item_list_check_question {
        width: 100%;
        font-size: 24px;
        box-sizing: border-box;
      }

      .item_list_check_option_list {
        padding: 8px;

        .question_option {
          font-size: 24px;
        }
      }
    }

    .item_list_check_item_title {
      font-size: 24px;
    }

    .item_list_check_item_answer {
      font-size: 24px;
    }

    .shareBottom {
      display: none;
    }
  }

  .float_submit {
    height: 40px;
    padding: 8px;

    .count {
      font-size: 24px;
    }
  }
}
</style>
