import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'
import Article from '../components/Articles.vue'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path:'/article',
      name: 'Article',
      component: Article
    }
  ]
})
