const path = require('path');
module.exports = ({ file }) => {
  const designWidth = 750;// file.includes(path.join('node_modules', 'vant')) ? 375 : 750;// vant团队是根据375px的设计稿去做的
  return {
    plugins: {
      'postcss-pxtorem': {
        rootValue: 75, // 根元素字体大小，通常设置为设计稿宽度/10，即750/10=75，但为了方便计算通常取37.5（基于iPhone6的设计稿）
        unitPrecision: 5, // 保留的小数点位数
        propList: ['*'], // 可以从px更改为rem的属性
        selectorBlackList: ['.ignore', '.hairlines', '.ig-'], // 忽略的选择器
        minPixelValue: 1, // 小于或等于`1px`的不转换
        mediaQuery: false, // 允许在媒体查询中转换px
        exclude: /node_modules/i // 排除 node_modules 文件夹下的文件
      }

    }
  }
}