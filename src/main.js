import Vue from 'vue';
import App from './App.vue';
import less from 'less';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Router from 'vue-router';
import Home from '@/components/Home.vue';
import Login from '@/components/Login.vue'

Vue.use(less)
Vue.use(ElementUI)
Vue.use(Router)
Vue.config.productionTip = false

console.log = function(){}

const router = new Router({
  routes : [
    {
      path:'/',
      redirect:'/login'
    },
    {
      path:'/login',
      component:Login
    },
    {
      name:'home',
      path:'/home',
      component:Home,
      beforeEnter:(to,from,next) =>{
        console.log(to,from)
        if(!Object.hasOwnProperty.call(to.params,'nickname')){
          alert('请先登录！')
          next('/login')
        }else
          next()
      }
    },
  ]
})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
