var request = require('request');
var jade = require('jade');
var $ = require('cheerio');

var dailyAPI = {
    getLatest : function(req, res){
        // 最新内容
        // http://news-at.zhihu.com/api/4/news/latest
        request('http://news-at.zhihu.com/api/4/news/latest', function (err, response, body) {
            if(!err){
                var latest = JSON.parse(body);
                var pic = {};
                pic.text = 'author @ 2017';
                pic.img = 'http://gtms03.alicdn.com/tps/i3/TB117YzHpXXXXXLXXXXWZMJJXXX-720-1280.jpg';
                res.render('index', { 'title': 'Daily', 'pic': pic, 'latest':latest.stories});
            }else {

            }
        })
    },
    //文章详情
    getArticle: function (req, res) {
        var articleId = req.params.id;
        if(articleId) {
            var url = 'http://news-at.zhihu.com/api/4/news/' + articleId;
            request(url, function (err, response, body) {
                if(!err){
                    var article = JSON.parse(body);
                    var content = window.$(article.body);
                    res.render('article', { 'title': article.title});
                }
            })
        }else {

        }
    },
    // 历史内容
    getHistory: function (req, res) {
        var date = req.params.date;
        if(date){
            var url = 'http://news.at.zhihu.com/api/4/news/before/' + date;
        }else {

        }
    }
}

module.exports = dailyAPI;