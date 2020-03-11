import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken, removeToken } from './auth'
import router from '@/router'
axios.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = 'Bearer' + getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
axios.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  async response => {
    if (response.status && response.status === 200 && response.data.status === 500) {
      Message.error({ message: response.data.msg })
      return
    }
    if (response.data.status === 600) {
      Message.error({ message: response.data.msg })
      removeToken()
      router.replace('/')
      return
    } else if (response.data.msg) {
      Message.success({ message: response.data.msg })
    }
    console.log(response)
    return response.data
  },
  async error => {
    console.log('err' + error) // for debug
    if (error.response) {
      if (error.response.status === 504 || error.response.status === 404) {
        Message.error({ message: '服务器被吃了( ╯□╰ )' })
      } else if (error.response.status === 403) {
        Message.error({ message: '权限不足，请联系管理员' })
      } else if (error.response.status === 401) {
        Message.error({ message: '尚未登录，请登录' })
      } else {
        if (error.response.data.msg) {
          Message.error({ message: error.response.data.msg })
        } else {
          Message.error({ message: '未知错误!' })
        }
      }
    } else {
      Message.error({ message: '网络错误!' })
    }
    return Promise.reject(error)
  }
)
const base = 'http://localhost:8081'

export const postKeyValueRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    transformRequest: [function(data) {
      let ret = ''
      for (const i in data) {
        ret += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
export const postRequest = (url, params) => {
  console.log(params)
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params
  })
}
export const putRequest = (url, params) => {
  return axios({
    method: 'put',
    url: `${base}${url}`,
    data: params
  })
}
export const getRequest = (url, params) => {
  return axios({
    method: 'get',
    url: `${base}${url}`,
    data: params
  })
}

export const deleteRequest = (url, params) => {
  return axios({
    method: 'delete',
    url: `${base}${url}`,
    data: params
  })
}
