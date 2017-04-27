import Vue from 'vue'
import Vuex from 'vuex'
import * as api from './api'
import DateCalc from '../../common/util/date'

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        loadingDay: false,
        date: new DateCalc().now(),
        latest: [],
        day: [],
        oneday: {},
        article: {},
        comments: []
    },
    scrollBehavior: (to, from, savedPosition) => {
        if (savedPosition) {
            return savedPosition;
        }
        let position = {
            x: 0,
            y: 0
        }
        if (to.path === "/") {
            position.y = +sessionStorage.getItem('scrollTop') || 0
        }
        return position;
    },
    //Action 提交的是 mutation，而不是直接变更状态 2. Action 可以包含任意异步操作
    actions: {
        FETCH_LATEST ({commit, state}) {
            return api.fetchLatest()
                .then(({data}) => {
                    commit('SET_LATEST', data)
                })
        },
        FETCH_ARTICLE ({commit, state}, aid) {
            return api.fetchArticle(aid)
                .then(({data}) => {
                    commit('SET_ARTICLE', data)
                })
        },
        FETCH_HISTORY ({commit, state}, dtime) {
            if (!state.loadingDay) {
                state.loadingDay = true;
                return api.fetchHistory(dtime)
                    .then(({data}) => {
                        state.loadingDay = false;
                        commit('SET_HISTORY', data)
                    })
                    .catch(() => {
                        state.loadingDay = false
                    })
            }
        }
    },
    //更改 Vuex 的 store 中的状态的唯一方法是提交 mutation
    mutations: {
        SET_LATEST (state, data) {
            state.latest = data;
        },
        SET_ARTICLE (state, data) {
            state.article = data;
        },
        SET_HISTORY (state, data) {
            if (data.length) {
                const day = {
                    month: new DateCalc().monthEN(data[0].dtime) + data[0].dtime.substr(6, 2),
                    date: new DateCalc().CN(data[0].dtime),
                    data: data
                };
                state.day.push(day)
            }
        }
    }
})

export default store;