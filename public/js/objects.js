OBJ = {
    init: function () {
        APP.log('   OBJ.init');
    },
    
    build: {
        map: function () {
            APP.log('   build.map');
            
        },
        dungeon: function () {
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
            room: function (el) {
                var $this = {attrs: {}};
                var attrs = {
                    l: {width: 400, height: 400, doors: 4},
                    m: {width: 300, height: 300, doors: 2},
                    s: {width: 400, height: 400, doors: 1}
                };
                $this.attrs.width = attrs[el.size]['width'];
                $this.attrs.height = attrs[el.size]['height'];
                $this.exits = attrs[el.size]['doors'];
                return $this;
            },
            hallway: function (el) {
                var $this = {attrs: {}};
                var attrs = {
                    l: {width: 50, height: 200, exits: 4},
                    m: {width: 50, height: 100, exits: 2},
                    s: {width: 50, height: 50, exits: 0}
                };
                $this.attrs.width = attrs[el.size]['width'];
                $this.attrs.height = attrs[el.size]['height'];
                $this.exits = attrs[el.size]['exits'];
                return $this;
            }
        },
    },
    type: {
        data: {
            type: ['room', 'hallway'],
            size: ['l', 'm', 's']
        },
        get: function () {
            var $this = {};
            $this.type = _.sample(OBJ.type.data.type, 1)[0];
            $this.size = _.sample(OBJ.type.data.size, 1)[0];
            $this = _.extend($this, OBJ.type[$this.type]($this));
            return $this;
    
        },
        room: function (el) {
            var $this = el;
            $this.elements = [];
            $this = _.extend($this, OBJ.attr.set[$this.type]($this));
            return $this;
        },
        
        hallway: function (el) {
            var $this = el;
            $this.elements = [];
            $this = _.extend($this, OBJ.attr.set[$this.type]($this));
            return $this;
        }
    }
};
