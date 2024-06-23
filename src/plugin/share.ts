import androidBridge from "./androidBridge";

function share(title: string, url: string, desc: string, img: string) {
  return new Promise<void>((resolve, reject) => {
    if (navigator.userAgent.includes('studying1v1Android')) {
      androidBridge('Share', 'share', {
        title,
        url,
        desc,
        img: img || '',
      }).then(() => {
        resolve()
      })
    }
    else if (navigator.userAgent.includes('windvane')) {
      // @ts-ignore
      window.WindVane.call('share', 'shareUrl', {
        title,
        url,
        desc,
        img: img || '',
      }, () => {
        // alert('success');
      }, () => {
        // alert('failure: ' + JSON.stringify(e));
      });
    } else {
      alert('分享' + ':' + title + "|" + url)
    }
  })
}
export default share;