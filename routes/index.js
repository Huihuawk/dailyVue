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
router.get('/d/:day', home.soByDate);
router.get('/m/:month', home.soByDate);
router.get('/y/:year', home.soByDate);

router.get('/test', home.test);


//imgProxy
// router.get('/img', imgProxy.proxy);

module.exports = router;
