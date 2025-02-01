const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    // host: 'dev.studying1v1.com',
    // allowedHosts: ['dev.studying1v1.com','local.studying1v1.com']
    proxy: {
      '/api': { // 匹配请求路径，localhost:3000/snow
        target: 'https://api.studying1v1.com/', // 代理的目标地址
        changeOrigin: true, // 开发模式，默认的origin是真实的 origin:localhost:3000 代理服务会把origin修改为目标地址
        // secure: true, // 是否https接口
        // ws: true, // 是否代理websockets
        pathRewrite: {
          "^/api": ""
        },
      }
    },
  },
  // publicPath: process.env.NODE_ENV === 'production' ? '/dist/' : '',
  publicPath: '',
})
