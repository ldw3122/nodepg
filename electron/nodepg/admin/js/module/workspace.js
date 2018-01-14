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

    var selector = '';

	exports.loadPage = function(event){

		if(!event.target){
			return;
		}

		var id = event.target.id || event.target.name;

		if(!id){
			return;
		}

        $(selector).find('.page-toggle-panel').show();
        $(selector).find('.page-toggle-panel .page-toggle-button p i').removeClass('activation');

		var tabLink = $(selector).find('.page-toggle-button p #'+id);
		if(tabLink.size()<1){
            $(selector).find('.page-toggle-button p').append('<i class="activation" id="' + id + '" title="' + event.target.title + '"></i>');
		}else{
			tabLink.addClass('activation');
		}

		$(selector).find('.workspace .workspace-panel').hide();
		var tabContent = $(selector).find('.workspace [name='+id+']');
		if(tabContent.size()<1){
            $(selector).find('.workspace').append('<div class="workspace-panel" name="' + id + '"></div>');
			require.async('m/' + id + '/default.js', function(m){
                layout.render();
			});
		}else{
            tabContent.show();
            layout.render();
		}
    };

    exports.render = function (e) {

        if (!e)
            return;

        selector = e;


        //初始化组件
        $(selector).view('workspace', function (vue) {
            var model = {
                el: this.selector,
                data: {},
                methods : {
                    toggle : function (event) {
                        _this.loadPage(event);
                    }
                },
                mounted: function () { //组件挂载完成

                    if (layout) {
                        layout.render();
                        $(selector).find('.workspace .ui-resizable-handle').hide();
                    }
                }
            };

            new vue(model);
        });

        return _this;
    };

});
