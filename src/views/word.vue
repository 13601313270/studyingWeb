<template>
  <div class="content">
    1
    <div class="index">
      2
      <text v-if="!todayFinish" style="color:white;font-family: iconfont;">今日剩余：{{ allWords.length }}</text>
      <text v-else> </text>
      <text style="color:white;font-family: iconfont;" v-if="Math.abs(knowWordCount[0] - knowWordCount[1]) < 50">您的词汇量：{{
        parseInt(knowWordCount) }}</text>
      <text style="color:white;font-family: iconfont;" v-else>您的词汇量：{{ parseInt(knowWordCount[0]) }}~{{
        parseInt(knowWordCount[1]) }}</text>
    </div>
    <div class="word" v-if="!todayFinish">
      3
      <text class="word1">单词序：{{ word.numIndex }}</text>
      <text class="word2">{{ word.word }}</text>
      <div style="display: flex;flex-direction: row;justify-content: center;align-items: center;margin-top: 50px;">
        <text style="color:white;font-size: 35px" v-if="info.ph_en" @click="play(info.ph_en_mp3)">英：{{ info.ph_en
        }}</text>
        <span v-if="info.en_mp3" @click="play(info.en_mp3)">
          <Icon src="play_white" width="60" />
        </span>
        <text style="color:white;font-size: 35px;margin-left: 20px;" v-if="info.ph_am" @click="play(info.ph_am_mp3)">美：{{
          info.ph_am }}</text>
        <span v-if="info.am_mp3" @click="play(info.am_mp3)">
          <Icon src="play_white" width="60" />
        </span>
      </div>
    </div>
    <scroller class="answer">
      4
      <div v-if="todayFinish" class="todayFinish">
        <text class="todayFinishText">今天完成</text>
        <text class="todayFinishText">Celebrate</text>
        <image src="https://yingshijiaoyusystem.oss-cn-beijing.aliyuncs.com/celebrate.png"
          style="width: 400px;height:400px;margin-left: 150px;" />
        <text class="todayFinishInfo" style="margin-top: 30px;">今天复习单词{{ allWordsCount }}个</text>
        <text class="todayFinishInfo">遇到生词{{ Object.keys(collection).length }}个</text>
      </div>
      <div v-else style="flex:1">
        <div v-if="showTransform">
          <text style="color:white;font-size: 38px;font-family: iconfont;" v-for="item in info.meaning">{{ item.part }}{{
            item.means.join(';') }}</text>
          <!--<text style="color:white;">麦田</text>-->
        </div>
        <text v-else class="showAnswer" @click="showTransform = true"
          style="width: 700px;font-family: iconfont;">想好答案后，点击屏幕验证</text>
      </div>
    </scroller>
    <div v-if="showTransform && !todayFinish" class="tools">
      <Button text="不认识" class="dontKnow" @wxcButtonClicked="dontKnow" />
      <Button text="认识" class="knowAction" @wxcButtonClicked="knowAction" />
    </div>
    <div class="word_test" v-if="showTestTransform"
      :style="{ backgroundColor: UserInterfaceStyle === 1 ? '#191919' : 'white' }">
      5{{ checkShowWord }}
      <div v-if="checkShowWord" style="display: flex;flex-direction: column;flex:1;">
        <div class="testContent">
          <text class="word_test_tips">第一次进入，将要进行测试，校验你的词汇量。大约需要10分钟，150个单词左右。</text>
          <div style="display: flex;flex-direction: row;justify-content: space-between">
            <text style="color:white;font-family: iconfont;">已测单词数:{{ testedWordCount }}</text>
            <text style="color:white;font-family: iconfont;">评估词汇量:{{ testedWordCount > 20 ? (parseInt(youWordCount[0]) +
              '~' + parseInt(youWordCount[1])) : '样本太少' }}</text>
          </div>
          <div class="testCollectionList">
            <div v-for="(item, key) in testCollectionForecast" class="testCollectionItem"
              :style="{ bottom: '-1px', left: key * 710 / testDrawConfig.stepCount + 20 + 'px', height: parseInt((item.right / item.count) * 145) + 4 + 'px' }">
            </div>
          </div>
          <div class="testCollectionList2">
            <div v-for="item in testDrawConfig.stepCount" style="width: 100px;position: absolute;"
              :style="{ left: (item - 1) * 710 / testDrawConfig.stepCount + 20 + 'px', height: '3px' }">
              <text style="color:white;font-size: 24px;font-family: iconfont;">{{ getStrByNumber(item *
                testDrawConfig.stepWord) }}</text>
            </div>
          </div>
        </div>
        <div class="finish">
          <div style="flex: 1;">
            <text v-if="!testCollectionFinish" class="word_test_word"
              :style="{ color: UserInterfaceStyle === 1 ? 'white' : 'black' }">{{ checkShowWord }}</text>
            <div v-if="testCollectionFinish">
              <text class="word_test_word_result_tip" style="text-align: center;font-size: 40px;"> </text>
              <text class="word_test_word_result_tip"
                :style="{ color: UserInterfaceStyle === 1 ? 'white' : 'black' }">您的单词量评估测试完成</text>
              <text class="word_test_word_result_tip"
                :style="{ color: UserInterfaceStyle === 1 ? 'white' : 'black' }">评估词汇量：{{ parseInt(youWordCount[0]) }}~{{
                  parseInt(youWordCount[1]) }}</text>
              <text class="word_test_word_result_tip"
                :style="{ color: UserInterfaceStyle === 1 ? 'white' : 'black' }">词汇量近似值：{{ parseInt((youWordCount[0] +
                  youWordCount[1]) / 2) }}</text>
              <text class="word_test_word_result_tip"
                style="font-size: 28px;color:#535353;">随着每天使用App背单词，系统评估的词汇量会越来越精确</text>
            </div>
            <div v-else-if="showTestMeaningWord" style="flex:1">
              <div
                style="display: flex;flex-direction: row;justify-content: center;align-items: center;margin-bottom: 50px;">
                <text v-if="testWordInfo.ph_en" :style="{ color: UserInterfaceStyle === 1 ? 'white' : 'black' }"
                  @click="play(testWordInfo.en_mp3)">英：{{ testWordInfo.ph_en }}</text>
                <span v-if="testWordInfo.en_mp3" @click="play(testWordInfo.en_mp3)">
                  <Icon src="play" width="60" />
                </span>
                <text v-if="testWordInfo.ph_am" style="margin-left: 50px;" @click="play(testWordInfo.am_mp3)"
                  :style="{ color: UserInterfaceStyle === 1 ? 'white' : 'black' }">美：{{ testWordInfo.ph_am }}</text>
                <span v-if="testWordInfo.am_mp3" @click="play(testWordInfo.am_mp3)">
                  <Icon src="play" width="60" />
                </span>
              </div>
              <scroller style="flex:1">
                <!--<text style="font-family: iconfont;">英:[{{testWordInfo.ph_en}}]  美:[{{testWordInfo.ph_am}}]</text>-->
                <text style="font-family: iconfont;" v-for="item in testWordInfo.meaning"
                  :style="{ color: UserInterfaceStyle === 1 ? 'white' : 'black' }">{{ item.part }}{{ item.means.join(';')
                  }}</text>
              </scroller>
            </div>
            <text v-else @click="getTestWordInfo" :style="{ color: UserInterfaceStyle === 1 ? 'white' : 'black' }"
              style="flex: 1;text-align: center;padding-top: 200px;font-family: iconfont;">点击屏幕验证</text>
          </div>
          <div v-if="testCollectionFinish">
            <Button text="开启我的背单词计划" style="width: 710px;" class="dontKnow" @wxcButtonClicked="beginPlan" />
          </div>
          <div class="tools" v-else-if="showTestMeaningWord">
            <Button text="不认识" class="dontKnow" @wxcButtonClicked="checkDontKnow" />
            <Button text="认识" class="knowAction" @wxcButtonClicked="checkKnowAction" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import sqlClass from '@/plugin/sql'
