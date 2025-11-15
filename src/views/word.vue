<template>
  <Page title="超级背单词">
    <template #others>
      <div v-if="wordTarget" class="target" @click="showTestTransform = !showTestTransform">
        <span>{{ wordTarget.title }}</span>
        <span>{{ wordTarget.target }}</span>
        <img src="../icons/sanjiao-white.svg" />
      </div>
    </template>
    <!-- wordTarget -->
    <div class="content">
      <div class="index">
        <div class="todayMiss" v-if="!todayFinish">今日剩余：{{ allWords.length }}</div>
        <div v-else> </div>
        <div class="indexText">
          <div v-if="wordTarget" class="target">
            <span>{{ wordTarget.title }}</span>
          </div>
          <div>：完成度{{ wordKnowCount }}%
          </div>
        </div>
      </div>
      <div class="word" v-if="!todayFinish">
        <!-- <div class="word1">单词序：{{ word.numIndex }}</div> -->
        <div class="word2">{{ word.word }}</div>
        <div class="yinbiao">
          <div>
            <div v-if="info.ph_en" @click="play(info.ph_en_mp3)">英：{{ info.ph_en }}</div>
            <div class="icon" v-if="info.en_mp3" @click="play(info.en_mp3)">
              <img src="../icons/play.png" />
            </div>
          </div>
          <div class="split"></div>
          <div>
            <div v-if="info.ph_am" @click="play(info.ph_am_mp3)">美：{{ info.ph_am }}</div>
            <div class="icon" v-if="info.am_mp3" @click="play(info.am_mp3)">
              <img src="../icons/play.png" />
            </div>
          </div>
        </div>
      </div>
      <div class="answer">
        <div v-if="todayFinish" class="todayFinish">
          <div class="todayFinishText">今天完成</div>
          <div class="todayFinishText">Celebrate</div>
          <div>
            <img class="todayFinishImg" src="https://yingshijiaoyusystem.oss-cn-beijing.aliyuncs.com/celebrate.png" />
          </div>
          <div class="todayFinishInfo">
            今天复习单词{{ allWordsCount }}个，遇到生词{{ Object.keys(collection).length }}个
          </div>
        </div>
        <div v-else style="flex:1;height: 100%;">
          <div v-if="showTransform">
            <text style="color:white;font-family: iconfont;" v-for="item in info.meaning">{{ item.part }}{{
              item.means.join(';') }}</text>
            <!--<text style="color:white;">麦田</text>-->
          </div>
          <div v-else class="showAnswer" @click="showTransform = true">想好答案后，点击屏幕验证</div>
        </div>
      </div>
      <div v-if="showTransform && !todayFinish" class="tools">
        <Button text="不认识" class="dontKnow" @click="dontKnow" />
        <Button text="认识" class="knowAction" @click="knowAction" />
      </div>
      <div class="word_test" v-if="showTestTransform"
        :style="{ backgroundColor: UserInterfaceStyle === 1 ? '#191919' : 'white' }">
        <div v-if="firstLoading" style="text-align: center;color: #535353;margin-top: 10vw;">
          首次进入，单词库下载中...
        </div>
        <div v-else class="wordTestContent">
          <div class="targetTitle">请选择学习目标</div>
          <div class="targetList">
            <div class="targetItem" v-for="item in allStudyTarget" @click="changeTestTarget(item.id)">
              <span>{{ item.title }}</span>
              <span>{{ item.target }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Page>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, nextTick } from 'vue'
import { mapActions, mapGetters } from 'vuex'
import SqlClass from '@/plugin/sql'
import request from '../plugin/request'
import Button from '../components/Button.vue'
import { play } from '../plugin/audio'
import storage from '../plugin/localStorage'
import Page from '@/components/Page.vue'
import Loading from '@/plugin/loading'
import { timeSteps, fineTimeStep, stepWord } from '../common/timeSteps'

let gDaySleep = 0

function sleep(time: number) {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}
function getTimeStr(t = 0) {
  const time = new Date()
  time.setTime(time.getTime() + 86400000 * (t + gDaySleep))
  const year = time.getFullYear()
  let month: number | string = time.getMonth() + 1
  if (month < 10) {
    month = '0' + month
  }
  let day: number | string = time.getDate()
  if (day < 10) {
    day = '0' + day
  }
  return year + '-' + month + '-' + day
}

let CheckResolve: any = null

