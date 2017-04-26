<template>
    <Articles :article="article"></Articles>
</template>

<script>
    import Vue from 'vue'
    import Articles from '../components/Articles.vue'

    const API = {
        fetchArticle: store => {
            return store.dispatch('FETCH_ARTICLE', store.state.route.query.aid)
        }
    };

    export default {
        name: 'detail',
        components: {
            Articles
        },
        computed: {
            article () {
                return this.$store.state.article
            }
        },
//        preFetch: API.fetchArticle,
        beforeMount () {
            API.fetchArticle(this.$store)
        }
    }
</script>