<template>
    <div class="article">
        <div class="img-wrap"
             :style="{'background-image':`url(http://ccforward.sinaapp.com/api/proxy.php?url=+${article.image})`}">
            <h1>{{ article.title }}</h1>
            <span>{{ article.imageSource }}</span>
            <div class="img-mask"></div>
        </div>
        <article v-html="article.body"></article>
    </div>
</template>


<script>
    export default {
        name: 'article-item',
        props: ['article']
    };
</script>


<style scoped>
    @import "../../public/css/articles.css";
</style>