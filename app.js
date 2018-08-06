/*  global libs */
_ = require('underscore');

/*  local libs  */
var async = require('async');
var fs = require('fs');
var path = require('path');

/*  helper functions    */
UTIL = require('./utility.js');
EVENTS = require('./events.js');

/*  import global controllers   */
DB = require('./controllers/db');
GAME = require('./controllers/game.js');

/*  express libs    */
var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

console.log('\r[  Initialize   ]');
async.waterfall([
    function (cb) { DB.init(cb); },
    function (cb) { GAME.init(cb); },
    function (cb) {
        /*  assign view directory and template engine   */
        var view = {engine: 'pug', path: path.join(__dirname, 'views')};
        console.log('   [   Views Engine    ]', view.engine);
        console.log('   [   Views Path    ]', view.path);
        app.set('view engine', view.engine);
        app.set('views', view.path);
        cb();
    },
    function (cb) {
        /*  assign logging level per env    */
        var logEnv = 'dev';
        console.log('   [   Env Logging    ]', logEnv);
        app.use(logger(logEnv));
        cb();
    },
    function (cb) {
        /*  activate middleware json    */
        var middlewareJson = true;
        console.log('   [   Json Middleware    ]', middlewareJson);
        if (middlewareJson) {
            app.use(express.json());
        }
        cb();
    },
    function (cb) {
        /*  allow form-data parsing */
        var isEncoded = false;
        console.log('   [   Request Encoded    ]', isEncoded);
        if (isEncoded) {
            app.use(express.urlencoded({ extended: isEncoded }));
        }
        /*
            var multipart = require('connect-multiparty');
            var multipartMiddleware = multipart();
            app.use('/url/that/accepts/form-data', multipartMiddleware);
            app.post('/url/that/accepts/form-data', function(req, resp) {
                console.log(req.body, req.files);
            });
        * */
        cb();
    },
    function (cb) {
        var isParsed = true;
        console.log('   [   Cookie Parser    ]', isParsed);
        if (isParsed) {
            app.use(cookieParser());
        }
        cb();
    },
    function (cb) {
        var publicDir = path.join(__dirname, 'public');
        console.log('   [   Public Dir    ]', publicDir);
        app.use(express.static(publicDir));
        cb();
    },
    function (cb) {
        var routes = [
            { name: 'index', route: '/', filepath: './routes/index', import: true }
        ];
        console.log('   [   Routes    ]', jsonStringify(routes));
        _.each(routes, function (route) {
            if (route.import) {
                app.use(route.route, getRequire(route.filepath));
            }
        });
        cb();
    },
    function (cb) {
        console.log('   [   404   ]');
        app.use(function(req, res, next) {
            next(createError(404));
        });
        cb();
    },
    function (cb) {
        console.log('   [   500   ]');
        app.use(function(err, req, res, next) {
            // set locals, only providing error in development
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};
        
            // render the error page
            res.status(err.status || 500);
            res.render('error');
        });
        cb();
    },
],
function (err) {
    if(err) {
        console.log('init waterfall error', err);
    }
    module.exports = app;
    
});

