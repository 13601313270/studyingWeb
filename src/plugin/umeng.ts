import bridge from "./bridge";

function init(isFirst: boolean): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    bridge('UMeng', 'init', {
      isFirst
    }).then(() => {
      resolve();
    })
  })
}

export default {
  init,
}
