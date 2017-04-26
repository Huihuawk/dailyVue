// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import store from './store'
import { sync } from 'vuex-router-sync'
import router from './router/index'
import lazy from 'vue-lazy-image'
import * as filters from './filters'

Vue.config.productionTip = false;

Vue.config.debug = true;

//数据过滤器
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
});

Vue.use(lazy);
sync(store, router);

/* eslint-disable no-new */
const app = new Vue({
    el: '#app',
    name: 'app',
    router,
    store,
    render(h) {
        return h(App)
    }
})

export {app, router, store}