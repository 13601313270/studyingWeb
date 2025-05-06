import androidBridge from "./androidBridge";

function init(isFirst: boolean): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (navigator.userAgent.includes('studying1v1Android')) {
      androidBridge('Umeng', 'init', {
      }).then(() => {
        resolve()
      })
    } else if (navigator.userAgent.includes('studying1v1')) {
      // @ts-ignore
      window.WindVane.call('Umeng', 'init', {
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
        type: 'UmengInit',
        isFirst,
      }).then(() => {
        resolve();
      })
    }
  })
}

export default {
  init,
}
