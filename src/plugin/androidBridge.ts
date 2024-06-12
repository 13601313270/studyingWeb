export default function (group: string, method: string, param = {}) {
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
