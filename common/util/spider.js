var CronJob = require('cron').CronJob;
var Promise = require('es6-promise');

var ArticleDAO = require('../db/models/article');
var HistoryDAO = require('../db/models/history');
var CmtCountDAO = require('../db/models/cmtCount');
var dlAPI = require('../api/index');
var DateCalc = require('./date');

var historyDAO = new HistoryDAO(),
    cmtCountDAO = new CmtCountDAO();

var Spider = {
    init: function (start, end) {
        var dateCalc = new DateCalc(start);
        historyDAO.count({dtime: dateCalc.before()}).then(function (d) {
            d == 0 && Spider.loopDate(start, end);
        })
    },
    //日数据
    day: function (date) {
        dlAPI.getHistory(date).then(function (history) {
            var date = history.date;
            var d = history.stories;
            for(var i = 0; i < d.length; i++){
                var img = '';
                var theme = 0;
                if(d[i].images){
                    img = d[i].images[0];
                }
                if(d[i].theme){
                    theme = d[i].theme.id;
                    t = d[i].theme.name;
                }
                var data = {
                    id: d[i].id,
                    title: d[i].title,
                    iamge: img,
                    theme: theme,
                    dtime: date,
                    dmonth: date.substr(0,6),
                    dyear: date.substr(0,4)
                }
                historyDAO.save(data);
            }
        })
    },
    //评论，点赞
    comment: function (articleId) {
        dlAPI.getCmtcount(articleId).then(function (count) {
            var data = {
                id: articleId,
                longComments: count.longComments ? count.longComments : 0,
                shortComments: count.shortComments ? count.shortComments : 0,
                popularity: count.popularity ? count.popularity : 0,
                comments: count.comments ? count.comments : 0
            }
            cmtCountDAO.save(data);
        })
    },
    loopDate: function (start, end) {
        var _self = this,
            date = start,
            dateCalc = new DateCalc(start);
        _self.day(date);
        date = dateCalc.before();
        if(date === end){
            _self.day(date);
            console.log('over-------------');
        }else {
            setTimeout(function () {
                _self.loopDate(date,end);
            }, 100)
        }
    },
    //爬取每日最新的数据 每天23:30
    daily: function () {
        new CronJob('* * * * * *', function () {
            console.log('-------Begin-------');
            dlAPI.getLatest().then(function (latest) {
                var d = latest.stories,
                    date = latest.date;
                console.log('-------over request-------');
                for (var i = 0; i< d.length; i++){
                    var img = '';
                    if(d[i].images){
                        img = d[i].images[0];
                    }
                    var data = {
                        id: d[i].id,
                        title: d[i].title,
                        image: img,
                        dtime: d.date,
                        dyear: d.date.substr(0,4)
                    };
                    historyDAO.save(data);
                }
            })
        }, function () {
            console.log('cronjob over');
        }, true, 'Asia/Shanghai')
    }
}

module.exports = Spider;

