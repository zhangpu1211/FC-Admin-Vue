import { postRequest, getRequest, putRequest, deleteRequest } from '@/utils/request'
class SysUser {
  async userList(url) {
    const res = await getRequest(url)
    console.log(res)
    if (res) {
      return res
    } else {
      return []
    }
  }
  async add(data) {
    const res = await postRequest('/system/user/save', data)
    return res
  }
  async update(data) {
    const res = await putRequest('/system/user/save', data)
    return res
  }
  async delete(id) {
    const res = await deleteRequest('/system/user/delete/' + id)
    return res
  }
  async getRouter() {
    const res = await postRequest('/system/menu/sidebar')
    console.log(res)
    return res
  }
}
export default new SysUser()

