import Vue from 'vue';
import Router from 'vue-router';

import Home from '../views/Home.vue';


Vue.use(Router);

export default new Router({
	routes: [
		{
			path: '/',
			name: 'Home',
			component: Home,
		},
		{
			path: '/article',
			name: 'Article',
			component: resolve => {
				require.ensure([], require => {
					resolve(require('../components/Articles.vue'));
				});
			},
		},
		{
			name: 'detail',
			path: '/detail',
			component: resolve => {
				require.ensure([], require => {
					resolve(require('../views/Detail.vue'));
				});
			},
			meta: {
				scrollToTop: true,
			},
		},
		{
			name: 'top-detail',
			path: '/top-detail',
			component: resolve => {
				require.ensure([], require => {
					resolve(require('../views/Detail.vue'));
				});
			},
			meta: {
				scrollToTop: true,
			},
		},
		{
			name: 'the-day',
			path: '/the-day',
			component: resolve => {
				require.ensure([], require => {
					resolve(require('../views/TheDay.vue'));
				});
			},
			meta: {
				scrollToTop: true,
			},
		},
	],
});
