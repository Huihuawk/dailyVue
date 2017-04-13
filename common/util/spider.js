var CronJob = require('cron').CronJob;
var Promise = require('es6-promise');

var CONFIG = require('../../config');

var ArticleDAO = require('../db/models/article');
var HistoryDAO = require('../db/models/history');
var CmtCountDAO = require('../db/models/cmtCount');
var CommentsDAO = require('../db/models/comments');
var TempDAO = require('../db/models/temp');
var dlAPI = require('../api/index-promise');
var DateCalc = require('./date');
var dateCalculator = new DateCalc();


var historyDAO = new HistoryDAO(),
    cmtCountDAO = new CmtCountDAO(),
    articleDAO = new ArticleDAO(),
    commentsDAO = new CommentsDAO(),
    tempDAO = new TempDAO();

let logger = console;

const Spider = {
    init: function (start, end) {
        // Spider.daily();
        historyDAO.count({dtime: start}).then(function (d) {
            console.log(d);
            start = new DateCalc(start).after();
            end = new DateCalc(end).after();
            if (d > 0) {
                return;
            }
            // 每20秒一次 CONFIG.spider.interval == 20
            var interval = '*/' + CONFIG.spider.interval + ' * * * * *';
            var spiderCronJob = new CronJob(interval, function () {
                if (d == 0) {
                    Spider.day(end);
                    var dateCalc = new DateCalc(end);
                    end = dateCalc.after();
                    if (start == end) {
                        setTimeout(function () {
                            Spider.day(end);
                        }, CONFIG.spider.interval * 1000);
                        spiderCronJob.stop();
                    }
                } else {
                    spiderCronJob.stop();
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
                console.log('day history data over @: ' + date);
                logger.info('day history data over @: ' + date);
            }).catch(function (error) {
                console.log('get ' + hDate + ' data error: ', error);
                logger.error('get ' + hDate + ' data error: ', err);
            })
        })
    },
    dataOne: function (data, date) {
        return Spider.history(data)
            .then(Spider.article(data.id, data.dtime))
            .then(Spider.cmtCount(data.id, data.dtime))
            .then(Spider.cmtLong(data.id, data.dtime))
            .then(Spider.cmtShort(data.id, data.dtime))
            .catch(function (e) {
                tmpDAO.save({aid: '', dtime: data.dtime});
                console.log('day @' + date + ' history data error @id: ' + data.id, e);
                logger.error('day @' + date + 'history data error @id: ' + data.id, e);
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
                    return Promise.resolve({aid: aid, dtime: dtime});
                })
                .catch(function (err) {
                    logger.error('article save error @aid: ' + aid, err);
                })
        })
    },
    //提出保存历史数据function
    history: function (data) {
        return historyDAO.save(data)
            .then(function () {
                return Promise.resolve({aid: data.id, dtime: data.dtime});
            })
            .catch(function (err) {
                logger.error('get history error @id: ' + data.id, err);
            })
    },
    //评论，点赞
    cmtCount: function (aid, dtime) {
        return dlAPI.getCmtcount(aid)
            .then(function (count) {
                var data = {
                    id: aid,
                    longComments: count.longComments ? count.longComments : 0,
                    shortComments: count.shortComments ? count.shortComments : 0,
                    comments: count.comments ? count.comments : 0,
                    dtime: dtime,
                    dmonth: dtime.substr(0, 6),
                    dyear: dtime.substr(0, 4)
                };
                return cmtCountDAO.save(data)
                    .then(function () {
                        return Promise.resolve({aid: aid, dtime: dtime});
                    })
                    .catch(function (err) {
                        logger.error('get cmtCount error @id: ' + aid, err);
                    })
            })
            .catch(function (err) {
                logger.error('comments count save error @aid: ' + aid, err);
            })
    },
    //长评论
    cmtLong: function (aid, dtime) {
        return dlAPI.getCmtLong(aid)
            .then(function (cmts) {
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
                        logger.error('get cmtLong error @id: ' + aid, err);
                    })
            })
            .catch(function (err) {
                logger.error('long comments save error @id: ' + aid, err);
            })
    },
    //短评论
    cmtShort: function (aid, dtime) {
        return dlAPI.getCmtShort(aid)
            .then(function (cmts) {
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
                        logger.error('get cmtShort error @id: ' + aid, err);
                    })
            })
            .catch(function (err) {
                logger.error('short comments save error @aid: ' + aid, err);
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
                    Spider._dailySave(date, d[i]);
                }
            })
        }, function () {
            console.log('cronjob over');
        }, true, 'Asia/Shanghai')
    },
    _dailySave: function (date, data) {
        var his = {
            id: data.id,
            title: data.title,
            image: data.images.length ? data.images[0] : '',
            theme: data.theme ? data.theme.id : 0,
            type: data.type || '0',
            dtime: date,
            dmonth: date.substr(0, 6),
            dyear: date.substr(0, 4)
        };
        historyDAO.save(his)
            .then(function () {
                return Spider.article(data.id, date);
            })
            .catch(function (err) {
                logger.error('daily save error @aid:  ' + data.id, err);
            })
    }
};

module.exports = Spider;

