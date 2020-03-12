import { postRequest, getRequest, putRequest, deleteRequest } from '@/utils/request'
class SysMenu {
  async menuList() {
    const res = await getRequest('/system/menu/list')
    console.log(res)
    if (res) {
      return res
    } else {
      return []
    }
  }
  async add(data) {
    const res = await postRequest('/system/menu/save', data)
    return res
  }
  async update(data) {
    console.log(typeof data)
    console.log('111', data)
    const res = await putRequest('/system/menu/save', data)
    return res
  }
  async delete(id) {
    const res = await deleteRequest('/system/menu/delete/' + id)
    return res
  }
}

export default new SysMenu()

