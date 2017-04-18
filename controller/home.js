var request = require('request');
var Promise = require('es6-promise').Promise;
var cheerio = require('cheerio');
var URL = require('url');


var dlAPI = require('../common/api/index-promise');
var HistoryDAO = require('../common/db/models/history');
var ArticleDAO = require('../common/db/models/article');
var CmtCountDAO = require('../common/db/models/cmtCount');
var CommentsDAO = require('../common/db/models/comments');
var LatestDAO = require('../common/db/models/latest');

var cmtCountDAO = new CmtCountDAO();
var articleDAO = new ArticleDAO();
var commentsDAO = new CommentsDAO();
var historyDAO = new HistoryDAO();
var latestDAO = new LatestDAO();


var Home = {
    index: function (req, res) {
        res.render('index');
    },
    //最新内容
    getLatest: function (req, res) {
        latestDAO.all().then(function (result) {
            if (result.length) {
                res.json(result)
            }
        })
    },
    //详情
    getArticle: function (req, res) {
        var aid = req.params.aid;
        if (aid) {
            articleDAO.search({id: aid}).then(function (data) {
                if (data.length) {
                    var result = data[0];
                    var $ = cheerio.load(result.body, {decodeEntities: false});
                    $('img').each(function (idx, item) {
                        $(item).attr('src', 'http://ccforward.sinaapp.com/api/proxy.php?url=' + $(item).attr('src'))
                    });
                    result.body = $.root().html();
                }
                res.json(result)
            });
        }
    },
    getCmtcount: function (req, res) {
        var aid = req.params.aid;
        if (aid) {
            cmtCountDAO.search(aid).then(function (result) {
                res.json(result);
            });
        }
    },
    getCmtLong: function (req, res) {
        var aid = req.params.aid;
        if (aid) {
            commentsDAO.search({aid: aid, type: 1}).then(function (result) {
                res.json(result);
            })
        }
    },
    getCmtShort: function (req, res) {
        var aid = req.params.aid;
        if (aid) {
            commentsDAO.search({aid: aid, type: 0}).then(function (result) {
                res.json(result);
            })
        }
    },
    //日期查询
    searchByDate: function (req, res) {
        var param = req.params,
            query = {},
            title = '';
        if (param.day) {
            query = {dtime: param.day};
        } else if (param.month) {
            title = param.month.substr(0, 6);
            query = {dmonth: title};
        } else if (param.year) {
            title = param.year.substr(0, 4);
            query = {dyear: title};
        }
        historyDAO.search(query).then(function (result) {
            // res.render('list', {'title': '日报' + title, 'list': result});
            console.log(result);
            res.json(result);
        })
    },
    list: function (req, res) {
        historyDAO.list().then(function (list) {
            res.render('list', {'list': list});
        })
    },
    //test
    test: function (req, res) {
        var data = {
            days: []
        };
        for (var i = 1; i <= 31; i++) {
            data.days[i] = i;
        }
        data.days = data.days.slice(1);
        res.render('test', {'title': '知乎 日报', 'data': data});
    }
}

module.exports = Home;