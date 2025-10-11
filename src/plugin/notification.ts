import bridge from "./bridge";

export function notification(title: string, body: string, hour: number, minute: number, second: number) {
  return new Promise<void>((resolve, reject) => {
    bridge('notification', 'sent', {
      title,
      body,
      hour,
      minute,
      second,
    }).then((res: boolean) => {
      if (res) {
        resolve();
      } else {
        alert('添加提醒失败，请检查权限设置')
        reject()
      }
    })
  })
}

export function removeNotification() {
  return new Promise<void>((resolve, reject) => {
    bridge('notification', 'remove').then((res: boolean) => {
      if (res) {
        resolve();
      } else {
        reject()
      }
    })
  })
}