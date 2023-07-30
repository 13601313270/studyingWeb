let imgCallBack = (url: string)=>{}
export function onShowImg(callBack: (url: string) => void){
  imgCallBack = callBack;
}

export function showImg(url: string) {
  imgCallBack(url)
}