import androidBridge from "./androidBridge";

function iosBridge(group: string, method: string, param = {}): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    // @ts-ignore
    window.webkit.messageHandlers.jsUseWKWebView.postMessage({
      group: group,
      type: method,
      ...param
    })
      .then((res: any) => {
        resolve(res)
      })
      .catch((error: any) => {
        reject(error)
      });
  })
}

export default function (group: string, method: string, param = {}): Promise<any> {
  if (window.Bridge) {
    return androidBridge(group, method, param);
  } else if (window.webkit && window.webkit.messageHandlers.jsUseWKWebView) {
    return iosBridge(group, method, param);
  } else {
    return webBridge();
  }
}
function webBridge() {
  return new Promise((resolve, reject) => {
    reject();
  })
}