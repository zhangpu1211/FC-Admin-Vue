import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'normalize.css/normalize.css'
import ElementUI from 'element-ui'
import '@/styles/index.scss' // global css
import 'element-ui/lib/theme-chalk/index.css'

import '@/assets/icon/iconfont.js'
import SvgIcon from './components/SvgIcon/index'

// 全局注册icon-svg
Vue.component('icon-svg', SvgIcon)
Vue.config.productionTip = false

Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
