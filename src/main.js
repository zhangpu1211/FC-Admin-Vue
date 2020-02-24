import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'normalize.css/normalize.css'
import ElementUI from 'element-ui'
import '@/styles/index.scss' // global css
import 'element-ui/lib/theme-chalk/index.css'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import '@/assets/icon/iconfont.js'
import SvgIcon from './components/SvgIcon/index'
import SysMenu from './models/SysMenu'
// 全局注册icon-svg
Vue.component('icon-svg', SvgIcon)
Vue.config.productionTip = false

Vue.use(ElementUI)

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (to.path === '/') {
    // if (window.sessionStorage.getItem('user')) {
    //   next({ path: from.fullPath })
    // } else {
    //   next()
    // }
    next()
  } else {
    if (window.sessionStorage.getItem('user')) {
      SysMenu.getMenus(router, store)
      if (to.path === '/home') {
        next('/dashboard/analyse')
      }
      next()
    } else {
      next('/?redirect=' + to.path)
    }
  }
})
router.afterEach(transition => {
  NProgress.done()
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