import { mapGetters } from 'vuex'
import request from '../plugin/request'
import Button from '../components/Button'
import Icon from '../components/icon'
import { play, pause } from '../plugin/audio'
import storage from '../plugin/localStorage.ts'
var gDaySleep = 0

function getTimeStr(sleep = 0) {
  let time = new Date()
  time.setTime(time.getTime() + 86400000 * (sleep + gDaySleep))
  let year = time.getYear() + 1900
  let month = time.getMonth() + 1
  if (month < 10) {
    month = '0' + month
  }
  let day = time.getDate()
  if (day < 10) {
    day = '0' + day
  }
  return year + '-' + month + '-' + day
}

let fineTimeStep = 999999// 代表永远记住的时间位
let timeSteps = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 21, 30, 60, 90, 180, 360, fineTimeStep]
let CheckResolve = null

export default {
  name: 'word',
  data() {
    return {
      allWords: [],
      allWordsCount: 0,
      showTransform: false,
      word: {},
      collection: {},
      info: {},// 金山词霸的远程翻译信息
      todayFinish: false,
      knowWordCount: [0, 0],// 全局词汇量计算值
      checkShowWord: '',
      showTestTransform: false,
      showTestMeaningWord: false,
      testWordInfo: {},
      testedWordCount: 0,
      testCollection: {},
      testCollectionFinish: false,
      testDrawConfig: {
        stepWord: 500,
        stepCount: 8
      },
      wordRecordWords: [],// 目前记录里所有的单词对应的word的id信息
      asdf: ''
    }
  },
  async created() {
    let option = new sqlClass('option')
    if ((await option.select('select count(*) as count from option where name="wordTestFinish"'))[0].count === 0) {
      this.showTestTransform = true
      await this.initWords();
      this.getTestWords()
    } else {
      this.init()
    }
  },
  methods: {
    async init() {
      await this.updateWordKnowCount()
      let temp = 0//这个组的单词熟悉率为90%
      Object.keys(this.wordRecordWords[2]).sort().forEach(key => {
        if (this.wordRecordWords[2][key] / (this.wordRecordWords[2][key] + (this.wordRecordWords[3][key] ? this.wordRecordWords[3][key] : 0)) > 0.9) {
          temp = parseInt(key)
        }
      })
      // this.asdf = temp + ';'
      this.collection = {}
      let recordApi = new sqlClass('wordRecord')
      let wordTimeRecord = new sqlClass('wordTimeRecord')
      // 每天需要复习+新学的词汇
      let option = new sqlClass('option')
      let config = await option.select('select * from option where name="perDay"')
      let perDay = parseInt(config[0].val)
      // 检验日期
      let todayHasRecord = await wordTimeRecord.select('select count(*) as count from wordTimeRecord where `date`="' + getTimeStr() + '"')
      if (todayHasRecord[0].count === 0) {
        await wordTimeRecord.insert({
          date: getTimeStr(),
          wordCount: perDay,
          know: 0,
          dontKnow: 0
        })

        // 从数据库里提取，今日应该背诵的单词
        let todayRecord = await wordTimeRecord.select('select * from wordTimeRecord where `date`="' + getTimeStr() + '"')
        if (todayRecord[0].wordCount === todayRecord[0].know + todayRecord[0].dontKnow) {
          this.todayFinish = true
        } else {
          this.todayFinish = false
          let todayNeedsWords = await recordApi.select('select word from wordRecord where showTime <="' + getTimeStr() + '" order by showTime limit ' + perDay)
          if (todayNeedsWords.length < perDay) {
            let todayNeed = perDay - todayNeedsWords.length
            // 需要补充词汇
            let leftWordNeed = todayNeed > 4 ? parseInt(todayNeed / 4) : 0// 抽查>90%区间的个别单词

            let centerSlip = (temp + 1) * this.testDrawConfig.stepWord
            let centerSlip2 = temp * this.testDrawConfig.stepWord
            // this.asdf = centerSlip + '|' + centerSlip2 + ';'
            let api = new sqlClass('word')
            let appendNewWord = await api.select('select word from word where word not in (select word from wordRecord) order by `id` limit ' + centerSlip + ',' + (todayNeed - leftWordNeed))
            for (let i = 0; i < appendNewWord.length; i++) {
              let item = appendNewWord[i]
              await recordApi.insert({
                word: item.word,
                deep: 0,
                showTime: getTimeStr()
              })
            }
            let appendNewWord2 = await api.select('select word from word where word not in (select word from wordRecord) order by `id` limit ' + centerSlip2 + ',' + leftWordNeed)
            for (let i = 0; i < appendNewWord2.length; i++) {
              let item = appendNewWord2[i]
              await recordApi.insert({
                word: item.word,
                deep: 0,
                showTime: getTimeStr()
              })
            }
          }
        }
        this.allWords = await recordApi.select('select word,deep from wordRecord where showTime <="' + getTimeStr() + '" order by showTime asc limit ' + perDay)

        this.allWordsCount = this.allWords.length
        await this.saveStates()
        this.getWordInfo()
        this.updateWordKnowCount()
      } else {
        // 今天已经打开了背单词
        storage.getItem('wordsTimeStamp').then((data) => {
          this.allWords = JSON.parse(data.data).allWords
          this.collection = JSON.parse(data.data).collection
          this.allWordsCount = JSON.parse(data.data).allWordsCount
          this.getWordInfo()
          this.updateWordKnowCount()
        })
        let todayRecord = await wordTimeRecord.select('select * from wordTimeRecord where `date`="' + getTimeStr() + '"')
        if (todayRecord[0].wordCount === todayRecord[0].know + todayRecord[0].dontKnow) {
          this.todayFinish = true
        }
      }
    },
    async getTestWords() {
      this.testedWordCount = 0
      let step = this.testDrawConfig.stepWord
      this.testCollection = {}
      let times = 0
      let perSearch = 5
      let pageSteps = [0, 1, 2, 3, 4, 5, 6, 7]

      while (times < 10) {
        times++
        // countStep: 12//6租，也就是测试总共6000个单词
        for (let i = 0; i < pageSteps.length; i++) {
          let page = pageSteps[i]
          this.testDrawConfig.stepCount = Math.max(this.testDrawConfig.stepCount, page + 1)
          let wordApi = new sqlClass('word')
          let sqlStr = 'select * from word where id<' + ((page + 1) * step) + ' and id>' + (page * step) + ' order by RANDOM() limit ' + times * perSearch + ',' + perSearch
          // let sqlStr = 'select * from word limit ' + times * perSearch + ',' + perSearch

          let list = await wordApi.select(sqlStr)
          for (let i = 0; i < list.length; i++) {
            let item = list[i]
            this.showTestMeaningWord = false
            this.testWordInfo = {}
            let thisWordGroup = parseInt((item.id - 1) / step)
            if (this.testCollection[thisWordGroup] === undefined) {
              this.testCollection[thisWordGroup] = {
                count: 0,
                right: 0
              }
            }
            if (this.testCollection[thisWordGroup].count > 30) {
              break
            }
            let temp = await this.checkWord(item)

            // this.beginPlan();
            this.testCollection[thisWordGroup].count++
            if (temp) {
              this.testCollection[thisWordGroup].right++
            }
            this.testedWordCount++
          }
        }
        // 检查最后一个是不是找到最低点，超过10000不再检查
        if (pageSteps[pageSteps.length - 1] < 10000 / step) {
          let last = this.testCollection[pageSteps[pageSteps.length - 1]]
          if (last.right / last.count > 0.4) {
            pageSteps.push(pageSteps[pageSteps.length - 1] + 1)
          }
        }
        // 检查第一个是不是找到最低点
        if (pageSteps[0] > 0) {
          let first = this.testCollection[pageSteps[0]]
          if (first.count > 20 && first.right / first.count < 0.9) {
            pageSteps.unshift(pageSteps[0] - 1)
          }
        }
      }
      this.testCollectionFinish = true
    },
    initWords() {
      return new Promise(async (resolve) => {
        this.firstLoading = true
        //加载单词

        let wordApi = new sqlClass('word')

        const exist = await wordApi.select('select count(*) as count from word')
        if (exist[0].count > 0) {
          resolve()
          return;
        }
        let allWord = await request.get('/en/word/initAll')
        let self = this
        function temp(begin, end) {
          self.$nextTick(async () => {
            self.importWord = '(' + (begin + 1) + '/' + allWord.length + ')'
            let insertList = []
            for (let i = begin; i <= end && i < allWord.length - 1; i++) {
              let word = allWord[i]
              insertList.push({
                word: word.word,
                count: word.count,
                translate: ''
              })
            }

            try {
              await wordApi.insert.apply(wordApi, insertList)
              resolve();
              // if (end < allWord.length - 1) {// end < allWord.length - 1 会在某一个值有bug
              //   // return temp(end + 1, end + 21)
              // } else {
              //   self.firstLoading = false
              //   resolve()
              // }
            } catch (e) {
              // return temp(end + 1, end + 21)
            }
          })
        }

        temp(0, 20)
      })
    },
    checkWord(word) {
      return new Promise(resolve => {
        this.checkShowWord = word.word
        CheckResolve = resolve
        request.get('/en/word/info/' + this.checkShowWord).then(res => {
          this.testWordInfo = res
        })
      })
    },
    checkDontKnow() {
      let recordApi = new sqlClass('wordRecord')
      recordApi.insert({
        word: this.checkShowWord,
        deep: 1,
        showTime: getTimeStr()
      })
      CheckResolve(false)
    },
    checkKnowAction() {
      let recordApi = new sqlClass('wordRecord')
      recordApi.insert({
        word: this.checkShowWord,
        deep: fineTimeStep,
        showTime: '9999-12-31'
      })
      CheckResolve(true)
    },
    saveStates() {
      return new Promise((resolve) => {
        storage.setItem('wordsTimeStamp', JSON.stringify({
          allWords: this.allWords,
          collection: this.collection,
          allWordsCount: this.allWordsCount
        })).then(() => {
          resolve()
        })
      })
    },
    nextDay() {
      gDaySleep++
      this.init()
    },
    async getWordInfo() {
      this.showTransform = false
      this.word = this.allWords[0]
      let wordApi = new sqlClass('word')
      wordApi.select('select id from word where word="' + this.word.word + '"').then(res => {
        this.word.numIndex = res[0].id
      })

      let self = this
      this.info = {}

      request.get('/en/word/info/' + this.word.word).then(res => {
        self.info = res
      })
    },
    async knowAction() {
      let newObj = this.allWords.shift()
      if (this.collection[newObj.word] !== undefined) {
        this.collection[newObj.word]--
        if (this.collection[newObj.word] > 0) {
          let temp = this.collection[newObj.word] * 2
          this.allWords.splice(Math.min(temp, this.allWords.length - 1), 0, newObj)
        } else {
          // 今天错过，但是确认今天记住了，今天不再测试
          // delete this.collection[newObj.word]
        }
      } else {
        let recordApi = new sqlClass('wordRecord')
        // 今天这个词没有错过，第一次见到就通过
        if (newObj.deep === 0) {
          // 补充新增词汇，第一次见到就通过
          this.wordRecordWords = []
          await recordApi.select('update wordRecord set showTime="9999-12-31",deep=' + fineTimeStep + ' where word ="' + newObj.word + '"')
        } else {
          // 历史忘记过，但是今天第一次见到就认识通过
          if (timeSteps.indexOf(newObj.deep) > -1) {
            if (timeSteps[timeSteps.indexOf(newObj.deep) + 1]) {
              let nextDeep = timeSteps[timeSteps.indexOf(newObj.deep) + 1]
              await recordApi.select('update wordRecord set showTime="' + getTimeStr(nextDeep) + '",deep=' + nextDeep + ' where word ="' + newObj.word + '"')
            }
          }
        }
        let wordTimeRecord = new sqlClass('wordTimeRecord')
        await wordTimeRecord.select('update wordTimeRecord set know=know+1 where `date`="' + getTimeStr() + '"')
      }
      await this.saveStates()
      if (this.allWords.length === 0) {
        this.word = {}
        this.info = {}
        this.todayFinish = true
      } else {
        this.getWordInfo()
      }
      this.updateWordKnowCount()
    },
    async dontKnow() {
      let recordApi = new sqlClass('wordRecord')
      let length = this.allWords.length
      let newObj = this.allWords.shift()
      if (this.collection[newObj.word] === undefined) {
        let wordTimeRecord = new sqlClass('wordTimeRecord')
        await wordTimeRecord.select('update wordTimeRecord set dontKnow=dontKnow+1 where `date`="' + getTimeStr() + '"')
        await recordApi.select('update wordRecord set showTime="' + getTimeStr(1) + '",deep=1 where word ="' + newObj.word + '"')
      }

      // select * from word order by `count` desc limit 10
      // api.select('update word set');
      let interval = Math.min(3, length)
      if (length - interval < 2) {
        this.collection[newObj.word] = 1
      } else if (length - interval < 3) {
        this.collection[newObj.word] = 2
      } else {
        this.collection[newObj.word] = 3
      }
      this.allWords.splice(interval, 0, newObj)
      await this.saveStates()
      this.getWordInfo()
      this.updateWordKnowCount()
    },
    async updateWordKnowCount() {
      let recordApi = new sqlClass('wordRecord')

      let knowWordCount = [0, 0]
      for (let i = 0; i < timeSteps.length; i++) {
        let num = timeSteps[i]
        let temp = 0
        if (num > 999) {
          let step = this.testDrawConfig.stepWord
          temp = await recordApi.select('select count(word) as count from wordRecord where deep>999')
          if (this.wordRecordWords.length === 0) {
            let word = new sqlClass('word')
            let temp1 = await word.select('select id,word from word where word in (select word from wordRecord where deep>999) order by id')
            let writeCollection = {}
            temp1.forEach(item => {
              let thisWordGroup = parseInt((item.id - 1) / step)
              if (writeCollection[thisWordGroup] === undefined) {
                writeCollection[thisWordGroup] = 0
              }
              writeCollection[thisWordGroup]++
            })
            let temp2 = await word.select('select id,word from word where word in (select word from wordRecord where deep<=999 and deep>0)')
            let collection = {}
            temp2.forEach(item => {
              let thisWordGroup = parseInt((item.id - 1) / step)
              if (collection[thisWordGroup] === undefined) {
                collection[thisWordGroup] = 0
              }
              collection[thisWordGroup]++
            })
            this.wordRecordWords = []
            let perMin = 0
            let perMax = 0
            // this.asdf = [writeCollection, collection]

            let last = []
            for (let i = Math.max(...Object.keys(writeCollection).map(i => parseInt(i))); i >= 0; i--) {
              if (writeCollection[i]) {
                let left = 0
                let right = 0
                if (writeCollection[i] + (collection[i] ? collection[i] : 0) > 40) {
                  left = writeCollection[i] / ((collection[i] ? collection[i] : 0) + writeCollection[i]) * (step - (collection[i] ? collection[i] : 0))
                  right = writeCollection[i] / ((collection[i] ? collection[i] : 0) + writeCollection[i]) * (step - (collection[i] ? collection[i] : 0))
                } else if (writeCollection[i] + (collection[i] ? collection[i] : 0) > 20) {
                  left = Math.max(writeCollection[i] - 1, 1) / ((collection[i] ? collection[i] : 0) + Math.max(writeCollection[i] - 1, 1)) * (step - (collection[i] ? collection[i] : 0))
                  right = (collection[i] === 0 ? writeCollection[i] : (writeCollection[i] + 1)) / ((collection[i] ? collection[i] : 0) + (collection[i] === 0 ? writeCollection[i] : (writeCollection[i] + 1))) * (step - (collection[i] ? collection[i] : 0))
                } else {
                  left = Math.max(writeCollection[i] - 2, 1) / ((collection[i] ? collection[i] : 0) + Math.max(writeCollection[i] - 2, 1)) * (step - (collection[i] ? collection[i] : 0))
                  right = (collection[i] === 0 ? writeCollection[i] : (writeCollection[i] + 2)) / ((collection[i] ? collection[i] : 0) + (collection[i] === 0 ? writeCollection[i] : (writeCollection[i] + 2))) * (step - (collection[i] ? collection[i] : 0))
                }
                last = [left, right]
              }
              perMin += last[0]
              perMax += last[1]
            }
            this.wordRecordWords.push(perMin)
            this.wordRecordWords.push(perMax)
            this.wordRecordWords.push(writeCollection)
            this.wordRecordWords.push(collection)
          }
          knowWordCount[0] += this.wordRecordWords[0]
          knowWordCount[1] += this.wordRecordWords[1]
        } else {
          temp = await recordApi.select('select count(word) as count from wordRecord where deep=' + num)
        }
        let temp2 = 1
        if (num > 999) {
          temp2 = 1
        } else if (num === 1) {
          temp2 = 0.6
        } else if (num === 2) {
          temp2 = 0.6
        } else if (num === 3) {
          temp2 = 0.6
        } else if (num === 4) {
          temp2 = 0.6
        } else if (num === 5) {
          temp2 = 0.65
        } else if (num === 6) {
          temp2 = 0.7
        } else if (num === 6) {
          temp2 = 0.75
        } else if (num === 14) {
          temp2 = 0.5
        } else if (num === 60) {
          temp2 = 0.55
        } else {
          temp2 = 0.65
        }
        knowWordCount[0] += temp[0].count * temp2
        knowWordCount[1] += temp[0].count * temp2
      }
      this.knowWordCount = knowWordCount
    },
    getTestWordInfo() {
      this.showTestMeaningWord = true
    },
    getStrByNumber(number) {
      let temp = number / 100
      if (temp % 10 === 0) {
        return (temp / 10) + '.0k'
      } else {
        return (temp / 10) + 'k'
      }

    },
    beginPlan() {
      let option = new sqlClass('option')
      option.insert({
        name: 'wordTestFinish',
        val: 'true'
      })
      this.showTestTransform = false
      this.init()
    },
    play(url) {
      play(url)
    }
  },
  computed: {
    ...mapGetters('main', ['UserInterfaceStyle']),
    youWordCount() {
      function sss(per, count) {
        function C(a, b) {
          if (b > a / 2) {
            b = a - b
          }
          let temp = 10000000
          let count = 1 / temp
          for (let i = 0; i < b; i++) {
            count *= (a - i)
          }
          for (let i = 0; i < b; i++) {
            count /= (b - i)
          }
          return count * temp
        }

        let result = []
        let max = 0
        for (let i = 0; i <= count; i++) {
          result.push(Math.pow(per, i) * Math.pow(1 - per, count - i) * C(count, i))
          if (i > 0) {
            if (result[result.length - 1] > result[result.length - 2]) {
              max = i
            }
          }
        }
        return [Math.max(max - 1, 0) / count, Math.min(max + 1, result.length - 1) / count]
      }

      let count = [0, 0]
      for (let i in this.testCollectionForecast) {
        let item = sss(this.testCollectionForecast[i].right / this.testCollectionForecast[i].count, this.testCollectionForecast[i].count)
        count[0] += parseFloat(item[0]) * this.testDrawConfig.stepWord
        count[1] += parseFloat(item[1]) * this.testDrawConfig.stepWord
      }
      return count
    },
    testCollectionForecast() {
      let self = {}
      if (Object.keys(this.testCollection).length > 0) {
        let last = {}
        for (let i = Math.max(...Object.keys(this.testCollection).map(i => parseInt(i))); i >= 0; i--) {
          if (this.testCollection[i]) {
            last = this.testCollection[i]
            self[i] = last
          } else {
            if (last.right / last.count > 0.9) {
              self[i] = {
                right: last.count,
                count: last.count
              }
            } else {
              self[i] = last
            }
          }
        }
      }
      return self
    }
  },
  components: { Button, Icon },
}
</script>

