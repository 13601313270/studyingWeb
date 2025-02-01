import Vue, { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Icon from './components/icon.vue'
import scroller from './components/scroller.vue'
import request from './plugin/request'
import refresh from './components/refresh.vue'
import loading from './components/loading.vue'

const app = createApp(App)

var events = require("events");
// 设置右侧按钮
let rightEmitter = new events.EventEmitter();
// @ts-ignore
app.config.globalProperties.setRightButton = function (buttons) {
  // @ts-ignore
  rightEmitter.emit("setButton", buttons);
};

// Vue.prototype.setRightButton = function (buttons) {
//   // @ts-ignore
//   rightEmitter.emit("setButton", buttons);
// }

// @ts-ignore
window.singleApp = app;

// 全局组件
app.component('icon', Icon)
app.component('scroller', scroller)
app.component('refresh', refresh)
app.component('loading', loading)

const platform = 'iphone';

app.config.globalProperties.$logAction = function (action: string) {
  request.get('/log/' + platform + '/' + action + '?rand=' + +(Math.random() * 100000))
}

app.use(store)
  .use(router)
  .mount('#app')

