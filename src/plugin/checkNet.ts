import androidBridge from "./androidBridge";

// 检测客户端网络权限
function check(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (navigator.userAgent.includes('studying1v1Android')) {
      androidBridge('checkNet', 'check', {
      }).then(() => {
        resolve()
      })
    } else if (navigator.userAgent.includes('studying1v1')) {
      // @ts-ignore
      window.WindVane.call('checkNet', 'check', {
      },
        () => {
          resolve();
        },
        (err: any) => {
          reject(err)
        });
      // @ts-ignore
    } else if (window.webkit && window.webkit.messageHandlers.jsUseWKWebView) {
      // @ts-ignore
      window.webkit.messageHandlers.jsUseWKWebView.postMessage({
        type: 'checkNet',
      }).then(() => {
        resolve();
      })
    }
  })
}

export default {
  check,
}
