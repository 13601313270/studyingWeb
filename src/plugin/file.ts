import androidBridge from "./androidBridge";

function download(file: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (navigator.userAgent.includes('studying1v1Android')) {
      androidBridge('File', 'download', {
        url: file.replace('http://', 'https://')
      }).then(() => {
        resolve()
      })
    } else {
      // @ts-ignore
      window.WindVane.call('File', 'download', {
        url: file.replace('http://', 'https://')
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

function getDownLoadFileList() {
  return new Promise(resolve => {
    if (navigator.userAgent.includes('studying1v1Android')) {
      androidBridge('File', 'fileList').then(res => {
        resolve(res.result)
      })
    } else {
      // @ts-ignore
      window.WindVane.call('File', 'getDownloadPath', {}, (result) => {
        // @ts-ignore
        window.WindVane.call('File', 'fileList', { path: result.data }, (result) => {
          resolve(result.data)
        });
      });
    }
  })
}

export default {
  download,
  getDownLoadFileList,
}
