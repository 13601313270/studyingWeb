import request from './request'

type icon = {
  img: string;
  name: string
}
let allIcons: {
  [key in string]: {
    path: string
  }
} = {}
export function init() {
  return new Promise((resolve, rej) => {
    // 无WindVane环境，比如本地开发
    const newMap: {
      [key in string]: {
        path: string
      }

    } = {
    }
    const result = [{ "id": 1, "img": "http:\/\/yingshijiaoyuimg.oss-cn-beijing.aliyuncs.com\/8c0f4bc778f194239f7e2f3ebd85aba5.png", "name": "icons" }, { "id": 2, "img": "http:\/\/yingshijiaoyuimg.oss-cn-beijing.aliyuncs.com\/5b86db6619a5e28e6d54c6b72ae0552c.png", "name": "more" }, { "id": 3, "img": "http:\/\/yingshijiaoyuimg.oss-cn-beijing.aliyuncs.com\/2ffce4a06b723c272fd4428768ccb3d7.png", "name": "back" }, { "id": 4, "img": "http:\/\/yingshijiaoyuimg.oss-cn-beijing.aliyuncs.com\/c40fe17b24b53c73070d283f71df8ead.png", "name": "main" }, { "id": 5, "img": "http:\/\/yingshijiaoyuimg.oss-cn-beijing.aliyuncs.com\/cf516f56eb0facd864c2ef40f46d84a1.png", "name": "main_active" }, { "id": 6, "img": "http:\/\/yingshijiaoyuimg.oss-cn-beijing.aliyuncs.com\/864eafe8b25f68f57873b0dbaf64859e.png", "name": "friend" }, { "id": 7, "img": "http:\/\/yingshijiaoyuimg.oss-cn-beijing.aliyuncs.com\/4512b1b509c4d09db0d4e7ab238a06de.png", "name": "friend_active" }, { "id": 8, "img": "http:\/\/yingshijiaoyuimg.oss-cn-beijing.aliyuncs.com\/e8099993e603d53908c9a8a21e0c1796.png", "name": "user" }, { "id": 9, "img": "http:\/\/yingshijiaoyuimg.oss-cn-beijing.aliyuncs.com\/d3028d6ed953c192ad28c70bc3632e78.png", "name": "user_active" }, { "id": 10, "img": "http:\/\/yingshijiaoyuimg.oss-cn-beijing.aliyuncs.com\/90a88a79d881d066f968e22385277fea.png", "name": "video" }, { "id": 11, "img": "http:\/\/yingshijiaoyuimg.oss-cn-beijing.aliyuncs.com\/923c6632610a7d8b886560896820258f.png", "name": "question" }, { "id": 12, "img": "http:\/\/yingshijiaoyuimg.oss-cn-beijing.aliyuncs.com\/2da653cb7d11a40532304702f80021b9.png", "name": "light" }, { "id": 13, "img": "http:\/\/yingshijiaoyuimg.oss-cn-beijing.aliyuncs.com\/55e10239ba3eda8b31eed5a248faf415.png", "name": "play" }, { "id": 14, "img": "http:\/\/yingshijiaoyuimg.oss-cn-beijing.aliyuncs.com\/839d8cad64ea6dcc6310864075a1f5e7.png", "name": "log" }, { "id": 15, "img": "http:\/\/yingshijiaoyuimg.oss-cn-beijing.aliyuncs.com\/84f155b468a15daf304fa7be8d28c817.png", "name": "stop" }, { "id": 16, "img": "http:\/\/yingshijiaoyuimg.oss-cn-beijing.aliyuncs.com\/6b31dc1aabeace2f0ee9376e80078f6f.png", "name": "right" }, { "id": 17, "img": "http:\/\/yingshijiaoyuimg.oss-cn-beijing.aliyuncs.com\/b1909977ab0fe8a371a6f232026b1f80.png", "name": "english" }, { "id": 18, "img": "http:\/\/yingshijiaoyuimg.oss-cn-beijing.aliyuncs.com\/30f2cea9dfd524f4dc7a55fe0bb54edb.png", "name": "right_black" }, { "id": 19, "img": "http:\/\/yingshijiaoyuimg.oss-cn-beijing.aliyuncs.com\/ee4c9ca80210f4c6401763de1f9fc760.png", "name": "close" }, { "id": 20, "img": "http:\/\/yingshijiaoyuimg.oss-cn-beijing.aliyuncs.com\/0157d88a088b433afe465f4973d62a6a.png", "name": "icon_green" }, { "id": 21, "img": "http:\/\/yingshijiaoyuimg.oss-cn-beijing.aliyuncs.com\/14acdbb0e835994a131fe28166d710e9.png", "name": "check" }, { "id": 22, "img": "http:\/\/yingshijiaoyuimg.oss-cn-beijing.aliyuncs.com\/93607584cee201569be9c883f04936ab.png", "name": "warning" }, { "id": 23, "img": "http:\/\/yingshijiaoyuimg.oss-cn-beijing.aliyuncs.com\/ae3280c0a2eecb0fd02d6fa27ecced32.png", "name": "best" }, { "id": 24, "img": "http:\/\/yingshijiaoyuimg.oss-cn-beijing.aliyuncs.com\/a709332149b3d1f81355f9d11be1fcbb.png", "name": "buy" }, { "id": 25, "img": "http:\/\/yingshijiaoyuimg.oss-cn-beijing.aliyuncs.com\/9c1dbb82ef4355423af9628e6a67ab8b.png", "name": "comment" }, { "id": 26, "img": "http:\/\/yingshijiaoyuimg.oss-cn-beijing.aliyuncs.com\/db25c75a10d29d7afc8573c933b21898.png", "name": "disable" }, { "id": 27, "img": "http:\/\/yingshijiaoyuimg.oss-cn-beijing.aliyuncs.com\/4c907f7664a3c811d04a0393ba1e2eed.png", "name": "search" }, { "id": 28, "img": "http:\/\/yingshijiaoyuimg.oss-cn-beijing.aliyuncs.com\/528834df992ab403f5976f97a60a37a2.png", "name": "wechat" }, { "id": 29, "img": "http:\/\/yingshijiaoyuimg.oss-cn-beijing.aliyuncs.com\/f5578a88e7dcb5be7dd16c00c7b95e05.png", "name": "user_shield" }, { "id": 30, "img": "http:\/\/yingshijiaoyuimg.oss-cn-beijing.aliyuncs.com\/f59054861db5a2425bc3582160cc4c63.png", "name": "police" }, { "id": 31, "img": "http:\/\/yingshijiaoyuimg.oss-cn-beijing.aliyuncs.com\/b23bb603b41a95734a2f849b7b337eb6.png", "name": "share" }, { "id": 32, "img": "http:\/\/yingshijiaoyuimg.oss-cn-beijing.aliyuncs.com\/1252f71a2ee62754ca2759def69f63e9.png", "name": "recycle" }, { "id": 33, "img": "http:\/\/yingshijiaoyuimg.oss-cn-beijing.aliyuncs.com\/ad89a82db45d586bc20d5f4ce1f30196.png", "name": "recycle_white" }, { "id": 34, "img": "http:\/\/yingshijiaoyuimg.oss-cn-beijing.aliyuncs.com\/6b99af2718ec4377595246be1024fb7b.png", "name": "add" }, { "id": 35, "img": "http:\/\/yingshijiaoyuimg.oss-cn-beijing.aliyuncs.com\/7079cd94cdbf63b7503b99e91915f4b7.png", "name": "config" }, { "id": 36, "img": "http:\/\/yingshijiaoyuimg.oss-cn-beijing.aliyuncs.com\/a6da38146ffb218271901201d70c397e.png", "name": "file" }, { "id": 37, "img": "http:\/\/yingshijiaoyuimg.oss-cn-beijing.aliyuncs.com\/a6c34aaf05a9fa0a55aed4e62cc0ce8a.png", "name": "file_active" }, { "id": 38, "img": "https:\/\/yingshijiaoyuimg.oss-cn-beijing.aliyuncs.com\/04731961b7feed0bec9c8b6ce36c3ec0.png", "name": "word" }, { "id": 39, "img": "https:\/\/yingshijiaoyuimg.oss-cn-beijing.aliyuncs.com\/7b725351dbfc256c5129f99065f0a482.png", "name": "listen" }, { "id": 40, "img": "https:\/\/yingshijiaoyuimg.oss-cn-beijing.aliyuncs.com\/f9e2a1917ac48f23615cd3b1587990a4.png", "name": "next_white" }];
    result.forEach(v => {
      newMap[v.name] = {
        path: v.img
      }
    })
    allIcons = newMap
    resolve(true)
  })
}
export function getAllIcons(): {
  [key in string]: {
    path: string
  }
} {
  return allIcons;
}