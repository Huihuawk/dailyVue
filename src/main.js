// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import router from './router/index'

Vue.config.productionTip = false;

Vue.config.debug = true;

Vue.use(VueRouter);

/* eslint-disable no-new */
const app = new Vue({
    el: '#app',
    name: 'app',
    router,
    render(h) {
        return h(App)
    }
})

export {app, router}