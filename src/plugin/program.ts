import androidBridge from "./androidBridge";

function exit(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (navigator.userAgent.includes('studying1v1Android')) {
      androidBridge('Program', 'exit', {
      }).then(() => {
        resolve()
      })
    } else if (navigator.userAgent.includes('studying1v1')) {
      // @ts-ignore
      window.WindVane.call('Program', 'exit', {
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
        type: 'exit',
      }).then((res: any) => {
        resolve();
      })
    }
  })
}

export default {
  exit,
}
