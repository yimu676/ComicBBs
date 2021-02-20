import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)
//push 
const VueRouterPush = VueRouter.prototype.push 
VueRouter.prototype.push = function push (to) {
    return VueRouterPush.call(this, to).catch(err => err)
}

//replace
const VueRouterReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace (to) {
  return VueRouterReplace.call(this, to).catch(err => err)
}

const routes = [
  {
    path: '/home',
    redirect: '/'
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    component: () => import( '../views/About.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import( '../views/Login.vue')
  } ,
  {
    path: '/register',
    name: 'Register',
    component: () => import( '../views/Register.vue')
  } ,
  {
    path: '/search',
    name: 'Search',
    component: () => import( '../views/Search')
  } ,
  {
    path: '/my',
    name: 'My',
    component: () => import( '../views/UserInfo.vue')
  } ,
  {
    path: '/detail',
    name: 'Detail',
    component: () => import( '../views/Detail.vue')
  }  ,
  {
    path: '/useredit',
    name: 'UserEdit',
    component: () => import( '../views/UserEdit.vue')
  }  ,
  {
    path: '/post',
    name: 'Post',
    component: () => import( '../views/Post.vue')
  }  ,
  {
    path: '/loginout',
    name: 'loginout',
    component: () => import( '../views/LoginOut.vue')
  }  
]
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next)=> {

  if (from.path == "/detail"||from.path == "/my"||from.path == "/loginout"||from.path == "/home") {
  
  to.meta.keepalive= true
  
  } else {
  
    to.meta.keepalive = false;
  
  }
  
  next();
  
  })
export default router
