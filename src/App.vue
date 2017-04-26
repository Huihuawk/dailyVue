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
                                <li class="nav-current" role="presentation"><a href="/">首页</a></li>
                                <li role="presentation"><a href="/">数据分析</a></li>
                                <li role="presentation"><a href="/">关于</a></li>
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
                            <a href="https://github.com/Huihuawk/dailyVue" class="btn btn-default btn-block" onclick="_hmt.push(['_trackEvent', 'big-button', 'click', 'View on Github'])">View on Github</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
    export default {
        name: 'app'
    }
</script>
<style>
    @import "../public/css/index/base.css";
    @import "../public/css/index/index.css";
</style>
