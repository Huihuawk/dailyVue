var express = require('express');
var router = express.Router();

var home = require('./../controller/home')

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/', home.getLatest);
router.get('/index', home.getLatest);

module.exports = router;
