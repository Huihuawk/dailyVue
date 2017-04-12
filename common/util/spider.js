var CronJob = require('cron').CronJob;
var Promise = require('es6-promise');

var CONFIG = require('../../config');

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
            // if (start == end){
            //     d == 0 && Spider.day(start);
            // } else {
            //     d == 0 && Spider.loopDayData(start, end);
            // }
            console.log(d);
            start = new DateCalc(start).after();
            end = new DateCalc(end).after();
            // 每20秒一次 CONFIG.spider.interval == 20
            var interval = '*/' + CONFIG.spider.interval + ' * * * * *';
            var spiderCronJob = new CronJob(interval, function () {
                if (d == 0){
                    Spider.day(start);
                    var dateCalc = new DateCalc(start);
                    start = dateCalc.before();
                    if (start == end){
                        setTimeout(function () {
                            Spider.day(end);
                        }, CONFIG.spider.interval * 1000);
                        spiderCronJob.stop();
                    }else {
                        spiderCronJob.stop();
                    }
                }
            }, null, true, 'Asia/Shanghai');
        });
    },
    //日数据
    day: function (date) {
        dlAPI.getHistory(date).then(function (history) {
            var hDate = history.date,
                d = history.stories,
                promiseAll = [];
            for (var i = 0; i < d.length; i++) {
                var data = {
                    id: d[i].id,
                    title: d[i].title,
                    image: d[i].images.length ? d[i].images[0] : '',
                    theme: d[i].theme ? d[i].theme.id : 0,
                    type: d[i].type || '0',
                    dtime: hDate,
                    dmonth: hDate.substr(0, 6),
                    dyear: hDate.substr(0, 4)
                };
                var p = Spider.dataOne(data, hDate);
                promiseAll.push(p);
            }
            Promise.all(promiseAll).then(function () {
                console.log('\nday history data over @: ' + date);
            }).catch(function (error) {
                console.log('get ' + hDate + ' data error: ', error)
            })
        })
    },
    dataOne: function (data, date) {
        return Spider.history(data)
            .then(function (d) {
                return Spider.article(d.id, d.dtime);
            })
            .then(function (d) {
                return Spider.cmtCount(d.id, d.dtime);
            })
            .then(function (d) {
                return Spider.cmtLong(d.id, d.dtime);
            })
            .then(function (d) {
                return Spider.cmtShort(d.id, d.dtime);
            })
            .catch(function (e) {
                console.log('day @' + date + ' history data error @id: ' + data.id, e);
            })
    },
    //正文
    article: function (aid, dtime) {
        return dlAPI.getArticle(aid).then(function (article) {
            var data = {
                id: aid,
                title: article.title,
                body: article.body,
                image: article.image,
                css: article.css,
                js: article.js,
                imageSource: article.image_source,
                shareUrl: article.share_url,
                dtime: dtime,
                dmonth: dtime.substr(0, 6),
                dyear: dtime.substr(0, 4)
            };
            return articleDAO.save(data)
                .then(function () {
                    return Promise.resolve({aid:aid, dtime: dtime});
                })
                .catch(function (err) {
                    var log = {
                        id: aid,
                        err: CONFIG.spider.errArticle,
                        date:dtime,
                        msg: err
                    };
                    console.log('article save error @id: ' + aid);
                    return logDAO.save(log);
                })
        })
    },
    //提出保存历史数据function
    history: function (data) {
        return historyDAO.save(data)
            .then(function () {
                return Promise.resolve({aid:data.id, dtime: data.dtime});
            })
            .catch(function (err) {
                var log = {
                    id: data.id,
                    err: CONFIG.spider.errHistory,
                    date: data.dtime,
                    msg: err
                };
                console.log('get history error @id: ' + data.id);
                return logDAO.save(log);
            })
    },
    //评论，点赞
    cmtCount: function (aid, dtime) {
        return dlAPI.getCmtcount(aid).then(function (count) {
            var data = {
                id: aid,
                longComments: count.longComments ? count.longComments : 0,
                shortComments: count.shortComments ? count.shortComments : 0,
                comments: count.comments ? count.comments : 0,
                dtime: dtime,
                dmonth: dtime.substr(0, 6),
                dyear: dtime.substr(0, 4)
            }
            return cmtCountDAO.save(data)
                .then(function () {
                    return Promise.resolve({aid: aid, dtime: dtime});
                })
                .catch(function (err) {
                    var log = {
                        id: aid,
                        err: CONFIG.spider.errComments,
                        date: dtime,
                        msg: err
                    };
                    console.log('comments count error ' + aid);
                    logDAO.save(log);
                })
        })
    },
    //长评论
    cmtLong: function (aid, dtime) {
        return dlAPI.getCmtLong(aid).then(function (cmts) {
            var data = {
                aid: aid,
                comments: cmts.comments,
                type: 1,
                dtime: dtime,
                dmonth: dtime.substr(0, 6),
                dyear: dtime.substr(0, 4)
            };
            return commentsDAO.save(data)
                .then(function () {
                    return Promise.resolve({aid: aid, dtime: dtime});
                })
                .catch(function (err) {
                    var log = {
                        id: aid,
                        err: CONFIG.spider.errComments,
                        date: dtime,
                        msg: err
                    };
                    console.log('long comments  error ' + aid);
                    return logDAO.save(log);
                })
        })
    },
    //短评论
    cmtShort: function (aid, dtime) {
        return dlAPI.getCmtShort(aid).then(function (cmts) {
            var data = {
                aid: aid,
                comments: cmts.comments,
                type: 0,
                dtime: dtime,
                dmonth: dtime.substr(0, 6),
                dyear: dtime.substr(0, 4)
            };
            return commentsDAO.save(data)
                .then(function () {
                    return Promise.resolve({aid: aid, dtime: dtime});
                })
                .catch(function (err) {
                    var log = {
                        id: aid,
                        err: CONFIG.spider.errComments,
                        date: dtime,
                        msg: err
                    };
                    console.log('short comments  error ' + aid);
                    return logDAO.save(log);
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
        new CronJob('00 30 23 * * *', function () {
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

