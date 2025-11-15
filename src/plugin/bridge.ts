import androidBridge from "./androidBridge";

function iosBridge(group: string, method: string, param = {}): Promise<any> {
  console.log('=====7=====')
  return new Promise<any>((resolve, reject) => {
    console.log('=====8=====')
    console.log(window.webkit.messageHandlers.jsUseWKWebView.postMessage)
    // @ts-ignore
    window.webkit.messageHandlers.jsUseWKWebView.postMessage({
      group: group,
      type: method,
      ...param
    })
      .then((res: any) => {
        console.log('=====9.1=====')
        resolve(res)
      })
      .catch((error: any) => {
        console.log('=====9.2=====')
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
    return webBridge(group, method, param);
  }
}
function webBridge(group: string, method: string, param = {}) {
  return new Promise((resolve, reject) => {
    if (group === 'ad' && method === 'openAd') {
      resolve(null);
    } else if (group === 'UMeng' && method === 'init') {
      resolve(null);
    } else {
      reject(group + method);
    }
  })
}