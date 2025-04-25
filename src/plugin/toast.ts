import { createVNode, render } from 'vue'
import toastTemplate from '../components/Message.vue'
export interface IProps {
  message?: string;
  duration?: number;
  background?: string;
  color?: string;
}
const defaultOpt = { // 创建默认参数
    duration: 3000
}

export interface ResultParams {
    destory?: () => void;
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const Toast = (options: IProps):ResultParams => {
    const container = document.createElement('div')
    container.setAttribute('style','position: fixed;top: 0;border-radius: 1.33333vw;box-shadow: 0 0 40px -5px rgba(0,0,0,0.5);left: 50%;top: 10%;transform: translateX(-50%);z-index:2');
    const opt = {...defaultOpt,...options}
    const vm = createVNode(toastTemplate, opt, options.message) // 创建vNode
    render(vm, container)
    document.body.appendChild(container)
    const destory =  ()=> {
        const t = setTimeout(() => {
          render(null, container)
          document.body.removeChild(container)
          clearTimeout(t)
      },500);
    }
    if(opt.duration) {
        const timer = setTimeout(()=> {
            destory()
            clearTimeout(timer)
        }, opt.duration)
    }
    return {
        destory
    }
}
export default Toast