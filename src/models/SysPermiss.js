import { postRequest, putRequest, deleteRequest } from '@/utils/api'

class SysPermiss {
  async addPermiss(form) {
    const res = await postRequest('/system/menu/sysMenus', form)
    return res
  }
  async deletePermiss(id) {
    const res = await deleteRequest('/system/menu/sysMenus/' + id)
    return res
  }
  async updatePermiss(form) {
    const res = await putRequest('/system/menu/sysMenus', form)
    return res
  }
}
export default new SysPermiss()
