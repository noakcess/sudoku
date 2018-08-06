var GAME = {
    init: function (callback) {
        GAME.sudoku.setup(function () {
            console.log('   [   GAME.init   ]', (GAME.dataset !== false ? true : false));
            execCallback(callback);
        });
    },
    dataset: false,
    sudoku: {
        data: {},
        init: function () {
            console.log('GAME.sudoku.init');
            
            this.process();
        },
        setup: function (callback) {
            var data = [];
            var getCell = function (options) {
                var row = options.row;
                var col = options.col;
                var index = options.index;
                
                var result = {title: col + ':' + row, row: row, col: col};
                if(_.indexOf([1,2,3], index) != -1)
                    if (row <= 3) result = _.extend(result, {group: 'a'});
                    else if(row <= 6) result = _.extend(result, {group: 'd'});
                    else result = _.extend(result, {group: 'g'});
                else if(_.indexOf([4,5,6], index) != -1)
                    if (row <= 3) result = _.extend(result, {group: 'b'});
                    else if(row <= 6) result = _.extend(result, {group: 'e'});
                    else result = _.extend(result, {group: 'h'});
                else if(_.indexOf([7,8,9], index) != -1)
                    if (row <= 3) result = _.extend(result, {group: 'c'});
                    else if(row <= 6) result = _.extend(result, {group: 'f'});
                    else result = _.extend(result, {group: 'i'});
                return result;
            };
            var ct = 1;
            for(row=1; row<=9; row++) {
                for(col=1; col<=9; col++) {
                    data.push(getCell({index: ct++, row: row, col: col}));
                }
                ct = 1;
            }
            GAME.dataset = data;
            // console.log('sudoku.data');
            // console.log(data);
            execCallback(callback);
            
        },
        process: function (tries = 0) {
            var job = {tries: tries, data: JSON.parse(JSON.stringify(GAME.dataset))};
            console.log('GAME.sudoku.process', _.pluck(job.data, 'value').join(''));
            job.tries++;
            
            var grp = {};
            var row = {};
            var col = {};
            var cells = job.data || [];
            _.each(cells, function (cell) {
                var Grp = cell.group;
                var Row = cell.row;
                var Col = cell.col;
                var list = [];
                var log = [];
                var $cells = _.filter(cells, function(c){ return c.group == Grp; });
                
                _.each($cells, function (c) {
                    var temp = c && c.value;
                    if(temp) log.push(temp);
                    list.push(parseInt(temp));
                });
                
                list = _.filter(list);
                diff = [];
                
                for (i=1; i<=9; i++) {
                    if (_.indexOf(list, i) === -1) {
                        diff.push(i);
                    }
                }
                
                if (!row[Row]) row[Row] = [];
                if (!col[Col]) col[Col] = [];
                if (!grp[Grp]) grp[Grp] = [];
                
                var union = _.unique(_.union(col[Col], row[Row], grp[Grp]));
                var value = _.first(_.sample(_.difference(diff, union), 1));
                if (!value) {
                    job.faulty = true;
                    return false;
                }
                log.push('=' + value);
                
                row[Row].push(value);
                col[Col].push(value);
                grp[Grp].push(value);
                
                // console.log(Grp, JSON.stringify({log: log, diff: diff, list: list, union: union}));
                cell.value = value;
            });
            
            
            if (job && job.faulty === true) {
                job.faulty = false;
                console.log('FAULT FOUND', job.tries, job.faulty, _.pluck(job.data, 'value').join(''));
                setTimeout(function () {
                    console.log('RESTART');
                    GAME.sudoku.process(job.tries);
                }, 5);
            } else {
                console.log('RESULT', {row: row, col: col, grp: grp});
                var result = _.values(row).join('').replace(/\,/g, '');
                console.log('   RECORD', result);
                DB.execute('INSERT INTO `sudoku` (result, tries) values (?, ?)', [result, job.tries]);
                // GAME.sudoku.init();
            }
            
        },
        results: function (callback) {
            DB.execute('SELECT * FROM `sudoku` LIMIT 0, 100', [], callback);
        }
    }
};
module.exports = GAME;
