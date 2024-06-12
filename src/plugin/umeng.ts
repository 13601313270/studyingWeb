import androidBridge from "./androidBridge";

function init(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (navigator.userAgent.includes('studying1v1Android')) {
      androidBridge('Umeng', 'init', {
      }).then(() => {
        resolve()
      })
    } else if (navigator.userAgent.includes('studying1v1')) {
      // @ts-ignore
      window.WindVane.call('Umeng', 'init', {
      },
        () => {
          resolve();
        },
        (err: any) => {
          reject(err)
        });
    }
  })
}

export default {
  init,
}
