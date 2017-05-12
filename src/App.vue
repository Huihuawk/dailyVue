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
                                <li role="presentation"><a href="/statis" target="_self">数据统计</a></li>
                                <li role="presentation"><a href="/about" target="_self">关于</a></li>
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
                        <h4 class="title">历史文章</h4>
                        <div class="content community">
                            <p class="control-label">Date Picking</p>
                            <div class="input-group date form_date" data-date="" data-date-format="yyyy-mm-dd" data-link-field="dtp_input2" data-link-format="yyyy-mm-dd">
                                <input class="form-control" size="16" type="text" value="2017-05-01" readonly>
                                <span class="input-group-addon"><span class="icon date-close glyphicon glyphicon-remove"></span></span>
                                <span class="input-group-addon"><span class="icon date-pic glyphicon glyphicon-calendar"></span></span>
                            </div>
                            <input type="hidden" id="dtp_input2" value="" /><br/>
                            <button class="btn btn-default btn-block" id="day-pic">See the article</button>
                        </div>
                    </div>
                    <div class="widget">
                        <h4 class="title">代码仓库</h4>
                        <div class="content community">
                            <p>Power by Vue & Node.</p>
                            <a href="https://github.com/Huihuawk/dailyVue" class="btn btn-default btn-block">View on Github</a>
                        </div>
                    </div>
                    <div class="widget">
                        <h4 class="title">错误列表</h4>
                        <div class="content community">
                            <p>数据存储错误列表</p>
                            <a href="/spider-error" class="btn btn-default btn-block">Error Hanldling</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <a href="#" id="back-to-top" @click="up"><i class="fa">↑</i></a>s
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
            },
            backToTop: function () {
                $(window).scroll(function(){
                    if ($(this).scrollTop() > 100) {
                        $('#back-to-top').fadeIn();
                    } else {
                        $('#back-to-top').fadeOut();
                    }
                });
            }
        },
        mounted () {
            this.backToTop();
        }
    }
</script>
<style>
    @import "../public/css/index/base.css";
    @import "../public/css/index/index.css";
    @import "../public/c/bootstrap-datetimepicker.css";
</style>
