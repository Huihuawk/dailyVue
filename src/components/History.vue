<template>
    <section class="history">
        <div class="date" v-if="day.month">
            <span><i class="m">{{ day.month.substr(0, 3) }}</i><i class='d'>{{ day.month.substr(3, 2) }}</i></span>

            <router-link v-if="view" class="day-link" :to="{ path: '/the-day', query: { dtime: dtime }}">
                <small>{{ day.date }}</small>
            </router-link>

            <router-link v-else class="day-link" :to="{ path: '/the-day', query: { dtime: day.data[0].dtime }}">
                <small>{{ day.date }}</small>
            </router-link>
        </div>
        <ul>
            <li v-for="item in day.data">
                <router-link :to="{path: 'detail', query:{aid: item.id}}">
                    <span class="title">{{item.title}}</span>
                    <img v-if="view" :src="'http://ccforward.sinaapp.com/api/proxy.php?url='+item.image">
                    <img v-else v-lazy="'http://ccforward.sinaapp.com/api/proxy.php?url='+item.image">
                    <p class="sns">
                        <i :class="item.popularity>500 && 'hot' ">{{ item.popularity }} likes</i> |
                        <i>{{ item.comments }} comments</i>
                    </p>
                </router-link>
            </li>
        </ul>
    </section>
</template>

<style scoped>
    @import "../../public/css/history.css";
</style>

<script>
    export default {
        name: 'history-item',
        props: ['day', 'view'],
        computed: {
            dtime() {
                return this.$route.query.dtime
            }
        }
    }
</script>

