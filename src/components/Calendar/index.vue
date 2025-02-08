<template>
  <div class="calendar">
    <!-- {{chooseList}} -->
    <div class="year-month">
      <el-icon @click="upPage" :size="16" class="iconBgc">
        <ArrowLeft />
      </el-icon>
      <span>{{ year }}年{{ month }}月</span>
      <el-icon @click="nextPage" :size="16" class="iconBgc">
        <ArrowRight />
      </el-icon>
    </div>
    <div class="week">
      <template v-for="(item, index) in weeks" :key="index">
        <div :class="['item', { 'current-week': index == new Date().getDay() }]">{{ item }}</div>
      </template>
    </div>
    <el-divider class="border" />
    <template v-for="(line, index) of dates" :key="index">
      <div class="week">
        <div v-for="(item, index) of line" :key="index" @click="onClick(item)" :class="['item', 'pointerItem',
          { 'current-month': month == item.month },
          { 'today': today == `${item.month}-${item.date}` },
          { 'clickFlag': clickFlag === item.timeStamp },
          { 'select': chooseList.map(v=>v.date).includes(getTimeStr(item.timeStamp)) }]">
          <div>{{item.date }}</div>
          <div>{{getTimeUseTimeStr(item)}}</div>
          </div>
      </div>
    </template>
  </div>
</template>
  
<script setup>
import { watchEffect, ref, onBeforeMount } from "vue"
const today = `${new Date().getMonth() + 1}-${new Date().getDate()}`
const weeks = ["日", '一', '二', '三', '四', '五', '六']
const oneDayTimeStamp = 86400 * 1000
const dates = ref([])
const month = ref("")
const year = ref("")
const clickFlag = ref("")
const emit = defineEmits(["onSelect"])
const props = defineProps({
  chooseList: {
    type: Array,
  },
  defaultDate: {
    type: [String, Number],
    default: Date.now()
  },
  // selectDates: {
  //   type: Array,
  //   default() {
  //     const now = Date.now();
  //     const oneDayTimeStamp = 86400 * 1000
  //     return [now - oneDayTimeStamp, now, now + oneDayTimeStamp, now + oneDayTimeStamp * 3]
  //   }
  // },
})
onBeforeMount(() => {
  let firstTimestamp = getCurrentPageTimestampOf1(props.defaultDate)
  console.log(firstTimestamp, 66);
  
  getList(firstTimestamp)
})
  
function upPage() {
  let firstTimestamp = getFirstTimestampByUp()
  getList(firstTimestamp)
}
  
function nextPage() {
  let firstTimestamp = getFirstTimestampByNext()
  getList(firstTimestamp)
}
  
