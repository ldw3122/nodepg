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

    exports.render = function (e, data, opts, callback) {

        if (!e)
            return;

        selector = e;

        //存储状态
        exports.store = new Vuex.Store({
            state: {
                data : data,
                selectIndex: 0,
                closeButtonIndex: -1,
                fit: (opts && opts.fit),
                showFooter: (opts && opts.showFooter),
                navOver: false,
                selector: selector,
                buttons_width: 0,
                x: 0,
                status: '',
                onPageClick: (opts && opts.onPageClick),
                events: {
                    onActivate: false,
                    onSelected: false,
                },
            },
            mutations: {
                select: function (state, index) {

                    if (!state.data[index]) {
                        if (state.data.length && state.data.length > 0) {
                            index = state.data.length - 1;
                        }
                    }

                    if(state.events.onActivate && jQuery.isFunction(state.events.onActivate)){
                        state.events.onActivate.call(jQuery(selector), index, state);
                    }
                    if(state.events.onSelected && jQuery.isFunction(state.events.onSelected)){
                        _this.currentComponent.$nextTick(function(){
                            if(state.data.length < 1){
                                jQuery(this.$el.getElementsByClassName('npg-tab-page')).html('');
                            }
                            state.events.onSelected.call(jQuery(selector), state, index, _this.store.state.status);
                            _this.store.commit('resize');
                        });
                    }

                    //补丁：tab-page-content中加载子组件后selectIndex控制失效，需要用jquery做显示隐藏
                    jQuery(state.selector).find('.npg-tab-page-content').hide();
                    jQuery(state.selector).find('#tab_page_' + index).show();

                    state.selectIndex = index;
                    _this.store.state.status = 'select';
                },
                mouseover: function (state, index) {
                    state.closeButtonIndex = index;
                },
                mouseout: function (state, index) {
                    state.closeButtonIndex = -1;
                },
                close: function (state, index) {
                    state.data.splice(index, 1);
                },
                resize: function (state, data) {
                    state.buttons_width = 0;
                    $(state.selector).find('.tabs-tab').each(function () {
                        state.buttons_width = state.buttons_width + $(this).width() + 35;
                    });
                    if (state.buttons_width >= $(state.selector).find('.tabs-nav').parent().width()) {
                        $(state.selector).find('.tabs-nav').width($(state.selector).find('.tabs-nav').parent().width() - 35);
                        state.navOver = true;
                    } else {
                        $(state.selector).find('.tabs-nav').width($(state.selector).find('.tabs-nav').parent().width());
                        state.navOver = false;
                    }
                    $(state.selector).find('.tabs-nav-wrapper').width(state.buttons_width);
                    if (!state.navOver) {
                        $(state.selector).find('.tabs-nav-wrapper').css({ transform: 'translate3d(0px, 0px, 0px)' });
                    }
                },
                navRight: function (state) {
                    state.x -= 100;
                    var max = state.buttons_width - $(state.selector).find('.tabs-nav').parent().width();
                    if (Math.abs(state.x) > max) {
                        state.x = -(max);
                    }
                    $(state.selector).find('.tabs-nav-wrapper').css({ transform: 'translate3d(' + state.x + 'px, 0px, 0px)' });
                },
                navLeft: function (state) {
                    state.x += 100;
                    var min = 0;
                    if (state.x > min) {
                        state.x = 0;
                    }
                    $(state.selector).find('.tabs-nav-wrapper').css({ transform: 'translate3d(' + state.x + 'px, 0px, 0px)' });
                },
                navToLast: function (state) {
                    var max = state.buttons_width - $(state.selector).find('.tabs-nav').parent().width();
                    state.x = -(max)-50;
                    $(state.selector).find('.tabs-nav-wrapper').css({ transform: 'translate3d(' + state.x + 'px, 0px, 0px)' });
                },
                onPageClick: function(state, event){
                    if(state.onPageClick && jQuery.isFunction(state.onPageClick)){
                        state.onPageClick.call(state, event);
                    }
                },
            }
        });

        //初始化组件
        $(selector).view('tabs', function (vue) {

            exports.currentComponent = new vue({
                el: this.selector,
                data: _this.store.state,
                methods: {
                    select: function (index) {
                        return this.$store.commit('select', index);
                    },
                    mouseover: function (index) {
                        return this.$store.commit('mouseover', index);
                    },
                    mouseout: function (index) {
                        return this.$store.commit('mouseout', index);
                    },
                    close: function (index) {
                        return this.$store.commit('close', index);
                    },
                    navRight: function (e) {
                        return this.$store.commit('navRight', this);
                    },
                    navLeft: function (e) {
                        return this.$store.commit('navLeft', this);
                    },
                    pageClick: function(e){
                        return this.$store.commit('onPageClick', e);
                    },
                },
                props: {
                    model: Object
                },
                mounted: function () { //组件挂载完成

                    $(window).resize(function () {
                        _this.store.commit('resize');
                    });

                    if ($.isFunction(callback)) {
                        callback.call($(selector), this.model, _this.currentComponent);
                    }
                    else
                        require('m/layout').render();
                },
                store: _this.store
            });
            _this.currentComponent.$watch('data', function (model) { //监听数据
                if ($.isFunction(callback)) {
                    callback.call($(selector), this.model, _this.currentComponent);
                }
                else
                    require('m/layout').render();
            });
        });

        return _this;
    };

    exports.add = function (modelOrfn) {
        if (!_this.store) {
            return false;
        }

        if (!_this.store.state.data)
            _this.store.state.data = [];

        var index = _this.store.state.data.indexOf(modelOrfn);
        if (index > -1) {
            _this.store.commit('select', index);
            return false;
        }

        var model = null;

        if(jQuery.isFunction(modelOrfn)){

            model = modelOrfn.call(_this.store, _this.store.state.data);
            if(!model)
                return false;

        }else {

            model = modelOrfn;
        }

        _this.store.state.data.push(model);

        if (_this.store.state.navOver) {
            _this.store.commit('navToLast');
        }

        _this.store.state.closeButtonIndex = -1;
        _this.store.commit('select', _this.store.state.data.length - 1);

        _this.store.state.status = 'add';
    };
});
