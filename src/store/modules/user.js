import Login from '@/api/login'
import SysUser from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { StaticRouterMap } from '@/router/index'
import { baseUrl } from '@/utils/constVarible'
const user = {
  namespaced: true,
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    init: false, // 是否完成初始化 // 默认未完成
    RouterList: [], // 动态路由
    curuser: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    set_router: (state, RouterList) => {
      state.RouterList = RouterList
    },
    set_init: (state, status) => {
      state.init = status
    },
    set_user: (state, user) => {
      state.curuser = user
    }
  },

  actions: {
    // 登录
    async login({ commit }, userInfo) {
      const data = {
        'username': userInfo.username,
        'password': userInfo.password
      }
      const res = await Login.doLogin(data)
      const response = res.obj
      if (response) {
        console.log('reponse', response)
        console.log(response.token)
        setToken(response.token)
        commit('SET_TOKEN', response.token)
        commit('set_user', response.userInfo)
        commit('SET_NAME', response.userInfo.username)
        commit('SET_AVATAR', baseUrl + response.userInfo.avatar)
        return true
      } else {
        return false
      }
    },
    async GetInfo({ commit, state }) {
      const res = await SysUser.userInfo()
      commit('set_user', res)
      commit('SET_NAME', res.username)
      commit('SET_AVATAR', baseUrl + res.avatar)
    },
    // 获取用户信息
    // GetInfo({ commit, state }) {
    //   return new Promise((resolve, reject) => {
    //     getInfo(state.token)
    //       .then(response => {
    //         const data = response.data
    //         if (data.roles && data.roles.length > 0) {
    //           // 验证返回的roles是否是一个非空数组
    //           // commit('SET_ROLES', data.roles)
    //         } else {
    //           reject('getInfo: roles must be a non-null array !')
    //         }
    //         commit('SET_NAME', data.name)
    //         commit('SET_AVATAR', data.avatar)
    //         resolve(response)
    //       })
    //       .catch(error => {
    //         reject(error)
    //       })
    //   })
    // },
    // 动态设置路由 此为设置设置途径
    setRouterList({ commit }, routerList) {
      commit('set_router', StaticRouterMap.concat(routerList)) // 进行路由拼接并存储
    },
    // 存储颗粒话权限
    setroles({ commit }, roleList) {
      commit('SET_ROLES', roleList)
    },
    // 登出
    LogOut({ commit, state }) {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      commit('set_router', [])
    },

    // 前端 登出(测试方法)
    logout({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('set_init', false)
        removeToken()
        resolve()
      })
    }
  }
}

export default user