<style scoped lang="less">
.content {
  background-color: rgba(0, 121, 92, 0.84);
  height: 100%;
  width: 750px;
  display: flex;
  flex-direction: column;
  padding-left: 30px;
  padding-right: 30px;
  box-sizing: border-box;
}

.index {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  color: white;
  margin-top: 20px;
  height: 100px;
}

.word {
  background-color: rgba(0, 121, 92, 0.84);
  margin: 30px;
  border-top-style: solid;
  border-top-color: rgba(225, 255, 248, 0.84);
  border-top-width: 1px;
  border-radius: 20px;
  padding-top: 80px;
  padding-bottom: 80px;
}

.word1 {
  position: absolute;
  top: 10px;
  right: 20px;
  color: white;
  font-family: iconfont;
}

.word2 {
  color: white;
  font-size: 80px;
  text-align: center;
  font-family: iconfont;
}

.word3 {
  color: white;
  font-size: 40px;
  height: 50px;
  text-align: center;
  font-family: iconfont;
}

.answer {
  flex-grow: 1;
  flex-shrink: 1;
  padding-top: 50px;
}

.todayFinish {
  width: 700px;
}

.todayFinishText {
  text-align: center;
  font-size: 60px;
  color: white;
}

.todayFinishInfo {
  color: white;
  font-size: 36px;
  line-height: 68px;
  margin-left: 30px;
}

