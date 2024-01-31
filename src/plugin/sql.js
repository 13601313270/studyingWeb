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

const indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB

const dbModule = {
  sql(sql, callBack, isSelect) {
    if (navigator.userAgent.includes('windvane')) {
      // @ts-ignore
      window.WindVane.call('Db', 'sql', {
        sql,
        isSelect: !!isSelect,
      }, (res) => {
        callBack(res)
        // alert('success');
      }, () => {
        // alert('failure: ' + JSON.stringify(e));
      });
    } else {
      alert('分享' + ':' + title + "|" + url)
    }
  }
};//weex.requireModule('Db')
export default class {
  constructor(table, props) {
    this.table = table
    this.props = props
    let list = sqlConfig
    let listStr = list[this.table].map(item => {
      let type = 'text'
      if (item.type === Number) {
        type = 'integer'
      }
      return item.name + ' ' + type + (item.autoincrement === true ? ' primary key autoincrement' : '') + (item.notNull === true ? ' not null' : '')
    })

    this.dbExist = new Promise((resolve) => {
      dbModule.sql('create table if not exists ' + this.table + '(' + listStr.join(',') + ')', (res) => {
        resolve()
      })
    })
  }

  select(sql) {
    return new Promise((resolve) => {
      this.dbExist.then(() => {
        dbModule.sql(sql, (res) => {
          if (res.status === 'SUCCESS') {
            resolve(res.data)
          }
        }, true)
      })
    })
  }

  insert(object) {
    let allObject = arguments
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
        await this.dbExist
        sql.push(`(${value})`)

      }
      dbModule.sql(sqlBefore + sql.join(','), (res) => {
        resolve(res === '1')
      }, false)
    })

  }
}