type targetItem = {
  id: number,
  title: string,
  target: number,
};
const allWords = ref<any[]>([])
const allWordsCount = ref<number>(0)
const showTransform = ref<boolean>(false)
const allStudyTarget = ref<Array<targetItem>>([])
const word = ref<any>({})
const collection = ref<any>({})
const info = ref<any>({})
const todayFinish = ref<boolean>(false)
const gurssKnowWordCount = ref<[number, number]>([0, 0])// 推测
const recordWordCount = ref<number>(0)
const checkShowWord = ref<string>('')
const showTestTransform = ref<boolean>(false)
const showTestMeaningWord = ref<boolean>(false)
const testWordInfo = ref<any>({})
const firstLoading = ref<boolean>(false)
const testDrawConfig = ref<{
  stepWord: number,
  stepCount: number
}>({
  stepWord: stepWord,
  stepCount: 8
})
const wordRecordWords = ref<[number, number, any, any] | []>([])// 目前记录里所有的单词对应的word的id信息
const wordTarget = ref<targetItem>()

onMounted(async () => {
  const allWord: any[] = await request.get('/en/word/allLevel')
  allStudyTarget.value = allWord;
  console.log('allWord1111', allWord)
  const option = new SqlClass('option')
  if ((await option.select('select count(*) as count from option where name="wordTestFinishv2"'))[0].count === 0) {
    showTestTransform.value = true
    await initWords();
    const config = await option.select('select * from option where name="perDay"')
    if (config.length === 0) {
      option.insert({
        name: 'perDay',
        val: 50
      })
    }
  } else {
    init()
  }
})
async function init() {
  await updateWordKnowCount()
  collection.value = {}
  const recordApi = new SqlClass('wordRecord')
  const wordDateRecord = new SqlClass('wordDateRecord')
  // 每天需要复习+新学的词汇
  const option = new SqlClass('option')
  const config = await option.select('select * from option where name="perDay"')
  const perDay = parseInt(config[0].val)
  // 学习目标
  const targetInfoList: any = await option.select('select * from option where name="wordTarget"')
  if (targetInfoList.length) {
    const targetId = parseInt(targetInfoList[0].val)
    const targetInfo = allStudyTarget.value.find(v => v.id === targetId)
    if (targetInfo) {
      wordTarget.value = targetInfo
    }
  }
  // 检验日期
  const todayHasRecord = await wordDateRecord.select('select count(*) as count from wordDateRecord where `date`="' + getTimeStr() + '"')
  if (todayHasRecord[0].count === 0) {
    console.log('sss---4----------2', JSON.stringify(wordRecordWords.value))
    await wordDateRecord.insert({
      date: getTimeStr(),
      wordCount: perDay,
      know: 0,
      dontKnow: 0
    })

    // 从数据库里提取，今日应该背诵的单词
    const todayRecord = await wordDateRecord.select('select * from wordDateRecord where `date`="' + getTimeStr() + '"')
    console.log('todayRecord', todayRecord)
    if (todayRecord[0].wordCount === todayRecord[0].know + todayRecord[0].dontKnow) {
      todayFinish.value = true
    } else {
      todayFinish.value = false
      const todayNeedsWords = await recordApi.select('select word from wordRecord where showTime <="' + getTimeStr() + '" order by showTime limit ' + perDay)
      if (todayNeedsWords.length < perDay) {
        const todayNeed = perDay - todayNeedsWords.length
        console.log('sss---4----------222-1', todayNeed)
        // 需要补充词汇
        let centerSlip = 0;
        const option = new SqlClass('option')
        const targetInfoList: any = await option.select('select * from option where name="wordTarget"')
        if (targetInfoList.length) {
          const targetId = parseInt(targetInfoList[0].val)
          const targetInfo = allStudyTarget.value.find(v => v.id === targetId)
          if (targetInfo) {
            centerSlip = targetInfo.target;
            console.log('sss---4----------222-1.1', targetInfo)
            const wordTop1 = new SqlClass('wordTop1')
            const sql = 'select word from wordTop1 where word not in (select word from wordRecord) order by RANDOM() limit ' + todayNeed;
            const appendNewWord = await wordTop1.select(sql)
            console.log('sss---4----------4', sql, appendNewWord)
            for (let i = 0; i < appendNewWord.length; i++) {
              const item = appendNewWord[i]
              await recordApi.insert({
                word: item.word,
                deep: 0,
                showTime: getTimeStr()
              })
            }
          }
        } else {
          return;
        }
      }
    }
    allWords.value = await recordApi.select('select word,deep from wordRecord where showTime <="' + getTimeStr() + '" order by showTime asc limit ' + perDay)

    console.log('sss---4.5----------allWords', allWords.value)
    allWordsCount.value = allWords.value.length

    await saveStates()
    getWordInfo()
    updateWordKnowCount()
  } else {
    console.log('sss---5----------')
    // 今天已经打开了背单词
    storage.getItem('wordsTimeStamp').then(async (data) => {
      console.log('hhhhh', data)
      if (data) {
        allWords.value = JSON.parse(data).allWords
        console.log('allWords', allWords.value)
        if (allWords.value.length === 0) {
          todayFinish.value = true
          return
        }
        collection.value = JSON.parse(data).collection
        allWordsCount.value = JSON.parse(data).allWordsCount
      } else {
        allWords.value = await recordApi.select('select word,deep from wordRecord where showTime <="' + getTimeStr() + '" order by showTime asc limit ' + perDay)
        allWordsCount.value = allWords.value.length
        await saveStates()
      }
      getWordInfo()
      updateWordKnowCount()
    })
    const todayRecord = await wordDateRecord.select('select * from wordDateRecord where `date`="' + getTimeStr() + '"')
    console.log('todayRecord---2', todayRecord)
    if (todayRecord.length && todayRecord[0].wordCount === todayRecord[0].know + todayRecord[0].dontKnow) {
      todayFinish.value = true
    }
  }
}
async function changeTestTarget(id: number) {
  const handle = Loading({
    text: '正在加载单词...'
  })
  const allWord: any[] = await request.get('/en/word/initAllType?type=' + id)
  console.log('allWord', allWord)
  const wordTop1 = new SqlClass('wordTop1')
  wordTop1.select('delete from wordTop1')
  for (let i = 0; i < allWord.length; i++) {
    const word = allWord[i];
    handle.setText('正在加载单词:' + Math.round(i / allWord.length * 100) + '%')
    await wordTop1.insert({
      word: word.word,
      count: word.count,
    })
  }
  const option = new SqlClass('option');
  if ((await option.select('select count(*) as count from option where name="wordTarget"'))[0].count === 0) {
    await option.insert({
      name: 'wordTarget',
      val: id
    })
  } else {
    await option.select('update option set val="' + id + '" where name="wordTarget"')
  }
  handle.destory()
  beginPlan()
}
async function initWords(): Promise<void> {
  return new Promise<void>(async (resolve) => {
    firstLoading.value = true
    // 加载单词
    const wordApi = new SqlClass('word')
    const exist = await wordApi.select('select count(*) as count from word')
    if (exist[0].count > 0) {
      firstLoading.value = false
      resolve()
      return;
    }
    const allWord: any[] = await request.get('/en/word/initAll')
    function temp(begin: number, end: number) {
      nextTick(async () => {
        const insertList: object[] = []
        for (let i = begin; i <= end && i < allWord.length - 1; i++) {
          const word = allWord[i]
          insertList.push({
            word: word.word,
            count: word.count,
            translate: ''
          })
        }
        try {
          // @ts-ignore
          await wordApi.insert.apply(wordApi, insertList)
          if (end < allWord.length - 1) { // end < allWord.length - 1 会在某一个值有bug
            return temp(end + 1, end + 21)
          } else {
            firstLoading.value = false
            resolve()
          }
        } catch (e) {
          return temp(end + 1, end + 21)
        }
      })
    }
    nextTick(() => {
      temp(0, 20)
    })
  })
}
async function checkWord(word: any) {
  return new Promise(resolve => {
    checkShowWord.value = word.word
    CheckResolve = resolve
    request.get('/en/word/info/' + checkShowWord.value).then(res => {
      testWordInfo.value = res
    })
  })
}
function checkDontKnow() {
  const recordApi = new SqlClass('wordRecord')
  recordApi.insert({
    word: checkShowWord.value,
    deep: 1,
    showTime: getTimeStr()
  })
  CheckResolve(false)
}
function checkKnowAction() {
  const recordApi = new SqlClass('wordRecord')
  recordApi.insert({
    word: checkShowWord.value,
    deep: fineTimeStep,
    showTime: '9999-12-31'
  })
  CheckResolve(true)
}
function saveStates(): Promise<void> {
  return new Promise((resolve) => {
    storage.setItem('wordsTimeStamp', JSON.stringify({
      allWords: allWords.value,
      collection: collection.value,
      allWordsCount: allWordsCount.value
    })).then(() => {
      resolve()
    })
  })
}
function nextDay() {
  gDaySleep++
  init()
}
async function getWordInfo() {
  showTransform.value = false
  console.log('====allWords====', allWords.value)
  if (allWords.value.length === 0) {
    return;
  }
  word.value = allWords.value[0]
  const wordApi = new SqlClass('word')
  console.log('getWordInfo', word.value, 'select id from word where word="' + word.value.word + '"')
  wordApi.select('select id from word where word="' + word.value.word + '"').then(res => {
    word.value.numIndex = res[0]?.id
  })
  info.value = {}

  request.get('/en/word/info/' + word.value.word).then(res => {
    info.value = res
  })
}

