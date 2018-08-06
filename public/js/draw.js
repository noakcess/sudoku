DRAW = {
    init: function () {
        APP.log('DRAW.init');
    },
    dungeon: {
        init: function (dungeon) {
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
        init: function () {
            APP.log('DRAW.init');
            var _this = this;
            this.data.stage = $('.stage', DOC);
            
            this.data.instance = $('<div>', {width: 1000, height: 1000, id: 'map', class: 'debug'});
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
        addElement: function () {
            var _this = {};
            var map = DRAW.map.data.instance;
            var getCoords = function() {
                var temp = {
                    left: _.random(0, map.width()),
                    top: _.random(0, map.height())
                };
                return temp;
            };
            _this = _.extend(_this, OBJ.type.get());
            
            var coords = getCoords();
            // APP.log('   coords', coords);
            _this.instance = $('<div>', {class: 'element debug'});
            _this.instance.css(Object.assign(coords, _this.attrs));
            map.append(_this.instance);
            _this.offset = _this.instance.position();
            APP.log('   _this', _this);
            DRAW.map.data.elements.push(_this);
            
        }
    }
};
