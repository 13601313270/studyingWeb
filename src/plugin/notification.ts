export function notification(title: string, body: string, hour: number, minute: number, second: number) {
  return new Promise<void>((resolve, reject) => {
    if (navigator.userAgent.includes('studying1v1Android')) {

    } else if (navigator.userAgent.includes('windvane')) {

      // @ts-ignore
    } else if (window.webkit && window.webkit.messageHandlers.jsUseWKWebView) {
      // @ts-ignore
      window.webkit.messageHandlers.jsUseWKWebView.postMessage({
        type: 'notification',
        title,
        body,
        hour,
        minute,
        second,
      }).then((res: boolean) => {
        if (res) {
          resolve();
        } else {
          reject()
        }
      })
    }
  })
}

export function removeNotification() {
  return new Promise<void>((resolve, reject) => {
    if (navigator.userAgent.includes('studying1v1Android')) {

    } else if (navigator.userAgent.includes('windvane')) {

      // @ts-ignore
    } else if (window.webkit && window.webkit.messageHandlers.jsUseWKWebView) {
      // @ts-ignore
      window.webkit.messageHandlers.jsUseWKWebView.postMessage({
        type: 'removeNotification',
      }).then((res: boolean) => {
        if (res) {
          resolve();
        } else {
          reject()
        }
      })
    }
  })
}