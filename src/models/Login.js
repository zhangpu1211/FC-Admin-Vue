import { postKeyValueRequest } from '@/utils/api'

class Login {
  async doLogin(loginForm) {
    const res = await postKeyValueRequest('/doLogin', loginForm)
    return res
  }
}
export default new Login()
