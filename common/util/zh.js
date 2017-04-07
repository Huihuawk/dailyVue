var ArticleDAO = require('../db/models/article');
var HistoryDAO = require('../db/models/history')
var dlAPI = require('../api/index');
var CronJob = require('cron').CronJob;


var dao = new ArticleDAO();

var i = 0;

new CronJob('* * *', function () {
    console.log('i: '+ ++i);
}, null, true, 'Asia/Shanghai')

var x = 1;
var historyDAO = new HistoryDAO();
new CronJob('* * *',function () {
    if(x == 2){
        dlAPI.getHistory('20170401').then(function (history) {
            console.log(history);
        })
    }
    console.log('x: '+ ++x);
}, null, true, 'Asia/Shanghai')