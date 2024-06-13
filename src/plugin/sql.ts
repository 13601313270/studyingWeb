import androidBridge from "./androidBridge";

// 表配置
let sqlConfig = {
  option: [
    {
      name: 'id',
      type: Number,
      autoincrement: true,
      notNull: true
    },
    {
      name: 'name',
      type: String,
      notNull: true
    },
    {
      name: 'val',
      type: String,
      notNull: true
    }
  ],
  word: [
    {
      name: 'id',
      type: Number,
      autoincrement: true,
      notNull: true
    },
    {
      name: 'word',
      type: String,
      notNull: true
    },
    {
      name: 'count',
      type: Number,
      notNull: true
    },
    {
      name: 'translate',
      type: String
    }
    // 1 2 3 4 5 6 7 8
  ],
  wordRecord: [
    {
      name: 'id',
      type: Number,
      autoincrement: true,
      notNull: true
    },
    {
      name: 'word',
      type: String,
      notNull: true
    },
    {
      name: 'deep',
      type: Number,
      notNull: true
    },
    {
      name: 'showTime',
      type: String
    }
  ],
  wordTimeRecord: [
    {
      name: 'id',
      type: Number,
      autoincrement: true,
      notNull: true
    },
    {
      name: 'date',
      type: String,
      notNull: true
    },
    {
      name: 'wordCount',
      type: Number,
      notNull: true
    },
    {
      name: 'know',
      type: Number,
      notNull: true
    },
    {
      name: 'dontKnow',
      type: Number,
      notNull: true
    }
  ],
  enListenRecord: [
    {
      name: 'id',
      type: Number,
      notNull: true
    },
    {
      name: 'date',
      type: String,
      notNull: true
    },
  ],
  readFinish: [
    {
      name: 'id',
      type: Number,
      autoincrement: true,
      notNull: true
    },
    {
      name: 'article_id',
      type: Number,
      notNull: true
    }
  ],
  readRecordFinish: [
    {
      name: 'id',
      type: Number,
      autoincrement: true,
      notNull: true
    },
    {
      name: 'read_date',
      notNull: true
    },
    {
      name: 'article_id',
      type: Number,
      notNull: true
    }
  ],
  listenFinish: [
    {
      name: 'id',
      type: Number,
      autoincrement: true,
      notNull: true
    },
    {
      name: 'article_id',
      type: Number,
      notNull: true
    }
  ]
}

// @ts-ignore
const indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB

const dbModule = {
  sql(sql: string, callBack: any, isSelect: boolean) {
    if (navigator.userAgent.includes('studying1v1Android')) {
      androidBridge('File', 'download', {
        // @ts-ignore
        url: file.replace('http://', 'https://')
      }).then(() => {
        // @ts-ignore
        resolve()
      })
    } else if (navigator.userAgent.includes('windvane')) {
      // @ts-ignore
      window.WindVane.call('Db', 'sql', {
        sql,
        isSelect: !!isSelect,
      }, (res: any) => {
        callBack(res)
        // alert('success');
      }, () => {
        // alert('failure: ' + JSON.stringify(e));
      });
    } else {
      alert(1)
      fetch('http://127.0.0.1:3011/')
      // @ts-ignore
      // var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
      // // @ts-ignore
      // db.transaction(function (tx) {
      //   if (isSelect) {
      //     // @ts-ignore
      //     tx.executeSql(sql, [], function (tx, results) {
      //       const list = [];
      //       const len = results.rows.length;
      //       for (let i = 0; i < len; i++) {
      //         list.push(results.rows.item(i));
      //       }
      //       callBack({
      //         status: 'SUCCESS',
      //         data: list,
      //       });
      //     }, null); //查询和回调
      //   } else {
      //     callBack(tx.executeSql(sql));
      //   }
      // });
    }
  }
};//weex.requireModule('Db')
export default class {
  constructor(table: string, props: any) {
    // @ts-ignore
    this.table = table
    // @ts-ignore
    this.props = props
    let list = sqlConfig
    // @ts-ignore
    let listStr = list[this.table].map(item => {
      let type = 'text'
      if (item.type === Number) {
        type = 'integer'
      }
      return item.name + ' ' + type + (item.autoincrement === true ? ' primary key autoincrement' : '') + (item.notNull === true ? ' not null' : '')
    })

    // @ts-ignore
    this.dbExist = new Promise((resolve) => {
      if (navigator.userAgent.includes('studying1v1Android')) {

      } else {
        fetch('http://127.0.0.1:3011/').then(res => {
          console.log(res)
          alert(JSON.stringify(res))
        })
        // dbModule.sql('create table if not exists ' + this.table + '(' + listStr.join(',') + ')', (res) => {
        //   resolve()
        // })
      }
    })
  }

  select(sql: string) {
    return new Promise((resolve) => {
      // @ts-ignore
      this.dbExist.then(() => {
        dbModule.sql(sql, (res: any) => {
          if (res.status === 'SUCCESS') {
            resolve(res.data)
          }
        }, true)
      })
    })
  }

  insert(object: any) {
    let allObject = arguments
    // @ts-ignore
    let table = this.table
    return new Promise(async (resolve) => {
      let sql = []
      let sqlBefore = `INSERT INTO ${table} (${Object.keys(allObject[0]).join(',')}) VALUES `
      for (object of allObject) {
        let value = Object.values(object).map((item) => {
          if (typeof item === 'number') {
            return item
          } else {
            return '"' + item + '"'
          }
        }).join(',')
        // @ts-ignore
        await this.dbExist
        sql.push(`(${value})`)

      }
      dbModule.sql(sqlBefore + sql.join(','), (res: any) => {
        resolve(res === '1')
      }, false)
    })
  }
}
