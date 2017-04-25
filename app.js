var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var FileStreamRotator = require('file-stream-rotator');
var log4js = require('log4js');
var fs = require('fs');

var routes = require('./routes/index');
const CONFIG = require('./config');

const app = express();


// webpack
// 中间件API使用文档 https://webpack.github.io/docs/webpack-dev-middleware.html

if(CONFIG.fe.developing){
    require("nodejs-dashboard");
    var webpackConfig = require('./build/webpack.dev.conf');
    var webpack = require('webpack');
    var webpackDevMiddleware = require('webpack-dev-middleware');
    var compiler = webpack(webpackConfig);
    var devMiddleware = webpackDevMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath,
        stats: {
            colors: true,
            chunks: true,
            progress: true
        }
    });
    var hotMiddleware = require('webpack-hot-middleware')(compiler);
    app.use(devMiddleware);
    app.use(hotMiddleware);
}


// 每天23点爬知乎日报的latest并存储
var spider = require('./common/util/spider');
var task = require('./common/util/task');
if (CONFIG.spider.gogo) {
    spider.latest();
    spider.gogo(CONFIG.spider.start, CONFIG.spider.end);
}
if (CONFIG.spider.openTask) {
    spider.latest();
    task.gogo();
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    // render the error page
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
});

//log4js configure
if (CONFIG.log.isOpenningNode) {
    log4js.loadAppender('file');
    log4js.configure({
        appenders: [
            {type: 'console'},
            {type: 'file', filename: './log/cheese.log', category: 'cheese'}
        ]
    });
}
//log4js end

//Http log
if (CONFIG.log.isOpenningHTTP) {
    var logDirectory = path.join(__dirname, 'log');
    fs.existsSync(logDirectory) || fs.existsSync(logDirectory);
    var accessLogStream = FileStreamRotator.getStream({
        date_format: 'YYYYMMDD',
        filename: path.join(logDirectory, 'access-%DATE%.log'),
        frequency: 'daily',
        verbose: false
    });
    app.use(morgan('combined', {stream: accessLogStream}));
}

// Http log end

module.exports = app;
