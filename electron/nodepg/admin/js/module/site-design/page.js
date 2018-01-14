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

        if(!model || !model.name || !model.fullpath){
            return '';
        }

        var suffix = model.name.substr(model.name.lastIndexOf('.') + 1);

        switch(suffix){
            case 'npgd':
                exports.designer = require('m/site-design/npgd.js');
                break;
            case 'napi':
                exports.designer = require('m/site-design/napi.js');
                break;
            case 'jpg':
            case 'jpeg':
            case 'gif':
            case 'png':
                exports.designer = require('m/site-design/image.js');
                break;
        }

        if(_this.designer){
            _this.designer.render(selector, model);
            exports.resize = function () {
                _this.designer.resize();
            };
        }
    };
});
