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

    var $ = jQuery = require('jquery');

    var Vue = window.Vue;
    if (!Vue) {
        Vue = window.Vue = require('vue').Vue;
    }

    var Vuex = window.Vuex;
    if (!Vuex) {
        Vuex = window.Vuex = require('vuex').Vuex;
    }

	var basePath = 'js/view/';

	var isJson = function(obj){
		var isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
		return isjson;
	};
	(function($){
        window.jQuery.fn.view = function (viewName, options){

            var callback = null;

            if (options) {
                if ($.isFunction(options)) {
                    callback = options;
                } else if ($.isPlainObject(options) && options.callback && $.isFunction(options.callback)) {
                    callback = options.callback;
                }
            }

	        if(!this.length){
	    	    if(this.selector.substring(0,1)=='#'){
	    		    $('body').append('<div id="'+this.selector.substring(1)+'"></div>');
	    	    }else if(this.selector.substring(0,1)=='.'){
	    		    $('body').append('<div class="'+this.selector.substring(1)+'"></div>');
	    	    }else {
	    		    $('body').append('<'+this.selector.substring(1)+'></'+this.selector.substring(1)+'>');
	    	    }
	        }

	        var _this = $(this.selector);
            var conpomentName = '-component';
            var arr = viewName.split('/');

            if (arr.length > 1) {
                for (var i = arr.length - 1; i >= 0; i--) {

                    var val = arr[i].toLowerCase().replace('.tpl', '');

                    if (val === 'default' || val === 'index' || val === 'main')
                        continue;

                    conpomentName = arr[i] + conpomentName;
                    break;
                }
            }
            else
                conpomentName = viewName + conpomentName;

            var path = basePath + viewName;

            if (path.lastIndexOf('.tpl') < 0)
                path = path + '.tpl';

            _this.append('<' + conpomentName + '><' + conpomentName + '/>');

            $.ajaxSetup({
                global: true,
                cache: true
            });

            var render = function(html){
                var obj = {
                    template: html,
                };

                if ($.isPlainObject(options)) {
                    $.extend(true, obj, options);
                }

                // 注册
                Vue.component(conpomentName, obj);

                if($.isFunction(callback)){
                    callback.call(_this, Vue, html, obj)
                }
            };

            if(options.template){
                return render(options.template);
            }

            _this.load(path, function (html){

                if(options.action == 'getTemplate'){
                    if($.isFunction(callback)){

                        callback.call(_this, Vue, html);
                    }
                    return;
                }
                render(html);
            });
	   }
	})(jQuery);

});
