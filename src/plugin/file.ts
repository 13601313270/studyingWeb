import androidBridge from "./androidBridge";

function download(file: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (navigator.userAgent.includes('studying1v1Android')) {
      androidBridge('File', 'download', {
        url: file.replace('http://', 'https://')
      }).then(() => {
        resolve()
      })
    } else if (navigator.userAgent.includes('windvane')) {
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
      // @ts-ignore
    } else if (window.webkit && window.webkit.messageHandlers.jsUseWKWebView) {
      // @ts-ignore
      window.webkit.messageHandlers.jsUseWKWebView.postMessage({
        group: 'file',
        type: 'FileDownload',
        url: file.replace('http://', 'https://'),
      }).then((res: any) => {
        resolve();
      })
    } else {
      console.log('模拟download', file)
    }
  })
}
function open(file: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (navigator.userAgent.includes('studying1v1Android')) {
      androidBridge('File', 'open', {
        url: file
      }).then(() => {
        resolve()
      })
    } else if (navigator.userAgent.includes('windvane')) {
      // @ts-ignore
      window.WindVane.call('File', 'open', {
        url: file
      },
        () => {
          resolve();
        },
        (err: any) => {
          reject(err)
        });
      // @ts-ignore
    } else if (window.webkit && window.webkit.messageHandlers.jsUseWKWebView) {
      // @ts-ignore
      window.webkit.messageHandlers.jsUseWKWebView.postMessage({
        group: 'file',
        type: 'openDownloadFile',
        fileName: file,
      }).then((res: any) => {
        console.log('openDownloadFile', res)
        console.log('openDownloadFile', JSON.parse(res))
        resolve();
      })
    }
  })
  // window.WindVane.call('File', 'openFile', { path },
  //   () => {
  //   },
  //   (err) => {
  //     alert(JSON.stringify(err))
  //   });
}

function getDownLoadFileList() {
  return new Promise(resolve => {
    if (navigator.userAgent.includes('studying1v1Android')) {
      androidBridge('File', 'fileList').then(res => {
        resolve(res.result)
      })
    } else if (navigator.userAgent.includes('windvane')) {
      // @ts-ignore
      window.WindVane.call('File', 'getDownloadPath', {}, (result) => {
        // @ts-ignore
        window.WindVane.call('File', 'fileList', { path: result.data }, (result) => {
          resolve(result.data)
        });
      });
      // @ts-ignore
    } else if (window.webkit && window.webkit.messageHandlers.jsUseWKWebView) {
      // @ts-ignore
      window.webkit.messageHandlers.jsUseWKWebView.postMessage({
        group: 'file',
        type: 'downloadFileList',
      }).then((res: any) => {
        console.log('downloadFileList', res)
        console.log('downloadFileList', JSON.parse(res))
        resolve(JSON.parse(res));
      })
    }
  })
}

function isFileExist(file: string): Promise<boolean> {
  return new Promise(resolve => {
    if (navigator.userAgent.includes('studying1v1Android')) {
      androidBridge('File', 'isFileExist', {
        fileName: file
      }).then(res => {
        resolve(res.result)
      })
    } else if (window.webkit && window.webkit.messageHandlers.jsUseWKWebView) {
      // @ts-ignore
      window.webkit.messageHandlers.jsUseWKWebView.postMessage({
        group: 'file',
        type: 'isFileExist',
        fileName: file,
      }).then((res: any) => {
        console.log('isFileExist', res)
        console.log('isFileExist', JSON.parse(res))
        resolve(JSON.parse(res));
      })
    }
  })
}

function clearDownloadFiles(): Promise<boolean> {
  return new Promise(resolve => {
    if (navigator.userAgent.includes('studying1v1Android')) {
      androidBridge('File', 'clearDownloadFiles').then(res => {
        resolve(res.result)
      })
    } else if (window.webkit && window.webkit.messageHandlers.jsUseWKWebView) {
      // @ts-ignore
      window.webkit.messageHandlers.jsUseWKWebView.postMessage({
        group: 'file',
        type: 'clearDownloadFiles',
      }).then((res: any) => {
        resolve(JSON.parse(res));
      })
    }
  })
}

export default {
  download,
  getDownLoadFileList,
  open,
  isFileExist,
  clearDownloadFiles,
}
