<template>
    <div class="date-container">
        <div class="date-link">
            <router-link class="date-before" :to="{ path: '/the-day', query: { dtime: date.before }}" replace>
                < &nbsp;{{date.beforeCN}}
            </router-link>
            <router-link class="date-after" :to="{ path: '/the-day', query: { dtime: date.after }}" replace>
                {{date.afterCN}}&nbsp; >
            </router-link>
        </div>
        <div class="headline"></div>
        <History :day="theDay" :view="true"></History>
        <a class="fetch-day" @click.prevent="fetch" v-if="!theDay.data">刷新数据</a>
        <router-link :to="{path: '/'}" style="display:block;margin:10px 0">返回首页</router-link>
    </div>
</template>

<style scoped>
    @import "../../public/css/theday.css";
</style>

<script>
    import History from '../components/History.vue'
    import DateCalc from '../../common/util/date'
    import axios from 'axios'

    const API = {
        fetchHistory: (store) => {
            return store.dispatch('FETCH_THEDAY',  store.state.route.query.dtime);
        }
    };

    export default {
        name: 'the-day',
        components: {
            History
        },
        preFetch: API.fetchHistory,
        computed: {
            date() {
                API.fetchHistory(this.$store);
                const d = new DateCalc(this.dtime);
                return {
                    before: d.before(),
                    beforeCN: d.beforeCN(),
                    after: d.after(),
                    afterCN: d.afterCN()
                }
            },
            theDay() {
                return this.$store.state.theday
            },
            dtime() {
                return this.$store.state.route.query.dtime
            }
        },
        methods: {
            fetch() {
                const dtime = this.dtime;
                axios.post(`/clear-error/${dtime}`)
            }
        }
    }


</script>