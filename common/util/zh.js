var ArticleDAO = require('../db/models/article');
var HistoryDAO = require('../db/models/history')
var dlAPI = require('../api/index');
var CronJob = require('cron').CronJob;
var DateCalc = require('./date');


var dao = new ArticleDAO();

var start = '20170401';
var end = '20170310';

var x = 1;
var historyDAO = new HistoryDAO();

var Spider = {
    init: function (start, end) {
        this.loopDate(start, end);
    },
    //日数据
    day: function (date) {
        console.log(date);
        // return;
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
                    dtime: date
                }
                historyDAO.save(data);
            }
        })
    },
    loopDate: function (start, end) {
        var _self = this;
        var date = start;
        var dateCalc = new DateCalc(start);
        _self.day(date);
        date = dateCalc.before();
        if(date === end){
            console.log('over 1');
            _self.day(date);
        }else {
            _self.loopDate(date,end);
        }
    }
}

Spider.init(start, end);