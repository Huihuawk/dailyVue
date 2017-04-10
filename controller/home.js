var request = require('request');
var Promise = require('es6-promise').Promise;
var $ = require('cheerio');
var dlAPI = require('../common/api/index');
var HistoryDAO = require('../common/db/models/history');

var Home = {
    index: function(req, res){
        res.render('index');
    },
    //最新内容
    getLatest: function (req, res) {
        Promise.all([dlAPI.getStartPic(),dlAPI.getLatest()]).then(function (result) {
            console.log(result);
            var pic = result[0];
            var latest = result[1];
            res.render('index',{'title':'Daily', 'pic':pic, 'latest': latest.stories});
        })
    },
    //详情
    getArticle: function (req, res) {
        var articleId = req.params.id;
        if(articleId) {
            var url = 'http://news-at.zhihu.com/api/4/news/' + articleId;
            request(url , function (err, response, body) {
                if(!err){
                    var article = JSON.parse(body);
                    var content = $(article.body);
                    res.render('article', {'title': article.title});
                }
            })
        }else {

        }
    },
    list: function (req, res) {
        var historyDAO = new HistoryDAO();
        historyDAO.list().then(function (list) {
            res.render('list', {'list': list});
        })
    },
    //搜索
    so: function (req, res) {
        var key = req.params.key,
            query = {title: new RegExp(key)};
        console.log(req.params);
        var historyDAO = new HistoryDAO();
        historyDAO.so(query).then(function (result) {
            res.render('list', {'title': key + '_日报搜索', 'list': result});
        })
    }
}

module.exports = Home;