<template>
    <div class="article">
        <img src="../assets/logo.png" class="logo" alt="">
        <h1>{{article.title}}</h1>
        <article v-html="article.body"></article>
        <a v-link="{ path: '/' }"> Home </a>
    </div>
</template>

<script>
    import Vue from 'vue'
    import vueResource from 'vue-resource'
    Vue.use(vueResource);

    export default{
        data(){
            return {
                article: {}
            };
        },
        ready(){
            this.$http.get('/article/', {}, {
                headers: {
                    vary: 'pjax'
                }
            }).then(function (res) {
                this.article = res.body;
                console.log(this.article);
            },function () {

            })
        }
    }
</script>