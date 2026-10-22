<template>
  <Page title="缓存设置" foot-active="mine">
    <div class="content">
      <div class="title">缓存内容包括：</div>
      <div class="cacheList">
        <div v-if="DBList.length === 0" style="color: #aaa">
          暂无可以删除的缓存内容难过
        </div>
        <div v-for="(text, index) in cacheListText">
          {{ index + 1 }}、{{ text }}
        </div>
      </div>
      <Button text="清空本地缓存" error @click="showDelete = true"></Button>
    </div>
  </Page>
  <Dialog :show="showDelete" title="是否确定清除本地缓存" @close="showDelete = false">
    <div style="margin-bottom: 20px;overflow: auto;">

    </div>
    <div style="display:flex;justify-content: space-around;">
      <Button text="取消" style="width: 40%" @click="showDelete = false"></Button>
      <Button text="确定" style="width: 40%" error @click="deleteCache"></Button>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import Button from '@/components/Button.vue'
import Dialog from '@/components/Dialog.vue'
import Page from '@/components/Page.vue'
import file from '@/plugin/file'
import Toast from '@/plugin/toast'

// Web SQL Database 全局 API（非标准，但历史项目仍在使用）
declare const openDatabase: any

const tableNameMap: Record<string, string> = {
  option: '单词创建记录',
  word: '单词库',
  wordRecord: '单词熟练度数据',
  wordTimeRecord: '单词背诵记录',
  enListenRecord: '英语听力记录',
  enListenRecordNew: '英语听力记录',
}

const DBList = ref<string[]>([])
const showDelete = ref<boolean>(false)

onMounted(() => {
  init()
})

function init() {
  if (navigator.userAgent.includes('windvane')) {
    // @ts-ignore
    window.WindVane.call('Db', 'sql', {
      sql: 'select * from sqlite_master where type = "table"',
      isSelect: true,
    }, (res: any) => {
      DBList.value = res.data.map((v: any) => v.name)
    }, () => { })
  } else if (typeof openDatabase === 'function') {
    const db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024)
    db.transaction((tx: any) => {
      tx.executeSql("SELECT name FROM sqlite_master WHERE type='table';", [], (_: any, resultSet: any) => {
        const list: string[] = []
        for (let i = 0; i < resultSet.rows.length; i++) {
          const tableName = resultSet.rows[i].name
          if (Object.keys(tableNameMap).includes(tableName)) {
            list.push(tableName)
          }
        }
        DBList.value = list
      }, null)
    })
  }
}

async function deleteCache() {
  if (typeof openDatabase === 'function') {
    const db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024)
    db.transaction((tx: any) => {
      DBList.value.forEach(v => {
        if (tableNameMap[v]) {
          tx.executeSql('DROP TABLE ' + v, [], () => { }, null)
        }
      })
    })
  }
  await file.clearDownloadFiles();
  showDelete.value = false
  Toast({
    message: '清除成功',
  })
  init()
}

const cacheListText = computed<string[]>(() => {
  const returnTextList: string[] = []
  DBList.value.forEach(v => {
    if (tableNameMap[v]) {
      returnTextList.push(tableNameMap[v])
    }
  })
  return returnTextList
})
</script>

<style scoped lang="less">
.content {
  padding: 20px;
  box-sizing: border-box;
}

.title {
  font-size: 50px;
  margin-top: 50px;
  margin-bottom: 20px;
}

.cacheList {
  margin-bottom: 50px;
}
</style>
