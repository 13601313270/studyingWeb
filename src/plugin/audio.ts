let audio = new Audio()
let onStop: () => void;
export function play(url: string) {
  if (audio.src !== url) {
    audio.pause()
    onStop && onStop();
  }

  return new Promise((resolve, reject) => {
    function listen() {
      console.log('====end====', audio.src, url)
      audio.removeEventListener('ended', listen)
      resolve(true)
    }
    if (audio.src !== url) {
      console.log('====play====', audio.src, url)
      audio.src = url;
      audio.addEventListener('ended', listen, false)
    }
    onStop = function () {
      audio.removeEventListener('ended', listen)
      reject();
    }
    audio.play()
  })
}

export function continuePlay() {
  audio.play()
}

export function pause() {
  audio.pause()
}
export function stop() {
  return new Promise((resolve, reject) => {
    audio.pause()
    onStop && onStop();
    audio = new Audio()
  })
}