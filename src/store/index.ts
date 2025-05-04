import { createStore } from 'vuex'

type IState = {
  path: any[],
  token: string,
  userInfo: any,
  showLogin: boolean
}
const main = {
  namespaced: true,
  state: {
    path: [],
    token: '',
    showLogin: false,
    userInfo: {}
  },
  getters: {
    path: (state: IState) => state.path,
    token: (state: IState) => state.token,
    userInfo: (state: IState) => state.userInfo,
    showLogin: (state: IState) => state.showLogin,
  },
  mutations: {
    set_path(state: IState, path: any) {
      state.path = path;
    },
    set_token(state: IState, token: string) {
      state.token = token;
    },
    set_user_info(state: IState, userInfo: any) {
      state.userInfo = userInfo;
    },
    set_show_login(state: IState, type: boolean) {
      state.showLogin = type
    }
  },
  actions: {
    setPath({ commit }: any, path: any) {
      return commit('set_path', path);
    },
    setToken({ commit }: any, token: any) {
      return commit('set_token', token);
    },
    setUserInfo({ commit }: any, userInfo: any) {
      return commit('set_user_info', userInfo);
    },
    setShowLogin({ commit }: any, type: any) {
      return commit('set_show_login', type);
    },
  },
}





type Store = {
  main: { [key in keyof IState]: IState[key] }
}

export default createStore({
  modules: {
    main
  }
})

export type { Store }