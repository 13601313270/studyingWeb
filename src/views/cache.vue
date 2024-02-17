<template>
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
  <Dialog :show="showDelete" title="是否确定清除本地缓存" @close="showDelete = false">
    <div style="margin-bottom: 20px;overflow: auto;">

    </div>
    <div style="display:flex;justify-content: space-around;">
      <Button text="取消" style="width: 40%" @click="showDelete = false"></Button>
      <Button text="确定" style="width: 40%" error @click="deleteCache"></Button>
    </div>
  </Dialog>
</template>

<script>
import toast from '../plugin/toast'
import request from '../plugin/request'
import Button from '../components/Button.vue'
import Dialog from '@/components/Dialog.vue';

const tableNameMap = {
  option: '单词创建记录',
  word: '单词库',
  wordRecord: '单词熟练度数据',
  wordTimeRecord: '单词背诵记录',
  enListenRecord: '英语听力记录',
}
export default {
  name: 'mine',
  data() {
    return {
      DBList: [],
      showDelete: false,
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      if (navigator.userAgent.includes('windvane')) {
        // @ts-ignore
        window.WindVane.call('Db', 'sql', {
          sql: 'select * from sqlite_master where type = "table"',
          isSelect: true,
        }, (res) => {
          // callBack(res)
          this.DBList = res.data.map(v => v.name);
        }, () => {
        });
      } else {
        var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
        var totalSize = 0;
        // 执行SQL查询语句
        db.transaction((tx) => {
          console.log('===1===')
          tx.executeSql("SELECT name FROM sqlite_master WHERE type='table';", [], (_, resultSet) => {
            console.log('===2===')
            const DBList = [];
            for (var i = 0; i < resultSet.rows.length; i++) {
              var tableName = resultSet.rows[i].name;
              console.log('===3===' + tableName)
              if (Object.keys(tableNameMap).includes(tableName)) {
                DBList.push(tableName)
              }
            }
            console.log('===4===' + DBList)
            this.DBList = DBList;
          }, null);
        });
      }
    },
    deleteCache() {
      if (navigator.userAgent.includes('windvane')) {
        this.DBList.forEach(v => {
          if (tableNameMap[v]) {
            // @ts-ignore
            window.WindVane.call('Db', 'sql', {
              sql: 'DROP TABLE ' + v,
              isSelect: true,
            }, (res) => {

            }, () => {
            });
          }
        });
        setTimeout(() => {
          this.showDelete = false
          this.init();
        }, 500);
      } else {
        var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
        var totalSize = 0;
        // 执行SQL查询语句
        db.transaction((tx) => {
          this.DBList.forEach(v => {
            if (tableNameMap[v]) {
              tx.executeSql('DROP TABLE ' + v, [], () => {
                // Log a message to the console indicating that the table was deleted
                console.log('Table tableName deleted successfully');
              });
            }
          })
        });
        this.showDelete = false
        this.init();
      }
    },
  },
  computed: {
    cacheListText() {
      const returnTextList = [];
      console.log('===========')
      console.log('===========')
      console.log('===========')
      console.log(this.DBList)
      this.DBList.forEach(v => {
        if (tableNameMap[v]) {
          returnTextList.push(tableNameMap[v])
        }
      })
      return returnTextList;
    }
  },
  components: { Button, Dialog },
}
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
