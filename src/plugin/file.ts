function windVane(group: string, method: string, param = {}) {
  return new Promise<any>(resolve => {
    var randomFuncName = ('TempWorld' + Math.random()).replace('.', '');
    // @ts-ignore
    window[randomFuncName] = function (result) {
      if (result) {
        resolve(result)
      } else {
        resolve(null)
      }
      // @ts-ignore
      window[randomFuncName] = undefined;
    }
    // @ts-ignore
    window.Bridge.call(group, method, JSON.stringify(param), randomFuncName)
  })
}
function download(file: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (navigator.userAgent.includes('studying1v1Android')) {
      // @ts-ignore
      window.File.download(file.replace('http://', 'https://'))

      windVane('File', 'download', {
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
      // @ts-ignore
      const list = window.File.getDownLoadFileList()
      resolve(JSON.parse(list))
      windVane('File', 'fileList').then(res => {
        console.log('======222', res.result)
        resolve(res.result)
      })
    } else {
      // @ts-ignore
      window.WindVane.call('File', 'getDownloadPath', {}, (result) => {
        // @ts-ignore
        window.WindVane.call('File', 'fileList', { path: result.data }, (result) => {
          resolve(result.data)
          // this.downLoadList = result.data;
        });
      });
    }
  })
}

export default {
  download,
  getDownLoadFileList,
}
