var express = require('express');
var router = express.Router();
var async = require('async');

//

router.get('/', function(req, res, next) {
  res.render('sudoku', { title: 'Sudoku' });
});



router.get('/sudoku/generate', function(req, res, next) {
    var response = {results: []};
    async.timesLimit(100, 100,
        function (ct, cb) {
            GAME.sudoku.init();
            cb();
        },
        function (err) {
            if (err) {
                console.log('async error', err);
            }
            console.log('async finished');
            res.json(response);
        });
    res.render('index', { title: 'Express' });
});

router.get('/sudoku/setup', function (req, res, next) {
    var payload = {now: Date.now()};
    EVENTS.sudoku.results(function (results) {
        res.json(results)    ;
    });
    
});

module.exports = router;
