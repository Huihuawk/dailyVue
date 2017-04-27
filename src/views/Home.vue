<template>
    <div class="home">


        <Latest :data="latest"></Latest>

        <div>
            <template v-for="item in this.$store.state.day">
                <History :day="item"></History>
            </template>
        </div>

        <i class="loading"><span>Previous Day</span></i>
    </div>
</template>

<script>
    import Vue from 'vue';
    import Latest from '../components/Latest.vue'
    import History from '../components/History.vue'
    import DateCalc from '../../common/util/date';

    //分发 action。返回 action 方法的返回值，如果多个处理函数被触发，那么返回一个 Pormise。
    const API = {
        fetchLatest: store => {
            return store.dispatch('FETCH_LATEST')
        },
        fetchHistory: (store, dtime) => {
            return store.dispatch('FETCH_HISTORY', dtime)
        }
    };
    
    const throttle = function (func, wait, options) {
        var context, args, result;
        var timeout = null;
        var previous = 0;
        if (!options) options = {};
        var later = function() {
            previous = options.leading === false ? 0 : new Date().getTime();
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        };
        return function() {
            var now = new Date().getTime();
            if (!previous && options.leading === false) previous = now;
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0 || remaining > wait) {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                previous = now;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };
    };
    

    export default {
        name: 'home',
        data() {
            return {
                histories: {}
            };
        },
        components: {
            Latest,
            History
        },
        //preFetch 的数据是存进了服务端 vuex store 里面，然后这些数据会直接内联在直出的 HTML 里面。客户端的 vuex store 启动的时候就直接以这些数据为初始数据了。客户端组件调用 actions 的时候，vuex store 起到一层缓存的作用，已经有的数据不会再 fetch。
        preFetch: API.fetchLatest,
        computed: {
            now() {
                const d = new DateCalc().now();
                return d.substr(0, 4) + '-' + d.substr(4, 2) + '-' + d.substr(6, 2)
            },
            latest() {
                const data = {
                    top: [],
                    latest: [],
                    month: ''
                };
                let comments = [];
                let d = this.$store.state.latest;
                for (let i = 0, len = d.length; i < len; i++) {
                    if (d[i].title) {
                        d[i].top ? data.top.push(d[i]) : data.latest.push(d[i])
                    } else {
                        comments.push(d[i])
                    }
                }
                for (let i = 0, len = comments.length; i < len; i++) {
                    for (let j = 0, length = data.latest.length; j < length; j++) {
                        if (comments[i].id === data.latest[j].id) {
                            data.latest[j].comments = comments[i].comments;
                            data.latest[j].popularity = comments[i].popularity
                        }
                    }
                }
                if (data.latest.length) {
                    const dtime = data.latest[0].dtime;
                    data.month = new DateCalc().monthEN(dtime) + dtime.substr(6, 2)
                }
                return data
            },
            histories() {
                console.log("!!!!!!!!!!!!!!!!!!!!!",this.$store.state.day);
                return this.$store.state.day
            }
        },
        //实例已经创建完成之后被调用。在这一步，实例已完成以下的配置：数据观测(data observer)，属性和方法的运算， watch/event 事件回调。然而，挂载阶段还没开始，$el 属性目前不可见。
        created(){
            this.scrollEvent = throttle(e => {
                if (window.innerHeight + document.body.scrollTop + 150 >= document.body.offsetHeight) {
                    this.previousDay()
                }
            }, 200)
        },
        //在挂载开始之前被调用：相关的 render 函数首次被调用
        beforeMount () {
            if (this.histories.length === 0) {
                this.previousDay()
            }
            if (this.$store.state.latest.length === 0) {
                API.fetchLatest(this.$store)
            }
        },
        //el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用该钩子。如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.$el 也在文档内
        mounted(){
            scrollTo(0, sessionStorage.getItem('scrollTop'));
            window.addEventListener('scroll', this.scrollEvent)
        },
        // 导航离开该组件的对应路由时调用
        // 可以访问组件实例 `this`
        beforeRouteLeave (to, from, next) {
            if (to.name === 'detail' || to.name === 'top-detail') {
                this.$store.state.article = {}
            }
            window.removeEventListener('scroll', this.scrollEvent);
            sessionStorage.setItem('scrollTop', document.body.scrollTop);
            next()
        },
        methods: {
            changeDate(e){
                const date = e.target.value.replace(/-/g, '');
                date && this.$router.push(`date?dtime=${date}`);
            },
            previousDay(){
                if (!this.$store.state.loadingDay) {
                    this.$store.state.date = new DateCalc(this.$store.state.date).before();
                    API.fetchHistory(this.$store, this.$store.state.date);
                }
            }
        }
    };
</script>

<style scoped>
 @import "../../public/css/home.css";
</style>