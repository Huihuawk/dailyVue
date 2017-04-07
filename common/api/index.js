// 通过API 获取数据

var request = require('request');
var Promise = require('es6-promise').Promise;

var API = {
    'startPic'  : 'http://news-at.zhihu.com/api/4/start-image/720*1184',
    'latest'    : 'http://news-at.zhihu.com/api/4/news/latest',
    'article'   : 'http://news-at.zhihu.com/api/4/news/',
    'history'   : 'http://news.at.zhihu.com/api/4/news/before/'
}

var data = {

    //startPic
    getStartPic: function () {
        var url = API.latest;
        return new Promise(function (resolve, reject) {
            request(url, function (err, response, body) {
                var pic = null;
                if(!err){
                    var latest = JSON.parse(body);
                    resolve(latest);
                }else {
                    return reject(err);
                }
            })
        })
    },
    //最新内容
    getLatest: function () {
        var url = API.latest;
        return new Promise(function (resolve, reject) {
            request(url, function (err, response, body) {
                var latest = null;
                if(!err){
                    latest = JSON.parse(body);
                    resolve(latest);
                }else {
                    return reject(err)
                }
            })
        })
    },
    //文章详情
    getArticle: function (articleId) {
        if(articleId) {
            var url = API.article + articleId;
            request(url, function (err, response, body) {
                if(!err){
                    var article = JSON.parse(body);
                    return article;
                }
            })
        }else {
            return null;
        }
    },
    //历史内容
    getHistory: function (date, callback) {
        if(date){
            var url = API.history + date;
            request(url, function (err, response, body) {
                if(!err){
                    var history = JSON.parse(body);
                    callback(history.stories);
                }else {
                    return null;
                }
            })
        }
    }
}

module.exports = data;