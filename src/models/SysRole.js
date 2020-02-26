import { getRequest, postRequest, putRequest, deleteRequest } from '@/utils/api'
class SysRole {
  async getRoles() {
    const res = await getRequest('/system/role')
    return res
  }
  async addRole(form) {
    const res = await postRequest('/system/role', form)
    return res
  }
  async deleteRole(id) {
    const res = await deleteRequest('/system/role' + id)
    return res
  }
  async updateRole(form) {
    const res = await putRequest('/system/role', form)
    return res
  }
}
export default new SysRole()
