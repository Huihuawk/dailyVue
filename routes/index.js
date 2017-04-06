var express = require('express');
var router = express.Router();

var dailyAPI = require('./../src/api/index');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/', dailyAPI.getLatest);
router.get('/index', dailyAPI.getLatest);
router.get('/article/:id', dailyAPI.getArticle);

module.exports = router;
