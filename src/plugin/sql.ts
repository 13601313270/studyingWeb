import androidBridge from "./androidBridge";

// 表配置
let sqlConfig: {
  [key in string]: Array<{
    name: string,
    type: NumberConstructor | StringConstructor,
    autoincrement?: boolean,
    notNull?: boolean,
  }>
} = {
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
    // {
    //   name: 'read_date',
    //   notNull: true
    // },
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
  sql(table: string, sql: string, callBack: any, isSelect: boolean) {
    if (navigator.userAgent.includes('studying1v1Android')) {
      androidBridge('Db', 'sql', {
        sql,
        isQuery: isSelect,
      }).then(({ result }) => {
        if (isSelect) {
          const list = result.map((item: any) => {
            const itemUpdate: any = {}
            Object.keys(item).forEach(key => {
              const findInfo = sqlConfig[table].find(v => v.name === key)
              if (findInfo && findInfo.type === Number) {
                itemUpdate[key] = +(item[key])
              } else {
                itemUpdate[key] = item[key]
              }
            })
            return itemUpdate;
          })
          callBack({
            status: 'SUCCESS',
            data: list,
          });
        } else {
          callBack({
            status: 'SUCCESS',
            data: true,
          });
        }
      })
    } else if (navigator.userAgent.includes('windvane')) {
      // @ts-ignore
      window.WindVane.call('Db', 'sql', {
        sql,
        isSelect: !!isSelect,
      }, (res: any) => {
        callBack(res)
      }, () => {
      });
      // @ts-ignore
    } else if (window.webkit && window.webkit.messageHandlers.jsUseWKWebView) {
      // @ts-ignore
      window.webkit.messageHandlers.jsUseWKWebView.postMessage({
        type: 'sql',
        sql: sql,
        isQuery: !!isSelect,
      }).then((res: any) => {
        console.log('sqlsqlsq=====select---result', res)
        console.log('sqlsqlsq=====select---result', JSON.parse(res))
        callBack({
          status: 'SUCCESS',
          data: JSON.parse(res),
        })
      })
    } else {
      if (isSelect) {
        fetch('http://127.0.0.1:3011/', {
          method: 'POST',
          body: JSON.stringify({
            sql: sql
          }),
        })
          .then(res => res.json())
          .then((results: any) => {
            const list = [];
            // console.log('=======', results)
            const len = results.length;
            for (let i = 0; i < len; i++) {
              list.push(results[i]);
            }
            callBack({
              status: 'SUCCESS',
              data: list,
            });
          })
      } else {
        fetch('http://127.0.0.1:3011/', {
          method: 'POST',
          body: JSON.stringify({
            sql: sql
          }),
        }).then((res) => {
          callBack(res);
        })
      }
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
  table: string;
  constructor(table: string) {
    this.table = table
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
    this.dbExist = new Promise<void>((resolve) => {
      if (navigator.userAgent.includes('studying1v1Android')) {
        androidBridge('Db', 'sql', {
          sql: 'create table if not exists ' + table + '(' + listStr.join(',') + ')',
          isQuery: false,
        }).then(() => {
          resolve()
        })
        // @ts-ignore
      } else if (window.webkit && window.webkit.messageHandlers.jsUseWKWebView) {
        // @ts-ignore
        window.webkit.messageHandlers.jsUseWKWebView.postMessage({
          type: 'sql',
          sql: 'create table if not exists ' + table + '(' + listStr.join(',') + ')',
          isQuery: false,
        }).then((res: any) => {
          resolve(res)
        })
      } else {
        fetch('http://127.0.0.1:3011/', {
          method: 'POST',
          body: JSON.stringify({
            sql: 'create table if not exists ' + table + '(' + listStr.join(',') + ')'
          }),
        }).then(() => {
          resolve()
        })
      }
    })
  }

  select(sql: string) {
    return new Promise((resolve) => {
      // console.log('isReaded---0.1');
      // @ts-ignore
      this.dbExist.then(() => {
        // console.log('isReaded---0.2');
        // console.log('sql----->', sql)
        dbModule.sql(this.table, sql, (res: any) => {
          // console.log('isReaded---0.3', res);
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
      console.log(2.1)
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
        console.log('2.1.1')
        // @ts-ignore
        await this.dbExist
        console.log('2.1.2')
        sql.push(`(${value})`)

      }
      console.log(2.2)
      dbModule.sql(this.table, sqlBefore + sql.join(','), (res: any) => {
        console.log(2.3)
        if (navigator.userAgent.includes('studying1v1Android')) {
          console.log(2.4)
          resolve(true)
        } else {
          resolve(res === '1')
        }
      }, false)
    })
  }
}
