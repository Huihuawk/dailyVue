<template>
    <section class="history">
        <div class="date" v-if="data.month">
            <span><i class="m">{{ data.month.substr(0, 3) }}</i><i class='d'>{{ data.month.substr(3, 2) }}</i></span>
        </div>
        <ul>
            <li v-for="item in data.latest">
                <router-link :to="{path: 'detail', query:{aid: item.id}}">
                    <span class="title">{{item.title}}</span>
                    <div class="img"
                         v-lazy:background-image="'http://ccforward.sinaapp.com/api/proxy.php?url='+item.image"></div>
                    <p class="sns">
                        <i :class="item.popularity>500 && 'hot' ">{{ item.popularity || 0 }} likes</i> |
                        <i>{{ item.comments || 0 }} comments</i>
                    </p>
                </router-link>
            </li>
        </ul>
    </section>
</template>

<style scoped>
    @import "../../public/css/latest.css";
</style>

<script>
    export default {
        name: 'latest-item',
        props: ['data']
    }
</script>