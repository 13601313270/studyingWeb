function share(title: string, url: string, desc: string, img: string) {
  if(navigator.userAgent.includes('windvane')) {
    // @ts-ignore
    window.WindVane.call('share','shareUrl', {
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
    alert('分享'+':'+title+"|"+url)
  }
}
export default share;