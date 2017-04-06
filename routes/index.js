var express = require('express');
var router = express.Router();

var dailyAPI = require('./../src/action/api');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/', dailyAPI.getStart);
router.get('/index', dailyAPI.getStart);
router.get('/article/:id', dailyAPI.getArticle);

module.exports = router;
