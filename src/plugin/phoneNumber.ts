import androidBridge from "./androidBridge";

export function getToken(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    if (navigator.userAgent.includes('studying1v1Android')) {
      //   androidBridge('Umeng', 'init', {
      //   }).then(() => {
      //     resolve()
      //   })
    } else if (navigator.userAgent.includes('studying1v1')) {
      // @ts-ignore
      //   window.WindVane.call('getPhoneToken', 'get', {
      //   },
      //     () => {
      //       resolve();
      //     },
      //     (err: any) => {
      //       reject(err)
      //     });
      // @ts-ignore
    } else if (window.webkit && window.webkit.messageHandlers.jsUseWKWebView) {
      // @ts-ignore
      window.webkit.messageHandlers.jsUseWKWebView.postMessage({
        group: 'phone',
        type: 'getPhoneToken',
      }).then((res: string) => {
        resolve(res);
      })
    }
  })
}