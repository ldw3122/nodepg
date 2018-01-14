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

define(function (require, exports, module) {

    require('jqvue')

    var $ = jQuery, _this = this, selector = '';

    exports.offset = function () {

        var result = {};
        if (!_this.target) return result;

        result.x = jQuery(_this.target).offset().left;
        result.y = jQuery(_this.target).offset().top + jQuery(_this.target).height() - 2;
        result.width = jQuery(_this.target).width();
        result.height = jQuery(_this.target).height();

        return result;
    };

    exports.render = function (e, data, opts, callback) {

        if (!e) return;

        exports.target = e;

        selector = '#npg-contextmenu';

        var offset = _this.offset();
        opts.x = (opts.x || offset.x) - 125;
        opts.y = (opts.y || offset.y) + offset.height;

        if ($(selector).size() > 0 && _this.store) {
            $(selector).find('.npg-contextmenu').css({ left: opts.x, top: opts.y });
            _this.items.setData(data);
            _this.store.commit('show');
            return;
        }

        exports.hide = function () {
            _this.store.commit('hide');
        };

        //存储状态
        exports.store = new Vuex.Store({
            state: {
                data : data,
                options: opts,
                show: true,
            },
            mutations: {
                hide: function (state) {
                    state.show = false;
                },
                show: function (state) {
                    state.show = true;
                },
            }
        });

        jQuery('body').append('<div id="npg-contextmenu"></div>');

        //初始化组件
        $(selector).view('menu', function (vue) {

            exports.currentComponent = new vue({
                el: this.selector,
                data: _this.store.state,
                mounted: function () { //组件挂载完成

                    $(selector).find('.npg-contextmenu').css({ left: _this.store.state.options.x, top: _this.store.state.options.y });

                    exports.items = require('m/menu-items').render($(selector).find('ul'), data, { onClickItem: (opts && opts.onClickItem), parent: _this });

                    jQuery('body').click(function (e) {
                        if (jQuery(e.target).parents('.npg-contextmenu').size() < 1) {
                            jQuery('.npg-contextmenu').find('ul ul').hide();
                            _this.store.commit('hide');
                        }
                    });

                    if ($.isFunction(callback)) {
                        callback.call($(selector), this.model, _this.currentComponent);
                    }
                }
            });
        });

        return _this;
    };

    exports.getSelected = function () {

        if (!_this.items)
            return;

        return _this.items.store.state.currentModel;
    };

});
