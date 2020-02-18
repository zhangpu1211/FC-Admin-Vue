import Vue from 'vue'
import VueRouter from 'vue-router'
import FriendChat from '../views/chat/FriendChat'
import RoleMana from '../views/sys/RoleMana'
import PermissMana from '../views/sys/PermissMana'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () =>
      import(/* webpackChunkName: "about" */ '@/views/Login.vue'),
    hidden: true
  },
  {
    path: '/home',
    name: 'Home',
    component: () =>
      import(/* webpackChunkName: "about" */ '@/views/Home.vue'),
    hidden: true,
    children: [
      {
        path: '/chat',
        name: '在线聊天',
        component: FriendChat,
        hidden: true
      }
    ]
  },
  {
    path: '/sys',
    name: 'Sys',
    component: () =>
      import(/* webpackChunkName: "about" */ '@/views/Home.vue'),
    children: [
      {
        path: '/sys/permiss',
        name: '权限管理',
        component: PermissMana
      },
      {
        path: '/sys/role',
        name: '角色管理',
        component: RoleMana
      }
    ]
  }
]
const router = new VueRouter({
  routes
})

export default router
