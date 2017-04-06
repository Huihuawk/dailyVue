// 通过API 获取数据

var request = require('request');

var API = {
    'startPic'  : 'http://news-at.zhihu.com/api/4/start-image/720*1184',
    'latest'    : 'http://news-at.zhihu.com/api/4/news/latest',
    'article'   : 'http://news-at.zhihu.com/api/4/news/',
    'history'   : 'http://news.at.zhihu.com/api/4/news/before/'
}

var data = {

    //startPic
    getStartPic: function () {
        var url = API.startPic;
        request(url, function (err, response, body) {
            if(!err){
                var pic = JSON.parse(body);
                pic.img = 'http://gtms03.alicdn.com/tps/i3/TB117YzHpXXXXXLXXXXWZMJJXXX-720-1280.jpg';
                return pic;
            }else {
                return null;
            }
        })
    },
    //最新内容
    getLatest: function () {
        var url = API.latest;
        request(url, function (err, response, body) {
            if(!err){
                var latest = JSON.parse(body);
                return latest.stories;
            }else {
                return null;
            }
        })
    },
    //文章详情
    getArticle: function () {
        var url = API.article + articleId;
        request(url, function (err, response, body) {
            if(!err){
                var article = JSON.parse(body);
                return article;
            }else {
                return null;
            }
        })
    },
    //历史内容
    getHistory: function () {
        var url = API.history + date;
        request(url, function (err, response, body) {
            if(!err){
                var history = JSON.parse(body);
                return history.stories;
            }else {
                return null;
            }
        })
    }
}

module.exports = data;