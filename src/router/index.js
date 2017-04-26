import Vue from 'vue'
import Router from 'vue-router'

import Home from '../views/Home.vue'
import Article from '../components/Articles.vue'
import Detail from '../views/Detail.vue'

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/article',
            name: 'Article',
            component: Article
        },
        {
            name: 'detail',
            path: '/detail',
            component: Detail,
            meta: {
                scrollToTop: true
            }
        },
        {
            name: 'top-detail',
            path: '/top-detail',
            component: Detail,
            meta: {
                scrollToTop: true
            }
        }
    ]
})
