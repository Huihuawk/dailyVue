var _ = require('lodash');

var StatisDAO = require('../common/db/models/statis'),
    HistoryDAO = require('../common/db/models/history');

var statisDAO = new StatisDAO();
var historyDAO = new HistoryDAO();

var yearData = function (data) {
    var starArr = [],
        cmtArr = [],
        monthArr = [],
        aids = [],
        sTenK = [],
        sTwentyK = [],
        cOneK = [];

    data = _.sortBy(data, function (o) {
        return o.dmonth;
    });
    for (let i = 0; i < data.length; i++) {
        if (data[i].type === 'star') {
            starArr.push(data[i]);
            monthArr.push(data[i].dmonth);

            for (let m = 0; m < data[i].count.length; m++) {
                var count = data[i].count(m);
                var idx = _.indexOf(data[i].count, count);
                if (count > 9999 && count < 20000) {
                    sTenK.push({
                        count: count,
                        aid: data[i].aids[idx]
                    });
                    aids.push(data[i].aids[idx]);
                } else if (count > 19999) {
                    sTwentyK.push({
                        count: count,
                        aid: data[i].aids[idx]
                    });
                    aids.push(data[i].aids[idx]);
                }
            }
        } else {
            cmtArr.push(data[i]);
            for (let x = 0; x < data[i].count.length; x++) {
                var count = data[i].count[x];
                var idx = _.indexOf(data[i].count, count);
                if (count > 999) {
                    cOneK.push({
                        count: count,
                        aid: data[i].aids[idx]
                    });
                    aids.push(data[i].aids[idx])
                }
            }
        }
    }
    return {
        data: {
            star: starArr,
            cmt: cmtArr,
            month: monthArr
        },
        aids: aids,
        sTenK: _.flattenDeep(sTenK),
        sTwentyK: _.flattenDeep(sTwentyK),
        cOneK: _.flattenDeep(cOneK)
    }
};

module.exports = {
    index: function (req, res) {
        res.render('statis', {title: 'Statistic'})
    },

    // 按日期查询
    searchByDate: function (req, res) {
        var param = req.params,
            query = {};
        if (param.dmonth) {
            query = {dmonth: param.dmonth};
        } else if (param.dyear) {
            query = {dyear: param.dyear};
        } else {
            res.json([]);
        }
        statisDAO.search(query).then(function (d) {
            if (param.dyear) {
                var data = yearData(d);
                historyDAO.search({id: {$in: data.aids}}).then(function (articles) {
                    var arts = {};
                    for (var x = 0, len = articles.length; x < len; x++) {
                        arts[articles[x].id] = articles[x]
                    }
                    res.json({
                        data: data.data,
                        articles: arts,
                        sTenK: data.sTenK,
                        sTwentyK: data.sTwentyK,
                        cOneK: data.cOneK
                    })
                }).catch(function () {
                    res.json({})
                })
            } else {
                res.json(d)
            }
        }).catch(function () {
            res.json([])
        });
    },
    searchArticles: function (req, res) {
        var param = req.params,
            query = {};
        if (param.aids) {
            query = {id: {$in: param.aids.split(',')}};
            historyDAO.search(query).then(function (data) {
                res.json(data)
            }).catch(function (err) {
                res.json([])
            });
        } else {
            res.json([]);
        }
    }
};