async function knowAction() {
  const newObj = allWords.value.shift()
  if (collection.value[newObj.word] !== undefined) {
    collection.value[newObj.word]--
    if (collection.value[newObj.word] > 0) {
      const temp = collection.value[newObj.word] * 2
      allWords.value.splice(Math.min(temp, allWords.value.length - 1), 0, newObj)
    } else {
      // 今天错过，但是确认今天记住了，今天不再测试
      // delete collection.value[newObj.word]
    }
  } else {
    const recordApi = new SqlClass('wordRecord')
    // 今天这个词没有错过，第一次见到就通过
    if (newObj.deep === 0) {
      // 补充新增词汇，第一次见到就通过
      wordRecordWords.value = []
      await recordApi.select('update wordRecord set showTime="9999-12-31",deep=' + fineTimeStep + ' where word ="' + newObj.word + '"')
    } else {
      // 历史忘记过，但是今天第一次见到就认识通过
      if (timeSteps.indexOf(newObj.deep) > -1) {
        if (timeSteps[timeSteps.indexOf(newObj.deep) + 1]) {
          const nextDeep = timeSteps[timeSteps.indexOf(newObj.deep) + 1]
          await recordApi.select('update wordRecord set showTime="' + getTimeStr(nextDeep) + '",deep=' + nextDeep + ' where word ="' + newObj.word + '"')
        }
      }
    }
    const wordDateRecord = new SqlClass('wordDateRecord')
    await wordDateRecord.select('update wordDateRecord set know=know+1 where `date`="' + getTimeStr() + '"')
  }
  await saveStates()
  if (allWords.value.length === 0) {
    word.value = {}
    info.value = {}
    todayFinish.value = true

    const wordDateRecord = new SqlClass('wordDateRecord')
    const knowWordCountMin = Math.floor(gurssKnowWordCount.value[0]);
    const knowWordCountMax = Math.floor(gurssKnowWordCount.value[1]);
    await wordDateRecord.run('update wordDateRecord set knowWordCountMin=' + knowWordCountMin + ', knowWordCountMax=' + knowWordCountMax + ' where `date`="' + getTimeStr() + '"', false)
  } else {
    getWordInfo()
  }
  updateWordKnowCount()
}

