<template>
    <div id="comment" class="article-comments">
        <section class="item" v-for="item in comments">
            <div class="avatar">
                <img v-lazy="item.avatar">
            </div>
            <div class="content">
                <p class="author">{{ item.author }} <span :class="item.likes>10 && 'hot' "><i
                        class="icon like"></i>{{ item.likes }}</span></p>
                <p class="cmt">
                    {{ item.content }}
                </p>
                <div v-if="item.reply_to" class="reply">
                    <span>//{{item.reply_to.author}} : </span>{{ item.reply_to.content }}
                </div>
                <span class="date">{{ item.time | date }}</span>
            </div>
        </section>
    </div>
</template>

<style scoped>
    @import "../../public/css/comments.css";
</style>

<script>
    export default {
        name: 'article-comments',
        props: ['comments']
    }
</script>