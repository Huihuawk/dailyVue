<template>
    <div class="home">
        <ul>
            <li v-for="item in latest">
                <p class="title">
                    <a v-link="{ path: '/article', query:{ aid: item.id }}">{{item.title}}</a>
                </p>
            </li>
        </ul>
    </div>
</template>

<script>
    import Vue from 'vue'
    import vueResource from 'vue-resource'
    Vue.use(vueResource);

    export default {
        el(){
            return '.home'
        },
        data(){
            return {
                latest: {},
            }
        },

    }
</script>