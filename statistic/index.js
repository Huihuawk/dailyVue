const _ = require('lodash');
const logger = require('log4js').getLogger('cheese');

const CmtCountDAO = require('../common/db/models/cmtCount');
const StatisDAO = require('../common/db/models/statis');
const cmtCountDAO = new CmtCountDAO();
const statisDAO = new StatisDAO();

module.exports = {
    start(start){
        for (let i = 0, len = start.length; i < len; i++) {
            this.month(start[i])
        }
    },
    month(dmonth) {
        statisDAO.count({dmonth: dmonth})
            .then(function (d) {
                if (d === 0) {
                    cmtCountDAO.search({dmonth: dmonth})
                        .then(function (d) {
                            //starts sum
                            var starsSum = _.sumBy(d, function (o) {
                                return o.popularity
                            });
                            // stars sort
                            var starsSort = _.slice(_.orderBy(d, ['popularity'], ['desc']), 0, 10),
                                starsCount = [],
                                starsAids = [];
                            for (let s = 0; s < starsSort.length; s++) {
                                starsCount.push(starsSort[s].popularity);
                                starsAids.push(starsSort[s].aid);
                            }
                            // comments sum
                            var commentsSum = _.sumBy(d, function (o) {
                                return o.comments
                            });
                            // sort comments
                            var sortComment = _.slice(_.orderBy(d, ['comments'], ['desc']), 0, 10),
                                countCmt = [],
                                aidsCmt = [];
                            for (let c = 0, cLen = sortComment.length; c < cLen; c++) {
                                countCmt.push(sortComment[c].comments);
                                aidsCmt.push(sortComment[c].aid);
                            }
                            statisDAO.save({
                                type: 'star',
                                sum: starsSum,
                                count: starsCount,
                                aids: starsAids,
                                dmonth: dmonth,
                                dyear: dmonth.substr(0, 4)
                            }).catch(function (err) {
                                logger.error('statistic star save error @dmonth: ' + dmonth);
                            });
                            statisDAO.save({
                                type: 'comments',
                                sum: commentsSum,
                                count: countCmt,
                                aids: aidsCmt,
                                dmonth: dmonth,
                                dyear: dmonth.substr(0, 4)
                            }).catch(function (err) {
                                logger.error('statistic comments save error @dmonth: ' + dmonth);
                            });
                        }).catch(function (err) {
                        logger.error('statistic error @dmonth: ' + dmonth);
                    })
                } else {
                    logger.error(dmonth + ' has statistic data ')
                }
            })
    }
};