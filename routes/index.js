var express = require('express');
var router = express.Router();

var home = require('./../controller/home');
var statis = require('./../controller/statis');
var spiderErr = require('./../controller/spiderErr');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// latest
router.get('/index', home.index);
router.get('/latest', home.getLatest);
router.get('/list', home.list);

//date
router.get('/day/:day', home.searchByDate);
router.get('/month/:month', home.searchByDate);

// detail
router.get('/article/:aid', home.getArticle);

// comments
router.get('/article/:aid/comments', home.getComment);

router.get('/cmt/count/:aid', home.getCmtcount);
router.get('/cmt/long/:aid', home.getCmtLong);
router.get('/cmt/short/:aid', home.getCmtShort);

// about
router.get('/about', function(req, res) {
    res.render('about',{title: 'About'});
});

// statistic
router.get('/statis', statis.index);
router.get('/statistics/month/:dmonth', statis.statisMonth);
router.get('/statistics/year/:dyaer', statis.statisYear);

// statistic api
router.get('/api-statis/month/:dmonth', statis.searchByDate);
router.get('/api-statis/year/:dyear', statis.searchByDate);
router.get('/api-statis/articles/:aids', statis.searchArticles);


// 处理爬虫错误
router.get('/spider-error', spiderErr.list);
router.post('/clear-error/:dtime', spiderErr.clear);


module.exports = router;
