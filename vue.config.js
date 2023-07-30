const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
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
  publicPath: '',
  configureWebpack: config => {
    if (process.env.NODE_ENV === "production") {
      // 为生产环境修改配置...
      config.mode = "production";
      //打包文件大小配置
      // config["performance"] = {
      //   "maxEntrypointSize":10000000,
      //   "maxAssetSize":30000000
      // }
      config.plugins.push(new webpack.DllReferencePlugin({
        manifest: require('./static/js/vueVendor-manifest.json'),
      }))
    } else {
      config.mode = "development";
      config.plugins.push(new webpack.DllReferencePlugin({
        manifest: require('./static/js/vueVendor-manifest.json'),
      }))
      // 为开发环境修改配置...
    }
    if (process.env.npm_config_report) {
      config.plugins.push(new BundleAnalyzerPlugin())
    }
  }
})
