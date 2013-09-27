KISSY.add('index/event-mgr', function (S) {
    'use strict';

    var events = {};

    var on = function (type, fn, scope) {
            events[type] || (events[type] = []);
            events[type].push({ scope:scope || this, callback:fn });
            return this;
        },

        fire = function (type) {
            var handlers = events[type];
            if (!handlers) return false;
            for (var i = 0, l = handlers.length; i < l; i++) {
                var handler = handlers[i];
                handler.callback.apply(handler.scope, [].slice.call(arguments, 1));
            }
            return this;
        },

        off = function (type, fn) {
            if (!type) {
                events = {};
                return this;
            }

            if (!events[type]) {
                return false;
            }

            if (!fn) {
                events[type] = [];
                return this;
            }

            var handlers = events[type];
            for (var i = 0, l = handlers.length; i < l;) {
                var handler = handlers[i];
                if (handler.callback == fn || handler.callback.__originFn == fn) {
                    handlers.splice(i, 1);
                    --l;
                } else {
                    ++i;
                }
            }
            return this;
        },

        after = function(type, fn, count, scope) {
            if(count < 1) {
                return;
            }

            var self = this;
            function wrapper() {
                if(--count == 0) {
                    self.off(type, wrapper);
                    fn.apply(scope, arguments);
                }
            }
            wrapper.__originFn = fn;

            self.on(type, wrapper, scope);
        };

    return {
        fire:fire,
        on:on,
        after: after,
        off:off,
        installTo:function (obj) {
            obj.on = on;
            obj.fire = fire;
            obj.off = off;
            obj.after = after;
        }
    };
});

KISSY.add('index/slide', function (S, EventMgr) {
    var $ = S.all;

    var $slide = null,
        CLASS_PREFIX = 's-',
        SIZE = 3,
        INTERVAL = 10000,
        prevIndex = 0;

    return {
        init: function () {
            S.ready(function() {
                $slide = $('#J_SlideNav');
                var run =  function() {
                    S.later(function () {
                        $slide.removeClass(CLASS_PREFIX + prevIndex);
                        prevIndex = (++prevIndex) % SIZE;
                        EventMgr.fire('slidechange', prevIndex);
                        $slide.addClass(CLASS_PREFIX + prevIndex);
                    }, INTERVAL, true);
                };
                run();
            });
        }
    }
}, {
    requires: ['index/event-mgr']
});

void function() {
    KISSY.use('index/slide', function(S, Slide) {
        Slide.init();
    });
}();