async function dontKnow() {
  const recordApi = new SqlClass('wordRecord')
  const length = allWords.value.length
  const newObj = allWords.value.shift()
  if (collection.value[newObj.word] === undefined) {
    const wordDateRecord = new SqlClass('wordDateRecord')
    await wordDateRecord.select('update wordDateRecord set dontKnow=dontKnow+1 where `date`="' + getTimeStr() + '"')
    await recordApi.select('update wordRecord set showTime="' + getTimeStr(1) + '",deep=1 where word ="' + newObj.word + '"')
  }

  // select * from word order by `count` desc limit 10
  // api.select('update word set');
  const interval = Math.min(3, length)
  if (length - interval < 2) {
    collection.value[newObj.word] = 1
  } else if (length - interval < 3) {
    collection.value[newObj.word] = 2
  } else {
    collection.value[newObj.word] = 3
  }
  allWords.value.splice(interval, 0, newObj)
  await saveStates()
  getWordInfo()
  updateWordKnowCount()
}

const wordKnowCount = ref<number>(0)
async function updateWordKnowCount() {
  const recordApi = new SqlClass('wordRecord')
  const wordTop1Api = new SqlClass('wordTop1');// 构造函数里面，有不存在取创建表的逻辑，这里可以保证有这个表
  await wordTop1Api.select('select * from wordTop1 limit 1');// 构造函数里面，有不存在取创建表的逻辑，这里可以保证有这个表
  const sql = 'select * from wordRecord left join wordTop1 on wordTop1.word=wordRecord.word';
  const appendNewWord = await recordApi.select(sql)
  // wordTop1
  const appendNewWord2 = await recordApi.select('select count(*) as count from wordTop1')
  let knowWords = 0;
  appendNewWord.forEach(v => {
    let addItem = (180 - 180 / (v.deep + 0.5)) / 180 + 0.05;
    if (addItem < 0) {
      addItem = 0;
    }
    knowWords += addItem;
  })
  wordKnowCount.value = Math.round(knowWords / appendNewWord2[0].count * 100)
  console.log('########===============end$$$$$$$$', knowWords, appendNewWord2[0].count)
}
function beginPlan() {
  const option = new SqlClass('option')
  option.insert({
    name: 'wordTestFinishv2',
    val: 'true'
  })
  showTestTransform.value = false
  init()
}

