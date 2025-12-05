<template>
  <Page title="文件" root>
    <template #before>
      <DegreeSelect />
    </template>
    <div class="filePage">
      <div class="subjects">
        <div class="scroll" ref="subjectScroll">
          <text ref="start" key="start"></text>
          <div class="subjectScroll">
            <div :key="subject.id" v-for="subject in subjects" @click="changeSubject(subject.id)" class="subjects_item"
              :class="{ active: selectSub === subject.id }">
              <div :key="subject.id">{{ subject.name }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="fileContent">
        <div class="sourceList">
          <div v-for="source in sourceList" :key="source.key" class="sourceItem"
            :class="[+selectCourse === source.id ? 'select' : '']" @click="changeSource(source)">
            <!--<img :src="source.img" width="30"/>-->
            <text>{{ source.name }}</text>
          </div>
        </div>
        <div class="fileListContent">
          <div class="head" v-if="fileCount > 0" style="display: none;">
            <div>共{{ fileCount }}个资料文件</div>
            <Button @click="printAll">全部打印</Button>
          </div>
          <div class="fileList">
            <div v-if="loading" class="loading">加载中...</div>
            <div v-else-if="!loading && fileList.length === 0" class="loading">该分类下暂无资料</div>
            <div v-for="file in fileList" class="fileItem" :key="file.id">
              <div class="name">{{ file.title }}</div>
              <div class="buttons">
                <Button @click="printFile([file])">云打印</Button>
                <Button @click="share(file)" icon="share">分享</Button>
                <Button v-if="isFileDownloaded(file.file)" text="打开"
                  @click="open(downLoadFile[file.file.split('/').slice(-1)[0]])">
                </Button>
                <Button :text="downLoading[file.file] ? '下载中' : (isFileDownloaded(file.file) ? '重新下载' : '下载')"
                  :disabled="downLoading[file.file]" @click="download(file)">
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Page>
  <Dialog :show="showConinueUrl !== '' || showConinueOpenPath !== ''" title="提示"
    @close="showConinueUrl = '', showConinueOpenPath = ''">
    <div class="chooseUseType">
      <BuyVIPDesc />
      <VipPriceDesc @buy="CallbuyVip" @toInvite="CallbuyVip" />
      <div class="split"></div>
      <div class="chooseUseTypeInfo" v-if="showConinueUrl || showConinueOpenPath">
        您是免费用户，今日可免费试用次数还剩<span class="time">{{ showConinueTimes.times.fileDownload }}</span>次，是否继续使用？
      </div>
      <div class="chooseUseTypeTools">
        <Button class="cancel" @click="continueUse" text="继续免费试用"></Button>
      </div>
    </div>
  </Dialog>
  <Dialog :show="showPrintAllDialog" title="提示" @close="showPrintAllDialog = false">
    <div class="printDialog">
      <div class="title">
        是否确认打印{{ fileList.length === waitPrintFileList.length ? '全部' : '' }}{{ waitPrintFileList.length }}个资料文件？
      </div>
      <div class="list">
        <div v-for="file in waitPrintFileList" :key="file.id" class="listItem">{{ file.title }}</div>
      </div>
      <div class="addressTitle">请选择打印地址：{{ chooseAddress }}</div>
      <div class="addressList">
        <div v-for="address in addressList" :key="address.id" class="addressItem"
          :class="{ active: chooseAddress === address.id }" @click="chooseAddress = address.id">
          <Check class="check" :value="chooseAddress === address.id" />
          <div>
            <div class="name">{{ address.name }} {{ address.phone }}</div>
            <div>{{ address.provinceInfo.name }} {{ address.cityInfo.name }} {{ address.districtInfo.name }} {{
              address.detail }}</div>
          </div>
        </div>
      </div>
      <div class="tools">
        <Button class="cancel" @click="printSent" text="确认打印"></Button>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import request from '@/plugin/request'
import Button from '@/components/Button.vue'
import sharePlugin from '../plugin/share'
import File from '@/plugin/file'
import Dialog from '@/components/Dialog.vue';
import BuyVIPDesc from './buyVIPDesc.vue';
import toast from '@/plugin/toast';
import log from '@/plugin/log';
import VipPriceDesc from '@/components/vipPriceDesc.vue';
import Check from '@/components/Check.vue';
import Page from '@/components/Page.vue'
import DegreeSelect from '../components/degreeSelect.vue'

// 定义响应式数据
const subjects = ref<any[]>([])
const selectSub = ref<number>(-1)
const sourceList = ref<any[]>([])
const selectCourse = ref<number>(-1)
const fileList = ref<any[]>([])
const fileCount = ref<number>(-1)
const downLoadList = ref<any[]>([])
const loading = ref<boolean>(false)
const downLoading = ref<{ [key: string]: boolean }>({})
const showConinueUrl = ref<string>('') // 下载
const showConinueOpenPath = ref<string>('') // 打开

const showConinueTimes = ref<{
  isVip: boolean,
  times: {
    fileDownload: number,
  }
}>({
  isVip: false,
  times: {
    fileDownload: 0,
  }
})

// 获取store中的degree
const store = useStore()
const degree = computed(() => store.getters['main/degree'])

// 计算属性
const downLoadFile = computed(() => {
  const map: { [key: string]: string } = {};
  downLoadList.value.forEach(v => {
    const paths = v.path.split('/');
    map[paths[paths.length - 1]] = v.path;
  })
  return map;
})

// 判断文件是否已下载的计算属性
const isFileDownloaded = (fileUrl: string) => {
  const fileName = fileUrl.split('/').slice(-1)[0];
  return Object.keys(downLoadFile.value).includes(fileName);
}

// 方法定义
const changeSubject = (id: number) => {
  selectSub.value = id;
  fileList.value = [];
  fileCount.value = 0;
  loading.value = true;
  localStorage.setItem('sourceFileChoose', id.toString())
  refresh();
}

const refresh = async () => {
  sourceList.value = [];
  try {
    sourceList.value = await request.get('/subjectSourceV2/' + selectSub.value);
    if (sourceList.value.length > 0) {
      changeSource(sourceList.value[0])
    }
  } catch (error) {
    console.error(error)
  }
}

const changeSource = async (course: any) => {
  fileList.value = [];
  fileCount.value = 0;
  selectCourse.value = course.id;
  initDownLoadList()
  loading.value = true;

  try {
    const data: any = await request.get('/file/listWithTotal', {
      params: {
        course: course.id,
        status: 0,
      }
    });
    fileList.value = data.list;
    fileCount.value = data.total;
    loading.value = false;
  } catch (error) {
    loading.value = false;
    console.error(error);
  }
}

const initDownLoadList = () => {
  File.getDownLoadFileList().then(res => {
    downLoadList.value = res as any[];
  })
}

const downloadFile = (file: string) => {
  downLoading.value[file] = true;
  File.download(file)
    .then(() => {
      downLoading.value[file] = false;
      initDownLoadList();
    })
    .catch((err) => {
      alert(JSON.stringify(err))
    })
}

const download = async (file: any) => {
  if (downLoading.value[file.file]) {
    return;
  }
  // 校验
  try {
    const data = await request.get('/user/checkFuncTimes');
    showConinueTimes.value = data as any;
    if (showConinueTimes.value.isVip) {
      downloadFile(file.file);
    } else {
      log('vipUseFileDownload');
      showConinueUrl.value = file.file;
    }
  } catch (error) {
    console.error(error);
  }
}

const continueUse = async () => {
  try {
    const result = await request.post('/user/useFuncTimes', {
      func: 'fileDownload'
    });
    if (result) {
      if (showConinueUrl.value) {
        downloadFile(showConinueUrl.value);
        showConinueUrl.value = '';
      } else if (showConinueOpenPath.value) {
        File.open(showConinueOpenPath.value);
        showConinueOpenPath.value = '';
      }
    } else {
      toast({
        'message': '今日免费权限用尽',
        'duration': 3000
      })
    }
  } catch (error) {
    console.error(error);
  }
}

const CallbuyVip = () => {
  showConinueUrl.value = '';
  showConinueOpenPath.value = '';
}

const open = async (path: string) => {
  try {
    const data: any = await request.get('/user/checkFuncTimes');
    showConinueTimes.value = data;
    if (showConinueTimes.value.isVip) {
      File.open(path);
    } else {
      log('vipUseFileOpen');
      showConinueOpenPath.value = path;
    }
  } catch (error) {
    console.error(error);
  }
}

const share = (file: any) => {
  const url = file.file.replace('http://', 'https://');
  sharePlugin(file.title, 'https://api.studying1v1.com/page/file?file=' + encodeURIComponent(url), '资料分享')
}

// 生命周期钩子
onMounted(async () => {
  loading.value = true;
  try {
    subjects.value = await request.get('/subjectV3?degree=1');
    const selectSubStorage = await localStorage.getItem('sourceFileChoose')
    selectSub.value = selectSubStorage ? +selectSubStorage : subjects.value[0]?.id || -1;
    refresh();
  } catch (error) {
    console.error(error);
    loading.value = false;
  }
})

const showPrintAllDialog = ref<boolean>(false)
const waitPrintFileList = ref<any[]>([])
interface Address {
  id: number
  name: string
  phone: string
  province: number
  provinceInfo: {
    name: string,
  }
  city: number
  cityInfo: {
    name: string,
  }
  district: number
  districtInfo: {
    name: string,
  }
  detail: string
  isDefault: boolean
}
const addressList = ref<Address[]>([])
const chooseAddress = ref<number>()
const printAll = () => {
  printFile(fileList.value);
}
const printFile = (files: string[]) => {
  request.get('/studying/address/myAddress').then(res => {
    addressList.value = res as any;
  })
  waitPrintFileList.value = files;
  showPrintAllDialog.value = true;
}
const printSent = () => {
  request.post('/studying/print/file', {
    files: waitPrintFileList.value,
    address: chooseAddress.value,
  }).catch(err => {
    toast({
      'message': '打印失败:' + err.message,
      'duration': 3000
    })
  })
}
</script>

<style lang="less" scoped>
.filePage {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.subjects {
  width: 100%;
  height: 100px;
  display: flex;
  flex-shrink: 0;
  flex-direction: row;
  border-bottom-color: #afafaf;
  border-bottom-width: 1px;
  border-bottom-style: solid;

  .scroll {
    width: 100%;
    flex-direction: row;
    align-items: center;
    height: 100%;
    overflow-x: auto;
    position: relative;

    .subjectScroll {
      display: flex;
      flex-direction: row;
      height: 100%;

      >div {
        flex-shrink: 0;
      }
    }

    &::-webkit-scrollbar {
      display: none;
      /* Chrome Safari */
    }
  }

  .subjects_item {
    font-size: 42px;
    min-width: 110px;
    line-height: 70px;
    text-align: center;
    padding: 20px 30px;
    color: rgba(0, 0, 0, 0.42);

    &.active {
      color: #00795c;

      &::after {
        content: '';
        display: block;
        width: 100%;
        height: 8px;
        background-color: #04785c;
        border-radius: 4px;
      }
    }
  }
}

.fileContent {
  display: flex;
  width: 100%;
  flex-grow: 1;
  overflow: hidden;

  .sourceList {
    // border-right: solid 1px #afafaf;
    width: 220px;
    padding-top: 20px;
    padding-bottom: 20px;
    box-sizing: border-box;
    flex-shrink: 0;
    overflow: auto;

    .sourceItem {
      padding: 20px;
      display: flex;
      align-items: center;
      font-size: 32px;
      justify-content: center;
      color: #6f6f6f;

      &.select {
        color: black;
        background: #f0f0f0;
      }
    }
  }

  .fileListContent {
    display: flex;
    flex-grow: 1;
    flex-direction: column;

    .head {
      font-size: 36px;
      padding: 12px 16px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .fileList {
      flex-grow: 1;
      background: #f0f0f0;
      overflow: auto;

      .loading {
        width: 100%;
        text-align: center;
        color: #b7b7b7;
        font-size: 42px;
        margin-top: 32px;
        line-height: 300px;
      }

      .empty {
        text-align: center;
        color: #5b5b5b;
        font-size: 36px;
        margin-top: 32px;
        line-height: 72px;
      }

      .fileItem {
        margin: 24px 12px;
        background: white;
        border-radius: 8px;
        padding: 12px;
        box-sizing: border-box;

        .name {
          font-size: 32px;
          line-height: 52px;
          border-bottom: solid 1px #d6d6d6;
          padding-bottom: 8px;
        }

        .buttons {
          margin-top: 32px;
          display: flex;
          justify-content: flex-end;

          >* {
            margin-left: 8px;
            padding-left: 14px;
            padding-right: 14px;

            :deep(.button_img) {
              margin-right: 4px;
            }
          }
        }
      }
    }
  }
}

@media (min-width: 900px) {
  .fileContent {
    .fileList {
      display: flex;
      flex-direction: row;
      align-items: center;
      flex-wrap: wrap;

      .fileItem {
        width: 48%;
        margin: 1%;

        .name {
          min-height: 2rem;
        }
      }
    }
  }
}

@media (min-width: 1025px) {
  .fileContent {
    .fileListContent {
      .fileList {
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;

        .fileItem {
          width: 31%;
          margin: 1%;

          .name {
            min-height: 2rem;
            font-size: 16PX;
          }
        }
      }
    }
  }
}

.chooseUseType {
  .chooseUseTypeInfo {
    .time {
      font-weight: bold;
      font-size: 38px;
      color: red;
      margin: 0 8px;
    }
  }

  .split {
    width: 100%;
    height: 2px;
    background-color: #b2b2b2;
    margin: 32px 0;
  }

  .chooseUseTypeTools {
    display: flex;
    align-items: center;
    justify-content: center;

    >div {
      margin: 8px;
      flex-grow: 1;
    }

    .cancel {
      height: 100px;
    }
  }
}

.printDialog {
  .title {
    font-size: 36px;
    line-height: 72px;
  }

  .list {
    font-size: 32px;
    line-height: 52px;
    padding: 8px;
    max-height: 400px;
    overflow: auto;
    border: solid 3px #d5d5d5;
    border-radius: 8px;

    .listItem {
      padding: 8px;
      text-align: left;
      border: solid 1px #d5d5d5;
      background-color: #f0f0f0;
      border-radius: 4px;
      margin-bottom: 8px;
    }

    :last-child {
      margin-bottom: 0;
    }
  }

  .addressTitle {
    font-size: 36px;
    line-height: 72px;
    margin-top: 16px;
  }

  .addressList {
    font-size: 32px;
    line-height: 52px;
    padding: 8px;
    max-height: 400px;
    overflow: auto;
    border: solid 3px #d5d5d5;
    border-radius: 8px;

    .addressItem {
      display: flex;
      flex-direction: row;
      padding: 12px;
      text-align: left;
      border: solid 2px #d5d5d5;
      background-color: #f0f0f0;
      border-radius: 4px;
      margin-bottom: 8px;

      .check {
        margin-right: 16px;
        flex-shrink: 0;
      }

      &.active {
        border: solid 2px #00795c;
        box-shadow: 0 0 4px #00795c;
        font-weight: bold;
        color: #00795c;
      }

      .name {
        font-size: 32px;
        line-height: 46px;
      }
    }

    :last-child {
      margin-bottom: 0;
    }
  }

  .tools {
    margin-top: 32px;
  }
}

@media (min-width: 1025px) {
  .subjects {
    height: 66px;

    .subjects_item {
      height: 100%;
      padding: 0;
      font-size: 24px;
      line-height: 66px;
      min-width: 120px;
      position: relative;

      &.active {
        color: #00795c;
        font-weight: bold;

        &::after {
          content: '';
          display: block;
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 4px;
          background-color: #04785c;
          border-radius: 2px;
        }
      }
    }
  }
}
</style>