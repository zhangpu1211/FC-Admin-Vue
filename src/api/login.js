import { postRequest, getRequest } from '@/utils/request'
class Login {
  async doLogin(data) {
    console.log(data)
    const res = await postRequest('/doLogin', data)
    console.log(res)
    return res
  }
  async getRouter() {
    const res = await getRequest('/system/menu/sidebar')
    console.log(res)
    return res
  }
}
export default new Login()
// export function getInfo(token) {
//   return request({
//     url: '/user/info',
//     method: 'get',
//     params: { token }
//   })
// }
//
// export function getRouter(roule) {
//   return request({
//     url: '/vue-admin-template/user/getRouter',
//     method: 'post',
//     data: {
//       type: roule
//     }
//   })
// }
//
// export function logout() {
//   return request({
//     url: '/user/logout',
//     method: 'post'
//   })
// }
