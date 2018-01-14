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

    exports.keys = [];

    exports.onActivate = null;
    exports.onSelected = null;

    exports.reset = function(e){
        _this.store.commit('reset', e);
    };

    exports.clear = function(){
        _this.store.state.status = '';
    };

    exports.getValue = function(){
        return _this.store.state.data.value;
    };

    exports.setValue = function(value){
        var max = _this.getData().max - _this.getData().min;
        _this.store.state.data.percent = value / max * 100;
        _this.store.state.data.value = value;
    };

    exports.getData = function(){
        return _this.store.state.data;
    };

    exports.render = function (e, data) {

        if (!e)
            return;

        selector = e;

        jQuery.extend(true, data, {
            max: 2040,
            min: 270,
            value: 1900,
            percent: 40,
        });

        data.percent = ((data.value - data.min) / (data.max - data.min) * 100);

        //存储状态
        exports.store = new Vuex.Store({
            state: {
                data : data,
                status: '',
            },
            mutations: {
                reset: function (state, e) {

                    if (_this.store.state.status != 'mousedown') {
                        return false;
                    }

                    var slider = jQuery(e.currentTarget).find('#pageSlider').size() > 0 ? jQuery(e.currentTarget).find('#pageSlider') : jQuery(e.currentTarget).parents('#pageSlider').first();
                    var min = 0;
                    var max = slider.width();
                    var left = slider.offset().left;

                    var value = e.clientX - left;

                    if (value > max)
                        value = max;

                    else if (value < 0)
                        value = 0;

                    var percent = value / max;

                    value = (_this.store.state.data.min + _this.store.state.data.max) * percent
                    if (value > _this.store.state.data.max)
                        value = _this.store.state.data.max;

                    else if (value < _this.store.state.data.min)
                        value = _this.store.state.data.min;

                    var panel = require('m/tooltips');
                    var block = slider.find('.npg-slider-handle');
                    panel.render(block, {
                        title: Math.round(value),
                    }, {
                        style: {
                            minWidth: 'auto',
                            height: '15px',
                        },
                        pos: 'top',
                    });

                    if (_this.store.state.data.onreset && jQuery.isFunction(_this.store.state.data.onreset)) {
                        _this.store.state.data.onreset.call(state, value, percent * 100, e);
                    } else {
                        _this.store.state.data.value = value;
                        _this.store.state.data.percent = percent * 100;
                    }
                },
            }
        });

        //初始化组件
        $(selector).view('slider', function (vue) {

            exports.currentComponent = new vue({
                el: this.selector,
                data: _this.store.state,
                methods: {
                    sliderMouseDown: function (e) {

                        _this.store.state.status = 'mousedown';
                        if (!jQuery(e.currentTarget).attr('valuenow')) {
                            _this.store.commit('reset', e);
                            _this.store.state.status = '';
                            return false;
                        }
                    },
                    pageMove: function(e){
                        _this.store.commit('reset', e);
                    },
                },
                mounted: function () { //组件挂载完成

                    if (_this.store.state.data.onmounted && jQuery.isFunction(_this.store.state.data.onmounted)) {
                        var max = _this.store.state.data.max + _this.store.state.data.min;

                        _this.store.state.data.onmounted.call(_this.store.state.data, max, _this.store.state.data.min);
                    }

                },
                store: _this.store
            });
            _this.currentComponent.$watch('data', function (model) { //监听数据

            });
        });

        return _this;
    };
});
