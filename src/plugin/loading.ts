import { createVNode, render } from 'vue'
import toastTemplate from '../components/MaskLoading.vue'
export interface IProps {
  background?: string;
  color?: string;
}
const defaultOpt = { // 创建默认参数
}

export interface ResultParams {
  destory: () => void;
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const Loading = (options?: IProps): ResultParams => {
  const container = document.createElement('div')
  container.setAttribute('style', 'position: fixed;z-index:3000;box-shadow: 0 0 40px -5px rgba(0,0,0,0.5);left: 0;top: 0;font-size: 3vw');
  // @ts-ignore
  const vm = createVNode(toastTemplate, options) // 创建vNode
  render(vm, container)
  document.body.appendChild(container)
  const destory = () => {
    const t = setTimeout(() => {
      render(null, container)
      //@ts-ignore
      window.aaa = container;
      document.body.removeChild(container)
      clearTimeout(t)
    }, 300);
  }
  return {
    destory
  }
}
export default Loading