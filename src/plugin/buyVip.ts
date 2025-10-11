import androidBridge from "./androidBridge";
import Loading from "./loading";
import request from "./request";
import toast from "./toast";
import bridge from "./bridge";

let buySuccessCallback = () => {
  console.log('支付成功')
};
export function setBuyVipCallback(callback: () => void) {
  buySuccessCallback = callback;
}
export function buyVip(product: 'studyingMonthVIP' | 'studyingYearVIP'): Promise<void> {
  return new Promise((resolve, reject) => {
    function bridgeSuccess() {
      request.put('/user/buyVip').then((res) => {
        if (res) {
          buySuccessCallback();
          resolve();
        } else {
          reject();
        }
      })
    }
    const handle = Loading();
    // setTimeout(() => {
    //   handle.destory()// 如果用户没有走完购买程序，取消了，那么得能销毁。估计3秒，可以唤醒系统支付
    // }, 3000)
    // @ts-ignore
    if (window.Bridge) {
      bridge('pay', 'alipay', { product }).then((res) => {
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
    } else if (window.webkit && window.webkit.messageHandlers.jsUseWKWebView) {
      bridge('pay', 'applePay', {
        product
      }).then((res) => {
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
    } else {
      setTimeout(() => {
        handle.destory()
        bridgeSuccess()
      }, 3000)
    }
  })
}
export function subscribe(product: 'studyingVIPMonth'): Promise<void> {
  /** 
   * 返回结果说明
    1、购买成功
    {
      "result": true,
      "transaction": 交易 ID，用于和服务器端的消息对账
    }
    2、交易未验证
    {
      "result": false,
      "code": 2,
      "reason": "交易未验证"
    }
    3、用户取消购买
    {
      "result": false,
      "code": 3,
      "reason": "用户取消购买"
    }
    4、等待审批中
    {
      "result": false,
      "code": 4,
      "reason": "等待审批中" //家人共享 / 家长审批，付款方式待处理（信用卡未扣款成功、Apple ID 余额不足交易会保持挂起状态，直到用户在钱包或设置里完成支付。）可以提示用户稍后在「设置」或「家人共享」里批准购买
    }
    5、购买出错
    {
      "result": false,
      "code": 5,
      "reason": "购买出错:xxxxxxxx"
    }
  */
  return new Promise((resolve, reject) => {
    function subscribeSuccess(transaction: string) {
      request.put('/user/subscribe', {
        transaction,
      }).then((res) => {
        if (res) {
          buySuccessCallback();
          handle.destory()
          resolve();
        } else {
          handle.destory()
          reject();
        }
      }).catch(() => {
        handle.destory()
        reject();
      })
    }
    const handle = Loading();
    bridge('pay', 'subscribe', {
      product
    }).then((res) => {
      console.log('支付结果', res)
      if (res.result === true) {
        toast({
          'message': '支付成功',
          'duration': 3000
        })
        setTimeout(() => {
          subscribeSuccess(res.transaction)
        }, 1000)
      } else {
        handle.destory()
        toast({
          'message': '未支付成功',
          'duration': 3000
        })
        reject()
      }
    })
  })
}