// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"..\\js\\app.js":[function(require,module,exports) {
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

WIN = window;
DOC = document;

APP = {
    init: function init() {
        APP.log('APP.init');
        APP.ready(function () {
            APP.global();
            OBJ.init();
            EVENTS.init();
        });
    },
    global: function global() {
        APP.log('APP.global');
    },
    ready: function ready(callback) {
        $(function () {
            try {
                if (typeof callback === 'function') {
                    callback();
                } else {
                    APP.log('ready callback', [typeof callback === 'undefined' ? 'undefined' : _typeof(callback), callback]);
                }
            } catch (err) {
                APP.log('ready error', err);
                APP.log('   callback', callback);
            }
        });
    },
    log: function log() {
        var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        if (a && b) {
            console.log(a, b);
        } else if (a) {
            console.log(a);
        }
    }
};
},{}],"public\\js\\events.js":[function(require,module,exports) {
GAME = {};
EVENTS = {
    init: function init() {
        APP.log('   EVENTS.init');
        this.listeners();
        this.global();
        this.sudoku.init();
    },
    global: function global() {
        $(WIN).bind('resize', function () {
            APP.log('window.resize');
            EVENTS.sudoku.resize();
        });
    },
    listeners: function listeners() {
        $('.btn', DOC).on({
            click: function click() {
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
        indexes: { row: [], col: [], group: [] },
        asset: {},
        init: function init() {
            GAME = EVENTS.sudoku;
            APP.log('sudoku.init');
            GAME.resize();
            GAME.global();
            GAME.setup();
        },
        global: function global() {
            var $overlay = _.clone($('.overlay', DOC));
            $overlay.show();
            APP.log('global overlay', $overlay);
            $(DOC).on('mouseover click hover', '.board .cell:not(.correct)', function (e) {
                var $this = $(this);
                var event = e;
                var $cell = { height: $this.innerHeight(), width: $this.outerWidth() };

                if (!$this.attr('data-visible') || $this.attr('data-visible') != this.hiddenValue) {
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
                $target.attr('data-visible', value).addClass(result == value ? 'correct' : 'incorrect').removeClass(result != value ? 'correct' : 'incorrect');
                if ($target.hasClass('correct')) {
                    $target.find('.overlay').remove();
                }
            });
        },
        setup: function setup() {
            EVENTS.request({ url: '/sudoku/setup' }, function (response) {
                APP.log('setup response', response);
                GAME.data = response;
                var indexes = GAME.indexes;
                var sample = _.sample(GAME.data, 1);
                APP.log('sample', sample);

                var results = _.first(sample)['result'].toString().split('');

                var $cells = $('.board .cell', DOC);
                var $difficulty = _.sample($cells, 10);
                APP.log('difficulty', $difficulty);
                $.each($cells, function () {
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
        resize: function resize() {
            var $board = $('.sudoku', DOC);
            $board.fadeIn();
            var win = { width: WIN.innerWidth, height: WIN.innerHeight - 150 };
            var board = { width: $board.width(), height: $board.height() };
            var cell = { width: board.width / 9, height: (board.width > win.height ? win.height : board.width) / 9 };
            cell['font-size'] = cell.height / 2;
            APP.log('sudoku.resize', [win, board, cell]);
            $('.board .cell', DOC).css(cell);
        }
    },
    request: function request(options, callback) {
        var url = options.url || '/';
        var jqxhr = $.ajax(url).done(function (resp) {
            // APP.log('success', resp);
            callback(resp);
        }).fail(function (err) {
            APP.log('fail', err);
        });
    }
};
},{}],"..\\js\\objects.js":[function(require,module,exports) {
OBJ = {
    init: function init() {
        APP.log('   OBJ.init');
    },

    build: {
        map: function map() {
            APP.log('   build.map');
        },
        dungeon: function dungeon() {
            APP.log('   build.dungeon');
            var _this = {};
            _this.name = 'DUNGEON-' + Date.now();
            _this.map = DRAW.dungeon.init();
            _this.monsters = {};
            return _this;
        }
    },
    attr: {
        set: {
            room: function room(el) {
                var $this = { attrs: {} };
                var attrs = {
                    l: { width: 400, height: 400, doors: 4 },
                    m: { width: 300, height: 300, doors: 2 },
                    s: { width: 400, height: 400, doors: 1 }
                };
                $this.attrs.width = attrs[el.size]['width'];
                $this.attrs.height = attrs[el.size]['height'];
                $this.exits = attrs[el.size]['doors'];
                return $this;
            },
            hallway: function hallway(el) {
                var $this = { attrs: {} };
                var attrs = {
                    l: { width: 50, height: 200, exits: 4 },
                    m: { width: 50, height: 100, exits: 2 },
                    s: { width: 50, height: 50, exits: 0 }
                };
                $this.attrs.width = attrs[el.size]['width'];
                $this.attrs.height = attrs[el.size]['height'];
                $this.exits = attrs[el.size]['exits'];
                return $this;
            }
        }
    },
    type: {
        data: {
            type: ['room', 'hallway'],
            size: ['l', 'm', 's']
        },
        get: function get() {
            var $this = {};
            $this.type = _.sample(OBJ.type.data.type, 1)[0];
            $this.size = _.sample(OBJ.type.data.size, 1)[0];
            $this = _.extend($this, OBJ.type[$this.type]($this));
            return $this;
        },
        room: function room(el) {
            var $this = el;
            $this.elements = [];
            $this = _.extend($this, OBJ.attr.set[$this.type]($this));
            return $this;
        },

        hallway: function hallway(el) {
            var $this = el;
            $this.elements = [];
            $this = _.extend($this, OBJ.attr.set[$this.type]($this));
            return $this;
        }
    }
};
},{}],"..\\js\\draw.js":[function(require,module,exports) {
DRAW = {
    init: function init() {
        APP.log('DRAW.init');
    },
    dungeon: {
        init: function init(dungeon) {
            APP.log('DRAW.dungeon', dungeon);
            var map = DRAW.map.init();
            return map;
        }
    },
    map: {
        data: {
            instance: false,
            stage: false,
            elements: []
        },
        init: function init() {
            APP.log('DRAW.init');
            var _this = this;
            this.data.stage = $('.stage', DOC);

            this.data.instance = $('<div>', { width: 1000, height: 1000, id: 'map', class: 'debug' });
            this.data.stage.html(this.data.instance);
            var count = 0;
            var addInterval = setInterval(function () {
                if (count >= 5) {
                    clearInterval(addInterval);
                }
                count++;
                _this.addElement();
            }, 3000);
        },
        addElement: function addElement() {
            var _this = {};
            var map = DRAW.map.data.instance;
            var getCoords = function getCoords() {
                var temp = {
                    left: _.random(0, map.width()),
                    top: _.random(0, map.height())
                };
                return temp;
            };
            _this = _.extend(_this, OBJ.type.get());

            var coords = getCoords();
            // APP.log('   coords', coords);
            _this.instance = $('<div>', { class: 'element debug' });
            _this.instance.css(Object.assign(coords, _this.attrs));
            map.append(_this.instance);
            _this.offset = _this.instance.position();
            APP.log('   _this', _this);
            DRAW.map.data.elements.push(_this);
        }
    }
};
},{}],"..\\js\\utility.js":[function(require,module,exports) {

var UTIL = {};

module.exports = UTIL;
},{}],"..\\..\\bundleJS.js":[function(require,module,exports) {
'use strict';

require('./public/js/app.js');

require('./public/js/events.js');

require('./public/js/objects.js');

require('./public/js/draw.js');

require('./public/js/utility.js');
},{"./public/js/app.js":"..\\js\\app.js","./public/js/events.js":"public\\js\\events.js","./public/js/objects.js":"..\\js\\objects.js","./public/js/draw.js":"..\\js\\draw.js","./public/js/utility.js":"..\\js\\utility.js"}]