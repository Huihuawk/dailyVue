var CronJob = require('cron').CronJob;
var Promise = require('es6-promise');

var CONFIG = require('../../config');

var ArticleDAO = require('../db/models/article');
var HistoryDAO = require('../db/models/history');
var CmtCountDAO = require('../db/models/cmtCount');
var CommentsDAO = require('../db/models/comments');
var LatestDAO = require('../db/models/latest');
var TempDAO = require('../db/models/temp');
var dlAPI = require('../api/index-promise');
var DateCalc = require('./date');
var dateCalculator = new DateCalc();


var historyDAO = new HistoryDAO(),
    cmtCountDAO = new CmtCountDAO(),
    articleDAO = new ArticleDAO(),
    commentsDAO = new CommentsDAO(),
    latestDAO = new LatestDAO(),
    tempDAO = new TempDAO();

let logger = console;

const Spider = {
    gogo: function (start, end) {
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
                logger.info('day history data over @: ' + new DateCalc(date).before());
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
                tempDAO.save({aid: '', dtime: data.dtime});
                console.log('day @' + date + ' history data error @id: ' + data.id, e);
                logger.error('day @' + date + 'history data error @id: ' + data.id, e);
            })
    },
    //文章正文
    article: function (aid, dtime, latest) {
        return dlAPI.getArticle(aid).then(function (article) {
            var section = article.section || {id: null, name: null};
            var data = {
                id: aid,
                title: article.title,
                body: article.body,
                image: article.image,
                css: article.css,
                js: article.js,
                imageSource: article.image_source,
                shareUrl: article.share_url,
                section: article.section || {},
                sectionId: section.id || '',
                sectionName: section.name || '',
                dtime: dtime,
                dmonth: dtime.substr(0, 6),
                dyear: dtime.substr(0, 4),
                latest: !!latest
            };
            return articleDAO.save(data)
                .then(function () {
                    return Promise.resolve({aid: aid, dtime: dtime});
                })
                .catch(function (err) {
                    logger.error('article save error @aid: ' + aid, err);
                })
        })
            .catch(function (err) {
                tempDAO.save({aid: aid, dtime: dtime});
                logger.error('article save error @id: ' + aid, err);
            });
    },
    //提出保存历史数据function
    history: function (data) {
        return historyDAO.save(data)
            .then(function () {
                return Promise.resolve({aid: data.id, dtime: data.dtime});
            })
            .catch(function (err) {
                debugger;
                tempDAO.save({aid: '', dtime: dtime});
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
                tempDAO.save({aid: aid, dtime: dtime});
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
                        tempDAO.save({aid: aid, dtime: dtime});
                        logger.error('get cmtShort error @id: ' + aid, err);
                    })
            })
            .catch(function (err) {
                logger.error('short comments save error @aid: ' + aid, err);
            })
    },
    //更新评论
    updateCmtCount: function (start, end) {
        var aidArr = [];
        return cmtCountDAO.search({dtime: start})
            .then(function (data) {
                if (data.length) {
                    for (var i = 0; i < data.length; i++) {
                        aidArr.push(data[i].aid);
                    }
                    return cmtCountDAO.delete({aid: {$in: aidsArr}});
                } else {
                    return Promise.reject('delete over');
                }
            })
            .then(function () {
                var promiseArr = [];
                while (aidsArr.length > 0) {
                    var aid = aidsArr.pop();
                    promiseArr.push(Spider.cmtCount(aid, start));
                }
                return Promise.all(promiseArr);
            })
            .then(function () {
                dateCalculator.now(start);
                var date = dateCalculator.before();
                if (date != end) {
                    Spider.updateCmtCount(date, end)
                }
                return Promise.resolve(start);
            })
            .catch(function (err) {
                logger.error('update error : ' + err);
                return Promise.resolve(start);
            })
    },
    //latest 内容
    latest(){
        var dtime = dateCalculator.now(),
            topID = [],
            latestID = [];
        articleDAO.delete({latest: true})
            .then(function () {
                return latestDAO.delete()
            }).then(function () {
            return dlAPI.getLatest()
        })
            .then(function (d) {
                var dtime = d.date,
                    stories = d.stories,
                    top = d.top_stories,
                    promiseAll = [];
                for (var i = 0; i < top.length; i++) {
                    topID.push(top[i].id);
                    var data = {
                        id: top[i].id,
                        title: top[i].title,
                        image: top[i].image,
                        top: true,
                        dtime: dtime
                    };
                    var p = latestDAO.save(data);
                    promiseAll.push(p)
                }
                for (var i = 0; i < stories.length; i++) {
                    latestID.push(stories[i].id);
                    var data = {
                        id: stories[i].id,
                        title: stories[i].title,
                        image: stories[i].images ? stories[i].images[0] : '',
                        top: false,
                        dtime: dtime
                    };
                    var p = latestDAO.save(data);
                    promiseAll.push(p)
                }
                return Promise.all(promiseAll);
            })
            .then(function () {
                for (let x = 0; x < topID.length; x++) {
                    Spider.article(topID[x], dtime, true);
                }
                for (let y = 0; y < latestID.length; y++) {
                    Spider.article(latestID[y], dtime, true);
                    dlAPI.getCmtcount(latestID[y])
                        .then(function (count) {
                            var data = {
                                id: latestID[y],
                                comments: count.comments || 0,
                                popularity: count.popularity || 0,
                                dtime: dtime
                            }
                            latestDAO.save(data);
                        })
                }
            })
            .catch(function (err) {
                logger.error('get lastest data error: ', err);
            })
    }
};

module.exports = Spider;
