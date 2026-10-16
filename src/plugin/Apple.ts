import androidBridge from "./androidBridge";
import request from '@/plugin/request'

interface AppleCredential {
  authorizationCode: string;
  email: string;
  familyName: string;
  givenName: string;
  identityToken: string;
  result: boolean;
  user: string;
}

function login() {
  return new Promise<any>((resolve) => {
    if (navigator.userAgent.includes('studying1v1Android')) {
      androidBridge('apple', 'appleLogin', {
      }).then((res) => {
        resolve(res)
      })
    } else if (navigator.userAgent.includes('studying1v1')) {
      // @ts-ignore
      window.WindVane.call('apple', 'appleLogin', {}, ({ data }) => {
        resolve(data)
      });
      // @ts-ignore
    } else if (window.webkit && window.webkit.messageHandlers.jsUseWKWebView) {
      // @ts-ignore
      window.webkit.messageHandlers.jsUseWKWebView.postMessage({
        group: 'apple',
        type: 'appleLogin',
      }).then((credential: AppleCredential) => {
        console.log('credential', credential)
        request.post("/apple/login", credential).then((res: any) => {
          console.log('credential-receive', res)
          resolve({
            ...res,
            code: credential.user || credential.authorizationCode,
          });
        })
      })
    }
  })
}

export default {
  login,
}
