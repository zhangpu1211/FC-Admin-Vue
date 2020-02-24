import Vue from 'vue'
import VueRouter from 'vue-router'
import FriendChat from '../views/chat/FriendChat'

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
  }
]
const router = new VueRouter({
  routes
})

export default router
