import '../utils/api'
import { getRequest } from '../utils/api'

class SysMenu {
  // 获取登录用户的资源
  async getMenus(router, store) {
    if (store.state.routes.length > 0) {
      console.log(store.state.routes.length > 0)
      return true
    } else {
      const data = await getRequest('/system/config/menus')
      if (data) {
        console.log('1111' + data)
        const fmtRoutes = formatRoutes(data)
        router.addRoutes(fmtRoutes)
        store.commit('initRoutes', fmtRoutes)
      }
    }
  }
  // 获取系统所有的资源
  async getSysAllMenus() {
    return await getRequest('/system/menu/sysMenus')
  }
}
const formatRoutes = (routes) => {
  const fmRoutes = []
  routes.forEach(router => {
    var {
      path,
      component,
      name,
      meta,
      iconCls,
      children
    } = router
    if (children && children instanceof Array) {
      children = formatRoutes(children)
    }
    const fmRouter = {
      path: path,
      name: name,
      iconCls: iconCls,
      meta: meta,
      children: children,
      component(resolve) {
        if (component.startsWith('Home')) {
          require(['../views/' + component + '.vue'], resolve)
        } else if (component.startsWith('Emp')) {
          require(['../views/emp/' + component + '.vue'], resolve)
        } else if (component.startsWith('Dash')) {
          require(['../views/dashboard/' + component + '.vue'], resolve)
        } else if (component.startsWith('Sal')) {
          require(['../views/sal/' + component + '.vue'], resolve)
        } else if (component.startsWith('Sta')) {
          require(['../views/sta/' + component + '.vue'], resolve)
        } else if (component.startsWith('Sys')) {
          require(['../views/sys/' + component + '.vue'], resolve)
        }
      }
    }
    fmRoutes.push(fmRouter)
  })
  return fmRoutes
}
export default new SysMenu()
