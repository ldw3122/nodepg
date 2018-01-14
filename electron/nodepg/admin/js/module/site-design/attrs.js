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

		var util = require('lib/utility');

    var $ = jQuery, _this = this, selector = '';

    var conf = {
        widthOptions: [
                    {text: '1', value: 1},
                    {text: '2', value: 2},
                    {text: '3', value: 3},
                    {text: '4', value: 4},
                    {text: '5', value: 5},
                    {text: '6', value: 6},
                    {text: '7', value: 7},
                    {text: '8', value: 8},
                    {text: '9', value: 9},
                    {text: '10', value: 10},
                    {text: '11', value: 11},
                    {text: '12', value: 12},
                ],
    };

    var unsetColumnWidth = function(){
        for(var i=0; i<conf.widthOptions.length; i++){
            jQuery(_this.store.state.target).removeClass('col-lg-' + conf.widthOptions[i]);
            jQuery(_this.store.state.target).removeClass('col-md-' + conf.widthOptions[i]);
            jQuery(_this.store.state.target).removeClass('col-sm-' + conf.widthOptions[i]);
            jQuery(_this.store.state.target).removeClass('col-xs-' + conf.widthOptions[i]);
        }
    };

    var setColumnWidth = function(value){

        unsetColumnWidth();

        jQuery(state.target).addClass('col-lg-' + value);
        jQuery(state.target).addClass('col-md-' + value);
        jQuery(state.target).addClass('col-sm-' + value);
        jQuery(state.target).addClass('col-xs-' + value);
    };

    function getData(target) {
        var attrs = [{
            label: 'ID',
            controls: [{
                type: 'text',
                title:'设置选中部件的唯一标识',
                value: jQuery(target).attr('id'),
                regexp: /[^\d\w_\u4e00-\u9fa5]/gmi,
                text: '唯一标识',
                onwatch: function(state, data){
                    jQuery(state.target).attr('id', data.input.value);
                },
            }],
        }, {
            label: '宽',
            controls: [{
                type: 'number',
                title:'设置选中部件宽度(Set Width)',
                text: '最小',
                regexp: /[^\d]/gmi,
                value: (jQuery(target).css('min-width').replace('px', '')=='0' ? '' : jQuery(target).css('min-width').replace('px', '')),
                options: conf.widthOptions,
                onwatch: function(state, data){

                    if(jQuery(state.target).hasClass('npg-body')){
                        return false;
                    }

                    jQuery(state.target).css('min-width', data.input.value + 'px');
                },
            }, {
                type: 'number',
                title:'设置选中部件宽度(Set Width)',
                text: '最大',
                value: (jQuery(target).css('max-width').replace('px', '')=='0' ? '' : jQuery(target).css('max-width').replace('px', '')),
                options: conf.widthOptions,
                onwatch: function(state, data){

                    if(jQuery(state.target).hasClass('npg-body')){
                        return false;
                    }

                    jQuery(state.target).css('max-width', data.input.value + 'px');
                },
            }, {
                type: (jQuery(target).css('width') ? 'number' : 'select'),
                title:'设置选中部件宽度(Set Width)',
                text: '宽',
                regexp: /\-/gmi,
                value: jQuery(target).css('width').replace(/[^\d]+/gmi, ''),
                options: conf.widthOptions,
                style: { marginLeft: '15px' },
                onwatch: function(state, data){

                    if(jQuery(state.target).hasClass('npg-body')){
                        return false;
                    }

                    if(this.controls[3].value == 'column'){
                        setColumnWidth(this.controls[3].value);
                        jQuery(state.target).css('width', null);
                        return true;
                    }

                    unsetColumnWidth();
                    jQuery(state.target).css('width', data.input.value + this.controls[3].value);
                    return true;
                },
            }, {
                type: 'select',
                title:'单位',
                value: (jQuery(target).css('width').replace(/[\d]+/gmi, '') || 'column'),
                options: [
                    {text: '自动(auto)', value: 'column'},
                    {text: '像素(px)', value: 'px'},
                    {text: '点数(pt)', value: 'pt'},
                    {text: '相对(rem)', value: 'rem'},
                    {text: '百分比(%)', value: '%'},
                ],
                onwatch: function(state, data) {
                    if(data.input.value == 'column'){
                        this.controls[2].type = 'select';
                        setColumnWidth(this.controls[3].value);
                        jQuery(state.target).css('width', null);
                    } else {
                        this.controls[2].type = 'number';
                        unsetColumnWidth();
                        jQuery(state.target).css('width', this.controls[2].value + this.controls[3].value);
                    }
                },
                style: { marginLeft: '7px' },
            }],
        }, {
            label: '高',
            controls: [{
                type: 'number',
                title:'设置最小高度(Set Min Height)',
                text: '最小',
                value: (jQuery(target).css('min-height').replace('px', '')=='0' ? '' : jQuery(target).css('min-height').replace('px', '')),
                options: conf.widthOptions,
                onwatch: function(state, data){

                    if(jQuery(state.target).hasClass('npg-body')){
                        return false;
                    }

                    jQuery(state.target).css('min-height', data.input.value + 'px');
                },
            }, {
                type: 'number',
                title:'设置最大高度(Set Max Height)',
                text: '最大',
                value: (jQuery(target).css('max-height').replace('px', '')=='0' ? '' : jQuery(target).css('max-height').replace('px', '')),
                options: conf.widthOptions,
                onwatch: function(state, data){

                    if(jQuery(state.target).hasClass('npg-body')){
                        return false;
                    }

                    jQuery(state.target).css('max-height', data.input.value + 'px');
                },
            }, {
                type: 'number',
                title:'设置高度(Set Width)',
                text: '高',
                value: jQuery(target).css('height'),
                options: conf.widthOptions,
                style: { marginLeft: '15px' },
                onwatch: function(state, data){

                    if(jQuery(state.target).hasClass('npg-body')){
                        return false;
                    }

                    jQuery(state.target).css('height', data.input.value + this.controls[3].value);
                    return true;
                },
            }, {
                type: 'select',
                title:'单位(Unit)',
                value: jQuery(target).css('height').replace(/[\d]+/gmi, ''),
                options: [
                    {text: '像素(px)', value: 'px'},
                    {text: '点数(pt)', value: 'pt'},
                    {text: '相对(rem)', value: 'rem'},
                    {text: '百分比(%)', value: '%'},
                ],
                style: { marginLeft: '4px' },
                onwatch: function(state, data) {
                    jQuery(state.target).css('height', this.controls[2].value + this.controls[3].value);
                },
            }],
        }, {
            label: '边框',
            controls: [{
                type: 'number',
                title: '设置边框大小(Set Border Size)',
                value: (jQuery(target).css('border-width').replace(/[^\d]+/gmi, '')=='0'?'':jQuery(target).css('border-width').replace(/[^\d]+/gmi, '')),
                text: '大小',
                style: { width: '40px' },
                onwatch: function(state, data) {

                    if(jQuery(state.target).hasClass('npg-body')){
                        return false;
                    }

                    jQuery(state.target).css('border-width', data.input.value + 'px');
                },
            }, {
                type: 'color',
                title: '设置边框颜色(Set Border Color)',
                value: util.colorHex(jQuery(target).css('border-color')),
                text: '颜色',
                onwatch: function(state, data) {

                    if(jQuery(state.target).hasClass('npg-body')){
                        return false;
                    }

                    jQuery(state.target).css('border-color', data.input.value);
                },
            }, {
                type: 'select',
                title: '设置边框样式(Set Border Style)',
                value: jQuery(target).attr('border-style'),
                text: '样式',
                options: [
                    {text: '无  (none)', value: 'none'},
                    {text: '实线(solid)', value: 'solid'},
                    {text: '虚线(dashed)', value: 'dashed'},
                    {text: '点状(dotted)', value: 'dotted'},
                    {text: '双线(double)', value: 'double'},
                    {text: '凹陷(groove)', value: 'groove'},
                    {text: '凸起(ridge)', value: 'ridge'},
                    {text: '继承(inherit)', value: 'inherit'},
                ],
                onwatch: function(state, data) {

                    if(jQuery(state.target).hasClass('npg-body')){
                        return false;
                    }

                    jQuery(state.target).css('border-style', data.input.value);
                },
            }],
        }, {
            label: '圆角',
            controls: [{
                type: 'number',
                title: '设置边框左上圆角(Set Border Left Top Size)',
                value: (jQuery(target).css('border-top-left-radius').replace(/[^\d]+/gmi, '')=='0'?'':jQuery(target).css('border-top-left-radius').replace(/[^\d]+/gmi, '')),
                text: '左上',
                style: { width: '40px' },
                onwatch: function(state, data) {

                    if(jQuery(state.target).hasClass('npg-body')){
                        return false;
                    }

                    jQuery(state.target).css('border-top-left-radius', data.input.value + 'px');
                },
            }, {
                type: 'number',
                title: '设置边框左下圆角(Set Border Left Bottom Size)',
                value: (jQuery(target).css('border-bottom-left-radius').replace(/[^\d]+/gmi, '')=='0'?'':jQuery(target).css('border-bottom-left-radius').replace(/[^\d]+/gmi, '')),
                text: '左下',
                style: { width: '40px' },
                onwatch: function(state, data) {

                    if(jQuery(state.target).hasClass('npg-body')){
                        return false;
                    }

                    jQuery(state.target).css('border-bottom-left-radius', data.input.value + 'px');
                },
            }, {
                type: 'number',
                title: '设置边框右下圆角(Set Border Right Bottom Size)',
                value: (jQuery(target).css('border-bottom-right-radius').replace(/[^\d]+/gmi, '')=='0'?'':jQuery(target).css('border-bottom-right-radius').replace(/[^\d]+/gmi, '')),
                text: '右下',
                style: { width: '40px', marginLeft: '27px' },
                onwatch: function(state, data) {

                    if(jQuery(state.target).hasClass('npg-body')){
                        return false;
                    }

                    jQuery(state.target).css('border-bottom-right-radius', data.input.value + 'px');
                },
            }, {
                type: 'number',
                title: '设置边框右上圆角(Set Border Right Top Size)',
                value: (jQuery(target).css('border-top-right-radius').replace(/[^\d]+/gmi, '')?'':jQuery(target).css('border-top-right-radius').replace(/[^\d]+/gmi, '')),
                text: '右上',
                style: { width: '40px' },
                onwatch: function(state, data) {

                    if(jQuery(state.target).hasClass('npg-body')){
                        return false;
                    }

                    jQuery(state.target).css('border-top-right-radius', data.input.value + 'px');
                },
            }],
        }, {
            label: '边距',
            controls: [{
                type: 'number',
                title: '设置边框左边距(Set Left Margin)',
                value: (jQuery(target).css('margin-left').replace(/[^\d]+/gmi, '')=='0'?'':jQuery(target).css('margin-left').replace(/[^\d]+/gmi, '')),
                text: '左',
                style: { width: '40px' },
                onwatch: function(state, data) {
                    if(jQuery(state.target).hasClass('npg-body')){
                        return false;
                    }

                    _this.store.state.data[5].controls[5].checked = true; //无
                    if(data.input.value == ''){
                        jQuery(state.target).css('margin-left', 'auto');
                        return;
                    }
                    jQuery(state.target).css('margin-left', data.input.value + 'px');
                },
            }, {
                type: 'number',
                title: '设置边框右边距(Set Right Margin)',
                value: (jQuery(target).css('margin-right').replace(/[^\d]+/gmi, '')=='0'?'':jQuery(target).css('margin-right').replace(/[^\d]+/gmi, '')),
                text: '右',
                style: { width: '40px' },
                onwatch: function(state, data) {
                    if(jQuery(state.target).hasClass('npg-body')){
                        return false;
                    }

                    _this.store.state.data[5].controls[5].checked = true; //无
                    if(data.input.value == ''){
                        jQuery(state.target).css('margin-right', 'auto');
                        return;
                    }
                    jQuery(state.target).css('margin-right', data.input.value + 'px');
                },
            }, {
                type: 'radio',
                title: '设置边距左对齐(Set Left Align For Margin)',
                text: '左对齐',
                group:"margin",
                style: { marginLeft: '27px' },
                checked: false,
                hide: (!jQuery(target).css('width') || jQuery(target).css('width').replace(/[^\d]+/gmi, '')=="0" || jQuery(target).css('width').indexOf('%')==-1 ? true : false),
                onwatch: function(state, data) {
                    _this.store.state.data[5].controls[0].value = 0; //左
                    _this.store.state.data[5].controls[1].value = ''; //右
                },
            }, {
                type: 'radio',
                title: '设置边距右对齐(Set Right Align For Margin)',
                text: '右对齐',
                group:"margin",
                checked: false,
                hide: (!jQuery(target).css('width') || jQuery(target).css('width').replace(/[^\d]+/gmi, '')=="0" || jQuery(target).css('width').indexOf('%')==-1 ? true : false),
                onwatch: function(state, data) {
                    _this.store.state.data[5].controls[0].value = ''; //左
                    _this.store.state.data[5].controls[1].value = 0; //右
                },
            }, {
                type: 'radio',
                title: '设置边距居中对齐(Set Center Align For Margin)',
                text: '居中对齐',
                group:"margin",
                style: { marginLeft: '27px' },
                checked: false,
                hide: (!jQuery(target).css('width') || jQuery(target).css('width').replace(/[^\d]+/gmi, '')=="0" || jQuery(target).css('width').indexOf('%')==-1 ? true : false),
                onwatch: function(state, data) {
                    _this.store.state.data[5].controls[0].value = ''; //左
                    _this.store.state.data[5].controls[1].value = ''; //右
                },
            }, {
                type: 'radio',
                title: '无(None)',
                text: '无',
                group:"margin",
                checked: true,
                hide: (!jQuery(target).css('width') || jQuery(target).css('width').replace(/[^\d]+/gmi, '')=="0" || jQuery(target).css('width').indexOf('%')==-1 ? true : false),
            }, {
                type: 'number',
                title: '设置边框下边距(Set Bottom Margin)',
                value: (jQuery(target).css('margin-bottom').replace(/[^\d]+/gmi, '')=='0'?'':jQuery(target).css('margin-bottom').replace(/[^\d]+/gmi, '')),
                text: '下',
                style: { width: '40px', marginLeft: '27px' },
                onwatch: function(state, data) {
                    if(jQuery(state.target).hasClass('npg-body')){
                        return false;
                    }
                    jQuery(state.target).css('margin-bottom', data.input.value + 'px');
                },
            }, {
                type: 'number',
                title: '设置边框上边距(Set Top Margin)',
                value: (jQuery(target).css('margin-top').replace(/[^\d]+/gmi, '')=='0'?'':jQuery(target).css('margin-top').replace(/[^\d]+/gmi, '')),
                text: '上',
                style: { width: '40px' },
                onwatch: function(state, data) {
                    if(jQuery(state.target).hasClass('npg-body')){
                        return false;
                    }
                    jQuery(state.target).css('margin-top', data.input.value + 'px');
                },
            }],
        }, {
            label: '间距',
            controls: [{
                type: 'number',
                title: '设置边框左间距(Set Left Padding)',
                value: (jQuery(target).css('padding-left').replace(/[^\d]+/gmi, '')=='0'?'':jQuery(target).css('padding-left').replace(/[^\d]+/gmi, '')),
                text: '左',
                style: { width: '40px' },
                onwatch: function(state, data) {
                    jQuery(state.target).css('padding-left', data.input.value + 'px');
                },
            }, {
                type: 'number',
                title: '设置边框下间距(Set Bottom Padding)',
                value: (jQuery(target).css('padding-bottom').replace(/[^\d]+/gmi, '')=='0'?'':jQuery(target).css('padding-bottom').replace(/[^\d]+/gmi, '')),
                text: '下',
                style: { width: '40px' },
                onwatch: function(state, data) {
                    jQuery(state.target).css('padding-bottom', data.input.value + 'px');
                },
            }, {
                type: 'number',
                title: '设置边框右间距(Set Right Padding)',
                value: (jQuery(target).css('padding-left').replace(/[^\d]+/gmi, '')=='0'?'':jQuery(target).css('padding-left').replace(/[^\d]+/gmi, '')),
                text: '右',
                style: { width: '40px', marginLeft: '27px' },
                onwatch: function(state, data) {
                    jQuery(state.target).css('padding-left', data.input.value + 'px');
                },
            }, {
                type: 'number',
                title: '设置边框上间距(Set Top Padding)',
                value: (jQuery(target).css('padding-top').replace(/[^\d]+/gmi, '')=='0'?'':jQuery(target).css('padding-top').replace(/[^\d]+/gmi, '')),
                text: '上',
                style: { width: '40px' },
                onwatch: function(state, data) {
                    jQuery(state.target).css('padding-top', data.input.value + 'px');
                },
            }],
        }, {
            label: '浮动',
            controls: [{
                type: 'select',
                title: '设置浮动(Set Float)',
                value: jQuery(target).css('float'),
                text: '浮动',
                options: [
                    {text: '无  (none)', value: 'none'},
                    {text: '左浮动(left)', value: 'left'},
                    {text: '右浮动(right)', value: 'right'},
                ],
                style: { width: '90px' },
                onwatch: function(state, data) {
                    if(jQuery(state.target).hasClass('npg-body')){
                        return false;
                    }

                    jQuery(state.target).css('float', data.input.value);
                },
            }],
        }, {
            label: '段落',
            controls: [{
                type: 'number',
                title: '设置行距(Set Line Spacing)',
                value: (jQuery(target).css('line-height')=='0'?'':jQuery(target).css('line-height')),
                text: '行距',
                style: { width: '40px', marginRight: '0px' },
                onwatch: function(state, data) {
                    jQuery(state.target).css('line-height', data.input.value + 'px');
                },
            }, {
                type: 'number',
                title: '设置缩进(Set Indent)',
                value: (jQuery(target).css('text-indent')=='0'?'':jQuery(target).css('text-indent')),
                text: '缩进',
                style: { width: '40px', marginRight: '0px' },
                onwatch: function(state, data) {
                    jQuery(state.target).css('text-indent', data.input.value + 'px');
                },
            }, {
                type: 'select',
                title: '设置对齐方式(Set Align)',
                value: jQuery(target).css('text-align'),
                text: '对齐',
                style: { width: '40px', marginLeft: '2px', marginRight: '0px' },
                options: [
                    {text: '无  (none)', value: 'none'},
                    {text: '左对齐(left)', value: 'left'},
                    {text: '右对齐(right)', value: 'right'},
                    {text: '两端对齐(ends)', value: 'justify'},
                    {text: '居中对齐(center)', value: 'center'},
                ],
                onwatch: function(state, data) {
                    jQuery(state.target).css('text-align', data.input.value);
                },
            }],
        }, {
            label: '字体',
            controls: [{
                type: 'select',
                title: '设置字体(Set Font Style)',
                value: jQuery(target).css('font-family'),
                text: '字体',
                options: [
                    {text: '默认(default)', value: ''},
                    {text: '宋体(SimSun)', value: 'SimSun'},
                    {text: '微软雅黑(Microsoft YaHei)', value: 'Microsoft YaHei'},
                    {text: '微软正黑体(Microsoft JhengHei)', value: 'Microsoft JhengHei'},
                    {text: '新宋体(NSimSun)', value: 'NSimSun'},
                    {text: '黑体(SimHei)', value: 'SimHei'},
                    {text: '仿宋(FangSong)', value: 'FangSong'},
                    {text: '楷体(KaiTi)', value: 'KaiTi'},
                    {text: '新细明体(PMingLiU)', value: 'PMingLiU'},
                    {text: '细明体(MingLiU)', value: 'MingLiU'},
                    {text: '标楷体(DFKai-SB)', value: 'DFKai-SB'},
                    {text: 'PmingLiu', value: 'PmingLiu'},
                    {text: 'Impact', value: 'Impact'},
                    {text: 'Georgia', value: 'Georgia'},
                    {text: 'Tahoma', value: 'Tahoma'},
                    {text: 'Arial', value: 'Arial'},
                    {text: 'Book Antiqua', value: 'Book Antiqua'},
                    {text: 'Century Gothic', value: 'Century Gothic'},
                    {text: 'Courier New', value: 'Courier New'},
                    {text: 'Times New Roman', value: 'Times New Roman'},
                    {text: 'Verdana', value: 'Verdana'},
                ],
                style: { width: '78px' },
                onwatch: function(state, data) {
                    jQuery(state.target).css('font-family', data.input.value);
                },
            }, {
                type: 'color',
                title: '设置字体颜色(Set Font Color)',
                value: util.colorHex(jQuery(target).css('color')),
                text: '颜色',
                onwatch: function(state, data) {
                    jQuery(state.target).css('color', data.input.value);
                },
            }, {
                type: 'number',
                title: '设置字体大小(Set Font Size)',
                value: (jQuery(target).css('font-size').replace(/[^\d]+/gmi, '')=='0'?'':jQuery(target).css('font-size')),
                text: '大小',
                style: { marginLeft: '27px' },
                onwatch: function(state, data) {
                    jQuery(state.target).css('font-size', data.input.value + this.controls[3].value);
                },
            }, {
                type: 'select',
                title:'单位',
                value: jQuery(target).css('font-size').replace(/[\d]+/gmi, ''),
                options: [
                  {text: '像素(px)', value: 'px'},
                  {text: '点数(pt)', value: 'pt'},
                  {text: '相对(rem)', value: 'rem'},
                  {text: '百分比(%)', value: '%'},
                ],
                onwatch: function(state, data) {
                    jQuery(state.target).css('font-size', this.controls[2].value + this.controls[3].value);
                },
            }],
        }, {
            label: '背景',
            controls: [{
                type: 'color',
                title: '设置背景颜色(Set Background Color)',
                value: util.colorHex(jQuery(target).css('background-color')),
                text: '背景颜色',
                onwatch: function(state, data) {
                    jQuery(state.target).css('background-color', data.input.value);
                },
            }, {
                type: 'color',
                title: '设置背景颜色(Set Background Color)',
                hide: true,
                value: util.colorHex(jQuery(target).attr('bg-color2')),
                text: '渐变颜色',
            }, {
                type: 'select',
                title:'渐变方式',
                value: 0,
                options: [
                    {text: '无  (none)', value: 0},
                    {text: '向右渐变(right)', value: 1},
                    {text: '向左渐变(left)', value: 2},
                    {text: '向上渐变(top)', value: 3},
                    {text: '向下渐变(left)', value: 4},
                ],
                onwatch: function(state, data) {
                    if(data.input.value == 0){
                        this.controls[1].hide = true;
                    } else {
                        this.controls[1].hide = false;
                    }
                },
                style: { width: '69px'},
            }, {
                type: 'text',
                title: '背景图片',
                value: (jQuery(target).css('background-image')=='none'?'':jQuery(target).css('background-image')),
                text: '背景图片地址',
                style: { width: '85px', float: 'left', marginLeft: '25px' },
                onwatch: function(state, data) {
                    jQuery(state.target).css('background-image', 'url('+data.input.value+')');
                },
            }, {
                id: 'bg_img_picker',
                type: 'button',
                title: '选择图片',
                value: '选择',
                text: '图片地址',
                style: { width: '40px'},
                onwatch: function(state, data) {
                    var target = state;
                    var pic_panel = require('m/image-viewer');
                    var el = this;
                    pic_panel.render(jQuery('#bg_img_picker'), {
                        title: '选择图片',
                        siteName: _this.siteName,
                    }, {
                        okText: '确定',
                        closeText: '关闭',
                        ok: function (state, data) {
													el.controls[3].value = data.path;
                          //Vue.set(el.controls, 3, el.controls[3]);
                          state.show = false;
                          el.controls[3].onwatch(target, {
                              attr: el,
                              input: el.controls[3],
                          });
                          el.controls[5].hide = false;
                          el.controls[6].hide = false;
                          el.controls[7].hide = false;
                          el.controls[8].hide = false;
                        },
                        height: 300,
                        width: 400,
                        pos: 'left',
                    });
                },
            }, {
                type: 'select',
                title: '设置背景图片重复(Set Repeat)',
                value: jQuery(target).css('background-repeat'),
                text: '背景重复',
                hide: ((jQuery(target).css('background-image')=='none'?'':jQuery(target).css('background-image'))==''),
                options: [
                    {text: '重复', value: 'repeat'},
                    {text: '横向重复', value: 'repeat-x'},
                    {text: '纵向重复', value: 'repeat-y'},
                    {text: '间隔重复', value: 'space'},
                    {text: '不重复', value: 'no-repeat'},
                ],
                style: { marginLeft: '25px', width: '60px' },
                onwatch: function(state, data) {
                    jQuery(state.target).css('background-repeat', data.input.value);
                },
            }, {
                type: 'select',
                title: '设置背景图片拉伸(Set Repeat)',
                value: jQuery(target).css('background-size'),
                text: '背景拉伸',
                hide: ((jQuery(target).css('background-image')=='none'?'':jQuery(target).css('background-image'))==''),
                options: [
                    {text: '无', value: ''},
                    {text: '比例', value: 'contain'},
                    {text: '平铺', value: 'cover'},
                ],
                style: { width: '60px' },
                onwatch: function(state, data) {
                    jQuery(state.target).css('background-size', data.input.value);
                },
            }, {
                type: 'checkbox',
                title: '设置背景水平居中(Set Center)',
                value: false,
                text: '水平居中',
                hide: ((jQuery(target).css('background-image')=='none'?'':jQuery(target).css('background-image'))==''),
                style: { marginLeft: '25px', width: '60px' },
                onwatch: function(state, data) {
                    if(data.input.value){
                        jQuery(state.target).css('background-position-x', 'center');
                    }else{
                        jQuery(state.target).css('background-position-x', '0');
                    }
                },
            }, {
                type: 'checkbox',
                title: '设置背景垂直居中(Set Vertical Center)',
                value: false,
                text: '垂直居中',
                hide: ((jQuery(target).css('background-image')=='none'?'':jQuery(target).css('background-image'))==''),
                onwatch: function(state, data) {
                    if(data.input.value){
                        jQuery(state.target).css('background-position-y', 'center');
                    }else{
                        jQuery(state.target).css('background-position-y', '0');
                    }
                },
            }],
        }, {
            label: '表格',
            controls: [{
                type: 'number',
                title: '设置表格行数(Set Table Rows)',
                value: jQuery(target).attr('rows'),
                text: '行数',
            }, {
                type: 'number',
                title: '设置表格列数(Set Table Columns)',
                value: jQuery(target).attr('cols'),
                text: '列数',
            }],
        }, {
            label: '链接',
            labelStyle: { float: 'left', position: 'absolute' },
            controls: [{
                type: 'text',
                title: '设置链接(Set Anchor)',
                value: jQuery(target).attr('href'),
                text: '链接地址',
                style: { position: 'absolute', zIndex: 1, marginLeft: '27px', marginTop: '0px', borderBottomRightRadius: '0px', borderTopRightRadius: '0px' },
                onwatch: function(state, data) {
                    jQuery(state.target).attr('href', data.input.value);
                },
            }, {
                type: 'select',
                title: '下拉选择锚点(Set Anchor)',
                style: { position: 'absolute', zIndex: 0, marginLeft: '26px', marginTop: '0px', width: '125px' },
                options: [
                    {text: 'a1', value: '#a1'},
                    {text: 'a2', value: '#a2'},
                ],
                onwatch: function(state, data) {
                    if(data.input.value){
                        this.controls[0].value = data.input.value;
                    }
                },
            }],
        }, {
            label: '表单',
            style: { paddingTop:'20px' },
            controls: [{
                type: 'text',
                title: '表单控件验证提示文字(Tips)',
                value: jQuery(target).attr('tips'),
                text: '验证提示文字',
                style: {width:'72px'},
            }, {
                type: 'select',
                title: '表单控件验证方式(Set Verification Mode)',
                options: [
                    {text: '无 (None)', value: "[\w\W]*"},
                    {text: '邮箱(Email)', value: "^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$"},
                    {text: '电话(Phone)', value: "^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$"},
                    {text: '手机(Mobile)', value: "^((\(\d{2,3}\))|(\d{3}\-))?13\d{9}$"},
                    {text: '身份证(Id Card)', value: "^\d{15}(\d{2}[A-Za-z0-9])?$"},
                    {text: 'QQ号码(QQ Number)', value: "^[1-9]\d{4,8}$"},
                    {text: '数字(Number)', value: "^\d+$"},
                    {text: '金额(Currency)', value: "^\d+(\.\d+)?$"},
                    {text: '链接地址(Url)', value: "^((https|http|ftp|rtsp|mms)?://)?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?(([0-9]{1,3}.){3}[0-9]{1,3}|([0-9a-z_!~*'()-]+.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].[a-z]{2,6})(:[0-9]{1,4})?((/?)|(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$"},
                    {text: '英文(English)', value: "^\d+(\.\d+)?$"},
                    {text: '中文(Chinese)', value: "^[\u0391-\uFFE5]+$"},
                    {text: '帐号(Acount)', value: "^[a-z]\w{3,}$"},
                    {text: '自定义(Custom)', value: "" },
                ],
                style: {width:'49px'},
                onwatch: function(state, data) {
                    if(!data.input.value){
                        this.controls[2].type = 'text';
                    } else {
                        this.controls[2].type = 'hidden';
                    }

                    this.controls[2].value = data.input.value;
                },
            }, {
                type: 'hidden',
                value: '',
                title: '设置表单控件验证规则(Set Verification Rules)',
                value: jQuery(target).attr('regexp'),
                text: '正则表达式',
                style: {marginLeft: '25px', width: '135px'},
            }, {
                type: 'checkbox',
                value: '',
                title: '设置为必填项(Require)',
                value: ".+",
                text: '必填',
                style: {marginLeft: '25px'},
            }, {
                type: 'checkbox',
                title: '忽略区分大小写(Ignore Case)',
                value: jQuery(target).attr('i'),
                text: '忽略大小写',
            }, {
                type: 'checkbox',
                value: '',
                title: '匹配多行(Multi Line)',
                value: jQuery(target).attr('g'),
                text: '匹配多行',
                style: {marginLeft: '25px'},
            }],
        }, {
            label: '事件',
            controls: [{
                type: 'button',
                title: '设置单击事件(Set Click Event)',
                value: '单击(Click)',
                style: { width: '130px' },
            }, {
                type: 'button',
                title: '设置双击事件(Set Double-click Event)',
                value: '双击(Double-click)',
                style: { width: '130px', marginLeft: '27px' },
            }],
        }, {
            label: '数据绑定',
            hide: true,
        }, {
            label: '', //留空一行
            style: {height: '10px', display:'block'},
        }];

        return attrs;
    }

    exports.render = function (e, target, siteName) {

        if (!e) return;

        selector = e;

        exports.siteName = siteName;

        //存储状态
        exports.store = new Vuex.Store({
            state: {
                target: target,
                data: getData(target),
            },
            mutations: {
                attrBlur: function (state, data) {

                    var v = false;
                    var input = data.input;
                    if (input.regexp) {

                        if(data.input.value){
                            if (jQuery.isFunction(input.regexp)) {
                                v = input.regexp.call(data.event, data.input.value)
                            } else {
                                var matchs = data.input.value.match(input.regexp);
                                v = (matchs && matchs.length && matchs.length > 0);
                            }
                        }
                    }

                    if (data.input.value && v) {
                        jQuery(data.event.currentTarget).css({"border":"1px solid #ff8f8f"});
                        return false;
                    }

                    jQuery(data.event.currentTarget).css({"border":"1px solid #d9d9d9"});

                    if (input.onwatch && jQuery.isFunction(input.onwatch)) {
                        input.onwatch.call(data.attr, state, data);
                    }

                    return true;
                },

                attrClick: function (state, data) {

                    var input = data.input;
                    if (input.onwatch && jQuery.isFunction(input.onwatch)) {
                        input.onwatch.call(data.attr, state, data);
                    }
                },
                attrChange: function (state, data) {

                    var input = data.input;
                    if (input.onwatch && jQuery.isFunction(input.onwatch)) {
                        input.onwatch.call(data.attr, state, data);
                    }
                },
            }
        });

        //初始化组件
        $(selector).view('site-design/attrs', function (vue) {

            exports.currentComponent = new vue({
                el: this.selector,
                data: _this.store.state,
                props: ['model'],
                methods: {

                    attrBlur: function (e, i, j){

                        if (!_this.store.state.data ||
                            !_this.store.state.data[i] ||
                            !_this.store.state.data[i].controls ||
                            !_this.store.state.data[i].controls[j]) {
                            return false;
                        }

                        _this.store.commit('attrBlur', {
                            attr: _this.store.state.data[i],
                            input: _this.store.state.data[i].controls[j],
                            event: e
                        });
                    },
                    attrClick: function (e, i, j) {

                        if (!_this.store.state.data ||
                            !_this.store.state.data[i] ||
                            !_this.store.state.data[i].controls ||
                            !_this.store.state.data[i].controls[j]) {
                            return false;
                        }

                        _this.store.commit('attrClick', {
                            attr: _this.store.state.data[i],
                            input: _this.store.state.data[i].controls[j],
                            event: e
                        });
                    },
                    attrChange: function (e, i, j) {

                        if (!_this.store.state.data ||
                            !_this.store.state.data[i] ||
                            !_this.store.state.data[i].controls ||
                            !_this.store.state.data[i].controls[j]) {
                            return false;
                        }

                        _this.store.commit('attrChange', {
                            attr: _this.store.state.data[i],
                            input: _this.store.state.data[i].controls[j],
                            event: e
                        });
                    },
                },
                mounted: function () { //组件挂载完成

                }
            });
        });

        return _this;
    };
});
