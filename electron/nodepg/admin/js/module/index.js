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

	var navigation;

	//初始化组件
	$('#app').view('index', function (vue) {

		var model = {
			el: this.selector,
			data: {
                showMenu : function (event) {
                    navigation.toggle(event); //显示隐藏导航菜单
                }},
			methods:{
				showMenu : function(event){
					navigation.toggle(event); //显示隐藏导航菜单
				}
			},
			mounted: function () { //组件挂载完成
                navigation = require('m/navigation');

                navigation.render('#navigation');
			}
		};

		new vue(model);

	});

	//文档加载完成事件
	$(function(){
		$(document).click(function(){
            $('#navigation').hide();
        });
	});

});
