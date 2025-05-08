export default function isMobileDevice() {
  let userAgent = navigator.userAgent;
  if (navigator.maxTouchPoints > 1) {
    // ipad类型ua特征不明显
    return 1;
  }
  return /android|ipad|iphone|ipod/i.test(userAgent);
}