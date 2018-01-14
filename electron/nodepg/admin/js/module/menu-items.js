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

    exports.setData = function (data) {
        _this.currentComponent.$data.children = data.children;
    };
    exports.render = function (e, data, opts, callback) {

        if (!e)
            return;

        selector = e;

        //存储状态
        exports.store = new Vuex.Store({
            state: {
                currentModel: null,
                options: opts,
            },
            mutations: {
                click : function (state, result) {
                    if (state.options && state.options.onClickItem && $.isFunction(state.options.onClickItem)) {
                        state.options.onClickItem.call(_this, state, result);
                    }
                    state.options.parent.hide();
                },
                hover : function (state, data) {
                    if (!data.model.name) {
                        return false;
                    }

                    $(data.event.target).siblings().find('ul').hide();
                    $(data.event.target).find('ul').first().show();
                },
            }
        });

        //初始化组件
        $(selector).view('menu-items', {
            callback: function (vue, template, options) {

                jQuery.extend(true, options, {
                    el: this.selector,
                    data: data,
                    store: _this.store
                });

                exports.currentComponent = new vue(options);
            },
            props: {
                model: Object
            },
            data: function () {
                return { //默认值
                    spliter: false,
                    name: '',
                    title: '',
                    isshow: false,
                };
            },
            computed: {
                init: function () {

                    if (!this.model) {
                        this.$props = { model: this.$data };
                        this.model = this.$props.model;
                        this.model.isshow = true;
                    }

                    return true;
                },
                status: function () {

                    return {
                        hasChildren: (this.model.children && this.model.children.length > 0),
                    };
                }
            },
            methods: {
                click: function (e) {
                    this.$store.commit('click', { data: this, event: e });
                },
                hover: function (e) {
                    this.$store.commit('hover', { model: this.model, event: e });
                },
            },
            mounted: function () { //组件挂载完成

                if ($.isFunction(callback)) {
                    callback.call($(selector), this.model, view);
                }
            }
        });

        return _this;
    };

});
