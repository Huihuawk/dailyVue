<template>
    <div class="home">
        <ul>
            <li v-for="item in latest">
                <p class="title">
                    <router-link to='/article' query={aid:  item.id}> {{item.title}} </router-link>
                </p>
            </li>
        </ul>
        <div class="history" v-for="day in history">
            <p class="dtime">{{day.dtime}}</p>
            <ul>
                <li v-for="d in day.data"></li>
                <img :src="d.image">
                <a v-link="{ path: '/article', query:{aid: d.id} }">{{ d.title }}</a>
            </ul>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import vueResource from 'vue-resource'
    Vue.use(vueResource);

    export default {
        data(){
            return {
                latest: {},
                history: []
            }
        }
    }
</script>

// stylus
<style lang="stylus">
    .date-pick {
        position relative
        &:hover {
            .date-desc {
                opacity 0
            }
        }
        input {
            margin 10px 0
            width 30%
            height 25px
            border 1px solid #42b983
            outline 0
            color #42b983
            line-height 25px
            text-indent 6px
            font-size 13px
        }
        .date-desc {
            position absolute
            top 14px
            left 3px
            margin 0
            height 20px
            background #fff
            color #42b983
            font-size 12px
            text-indent 11px
        }
    }

    .statis-link {
        text-align center
    }

    .history {
        a {
            display block
            overflow hidden
        }
        li {
            width 100%
            padding 8px 0
            overflow hidden
            border-bottom 1px solid #ccc;
            .title {
                display inline-block
                margin 10px 0 0 10px
                width auto
                max-width 70%
                font-size 15px
                line-height 1.5
            }
            img,
            .img {
                float right
                margin-right 5px
                width 90px
                height 90px
                background-size 100%
            }

        }
    }

    @keyframes MoreLoadingAnimation {
        0% {
            transform rotate(0deg)
        }
        to {
            transform rotate(360deg)
        }
    }

    @media (max-width: 650px) {
        .date-pick {
            display none
        }
    }

    @media (max-width: 500px) {
        .home {
            li .title {
                font-size 13px
            }
            button {
                margin 10px auto
                height 50px
                width 50px
                span {
                    display none
                }
                &::before,
                &::after {
                    height 50px
                    width 50px
                    border-width 2px
                }
                &::after {
                    border-width 2px
                }
            }

        }
    }
</style>