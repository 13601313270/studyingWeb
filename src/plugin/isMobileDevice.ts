export default function isMobileDevice() {
  let userAgent = navigator.userAgent;
  return /android|ipad|iphone|ipod/i.test(userAgent);
}