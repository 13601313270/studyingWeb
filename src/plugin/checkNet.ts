import androidBridge from "./androidBridge";
import bridge from "./bridge";

// 检测客户端网络权限
function check(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    bridge('checkNet', 'check').then(() => {
      resolve()
    })
  })
}

export default {
  check,
}
