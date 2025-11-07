declare module 'vue-router'

export { }; // 确保这是一个模块

declare global {
  interface Window {
    onClickBack: () => void;
    webkit: {
      messageHandlers: {
        jsUseWKWebView: {
          postMessage: (message: string) => Promise<any>;
        };
      };
    };
    Bridge: {
      callHandler: (handlerName: string, data: any, callback: (response: any) => void) => void;
    };
  };
}
