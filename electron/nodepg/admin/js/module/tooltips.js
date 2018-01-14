/*
 *  Nodepg Copyright (C) 2018 linlurui <rockylin@qq.com>
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

define(function(require, exports, module) {

    require('jqvue')

    var $ = jQuery, _this = this, selector = '';

    exports.offset = function (opts) {

        var result = {};
        if (!_this.target) return result;

        if(opts && !opts.pos){
            var l = jQuery(_this.target).offset().left;
            var t = jQuery(_this.target).offset().top;
            var b = jQuery(window).height() - t - jQuery(_this.target).height();
            var r = jQuery(window).width() - l - jQuery(_this.target).width();
            if(l > t && l > b && l > r) opts.pos = 'right';
            else if (r > t && r > b && r > l) opts.pos = 'left';
            else if (b > t && b > l && b > r) opts.pos = 'top';
            else if (t > l && t > b && t > r) opts.pos = 'bottom';
            else opts.pos = 'top';
        }

        if(opts.pos=='bottom' && !_this.store.state.options.height){
            opts.pos = 'left';
        } else if(opts.pos=='right' && !_this.store.state.options.width){
            opts.pos = 'top';
        }

        switch(opts.pos)
        {
            case 'top':
                result.x = (jQuery(_this.target).offset() ? jQuery(_this.target).offset().left : 0);
                result.y = (jQuery(_this.target).offset() ? jQuery(_this.target).offset().top + jQuery(_this.target).height() - 2 : 0);
                break;
            case 'bottom':
                result.x = (jQuery(_this.target).offset() ? jQuery(_this.target).offset().left - 2 : 0);
                result.y = (jQuery(_this.target).offset() ? jQuery(_this.target).offset().top - _this.store.state.options.height - 5 : 0);
                break;
            case 'left':
                result.x = (jQuery(_this.target).offset() ? jQuery(_this.target).offset().left + jQuery(_this.target).width() + 15 : 0);
                result.y = (jQuery(_this.target).offset() ? jQuery(_this.target).offset().top : 0);
                break;
            case 'right':
                result.x = (jQuery(_this.target).offset() ? jQuery(_this.target).offset().left - (_this.store.state.options.width || 16) - 5 : 0);
                result.y = (jQuery(_this.target).offset() ? jQuery(_this.target).offset().top : 0);
                break;
        }

        return result;
    };

    exports.render = function (e, data, opts, callback) {

        if (!e) return;

        exports.target = e;
        exports.trigger = (opts && opts.trigger) || e;

        selector = '#npg-tooltips';

        if ($(selector).size() > 0 && _this.store) {
            _this.store.state.data = data;
            jQuery.extend(true, _this.store.state.options, opts);
            _this.store.commit('open');
            return;
        }

        if (!opts) {
            var opts = {};
            var offset = _this.offset(opts);
            opts.x = offset.x;
            opts.y = offset.y;
        }

        jQuery('body').append('<div id="npg-tooltips"></div>');

        //存储状态
        exports.store = new Vuex.Store({
            state: {
                data : data,
                options: opts,
                show: false,
            },
            mutations: {
                ok: function (state) {
                    if ($.isFunction(opts.ok)) {
                        opts.ok.call(this, state, state.data);
                    }
                },
                close: function (state) {
                    state.show = false;
                },
                open: function (state) {
                    var offset = _this.offset(opts);
                    _this.store.state.options.x = offset.x;
                    _this.store.state.options.y = offset.y;
                    state.show = true;
                },
            }
        });

        //初始化组件
        $(selector).view('tooltips', function (vue) {

            exports.currentComponent = new vue({
                el: this.selector,
                data: _this.store.state,
                props: ['model'],
                methods: {
                    ok: function (e) {
                        return _this.store.commit('ok', this);
                    },
                    close: function (e) {
                        return _this.store.commit('close', this);
                    },
                    verify: function (e, index) {
                        if (_this.store.state.data.form[index].regexp) {
                            var val = String.fromCharCode(e.keyCode);
                            if (jQuery.isFunction(_this.store.state.data.form[index].regexp)) {
                                _this.store.state.data.form[index].regexp.call(e, val);
                                return;
                            }
                            e.returnValue = (_this.store.state.data.form[index].regexp.test(val));
                        }
                    }
                },
                mounted: function () { //组件挂载完成

                    $(selector).find('.npg-tips').css({ left: _this.store.state.options.x, top: _this.store.state.options.y });
                    jQuery('body').click(function (e) {
                        if (jQuery(e.target).parents('.npg-tips').size() < 1 && $(_this.trigger).first()[0].outerHTML != e.target.outerHTML) {
                            _this.store.commit('close');
                        }
                    });

                    _this.store.state.options.height = $(selector).find('.npg-tips').height();
                    _this.store.state.options.width = $(selector).find('.npg-tips').width();

                    _this.store.commit('open');

                    if ($.isFunction(callback)) {
                        callback.call($(selector), this);
                    }
                    else
                        require('m/layout').render();
                }
            });
        });

        return _this;
    };
});
