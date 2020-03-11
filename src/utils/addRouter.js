/**
 * 生成路由
 * @param {Array} routerlist 格式化路由
 * @returns
 */
export function addRouter1(routerlist) {
  const router = []
  try {
    routerlist.forEach(e => {
      let e_new = {
        path: e.url,
        name: e.name,
        component: () => e.component === 'layout' ? import('@/layout') : import(`@/views/${e.component}/index`)
      }
      if (e.children) {
        const children = addRouter(e.children)
        // 保存权限
        e_new = { ...e_new, children: children }
      }
      if (e.redirect) {
        e_new = { ...e_new, redirect: e.redirect }
      }
      if (e.generatemenu === 0) {
        e_new = { ...e_new, hidden: true }
      }
      if (e.icon !== '' && e.title !== '') {
        e_new = { ...e_new, meta: { title: e.title, icon: e.icon }}
      } else if (e.title !== '' && e.icon === '') {
        e_new = { ...e_new, meta: { title: e.title }}
      }
      router.push(e_new)
    })
  } catch (error) {
    console.error(error)
    return []
  }
  return router
}
export function addRouter(routerlist) {
  const router = []
  try {
    routerlist.forEach(e => {
      if (e.children) {
        e.resources = '/' + e.resources
      }
      console.log(`@/views${e.component}`)
      let e_new = {
        path: e.resources,
        name: e.resources,
        component: () => e.component === 'layout' ? import('@/layout') : import(`@/views${e.component}`)
      }
      if (e.children) {
        const children = addRouter(e.children)
        // 保存权限
        e_new = { ...e_new, children: children }
      }
      if (e.redirect) {
        e_new = { ...e_new, redirect: e.redirect }
      }
      if (e.generatemenu === 0) {
        e_new = { ...e_new, hidden: true }
      }
      if (e.meta.icon !== '' && e.name !== '') {
        e_new = { ...e_new, meta: { title: e.name, icon: e.meta.icon }}
      } else if (e.name !== '' && e.meta.icon === '') {
        e_new = { ...e_new, meta: { title: e.name }}
      }
      router.push(e_new)
    })
  } catch (error) {
    console.error(error)
    return []
  }
  router.push({
    path: '*',
    redirect: '/404',
    hidden: true
  })
  return router
}
