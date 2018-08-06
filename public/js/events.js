GAME = {};
EVENTS = {
    init: function () {
        APP.log('   EVENTS.init');
        this.listeners();
        this.global();
        this.sudoku.init();
    },
    global: function () {
        $(WIN).bind('resize', function () {
            APP.log('window.resize');
            EVENTS.sudoku.resize();
            
        });
    },
    listeners: function () {
        $('.btn', DOC).on({
            click: function () {
                var $this = $(this);
                var action = $this.attr('data-action');
                APP.log('   action', action);
                APP.log('EVENTS.string', EVENTS);
                EVENTS.sudoku.init();
                
            }
        });
    },
    sudoku: {
        data: {},
        indexes: {row: [], col: [], group: []},
        asset: {},
        init: function () {
            GAME = EVENTS.sudoku;
            APP.log('sudoku.init');
            GAME.resize();
            GAME.global();
            GAME.setup();
        },
        global: function () {
            var $overlay = _.clone($('.overlay', DOC));
            $overlay.show();
            APP.log('global overlay', $overlay);
            $(DOC).on('mouseover click hover', '.board .cell:not(.correct)', function (e) {
                var $this = $(this);
                var event = e;
                var $cell = {height: ($this.innerHeight()), width: ($this.outerWidth())};
                
                if(!$this.attr('data-visible') || $this.attr('data-visible') != this.hiddenValue) {
                    $cell['font-size'] = '40%';
                    // APP.log('event', event.type);
                    // APP.log('hover', $this);
                    // APP.log('$cell', $cell);
                    APP.log('value', this.hiddenValue);
                    $overlay.css($cell);
                    $this.append($overlay);
                } else {
                    APP.log('no ATTR');
                }
                $this.siblings().removeClass('focus');
                $this.addClass('focus');
            });
            $(DOC).on('mouseout', '.cell', function (e) {
                var $this = $(this);
                var event = e;
                APP.log('event', event.type);
            });
            $(DOC).on('click', '.overlay .option', function () {
                var $this = $(this);
                var $target = $this.closest('.cell');
                var result = $target[0].hiddenValue;
                var value = $this.attr('data-value');
                APP.log('option click', [value, $target]);
                APP.log('   result', result);
                $target
                    .attr('data-visible', value)
                    .addClass((result == value? 'correct' : 'incorrect'))
                    .removeClass((result != value? 'correct' : 'incorrect'));
                if($target.hasClass('correct')) {
                    $target.find('.overlay').remove();
                }
            });
        },
        setup: function () {
            EVENTS.request({url: '/sudoku/setup'}, function (response) {
                APP.log('setup response', response);
                GAME.data = response;
                var indexes = GAME.indexes;
                var sample = _.sample(GAME.data, 1);
                APP.log('sample', sample);
                
                var results = _.first(sample)['result'].toString().split('');
                
                var $cells = $('.board .cell', DOC);
                var $difficulty = _.sample($cells, 10);
                APP.log('difficulty', $difficulty);
                $.each($cells, function() {
                    var $this = $(this);
                    var value = results.shift();
                    this.hiddenValue = parseInt(value);
                    $this.attr('data-value', value);
                    APP.log('hiddenValue', this);
                });
                $.each($difficulty, function () {
                    var $this = $(this);
                    $this.addClass('default').attr('data-visible', this.hiddenValue);
                });
            });
        },
        resize: function () {
            var $board = $('.sudoku', DOC);
            $board.fadeIn();
            var win = {width: WIN.innerWidth, height: (WIN.innerHeight - 150)};
            var board = {width: $board.width(), height: $board.height()};
            var cell = {width: (board.width / 9), height: ((board.width > win.height) ? win.height : board.width) / 9};
            cell['font-size'] = (cell.height / 2);
            APP.log('sudoku.resize', [win, board, cell]);
            $('.board .cell', DOC).css(cell);
        }
    },
    request: function (options, callback) {
        var url = options.url || '/';
        var jqxhr = $.ajax( url )
            .done(function(resp) {
                // APP.log('success', resp);
                callback(resp);
            })
            .fail(function(err) {
                APP.log('fail', err);
            });
    }
};
