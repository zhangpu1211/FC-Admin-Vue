import { getRequest } from '@/utils/request'
class SysLog {
  async logList(listQuery) {
    const url = '/system/log/list/?page=' + listQuery.page + '&size=' + listQuery.size
    const res = await getRequest(url)
    console.log(res)
    if (res) {
      return res
    } else {
      return []
    }
  }
}

export default new SysLog()

