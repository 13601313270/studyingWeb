import androidBridge from "./androidBridge";

function isInstalled() {
  return new Promise<boolean>((resolve, reject) => {
    if (navigator.userAgent.includes('studying1v1Android')) {
      androidBridge('WeChat', 'isInstalled', {
      }).then((res) => {
        resolve(res.result)
      })
    } else if (navigator.userAgent.includes('studying1v1')) {
      // @ts-ignore
      window.WindVane.call('WeChat', 'isInstalled', {}, ({ data }) => {
        resolve(data)
      });
    }
  })
}

function login() {
  return new Promise<void>((resolve) => {
    if (navigator.userAgent.includes('studying1v1Android')) {
      androidBridge('WeChat', 'login', {
      }).then((res) => {
        console.log('!!!!!@@@@@@@', res)
        resolve(res.result)
      })
    } else if (navigator.userAgent.includes('studying1v1')) {
      // @ts-ignore
      window.WindVane.call('WeChat', 'login', {}, ({ data }) => {

      })
    }
  })
}

export default {
  isInstalled,
  login,
}
