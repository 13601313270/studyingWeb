import { createStore } from 'vuex'

type FootActiveEnum = 'source' | 'file' | 'shop' | 'friend' | 'mine';

type IState = {
  path: any[],
  token: string,
  userInfo: any,
  showLogin: boolean,
  degree: number,
  degreeList: any[],
  footActive: FootActiveEnum,
}
const main = {
  namespaced: true,
  state: {
    path: [],
    token: '',
    showLogin: false,
    userInfo: {},
    degree: 1,
    degreeList: [],
    footActive: 'source',
  },
  getters: {
    path: (state: IState) => state.path,
    token: (state: IState) => state.token,
    userInfo: (state: IState) => state.userInfo,
    showLogin: (state: IState) => state.showLogin,
    degree: (state: IState) => state.degree,
    degreeList: (state: IState) => state.degreeList,
    footActive: (state: IState) => state.footActive,
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
    },
    set_degree(state: IState, type: number) {
      state.degree = type
    },
    set_degree_list(state: IState, type: any) {
      state.degreeList = type
    },
    set_foot_active(state: IState, type: FootActiveEnum) {
      state.footActive = type
    },
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
    setDegree({ commit }: any, type: number) {
      return commit('set_degree', type);
    },
    setDegreeList({ commit }: any, type: any) {
      return commit('set_degree_list', type);
    },
    setFootActive({ commit }: any, type: FootActiveEnum) {
      return commit('set_foot_active', type);
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

export type { Store, FootActiveEnum }