import request from './request'

type icon = {
  img: string;
  name: string
}
let allIcons:{
  [key in string]: {
    path: string
  }
} = {}
export function init() {
  return new Promise((resolve, rej) => {
    if(navigator.userAgent.includes('windvane')) {
      // @ts-ignore
      window.WindVane.call('icons','getAllIcons', {}, ({data}:any) => {
        allIcons = data;
        resolve(true);
      });
    } else {
      // 无WindVane环境，比如本地开发
      request.get<any,icon[]>('/icon/allIcons').then((result:Array<icon>) => {
        const newMap: {
          [key in string]: {
            path: string
          }

        } = {
        }
        result.forEach(v => {
          newMap[v.name] = {
            path: v.img
          }
        })
        allIcons = newMap
        resolve(true)
      });
    }
  })
}
export function getAllIcons():{
  [key in string]: {
    path: string
  }
} {
  return allIcons;
}