function getTimeStr(sleep = 0) {
  let time = new Date(sleep)
  // time.setTime(time.getTime() + 86400000 * (sleep))
  let year = time.getFullYear()
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

// 获取当前页日期列表
function getList(timestamp) {
  const temp = []
  const list = []
  // 包含一个足月的最小周期为42天
  const pageT = 42
  for (let i = 0; i < pageT; i++) {
    temp.push(coverToDate(timestamp, i))
  }
  
  while (temp.length > 0) {
    list.push(temp.splice(0, 7))
  }
  removeLine(list)
  month.value = list[1][1].month
  year.value = list[1][1].year
  dates.value = list
  // console.log(list, 66);
}

function getTimeUseTimeStr(item) {
  const find = props.chooseList.find(v=>v.date===getTimeStr(item.timeStamp))
  if(find) {
    if(find.timeSecond>60) {
      return Math.floor(find.timeSecond/60) + '分';
    } else {
      return find.timeSecond + '秒';
    }
  }
}
  
// 获取上一页的第一个元素的时间戳
function getFirstTimestampByUp() {
  const firstObj = dates.value[0][0]
  let timestamp = 0
  //  第一行第一个元素是1号，返回firstObj前一天的时间戳 ，
  //  否则直接返回firstObj的时间戳
  if (firstObj.date === 1) {
    timestamp = firstObj.timeStamp - oneDayTimeStamp
  } else {
    timestamp = firstObj.timeStamp
  }
  
  return getCurrentPageTimestampOf1(timestamp)
}
  
// 获取下一页的第一个元素的时间戳
function getFirstTimestampByNext() {
  let len = dates.value.length
  const lastLine = dates.value[len - 1]
  // 最后一行包含1号，直接返回第一个元素的时间戳，
  // 否则返回最后一个元素的时间戳 + 一天的时间戳
  const includeDateOf1 = lastLine.find(item => item.date === 1)
  if (includeDateOf1) {
    return lastLine[0].timeStamp
  } else {
    return lastLine[6].timeStamp + oneDayTimeStamp
  }
}
  
// 删除掉不是属于当前月的行
function removeLine(list) {
  if (list.length > 5) {
    let index = list.slice(1).findIndex(line => line.some(item => item.date == 1))
    if (index != -1) {
      const startIndex = index + 1
      // 最后一行的第一天
      const lastLineOf1 = list[startIndex][0].date
      if (lastLineOf1 === 1) {
        list.splice(startIndex)
      } else {
        list.splice(startIndex + 1)
      }
    }
  }
}
  
// 获取当页的第一个日期的时间戳
function getCurrentPageTimestampOf1(timestamp) {
  const time = new Date(timestamp)
  const year = time.getFullYear()
  const month = time.getMonth() + 1
  // 当月的第一天
  const dateOf1 = new Date(`${year}/${month}/1`)
  // 当月的第一天,是星期几
  const weekOf1 = dateOf1.getDay()
  // 当页的第一天时间戳
  const firstTimestampOfPage = dateOf1.getTime() - weekOf1 * oneDayTimeStamp
  return firstTimestampOfPage
}
  
// 时间戳转成日期对象
function coverToDate(firstTimestampOfPage, index) {
  const timeStamp = firstTimestampOfPage + index * oneDayTimeStamp
  let obj = new Date(timeStamp)
  let date = obj.getDate()
  const week = obj.getDay()
  const month = obj.getMonth() + 1
  const year = obj.getFullYear()
  return { year, month, date, week, timeStamp }
}
  
function onClick(e) {
  clickFlag.value = e.timeStamp
  emit("onSelect", e)
}
</script>
  
<style lang="less" scoped>
.calendar {
  width: 100%;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  padding: 0 16px;
  box-sizing: border-box;
  
  .year-month {
    height: 56px;
    width: 100%;
    display: flex;
    justify-content: space-around;
    padding: 16px 8px;
    align-items: center;
  
    .iconBgc {
      cursor: pointer;
  
      &:hover {
        color: #3370e9;
      }
    }
  }
  
  .border {
    width: 316px;
    margin: 8px 0;
  }
  
  .week {
    width: 100%;
    display: flex;
    color: #C0C4CC;
    font-size: 22px;
    justify-content: space-between;
    align-items: center;
  
    .item {
      position: relative;
      width: 66px;
      height: 66px;
      line-height: 30px;
      text-align: center;
      box-sizing: border-box;
  
      // 当前的颜色
      &.current-month {
        color: #303133;
      }
  
      &.today {
        border: solid 1px black;
        // &::after {
        //   position: absolute;
        //   bottom: 2px;
        //   left: 45%;
        //   content: "";
        //   display: block;
        //   width: 2.77px;
        //   height: 2.77px;
        //   border-radius: 50%;
        //   background: #FFFFFF;
        // }
      }
  
      &.current-week {
        line-height: 36px;
        //是否在当前星期下加圆点
        // &::after {
        //   position: absolute;
        //   bottom: 2px;
        //   left: 45%;
        //   content: "";
        //   display: block;
        //   width: 2.77px;
        //   height: 2.77px;
        //   border-radius: 50%;
        //   background: #3775F6;
        // }
      }
  
      &.clickFlag {
        color: #3775F6;
        font-weight: 600;
      }
  
      &.select {
        color: #FFF !important;
        background: #00795c;
        border-radius: 8px;
      }
    }
  
    .pointerItem {
      cursor: pointer;
  
      &:hover {
        color: #3370e9;
      }
    }
  }
}
</style>