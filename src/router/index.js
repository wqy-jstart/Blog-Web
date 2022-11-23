import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: HomeView
  },
  {
    path: '/login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path:'/userDetail',
    component: () => import('../views/temp/UserDetailView')
  },
  {
    path:'/userUpdate',
    component: () => import('../views/temp/UserUpdateView')
  },
  {
    path:'/articleDetail',
    component: () => import('../views/temp/ArticleDetailView')
  },
  {
    path:'/register',
    component: () => import('../views/temp/RegisterView')
  },
  {
    path:'/createArticle',
    component: () => import('../views/temp/CreateArticleView')
  },
  {
    path:'/personalArticle',
    component: () => import('../views/temp/PersonalArticleView.vue')
  },
  {
    path:'/otherDetail',
    component: () => import('../views/temp/OtherDetailView.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
