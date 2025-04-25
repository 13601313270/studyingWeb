import androidBridge from "./androidBridge";

function toScore() {
  return new Promise<void>((resolve, reject) => {
    if (navigator.userAgent.includes('studying1v1Android')) {
      androidBridge('Share', 'toScore', {
      }).then(() => {
        resolve()
      })
      // @ts-ignore
    } else if (window.webkit && window.webkit.messageHandlers.jsUseWKWebView) {
      // @ts-ignore
      window.webkit.messageHandlers.jsUseWKWebView.postMessage({
        type: 'toScore',
      }).then((res: any) => {
        resolve();
      })
    } else {
      alert('请去应用市场评分')
    }
  })
}
export default toScore;
