const path = require('path')
const webpack = require('webpack')
// const config = require('../config')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

const dllConfig = {
  // 要打包的模块的数组
  entry: {
    vueVendor: [
      'core-js',
      'vue',
      'vue-class-component/dist/vue-class-component.esm-bundler.js',
      'vue-router',
      'axios',
      'vuex/dist/vuex.esm-bundler.js',
      'vue-image-swipe',
      // 'vue-router/dist/vue-router.esm.js',
      // 'es6-promise',
      'regenerator-runtime',
      // 'vue-drag-2.0',
      // 'vue-m-carousel',
    ],
  },
  mode: 'development',//'production',
  output: {
    path: path.join(__dirname, '../static/js'), // 打包后文件输出的位置
    filename: '[name].dll.js',
    library: '[name]_library' // 与webpack.DllPlugin中的`name: '[name]_library',`保持一致。
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, '../static/js', '[name]-manifest.json'),
      name: '[name]_library',
      context: path.join(__dirname, '..')
    }),
  //   // Ignore all locale files of moment.js
  //   new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ]
}

// if (config.build.bundleAnalyzerReport) {
//   dllConfig.plugins.push(new BundleAnalyzerPlugin())
// }
module.exports = dllConfig
