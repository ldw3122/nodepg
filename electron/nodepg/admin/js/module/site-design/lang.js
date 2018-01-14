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

﻿define(function (require, exports, module) {

    function getLastName(name) {
        var arr = name.split('.');
        if (!arr || !arr.length || arr.length < 2)
            return;

        return arr[arr.length - 1];
    }

    module.exports = {

        getIcon : function (model) {
            if (!model.isSite && !model.isDir && (getLastName(model.name) == 'js' || getLastName(model.name) == 'json'))
                return 'js';

            if (!model.isSite && !model.isDir && (getLastName(model.name) == 'css' || getLastName(model.name) == 'less'))
                return 'css';

            if (!model.isSite && !model.isDir && (getLastName(model.name) == 'npgd' || getLastName(model.name) == 'npg'))
                return 'npg';

            if (!model.isSite && !model.isDir && (getLastName(model.name) == 'napi'))
                return 'api';

            if (!model.isSite && !model.isDir && (getLastName(model.name) == 'html' || getLastName(model.name) == 'htm'))
                return 'html';

            if (model.isSite && !model.isDir && (getLastName(model.name) == 'xml' || getLastName(model.name) == 'svg'))
                return 'xml';

            if (!model.isSite && !model.isDir)
                return 'file';

            return '';
        },

        getMenus: function (model) {
            var newItem = {
                name: '新建(New)',
                title: '新建目录或文件',
                children: [
                    {
                        name: '目录(Directory)',
                        title: '新建目录',
                        cmd: 'createDir',
                    },
                    {
                        spliter: true,
                    },
                    {
                        name: 'NPG页面(Page)',
                        title: '新建Nodepg页面',
                    },
                    {
                        name: 'NPG接口(Interface)',
                        title: '新建Nodepg接口',
                    },
                    {
                        name: 'HTML页面(Html)',
                        title: '新建html静态页面',
                    },
                    {
                        name: 'JS文件(Javascript)',
                        title: '新建js文件',
                    },
                    {
                        name: 'JSON文件(Json)',
                        title: '新建json文件',
                    },
                    {
                        name: 'CSS样式(Css)',
                        title: '新建css样式文件',
                    },
                    {
                        name: 'LESS样式(Less)',
                        title: '新建less样式文件',
                    },
                    {
                        name: 'XML文件(Xml)',
                        title: '新建xml文件',
                    },
                    {
                        name: 'SVG文件(Svg)',
                        title: '新建svg文件',
                    },
                    {
                        name: 'TXT文件(Text)',
                        title: '新建文本文件',
                    },
                ]
            };

            var menus = {};

            if (model.isSite) {
                menus.children = [
                    {
                        spliter: true,
                    },
                    {
                        name: '修改网站(Edit)',
                        title: '重新修改网站名称或端口',
                        cmd: 'editSite',
                    },
                    {
                        name: '删除网站(Remove)',
                        title: '删除网站',
                        cmd: 'removeSite',
                    },
                    {
                        name: '导入图片(Add Image)',
                        title: '导入图片到先中目录',
                        cmd: 'addImage',
                    },
                    {
                        spliter: true,
                    },
                    {
                        name: (model.open?'收起(Close)':'展开(Open)'),
                        title: (model.open?'收起':'展开') + '网站',
                        cmd: 'sitelist.items.toggle',
                    },
                ];

                menus.children.splice(0, 0, newItem);

            } else if (model.isDir) {
                menus.children = [
                    {
                        spliter: true,
                    },
                    {
                        name: '重命名(Rename)',
                        title: '重新修改目录名称',
                        cmd: 'rename',
                    },
                    {
                        name: '删除(Remove)',
                        title: '删除目录',
                        cmd: 'removeDir',
                    },
                    {
                        spliter: true,
                    },
                    {
                        name: '复制(Copy)',
                        title: '复制目录',
                    },
                    {
                        name: '粘贴(Paste)',
                        title: '粘贴目录或文件',
                    },
                    {
                        name: '导入图片(Add Image)',
                        title: '导入图片到先中目录',
                        cmd: 'addImage',
                    },
                    {
                        spliter: true,
                    },
                    {
                        name: (model.open?'收起(Close)':'展开(Open)'),
                        title: (model.open?'收起':'展开') + '目录',
                        cmd: 'sitelist.items.toggle',
                    },
                ];

                menus.children.splice(0, 0, newItem);

            } else {
                menus.children = [
                    {
                        name: '查看(View)',
                        title: '打开文件进行查看',
                        cmd: 'openFile',
                    },
                    {
                        name: '重命名(Rename)',
                        title: '重新修改文件名称',
                        cmd: 'rename',
                    },
                    {
                        name: '删除(Remove)',
                        title: '删除文件',
                        cmd: 'removeFile',
                    },
                    {
                        name: '复制(Copy)',
                        title: '复制文件',
                    },
                ];

                if (model.name != '.napi' && model.name != '.npg' && model.name != '.npgd') {
                    var format = model.name.substr(model.name.lastIndexOf('.'));
                    if (format == '.napi' || format == '.npgd' || format == '.npg') {
                        menus.children.push({
                            spliter: true,
                        });

                        menus.children.push({
                            name: '引入(Include)',
                            title: '引入脚本或样式',
                            children: [
                                {
                                    name: 'Javascript',
                                    title: '引入js脚本',
                                },
                                {
                                    name: 'CSS',
                                    title: '引入css样式',
                                },
                                {
                                    name: 'LESS',
                                    title: '引入less样式',
                                },
                            ]
                        });
                    }
                }
            }

            return menus;
        },

        save: '保存(Save)',

        port_title: '请输入端口号',

        port: '端口(Port)',

        close: '关闭(Close)',

        site_name: 'http://',

        site_name_title: '请输入网站名称',

        new_site_name: '新建网站',

        new_site_title: '新建网站（New Site）',

        edit_site_name: '修改网站',

        edit_site_title: '修改网站（Edit Site）',

        site_mgr_title: '网站管理(Site Manage)',

        site_mgr_name: '网站管理',

        save_success: '保存成功',

        import_success: '导入成功',

        is_url: '请输入正确的网站地址',

        has_port: '请输入端口号',

        site_exists: '网站名称已经存在',

        port_exists: '端口号不允许重复',

        site_not_exists: '网站不存在',

        input_dir_name: '请输入目录名称',

        new_dir: '新建目录',

        remove_dir_fail: '删除目录失败',

        remove_dir_confirm: '删除目录将会删除目录下所有文件并不能恢复，您确定要删除目录{0}吗？',

        remove_site_fail: '删除网站失败',

        remove_site_confirm: '网站删除后将不能恢复，您确定要删除网站{0}吗？',

        remove_success: '删除成功',

        remove: '删除(Remove)',

        rename_text: '重命名',

        rename_fail: '重命名失败',

        remove_file_fail: '删除文件失败',

        remove_file_confirm: '删除的文件将不能恢复，您确定要删除文件{0}吗？',

        attribute: '属性',

        image_exists: '图片已经存在，您确定要替换旧图片吗？',
    };

});
