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
            exports.content = util.fsRead(model.fullpath);
        }
        exports.page =  $('<div class="npg-page" />').append($(_this.content).last());

        //存储状态
        exports.store = new Vuex.Store({
            state: {
                data : _this.page,
                selector: selector,
            },
            mutations: {
                select: function (state, index) {

                },
                mouseover: function (state, index) {

                },
                mouseout: function (state, index) {

                },
            }
        });

        //初始化组件
        $(selector).view('site-design/npgd', function (vue) {

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
                },
                props: {
                    model: Object
                },
                mounted: function () { //组件挂载完成

                },
                store: _this.store
            });
        });

    };
});
