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
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

  function connectDatabase() {
    return new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('--------------------connectDatabaseErr' + err.message);
      }
    });
  }
  const db = connectDatabase();
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString(); // 转换为字符串
    });
    req.on('end', () => {
      const parsedData = JSON.parse(body);
      // 处理请求体数据
      console.log("收到sql请求：" + JSON.stringify(parsedData.sql));
      if (parsedData.sql.match(/^INSERT/)) {
        db.run(parsedData.sql, (err) => {
          if (err) {
            console.log(err)
          }
          res.end(err ? '0' : '1');
        });
      } else {
        db.all(parsedData.sql, (err, rows) => {
          console.log(rows)
          res.end(JSON.stringify(rows));
        });
      }
      db.close();
    });
  } else {
    res.end();
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});