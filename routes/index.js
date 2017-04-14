var express = require('express');
var router = express.Router();

var home = require('./../controller/home');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// latest
router.get('/index', home.getLatest);
router.get('/list', home.list);

//date
router.get('/d/:day', home.searchByDate);
router.get('/m/:month', home.searchByDate);
router.get('/y/:year', home.searchByDate);

// detail
router.get('/article/:aid', home.getArticle);

// comments
router.get('/cmt/count/:aid', home.getCmtcount);
router.get('/cmt/long/:aid', home.getCmtLong);
router.get('/cmt/short/:aid', home.getCmtShort);

// router.get('/test', home.test);


module.exports = router;
