import request from "./request";


export default function (action: string) {
  let platform: string = 'iphone';
  if (navigator.userAgent.includes('studying1v1Android')) {
    platform = 'android'
  } else if ((window as any).webkit && (window as any).webkit.messageHandlers.jsUseWKWebView) {
    platform = 'iphone'
  }
  console.log('======================log======================', action, platform);
  request.get('/log/' + platform + '/' + action + '?rand=' + +(Math.random() * 100000))
}