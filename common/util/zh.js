var ArticleDAO = require('../db/models/article');
var HistoryDAO = require('../db/models/history')
var dlAPI = require('../api/index');
var CronJob = require('cron').CronJob;


var dao = new ArticleDAO();


var x = 1;
var historyDAO = new HistoryDAO();
new CronJob('* * *',function () {
    if(x == 2){
        console.log('===========  begin request  ===========')
        dlAPI.getHistory('20170301').then(function (history) {
            console.log(history);
            console.log('===========  over request  ===========')
        })
    }
    console.log('x: '+ ++x);
}, function () {
    console.log('CronJob over')
}, true, 'Asia/Shanghai')