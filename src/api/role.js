import { postRequest, getRequest, putRequest, deleteRequest } from '@/utils/request'
class SysRole {
  async roleList() {
    const res = await getRequest('/system/role/list')
    console.log(res)
    if (res) {
      return res
    } else {
      return []
    }
  }
  async addRole(data) {
    console.log(typeof data)
    console.log(data)
    const res = await postRequest('/system/role/save', data)
    return res
  }
  async updateRole(data) {
    const res = await putRequest('/system/role/save', data)
    return res
  }
  async deleteRole(id) {
    const res = await deleteRequest('/system/role/delete/' + id)
    return res
  }

  //  role menus
  async getOwnMenus(id) {
    const res = await getRequest('/system/role/mids/' + id)
    return res
  }
  async updateOwnMenus(url) {
    const res = await putRequest('/system/role/crole' + url)
    return res
  }
}
export default new SysRole()
