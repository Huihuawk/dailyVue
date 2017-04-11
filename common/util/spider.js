var CronJob = require('cron').CronJob;
var Promise = require('es6-promise');

var config = require('../../config');

var ArticleDAO = require('../db/models/article');
var HistoryDAO = require('../db/models/history');
var CmtCountDAO = require('../db/models/cmtCount');
var CommentsDAO = require('../db/models/comments');
var LogDAO = require('../db/models/log');
var dlAPI = require('../api/index');
var DateCalc = require('./date');

var historyDAO = new HistoryDAO(),
    cmtCountDAO = new CmtCountDAO(),
    articleDAO = new ArticleDAO(),
    commentsDAO = new CommentsDAO(),
    logDAO = new LogDAO();

var Spider = {
    init: function (start, end) {
        start = new DateCalc(start).after();
        end = new DateCalc(end).after();
        historyDAO.count({dtime: start}).then(function (d) {
            if (start == end){
                d == 0 && Spider.day(start);
            } else {
                d == 0 && Spider.loopDayData(start, end);
            }
        });
        Spider.loopDayData(start, end);
    },
    //日数据
    day: function (date, callback) {
        dlAPI.getHistory(date).then(function (history) {
            const date = history.date,
                d = history.stories,
                promiseAll = [];
            for (var i = 0; i < d.length; i++) {
                var data = {
                    id: d[i].id,
                    title: d[i].title,
                    image: d[i].images.length ? d[i].images[0] : '',
                    theme: d[i].theme ? d[i].theme.id : 0,
                    type: d[i].type || '0',
                    dtime: date,
                    dmonth: date.substr(0, 6),
                    dyear: date.substr(0, 4)
                };
                var p = Spider.history(data)
                    .then(function (err) {
                        if (err) {
                            //写入存储的log
                            let log = {
                                id: data.id,
                                err: 1,
                                date: date,
                                msg: JSON.parse(err)
                            };
                            console.log('get history error ' + data.id);
                            logDAO.save(error);
                        } else {
                            return Promise.resolve(data.id);
                        }
                    }).then(function (aid) {
                        return Spider.cmtLong(aid);
                    }).then(function (aid) {
                        return Spider.cmtShort(aid);
                    }).then(function (aid) {
                        return Spider.cmtCount(aid);
                    }).catch(function (e) {
                        console.log('day history data error id:' + data.id, e);
                    });
                promiseAll.push(p);
            }
            Promise.all(promiseAll).then(function (err) {
                callback && callback();
            }).catch(function (error) {
                console.log('get day data error: ', error)
            })
        })
    },
    //正文
    article: function (aid) {
        return dlAPI.getArticle(aid).then(function (article) {
            var data = {
                id: article.id,
                title: article.title,
                body: article.body,
                image: article.image,
                css: article.css,
                js: article.js,
                imageSource: article.image_source,
                shareUrl: article.share_url
            };
            return articleDAO.save(data)
                .then(function (err) {
                    if (err) {
                        //写入存储的log
                        let log = {
                            id: data.id,
                            err: config.spider.errArticle,
                            date: '',
                            msg: JSON.parse(err)
                        };
                        console.log('article save  error ' + data.id);
                        return logDAO.save(error);
                    } else {
                        return Promise.resolve(data.id);
                    }
                })
        })
    },
    //提出保存历史数据function
    history: function (data) {
        return historyDAO.save(data)
            .then(function (err) {
                if (err) {
                    let log = {
                        id: data.id,
                        err: config.spider.errHistory,
                        date: date,
                        msg: JSON.parse(err)
                    };
                    console.log('get history error ' + data.id);
                    logDAO.save(error);
                } else {
                    return Promise.resolve(data.id);
                }
            })
    },
    //评论，点赞
    cmtCount: function (aid) {
        return dlAPI.getCmtcount(aid).then(function (count) {
            var data = {
                id: aid,
                longComments: count.longComments ? count.longComments : 0,
                shortComments: count.shortComments ? count.shortComments : 0,
                comments: count.comments ? count.comments : 0
            }
            return cmtCountDAO.save(data)
                .then(function (err) {
                    if (err) {
                        let log = {
                            id: data.id,
                            err: config.spider.errComments,
                            date: date,
                            msg: JSON.parse(err)
                        };
                        console.log('comments count error ' + data.id);
                        logDAO.save(error);
                    } else {
                        return Promise.resolve(data.id);
                    }
                })
        })
    },
    //长评论
    cmtLong: function (aid) {
        return dlAPI.getCmtLong(aid).then(function (article) {
            var data = {
                aid: article.id,
                comments: cmts.comments,
                type: 1
            };
            return commentsDAO.save(data)
                .then(function (err) {
                    if (err) {
                        let log = {
                            id: data.id,
                            err: config.spider.errComments,
                            date: '',
                            msg: JSON.parse(err)
                        };
                        console.log('long comments  error ' + data.id);
                        return logDAO.save(error);
                    } else {
                        return Promise.resolve(data.id);
                    }
                })
        })
    },
    //短评论
    cmtShort: function (aid) {
        return dlAPI.getCmtShort(aid).then(function (article) {
            var data = {
                aid: article.id,
                comments: cmts.comments,
                type: 0
            };
            return commentsDAO.save(data)
                .then(function (err) {
                    if (err) {
                        let log = {
                            id: data.id,
                            err: config.spider.errComments,
                            date: '',
                            msg: JSON.parse(err)
                        };
                        console.log('short comments  error ' + data.id);
                        return logDAO.save(error);
                    } else {
                        return Promise.resolve(data.id);
                    }
                })
        })
    },
    loopDayData: function (start, end) {
        var _self = this,
            date = start,
            dateCalc = new DateCalc(start);
        // _self.day(date);
        _self.day(date, function () {
            date = dateCalc.before();
            if (date === end) {
                _self.day(date);
                console.log('over-------------');
            } else {
                _self.loopDayData(date, end);
            }
        })
    },
    //爬取每日最新的数据 每天23:30
    daily: function () {
        new CronJob('* * * * * *', function () {
            console.log('-------Begin-------');
            dlAPI.getLatest().then(function (latest) {
                var d = latest.stories,
                    date = latest.date;
                console.log('-------over request-------');
                for (var i = 0; i < d.length; i++) {
                    var img = '';
                    if (d[i].images) {
                        img = d[i].images[0];
                    }
                    var data = {
                        id: d[i].id,
                        title: d[i].title,
                        image: img,
                        dtime: d.date,
                        dyear: d.date.substr(0, 4)
                    };
                    historyDAO.save(data).then(function (err) {
                        if (err) {
                            var error = {
                                id: data.id,
                                err: 2,
                                date: [d.getFullYear(), '-', Spider._cover(d.getMonth() + 1), '-', Spider._cover(d.getDate())].join(''),
                                msg: JSON.parse(err)
                            }
                            logDAO.save(error);
                        }
                    })
                }
            })
        }, function () {
            console.log('cronjob over');
        }, true, 'Asia/Shanghai')
    },
    _cover: function (num) {
        var n = parseInt(num, 10);
        return n < 10 ? '0' + n : n;
    }
};

module.exports = Spider;

