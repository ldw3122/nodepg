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

	//初始化组件
	$('#app .content .workspace [name=site-design]').view('site-design/index.tpl', function (vue) {
			var model = {
				el: this.selector,
				data: {
					title: event.target.title
				},
				methods : {
					open : function(event){
			            _this.show(event);
					}
				},
        mounted: function () { //组件挂载完成

            $(function () {

                $('[name=site-design] .filemanager').resizable({ minWidth: 200 });
                $('[name=site-design] .tools').resizable({ minWidth: 50, maxWidth: 50, handles: 'w', disabled:true });

                var site_data = [
                    { title: lang.site_mgr_title, name: lang.site_mgr_name },
                    { title: lang.attribute, name: lang.attribute, content:'' }
                ];
                exports.sitemgr = require('m/tabs').render('#app .content .site-list', site_data, null, function (vue, template, options) {

                    var data = util.getWeb();

                    exports.sitelist = require('m/tree').render($(this).find('.npg-tab-page #tab_page_0'), data, {
                        select: _this.openFile,
                        buttonAddTitle: lang.new_site_title,
                        add: _this.newSite,
                        onContextMenu: _this.popupMenu,
                        root: './web/',
                    });

                    exports.pages = require('m/tabs').render('#app .workspace [name=site-design] .center', [], {
                        fit: false,
                        showFooter: true,
                        overflow: 'hidden',
                        onPageClick: _this.pageClick,
                    });
                });
            });
					}
			};

			new vue(model);
    });

    exports.pageClick = function(e){

        if (!jQuery(e.target).hasClass('npg-container')) {
            return false;
        }

        var attrPanle = jQuery('.site-list #tab_page_1');

        var attrs = require('m/site-design/attrs.js');

        var model = _this.sitelist.getSelected();

        if(model.path){
            var siteName = model.path.split('/')[0];

            attrs.render(attrPanle, e.target, siteName);

            jQuery('.site-list .tabs-tab')[1].click();
        }
    };

    exports.newSite = function (e) {

        var target = jQuery(e.target);
        var panel = require('m/tooltips');

        panel.render(target, {
            title: lang.new_site_name,
            form: [
                { name: 'site_name', label: lang.site_name, title: lang.site_name_title, type: 'text', value : '' },
                { name: 'site_port', label: lang.port, title: lang.port_title, type: 'text', value: '', regexp: /[\d.]/ },
            ],
        }, {
            okText: lang.save,
            closeText: lang.close,
            ok: function (state, data) {

                if (!_this.saveSite(data.form)) {
                    return;
                }
                jQuery.jAlert(lang.save_success);
                state.show = false;
            }
        });
    };

    exports.editSite = function (state, data, menuItem, vm, trigger) {

        var target = jQuery(menuItem).parents('.chosed').first();
        var panel = require('m/tooltips');

        panel.render(target, {
            title: lang.edit_site_name,
            form: [
                { name: 'site_name', label: lang.site_name, title: lang.site_name_title, type: 'text', value : data.model.name },
                { name: 'site_port', label: lang.port, title: lang.port_title, type: 'text', value: data.model.port, regexp: /[\d.]/ },
            ],
        }, {
            okText: lang.save,
            closeText: lang.close,
            ok: function (state, data) {

                var m = _this.sitelist.getSelected();
                if (!_this.saveSite(data.form, m)) {
                    return;
                }
                jQuery.jAlert(lang.save_success);
                state.show = false;
            },
            trigger: trigger,
        });
    };

    exports.saveSite = function (form, model) {

        var name = form[0].value;
        var port = form[1].value;
        if (!util.isUrl('http://' + name)) {
            jQuery.jAlert(lang.is_url);
            return false;
        }

        if (!name) {
            jQuery.jAlert(lang.has_port);
            return false;
        }

        var conf = util.getWebConfig();

        if (!model) {
            if (conf.sites[name]) {
                jQuery.jAlert(lang.site_exists);
                return false;
            }

            for (var i in conf.sites) {
                if (conf.sites[i].port == port) {
                    jQuery.jAlert(lang.port_exists);
                    return false;
                }
            }


            _this.sitelist.items.currentComponent.$data.children.push({
                name: name,
                children : [],
                path: './web/' + name,
                open: true,
                isDir: true,
                title: name + ':' + port,
                isSite: true,
                isRoot: false,
            });

        } else {
            if (model.name != name && !conf.sites[model.name]) {
                jQuery.jAlert(lang.site_not_exists);
                return false;
            }

            delete conf.sites[model.name];
            if(model.name != name){
              try {
                util.rename(model.fullpath, model.fullpath.substring(0, model.fullpath.lastIndexOf('/')) + '/' + name);
              } catch (e) {
              } finally {
              }
            }
            model.name = name;
            model.port = port;
        }

        conf.sites[name] = { port: port };

        util.saveWebConfig(conf);

        return true;
    };

    exports.addImage = function(state, data, menuItem, vm, trigger){

        jQuery('#importImageInputForSite').bind('change', function(){

            if(!this.value){
                return false;
            }

            jQuery('#importImageInputForSite').unbind('change');

            var reader = new FileReader();

            reader.onload=function(e) {

                var image = e.target.result;

                var target = vm.model.fullpath + '/' + filename;

                util.saveImage(target, image);

                vm.model.children = util.getDirs(vm.model.fullpath, 'gen');

                jQuery.jAlert(lang.import_success);

                state.show = false;
            };

            var filename = '';
            for(var i=0; i<this.files.length; i++){
                filename = this.files[i].name;
                if(!filename){
                    continue;
                }

                if(util.fsExists(vm.model.fullpath + '/' + filename)){
                    if(confirm(lang.image_exists)){
                        reader.readAsDataURL(this.files[i]);
                    }
                }else{
                    reader.readAsDataURL(this.files[i]);
                }
            }
        });
        jQuery('#importImageInputForSite').click();
    };

    exports.rename = function(state, data, menuItem, vm, trigger){
        var panel = require('m/tooltips');

        var target = jQuery(menuItem).parents('.chosed').first();
        if (!target || !target.length) return;

        panel.render(target, {
            title: lang.rename_text,
            form: [
                { name: 'name', title: lang.rename_text, type: 'text', value : data.model.name, regexp: new RegExp('[^\\/:\*\?"\'<>|]+') },
            ],
        }, {
            okText: lang.save,
            closeText: lang.close,
            ok: function (state, data) {
                if (!data.form[0].value) {
                    jQuery.jAlert(lang.rename_fail);
                    return false;
                }

                util.rename(vm.model.fullpath, vm.model.fullpath.substring(0, vm.model.fullpath.lastIndexOf('/')) + '/' + data.form[0].value);

                vm.model.name = data.form[0].value;

                jQuery.jAlert(lang.save_success);
                state.show = false;
            },
            trigger: trigger,
        });
    };

    exports.removeSite = function (state, data, menuItem, vm, trigger) {
        var panel = require('m/tooltips');

        var target = jQuery(menuItem).parents('.chosed').first();
        if (!target || !target.length) return;

        panel.render(target, {
            title: lang.remove_site_confirm.replace('{0}', '"' + data.model.name + '"'),
            form: [
                { name: 'path', type: 'hidden', value: data.model.fullpath },
            ],
        }, {
            okText: lang.remove,
            closeText: lang.close,
            ok: function (state, data) {
                if (!data.form[0].value) {
                    jQuery.jAlert(lang.remove_site_fail);
                    return false;
                }

                var conf = util.getWebConfig();

                util.rmdir(data.form[0].value);

                var arr = _this.sitelist.items.currentComponent.$data.children;
                for(var i in arr){
                    if(arr[i].fullpath == data.form[0].value){
                        delete conf.sites[arr[i].name];
                        arr.splice(i, 1);
                    }
                }

                util.saveWebConfig(conf);

                jQuery.jAlert(lang.remove_success);
                state.show = false;
            },
            trigger: trigger,
        });
    };

    exports.removeDir = function (state, data, menuItem, vm, trigger) {
        var panel = require('m/tooltips');

        var target = jQuery(menuItem).parents('.chosed').first();
        if (!target || !target.length) return;

        panel.render(target, {
            title: lang.remove_dir_confirm.replace('{0}', '"' + data.model.name + '"'),
            form: [
                { name: 'path', type: 'hidden', value: data.model.fullpath },
            ],
        }, {
            okText: lang.remove,
            closeText: lang.close,
            ok: function (state, data) {
                if (!data.form[0].value) {
                    jQuery.jAlert(lang.remove_dir_fail);
                    return false;
                }

                util.rmdir(data.form[0].value);

                _this.removeTreeChildren(_this.sitelist.items.currentComponent.$data.children, function(item){
                    return item.fullpath == data.form[0].value;
                });

                jQuery.jAlert(lang.remove_success);
                state.show = false;
            },
            trigger: trigger,
        });
    };

    exports.removeFile = function (state, data, menuItem, vm, trigger) {
        var panel = require('m/tooltips');

        var target = jQuery(menuItem).parents('.chosed').first();
        if (!target || !target.length) return;

        panel.render(target, {
            title: lang.remove_file_confirm.replace('{0}', '"' + data.model.name + '"'),
            form: [
                { name: 'path', type: 'hidden', value: data.model.fullpath },
            ],
        }, {
            okText: lang.remove,
            closeText: lang.close,
            ok: function (state, data) {
                if (!data.form[0].value) {
                    jQuery.jAlert(lang.remove_file_fail);
                    return false;
                }

                util.unlink(data.form[0].value);

                _this.removeTreeChildren(_this.sitelist.items.currentComponent.$data.children, function(item){
                    return item.fullpath == data.form[0].value;
                });

                jQuery.jAlert(lang.remove_success);
                state.show = false;
            },
            trigger: trigger,
        });
    };

    exports.removeTreeChildren = function(arr, fn){
        var removeItem = function(treeList){
            for(var i in treeList){
                if(fn(treeList[i])){
                    treeList.splice(i, 1);
                    return treeList;
                }

                if(treeList[i].children && treeList[i].children.length > 0){
                    removeItem(treeList[i].children);
                }
            }
        };

        return removeItem(arr);
    };

    exports.createDir = function (state, data, menuItem, vm, trigger) {
        var panel = require('m/tooltips');

        var target = jQuery(menuItem).parents('.chosed').first();
        if (!target || !target.length) return;

        panel.render(target, {
            title: lang.new_dir,
            form: [
                { name: 'name', title: lang.input_dir_name, type: 'text', value : '', regexp: new RegExp('[^\\/:\*\?"\'<>|]+') },
            ],
        }, {
            okText: lang.save,
            closeText: lang.close,
            ok: function (state, data) {
                if (!data.form[0].value) {
                    jQuery.jAlert(lang.input_dir_name);
                    return false;
                }

                util.mkdir(vm.model.fullpath + '/' + data.form[0].value);

                vm.model.children = util.getDirs(vm.model.fullpath, 'gen');

                jQuery.jAlert(lang.save_success);
                state.show = false;
            },
            trigger: trigger,
        });
    };

    exports.popupMenu = function (state, event) {

        var vm = this;
        exports.triggerMenu = event.target;
        require('m/menu').render(event.target, lang.getMenus(this.model), {
            x: event.pageX, y: event.pageY, onClickItem: function (s, result) {

                if (!result.data || !result.data.model || !result.data.model.cmd) {
                    return;
                }

                var data2 = { model: _this.sitelist.items.store.state.currentModel };
                if(data2.model){
                    vm.model = data2.model;
                }
                if (jQuery.isFunction(result.data.model.cmd)) {
                    result.data.model.cmd(state, data2, _this.triggerMenu, vm, result.event.target);
                }

                eval('_this.' + result.data.model.cmd + '(state, data2, _this.triggerMenu, vm, result.event.target);');
            }
        });
    };

    //查看选中文件
    exports.openFile = function () {

        if (!_this.sitelist)
            return;

        if (!_this.sitelist.getSelected)
            return;

        var model = _this.sitelist.getSelected();

        if (model) {
            model.icon = lang.getIcon(model);
            model.showClose = true;
            model.path = model.fullpath.replace('./web/','');

            _this.pages.store.state.events.onActivate = function (index){

                //补丁：tab-page-content中加载子组件后selectIndex控制失效，需要用jquery做显示隐藏
                this.find('.npg-tab-page-content').hide();
                this.find('#tab_page_' + index).show();
            };

            _this.pages.store.state.events.onSelected = function(state, index, action){

                //保存上次数据
                var old = state.data[state.selectIndex];
                if(action == 'add'){
                    var page = require('m/site-design/page.js');
                    var data = _this.pages.store.state.data[index];
                    page.render(this.find('#tab_page_' + index), data);
                    model.page = page;
                    return;
                }

                var mod = _this.sitelist.getSelected();
                mod.page.resize();
            };

            _this.pages.add(model);
        }
    };
});
