import androidBridge from "./androidBridge";
import bridge from "./bridge";

function toScore() {
  return new Promise<void>((resolve, reject) => {
    bridge('share', 'toScore').then(() => {
      resolve();
    })
  })
}
export default toScore;