const UserInterfaceStyle = null;
</script>

<style scoped lang="less">
.target {
  font-size: 28px;

  >img {
    width: 20px;
    height: 20px;
    margin-left: 8px;
  }
}

.content {
  background-color: rgba(0, 121, 92, 0.84) !important;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-left: 30px;
  padding-right: 30px;
  box-sizing: border-box;
  position: relative;
}

.index {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  color: white;
  margin-top: 20px;
  height: 100px;
  flex-shrink: 0;
  font-size: 32px;

  .todayMiss {
    color: white;
    font-family: iconfont;
  }

  .indexText {
    display: flex;
    color: white;
    font-family: iconfont;
  }
}

.word {
  background-color: rgba(0, 121, 92, 0.84);
  margin: 30px;
  border-top-style: solid;
  border-top-color: rgba(225, 255, 248, 0.84);
  border-top-width: 1px;
  border-radius: 20px;
  padding: 0 20px 80px 20px;
  flex-shrink: 0;

  .word1 {
    margin-top: 8px;
    color: white;
  }

  .word2 {
    color: white;
    font-size: 80px;
    margin-top: 32px;
    text-align: center;
    font-family: iconfont;
  }
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
  font-size: 38px;
  overflow-y: auto;
}

.todayFinish {
  width: 700px;

  .todayFinishText {
    text-align: center;
    font-size: 60px;
    color: white;
  }

  .todayFinishImg {
    width: 400px;
    margin-left: 150px;
  }
}

.todayFinishInfo {
  color: white;
  font-size: 36px;
  line-height: 68px;
  text-align: center;
  margin-top: 30px;
}

.showAnswer {
  flex: 1;
  text-align: center;
  line-height: 500px;
  text-align: center;
  color: white;
  height: 100%;
}

.tools {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding-top: 10px;
  padding-bottom: 20px;

  :deep(.button) {
    .button_text {
      color: white;
      font-weight: bold;
    }
  }
}

.dontKnow {
  height: 100px;
  width: 300px;
  background-color: #fc752e;
  color: white;
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

  .wordTestContent {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;

    .testContent {
      background-color: #00795c;
      height: 450px;
      padding: 20px;
    }

    .targetTitle {
      font-size: 4.26667vw;
      color: black;
      margin: 48px 0 30px;
      font-size: 48px;
      text-align: center;
    }

    .targetList {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;

      .targetItem {
        width: 550px;
        color: black;
        font-size: 33px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: rgb(230, 247, 236);
        margin-bottom: 4.26667vw;
        padding: 3.46667vw 4.26667vw;
        font-size: 4.26667vw;
        border: solid 1PX rgba(0, 0, 0, 0.04);
        color: #00795c;
        border-radius: 4.26667vw;
        display: flex;
        align-items: start;
        justify-content: space-between;
      }
    }
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
    padding-top: 50px;
    margin-bottom: 30px;
  }
}

.testCollectionList {
  position: relative;
  width: 710px;
  height: 152px;
  border-style: solid;
  border-width: 1px;
  border-color: white;
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  align-items: flex-end;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 50%;
    top: 25%;
    border-bottom: dashed 1px rgba(255, 255, 255, 0.3);
    border-top: dashed 1px rgba(255, 255, 255, 0.3);
  }

  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 0;
    top: 50%;
    border-bottom: dashed 1px rgba(255, 255, 255, 0.3);
  }
}

.testCollectionList2 {
  display: flex;
  flex-direction: row;
  width: 710px;
  overflow: hidden;
  position: relative;
  height: 42px;

  .item {
    // width: 100px;
    position: absolute;
    text-align: center;

    .text {
      color: white;
      font-size: 24px;
      font-family: iconfont;
    }
  }
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
  flex: 1;
  display: flex;
  flex-direction: column;
}

.yinbiao {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
  font-size: 35px;
  color: white;

  .icon {
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;

    >img {
      width: 36px;
      height: 36px;
    }
  }

  .split {
    width: 1px;
    height: 50px;
    background-color: rgba(255, 255, 255, 0.5);
    margin-left: 24px;
    margin-right: 24px;
  }
}
</style>
