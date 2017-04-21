var CronJob = require('cron').CronJob;
var CONFIG = require('../../config');
var dlAPI = require('../api/index-promise');
var Spider = require('./spider');
var DateCalc = require('./date');
var logger = require('log4js').getLogger('cheese');

var Task = {
    gogo: function () {
        this.hourly();
        this.daily();
        this.weekly();
    },
    // 00:00 - 23:00 每个小时更新最新文章
    hourly: function () {
        new CronJob('00 00 0-23/1 * * *', function () {
            Spider.latest();
        }, function () {
            logger.info('hourly cron-job over')
        }, true, 'Asia/Shanghai');
    },
    // 每天23:30 爬取当天的数据
    daily: function () {
        new CronJob('00 30 23 * * *', function () {
            var date = new DateCalc().after();
            Spider.day(date);
        }, function () {
            logger.info('daily cron-job over @date:' + new Date())
        }, true, 'Asia/Shanghai');
    },
    // 每周三、日 00:30 更新前7天的评论点赞数
    // 从start到end前一天 共7天
    weekly: function () {
        new CronJob('00 30 00 * * 0,3', function () {
            const date = new DateCalc();
            console.log(new Date() + ' weekly task date ' + date)
            Spider.updateCmtCount(date.before(), date.before(8));
        }, function () {
            logger.info('weekly cron-job over ')
        }, true, 'Asia/Shanghai');
    }
}

module.exports = Task;