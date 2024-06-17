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
export default {
  isInstalled,
}
