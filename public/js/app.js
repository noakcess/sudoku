
WIN = window;
DOC = document;

APP = {
    init: function () {
        APP.log('APP.init');
        APP.ready(function () {
            APP.global();
            OBJ.init();
            EVENTS.init();
        });
    },
    global: function () {
        APP.log('APP.global');
    },
    ready: function (callback) {
        $(function () {
            try {
                if (typeof (callback) === 'function') {
                    callback();
                } else {
                    APP.log('ready callback', [typeof (callback), callback]);
                }
            } catch (err) {
                APP.log('ready error', err);
                APP.log('   callback', callback);
            }
        });
    },
    log: function (a = false, b = false) {
        if (a && b) {
            console.log(a, b);
        } else if (a) {
            console.log(a);
        }
    }
};
