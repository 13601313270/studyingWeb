let audio = new Audio()
export function play(url: string) {
  return new Promise((resolve, reject) => {
    if(audio.src !== url) {
      audio.src = url;
    }
    function listen(){
      audio.removeEventListener('ended', listen)
      resolve(true)
    }
    audio.addEventListener('ended', listen, false)
    audio.play()
  })
}

export function pause() {
  return new Promise((resolve, reject) => {
    audio.pause()
  })
}
export function stop(){
  return new Promise((resolve, reject) => {
    audio.pause()
    audio = new Audio()
  })
}