import androidBridge from "./androidBridge";
import request from '@/plugin/request'

function isInstalled(): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    if (navigator.userAgent.includes('studying1v1Android')) {
      androidBridge('WeChat', 'isInstalled', {
      }).then((res) => {
        resolve(res.result)
      })
    } else if (navigator.userAgent.includes('studying1v1')) {
      // @ts-ignore
      window.WindVane.call('WeChat', 'isInstalled', {}, ({ data }) => {
        resolve(data)
      });
      // @ts-ignore
    } else if (window.webkit && window.webkit.messageHandlers.jsUseWKWebView) {
      // @ts-ignore
      window.webkit.messageHandlers.jsUseWKWebView.postMessage({
        type: 'WeChatIsInstalled',
      }).then((res: any) => {
        resolve(res);
      })
    }
  })
}

function login() {
  return new Promise<any>((resolve) => {
    if (navigator.userAgent.includes('studying1v1Android')) {
      androidBridge('WeChat', 'login', {
      }).then((res) => {
        console.log('!!!!!@@@@@@@', res)
        resolve(res.result)
      })
    } else if (navigator.userAgent.includes('studying1v1')) {
      // @ts-ignore
      window.WindVane.call('WeChat', 'login', {}, ({ data }) => {

      })
      // @ts-ignore
    } else if (window.webkit && window.webkit.messageHandlers.jsUseWKWebView) {
      // @ts-ignore
      window.webkit.messageHandlers.jsUseWKWebView.postMessage({
        type: 'WeChatLogin',
      }).then((code: any) => {
        request.post("/weChat/login", {
          code: code,
        }).then(res => {
          resolve({
            ...res,
            code: code,
          });
        })
      })
    }
  })
}

export default {
  isInstalled,
  login,
}
