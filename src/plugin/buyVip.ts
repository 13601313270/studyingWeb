import androidBridge from "./androidBridge";
import Loading from "./loading";
import request from "./request";
import toast from "./toast";

let buySuccessCallback = () => {
  console.log('支付成功')
};
export function setBuyVipCallback(callback: () => void) {
  buySuccessCallback = callback;
}
export function buyVip(): Promise<void> {
  return new Promise((resolve, reject) => {
    function bridgeSuccess() {
      buySuccessCallback();
      request.put('/user/buyTip').then((res) => {
        resolve();
      })
    }
    const handle = Loading();
    // setTimeout(() => {
    //   handle.destory()// 如果用户没有走完购买程序，取消了，那么得能销毁。估计3秒，可以唤醒系统支付
    // }, 3000)
    // @ts-ignore
    if (window.Bridge) {
      androidBridge('pay', 'alipay').then((res) => {
        console.log('支付结果', res)
        handle.destory()
        if (res.result === true) {
          toast({
            'message': '感谢打赏',
            'duration': 3000
          })
          bridgeSuccess()
        } else {
          toast({
            'message': '未支付成功',
            'duration': 3000
          })
          reject()
        }
      })
      // @ts-ignore
    } else if (window.webkit && window.webkit.messageHandlers.jsUseWKWebView) {
      // @ts-ignore
      window.buy = function (result) {
        handle.destory()
        if (result !== 'error') {
          toast({
            'message': '感谢打赏' + result,
            'duration': 3000
          })
          bridgeSuccess()
        }
      }
      // ios的bridge
      // @ts-ignore
      window.webkit.messageHandlers.jsUseWKWebView.postMessage({
        type: 'pay'
      })
    } else {
      setTimeout(() => {
        bridgeSuccess()
      }, 1000)
    }
  })
}