.showAnswer {
  color: white;
  /*background-color: red;*/
  flex: 1;
  text-align: center;
  line-height: 500px;
}

.tools {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding-top: 10px;
  padding-bottom: 20px;
}

.dontKnow {
  height: 100px;
  width: 300px;
  background-color: #fc752e;
}

.knowAction {
  height: 100px;
  width: 300px;
  background-color: #52a655;
}

.word_test {
  position: absolute;
  background-color: white;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  .testContent {
    background-color: #00795c;
    height: 450px;
    padding: 20px;
  }

  &_tips {
    text-align: center;
    font-family: iconfont;
    color: white;
    margin-top: 50px;
    font-size: 33px;
    margin-bottom: 50px;
  }

  &_word {
    text-align: center;
    font-size: 80px;
    margin-top: 50px;
    margin-bottom: 30px;
  }
}

.testCollectionList {
  width: 710px;
  height: 152px;
  border-style: solid;
  border-width: 1px;
  border-color: white;
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
}

.testCollectionList2 {
  display: flex;
  flex-direction: row;
  width: '710px'
}

.testCollectionItem {
  position: absolute;
  width: 30px;
  background-color: rgba(255, 255, 255, 0.53);
  border-style: solid;
  border-color: white;
  border-width: 1px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}

.word_test_word_result_tip {
  font-size: 36px;
  padding-left: 30px;
  line-height: 50px;
  margin-bottom: 40px;
  font-family: iconfont;
}

.finish {
  padding: 20px;
  flex: 1
}
</style>
