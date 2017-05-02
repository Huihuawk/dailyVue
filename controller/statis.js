var StatisDAO = require('../common/db/models/statis'),
    HistoryDAO = require('../common/db/models/history');

var statisDAO = new StatisDAO();
var historyDAO = new HistoryDAO();

module.exports = {
    index: function (req, res) {
        res.render('statis', {title: '数据统计'})
    }
}