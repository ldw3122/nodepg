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

    exports.load = function (model) {
        var util = require('lib/utility');
        var dirs = util.getDirs(model.fullpath, false, _this.store.state.options.fileTypes);
        if (dirs && dirs.length > 0) {
            Vue.set(model, 'children', dirs);
        }
    };

    exports.unselect = function (vueComponent) {

        var model = vueComponent.model;

        if (model && model.selected)
            Vue.set(model, 'selected', false);

        if (vueComponent.$children && vueComponent.$children.length > 0) {
            for (var i = 0; i < vueComponent.$children.length; i++) {
                _this.unselect(vueComponent.$children[i]);
            }
        }
    }

    exports.getParent = function (vueComponent) {

        if (!vueComponent.$parent)
            return false;

        return vueComponent.$parent;
    }

    exports.getRoot = function (vueComponent) {

        if (!vueComponent)
            return false;

        var parent = _this.getParent(vueComponent);
        if (!parent || (!_this.store.state.canShowRoot && !_this.getParent(parent))) {
            return vueComponent;
        } else {
            return _this.getRoot(parent);
        }
    }

    exports.toggle = function (state, data) {

        if (data.model.isDir) {
            data.model.open = !data.model.open

            if (!(data.model.children && data.model.children.length > 0)) {
                _this.load(data.model);
            }

            return;
        }

        if (data.model.selected) {
            if (state.options && state.options.select && $.isFunction(state.options.select)) {
                state.options.select.call(_this, data, state);
            }
        }
    };

    exports.render = function (e, data, opts, callback) {

        if (!e)
            return;

        selector = e;

        //存储状态
        exports.store = new Vuex.Store({
            state: {
                canShowRoot: opts.canShowRoot,
                currentModel: null,
                options: opts,
            },
            mutations: {
                toggle : function (state, data) {
                    _this.toggle(state, data);
                },
                chose : function (state, data) {

                    var root = _this.getRoot(data);

                    _this.unselect(root);

                    var value = !data.model.selected;

                    Vue.set(data.model, 'selected', value);

                    if (value) {
                        _this.store.state.currentModel = data.model;
                        if(_this.store.state.options.onselect){
                            _this.store.state.options.onselect.call(state, data.model, root);
                        }
                    }
                },
                popup: function(state, data) {

                    _this.store.commit('chose', data.data);
                    if (_this.store.state.options && _this.store.state.options.onContextMenu) {
                        if (jQuery.isFunction(_this.store.state.options.onContextMenu)) {
                            _this.store.state.options.onContextMenu.call(data, state, data.event);
                        }
                    }
                },
            }
        });

        //初始化组件
        $(selector).view('tree-items', {
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
                return {
                    selected: false //默认值
                };
            },
            computed: {
                status: function () {

                    if (!this.model) {
                        this.$props = { model: this.$data };
                        this.model = this.$props.model;
                        this.model.isRoot = true;
                    }

                    function getLastName(name) {
                        var arr = name.split('.');
                        if (!arr || !arr.length || arr.length < 2)
                            return;

                        return arr[arr.length - 1];
                    }

                    return {
                        canShowRoot: this.$store.state.canShowRoot,
                        hasChildren: (this.model.children && this.model.children.length > 0),
                        arrow: {
                            opened: this.model.open && this.model.isDir,
                            closed: !this.model.open && this.model.isDir,
                            empty: !this.model.isDir
                        },
                        icon: {
                            dir_open: !this.model.isSite && this.model.isDir && this.model.open,
                            dir_close: !this.model.isSite && this.model.isDir && !this.model.open,
                            js: !this.model.isSite && !this.model.isDir && (getLastName(this.model.name) == 'js' || getLastName(this.model.name) == 'json'),
                            css: !this.model.isSite && !this.model.isDir && (getLastName(this.model.name) == 'css' || getLastName(this.model.name) == 'less'),
                            html: !this.model.isSite && !this.model.isDir && (getLastName(this.model.name) == 'html' || getLastName(this.model.name) == 'htm'),
                            xml: !this.model.isSite && !this.model.isDir && (getLastName(this.model.name) == 'xml' || getLastName(this.model.name) == 'svg'),
                            npg: !this.model.isSite && !this.model.isDir && (getLastName(this.model.name) == 'npgd' || getLastName(this.model.name) == 'npg'),
                            api: !this.model.isSite && !this.model.isDir && (getLastName(this.model.name) == 'napi'),
                            file: !this.model.isSite && !this.model.isDir,
                            site: this.model.isSite,
                        },
                        defaultIcon: this.$store.state.options.defaultIcon,
                    };
                }
            },
            methods: {
                toggle : function (e) {
                    this.$store.commit('toggle', this);
                },
                chose : function (e) {
                    this.$store.commit('chose', this);
                },
                popup: function (e) {
                    this.$store.commit('popup', { model: this.model, data: this, event: e });
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
