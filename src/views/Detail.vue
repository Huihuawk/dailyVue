<template>
  <div class="detail">
    <Articles :article="article"></Articles>

    <button class="btn-default" @click="getComment">
      <span v-if="comments.length == 0">点击查看最新评论</span>
      <span v-else>最新评论</span>
    </button>
    <i v-show="showLoading" class="loading">Loading</i>
    <template v-if="cmt">
      <Comment :comments="comments"></Comment>
    </template>
    <router-link :to="{path: '/'}" class="go-home">返回首页</router-link>
  </div>
</template>

<style scoped>
  @import "../../public/css/detail.css";
</style>

<script>
	import Articles from '../components/Articles.vue'
	import Comment from  '../components/Comment.vue'

	const API = {
		fetchArticle: store => {
			return store.dispatch('FETCH_ARTICLE', store.state.route.query.aid)
		},
		fetchComment: store => {
			return store.dispatch('FETCH_COMMENT', store.state.route.query.aid)
		}
	};

	export default {
		name: 'detail',
		data() {
			return {
				cmt: false,
				showLoading: false
			}
		},
		components: {
			Articles,
			Comment
		},
		computed: {
			article () {
				return this.$store.state.article
			},
			comments () {
				const cmts = [];
				this.$store.state.comments.sort((a, b) => {
					return a.type < b.type
				});
				for (let item of this.$store.state.comments) {
					cmts.push(...item.comments);
				}
				this.showLoading = false;
				document.body.scrollTop = document.body.scrollTop + 100;
				return cmts;
			}
		},
//        preFetch: API.fetchArticle,
		beforeMount () {
			API.fetchArticle(this.$store);
		},
		mounted(){
			scrollTo(0, 0)
		},
		beforeRouteLeave (to, from, next) {
			this.$store.state.comments.length = 0;
			next()
		},
		methods: {
			getComment () {
				this.cmt = true;
				if (this.comments.length === 0) {
					this.showLoading = true;
					if (this.$store.state.route.name === 'detail') {
							API.fetchComment(this.$store);
					}
				}
			}
		}
	}
</script>