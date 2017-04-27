<template>
    <div id="app">
        <header class="main-header">
            <div class="container">
                <div class="row">
                    <div class="col-sm-12">
                        <h1>智慧比财富更有价值</h1>
                        <h2>WISDOM OUTWEIGHS ANY WEALTH.</h2>
                    </div>
                </div>
            </div>
        </header>
        <nav class="main-navigation">
            <div class="container">
                <div class="row">
                    <div class="col-sm-12">
                        <div id="main-menu">
                            <ul class="menu">
                                <li class="nav-current" role="presentation"><a href="/" target="_self">首页</a></li>
                                <li role="presentation"><a href="/statistics">数据统计</a></li>
                                <li role="presentation"><a href="/about">关于</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
        <section class="content-wrap">
            <div class="container">
                <div class="col-sm-8">
                    <transition name="fade" mode="out-in">
                        <router-view class="view"></router-view>
                    </transition>
                </div>
                <div class="col-sm-4 sidebar">
                    <div class="widget">
                        <h4 class="title">Code</h4>
                        <div class="content community">
                            <p>Power by Vue & Node.</p>
                            <a href="https://github.com/Huihuawk/dailyVue" class="btn btn-default btn-block">View on Github</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <a href="#" id="back-to-top" style="display: inline;" v-on:click="up"><i class="fa">↑</i></a>
    </div>
</template>

<script>
    import Vue from 'vue'
    export default {
        name: 'app',
        methods: {
            up: function (e) {
                e.preventDefault();
                $('html, body').animate({
                    scrollTop: 0
                }, 1000);
                return false;
            }
        }
    }
</script>
<style>
    @import "../public/css/index/base.css";
    @import "../public/css/index/index.css";
</style>
