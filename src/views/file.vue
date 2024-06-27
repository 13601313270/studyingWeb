<template>
  <div style="display:flex;flex-direction: column;">
    <div class="subjects">
      <div class="subjects_scroll" ref="subjectScroll">
        <text ref="start" key="start"></text>
        <div class="subjectScroll">
          <div :key="subject.id" v-for="subject in subjects" @click="changeSubject(subject.id)" class="subjects_item">
            <text :key="subject.id" :class="[+selectSub === subject.id ? 'subjects_item_select' : '']">{{ subject.name
            }}</text>
          </div>
        </div>
        <div key="end" class="subjects_item_bottomBorder" ref="subjectBorder"
          :style="{ left: subjects.map(item => item.id).indexOf(+selectSub) * 22.7 + 4.5 + 'vw' }"></div>
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
      <div class="fileList">
        <div v-if="loading" class="loading">加载中...</div>
        <div v-else-if="!loading && fileList.length === 0" class="loading">该分类下暂无资料</div>
        <div v-for="file in fileList" class="fileItem" :key="file.id">
          <div class="name">{{ file.title }}</div>
          <div class="buttons" v-if="Object.keys(downLoadFile).includes(file.file.split('/').slice(-1)[0])">
            <Button @click="share(file)" icon="share" text="分享" />
            <Button text="打开" @click="open(downLoadFile[file.file.split('/').slice(-1)[0]])"
              v-if="Object.keys(downLoadFile).includes(file.file.split('/').slice(-1)[0])"></Button>
            <Button :text="downLoading[file.file] ? '下载中' : '重新下载'" :disabled="downLoading[file.file]"
              @click="download(file)"></Button>
          </div>
          <div v-else class="buttons">
            <Button @click="share(file)" icon="share" text="分享" />
            <Button :text="downLoading[file.file] ? '下载中' : '下载'" @click="download(file)"
              :disabled="downLoading[file.file]"></Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import request from '@/plugin/request'
import Button from '@/components/Button.vue'
import share from '../plugin/share'
import File from '@/plugin/file'

export default {
  data() {
    return {
      subjects: [],
      selectSub: -1,
      sourceList: [],
      selectCourse: -1,
      fileList: [],
      downLoadList: [],
      loading: false,
      downLoading: {

      },
    }
  },
  async created() {
    this.loading = true;
    this.subjects = await request.get('/subjectV2');
    const selectSub = await localStorage.getItem('sourceFileChoose')
    this.selectSub = selectSub || this.subjects[0].id;
    this.refresh();
  },
  methods: {
    changeSubject(id) {
      this.selectSub = id;
      this.fileList = [];
      this.loading = true;
      localStorage.setItem('sourceFileChoose', id)
      this.refresh();
    },
    async refresh() {
      this.sourceList = [];
      this.sourceList = await request.get('/subjectSourceV2/' + this.selectSub);
      this.changeSource(this.sourceList[0])
    },
    async changeSource(course) {
      this.fileList = [];
      this.selectCourse = course.id;
      this.initDownLoadList()
      this.loading = true;
      request.get('/file/list', {
        params: {
          course: course.id,
          status: 0,
        }
      }).then(data => {
        this.fileList = data;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      })
    },
    initDownLoadList() {
      File.getDownLoadFileList().then(res => {
        this.downLoadList = res;
      })
    },
    download(file) {
      this.downLoading[file.file] = true;
      File.download(file.file)
        .then(() => {
          this.downLoading[file.file] = false;
          this.initDownLoadList();
        })
        .catch((err) => {
          alert(JSON.stringify(err))
        })
    },
    open(path) {
      File.open(path);
    },
    share(file) {
      const url = file.file.replace('http://', 'https://');
      share(file.title, 'https://api.studying1v1.com/page/file?file=' + encodeURIComponent(url), '高中试题分享')
    }
  },
  computed: {
    downLoadFile() {
      const map = {};
      this.downLoadList.forEach(v => {
        const paths = v.path.split('/');
        map[paths[paths.length - 1]] = v.path;
      })
      return map;
    }
  },
  components: {
    Button
  }
}
</script>
<style lang="less" scoped>
.subjects {
  width: 750px;
  height: 100px;
  display: flex;
  flex-shrink: 0;
  flex-direction: row;
  border-bottom-color: #afafaf;
  border-bottom-width: 1px;
  border-bottom-style: solid;

  &_scroll {
    width: 750px;
    flex-direction: row;
    align-items: center;
    height: 100px;
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

  &_item {
    font-size: 42px;
    min-width: 110px;
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

  .fileList {
    flex-grow: 1;
    background: #f0f0f0;
    overflow: auto;

    .loading {
      text-align: center;
      color: #5b5b5b;
      font-size: 36px;
      margin-top: 32px;
      line-height: 72px;
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

          :deep .button_img {
            margin-right: 4px;
          }
        }
      }
    }
  }
}
</style>