var express = require('express');
var router = express.Router();

var home = require('./../controller/home');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// latest
router.get('/', home.getLatest);
router.get('/index', home.getLatest);
router.get('/list', home.list);
router.get('/s/:key', home.so);

//date
router.get('/d/:day', home.soDate);
router.get('/m/:month', home.soDate);
router.get('/y/:year', home.soDate);

module.exports = router;
