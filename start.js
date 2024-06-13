#!/usr/bin/env node

const path = require('path')
const http = require('http');
const { semver, error } = require('@vue/cli-shared-utils')
const requiredVersion = require('./package.json').engines.node
const sqlite3 = require('sqlite3')

/**
 * 本地开发web服务
 */
if (!semver.satisfies(process.version, requiredVersion, { includePrerelease: true })) {
  error(
    `You are using Node ${process.version}, but vue-cli-service ` +
    `requires Node ${requiredVersion}.\nPlease upgrade your Node version.`
  )
  process.exit(1)
}

const Service = require("@vue/cli-service")
const service = new Service(process.env.VUE_CLI_CONTEXT || process.cwd())
const rawArgv = process.argv.slice(2)
const args = require('minimist')(rawArgv, {
  boolean: [
    // build
    // FIXME: --no-module, --no-unsafe-inline, no-clean, etc.
    'modern',
    'report',
    'report-json',
    'inline-vue',
    'watch',
    // serve
    'open',
    'copy',
    'https',
    // inspect
    'verbose'
  ]
})
const command = args._[0]
service.run(command, args, rawArgv).catch(err => {
  error(err)
  process.exit(1)
})

/**
 * 本地开发sqlite测试数据库启动
 */
const hostname = '127.0.0.1';
const port = 3011;
let DB_PATH = path.join(__dirname, '/Etc.End.db')

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');

  function connectDatabase() {
    return new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('--------------------connectDatabaseErr' + err.message);
      }
    });
  }


  /**
   * @Description: 创建数据库,如果用户本地没有数据库的话就创建否则跳过
   * @CreationDate 2023-05-10 13:44:48
   */
  function createDataTable() {
    /**
     * @Description: 创建用户表
     * @CreationDate 2023-06-01 22:53:23
     */

    db.serialize(function () {
      db.run('create table if not exists user (id INTEGER PRIMARY KEY AUTOINCREMENT, name text, email text, phone text);');
    });
    db.close();
  }

  const db = connectDatabase();
  createDataTable()

  console.log(111)

  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});