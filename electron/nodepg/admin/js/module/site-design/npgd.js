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

    var $ = jQuery;

    var _this = this;

    var layout = require('m/layout');

    var lang = require('./lang.js');

    var util = require('lib/utility');

    exports.render = function(selector, model){

        if (model.fullpath) {
            model.content = util.fsRead(model.fullpath);
        }

        var defaultPlaform = window.screen.width + 'x' + window.screen.height;

        //存储状态
        exports.store = new Vuex.Store({
            state: {
                data : {
                    page: {
                        content: $('<div class="npg-page" />').append($(model.content).last()).html(),
                        style: {
                            width: '1900px',
                            height: '100%',
                        },
                        platforms: [
                            { name: defaultPlaform, width: window.screen.width - 20, height: '100%', class: ['fa-television'] },
                            { name: '1024x768', width: 955, height: '100%', class: ['fa-laptop'] },
                            { name: '800x600', width: 760, height: '100%', class: ['fa-laptop'] },
                            { name: '1242×2208', width: 1242, height: 2208, class: ['fa-mobile'] },
                            { name: '750×1334', width: 750, height: 1334, class: ['fa-mobile'] },
                            { name: '640×1136', width: 640, height: 1136, class: ['fa-mobile'] },
                            { name: '640×960', width: 640, height: 960, class: ['fa-mobile'] },
                            { name: '320×480', width: 320, height: 480, class: ['fa-mobile'] },
                        ],
                        mode: defaultPlaform,
                    },
                    attributes: new Array(),
                },
            },
            mutations: {
                setPageWidth: function (state, opts) {

                    if(!opts || !opts.item)
                        return false;

                    var data = opts.item;

                    state.data.page.mode = data.name;

                    var width = data.width;
                    var value = width - _this.slider.getData().min;
                    //_this.slider.setValue(value);

                    var max = _this.slider.getData().max - _this.slider.getData().min;
                    var percent = (value / max * 100) + '%';

                    //补丁：结合jquery，否则slider组件在多页tab下面会失效
                    $(opts.event.currentTarget).parents('.npg-design').find('.npg-slider-track').css({ width: percent });
                    $(opts.event.currentTarget).parents('.npg-design').find('.npg-slider-handle').css({ left: percent });

                    if (data.height) {
                        if (typeof (data.height) == 'string') {
                            state.data.page.style.height = data.height;
                        }
                        else {
                            state.data.page.style.height = data.height + 'px';
                        }
                    }

                    if (data.width) {
                        if (typeof (data.width) == 'string') {
                            state.data.page.style.width = data.width;
                            width = Number(data.width.replace('px', ''));
                        }
                        else {
                            state.data.page.style.width = data.width + 'px';
                            width = data.width;
                        }
                    }

                    _this.currentComponent.$nextTick(function () {
                        _this.resize();
                    });
                },

                select: function(state, target){

                    if(!target || $(target).size() < 1){
                        return false;
                    }
                },
            }
        });

        //初始化组件
        $(selector).view('site-design/npgd', function (vue) {

            exports.currentComponent = new vue({
                el: this.selector,
                data: _this.store.state,
                methods: {
                    setPageWidth: function (item, e) {

                        return this.$store.commit('setPageWidth', { item: item, event: e});
                    },

                    sliderClear: function (e) {

                        _this.slider.clear();
                    },

                    pageMove: function (e) {

                        _this.slider.reset(e);
                    },

                    onSelect: function(e){
                        _this.store.commit('select', e.currentTarget);
                    },
                },
                props: {
                    model: Object
                },
                mounted: function () { //组件挂载完成
                    var tools = require('m/site-design/tools');
                    tools.render(jQuery('[name=site-design] .tools'));

                    exports.slider = require('m/slider.js');

                    _this.slider.render($(selector).find('.mySlider'), {
                        value: _this.store.state.data.page.platforms[0].width,
                        parent: $(selector),
                        max: 2046,
                        min: 270,
                        page: _this.store.state.data.page,
                        onmounted: function (max, min) {
                            var value = _this.store.state.data.page.platforms[0].width + min;
                            this.percent = (value / max * 100);
                        },
                        onreset: function (value, percent, event) {
                            _this.store.state.data.page.style.width = value + 'px';

                            //补丁：结合jquery，否则slider组件在多页tab下面会失效
                            var parent = $(event.currentTarget).parents('.npg-tab-page-content').find('.npg-page-content');
                            parent.css({ width: value + 'px' });
                            parent.find('.npg-slider-track').css({ width: percent + '%' });
                            parent.find('.npg-slider-handle').css({ left: percent + '%' });
                            $(event.currentTarget).parent().find('.npg-slider-track').css({ width: percent + '%' });
                            $(event.currentTarget).parent().find('.npg-slider-handle').css({ left: percent + '%' });
                            _this.resize();
                        },
                    });

                    _this.store.commit('select', $(selector).find('.npg-body'));

                    exports.resize = function(){

                        $('.npg-page-bg.fitHeight').each(function () {
                            var list = $(this).siblings();
                            if (!list) return;

                            var height = 0;
                            for (var i = 0; i < list.length; i++) {
                                if ($(list[i]).is(':visible')) {
                                    height = height + $(list[i]).height();
                                }
                            }

                            height = $(this).parent().height() - height;
                            if (height && height > 0) {
                                $(this).height(height - 11);
                            }
                        });

                        $('.npg-body').each(function () {
                            $(this).width($(this).parent().width() - 28);
                            $(this).height($(this).parent().height() - 28);

                            if($(this).find('.npg-container').first().width() > $('#zxxScaleRulerH').width()){

                            }

                            if($(this).find('.npg-container').first().height() > $('#zxxScaleRulerV').height()){

                            }
                        });
                    };
                    $(window).resize(function () {
                        _this.resize();
                    });

                    _this.resize();
                },
                store: _this.store
            });
        });

    };
});
