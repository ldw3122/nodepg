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

    exports.render = function(selector, target, models) {

        var data = [{
            name: '布局(Layout)',
            class: 'fa fa-columns',
            id: 'layout',
        }, {
            name: '层(Layer)',
            class: 'fa fa-object-ungroup',
            id:  'layer',
        }, {
            name: '段落(Paragraph)',
            class: 'fa fa-align-justify',
            id: 'paragraph',
        }, {
            name: '链接(Link)',
            class: 'fa fa-link',
            id: 'link',
        }, {
            name: '表单控件(Form Control)',
            class: 'fa fa-newspaper-o',
            id: 'form',
        }, {
            name: '表格(Table)',
            class: 'fa fa-table',
            id: 'table',
        }, {
            name: '图片(Image)',
            class: 'fa fa-image',
            id: 'image',
        }, {
            name: '视频(Video)',
            class: 'fa fa-video-camera',
            id: 'video',
        }, {
            name: '动画(Animation)',
            class: 'fa fa-play',
            id: 'animation',
        }, {
            name: '声音(Voice)',
            class: 'fa fa-volume-up',
            id: 'voice',
        }];

        if(models && models.length && models.length > 0){
          data = data.concat(models);
        }

        //存储状态
        exports.store = new Vuex.Store({
          state: {
              data : data,
              selector: selector,
          }
        });

        //初始化组件
        $(selector).view('site-design/tools', function (vue) {

            exports.currentComponent = new vue({
              el: this.selector,
              data: { data: _this.store.state.data },
              store: _this.store
            });

            _this.currentComponent.$nextTick(function(){

              //delete target event
              $(window.document).off('keyup');
              $(window.document).on('keyup', function(event){
                 switch(event.keyCode) {
                   case 46:
                   jQuery('.npg-body .npg-design-actived').remove();
                   break;
                 }
              });

              $('.npg-page-body .npg-design').off('click');
              $('.npg-page-body .npg-design').on('click', function(e){
                jQuery('.npg-page-body .npg-design-actived').removeClass('npg-design-actived');

                var item;
                if(jQuery(e.target).hasClass('npg-design')){
                  item = jQuery(e.target);
                }

                else {
                  item = jQuery(e.target).parents('.npg-design').first();
                }

                if(item){
                  jQuery(item).addClass('npg-design-actived');
                  return;
                }
              });

              $('[name=site-design] .tools .tools-panel .icon-button').off('dragstart');
              $('[name=site-design] .tools .tools-panel .icon-button').on('dragstart', function(e){
                  console.log('dragstart');
                  e.originalEvent.dataTransfer.setData('icon', jQuery(e.target).attr('id'));
              });


              $('.npg-page-body .npg-design').off('dragover');
              $('.npg-page-body .npg-design').on('dragover', function(e){

                e.originalEvent.preventDefault();

                console.log('dragover');

                if(_this.target == e.target){
                  return;
                }
                _this.target = e.target;
              });


              $('body').off('dragleave');
              $('body').on('dragleave', function(e){
                console.log('dragleave');
                if(e.target != _this.target){
                    if(!jQuery(this).hasClass('npg-design')){
                      jQuery('.npg-page-bg').css({overflow: 'auto'});
                    }
                }
              });


              $('body').off('drop');
              $('body').on('drop', function(e){
                console.log('drop');
                console.log(e.target);

                jQuery('.npg-page-bg').css({overflow: 'auto'});

                var icon = e.originalEvent.dataTransfer.getData('icon');
                if(icon == 'layout'){
                  appendLayout(e.target);
                }

                else if(icon == 'layer'){
                  appendLayer(e.target);
                }
              });
            });
        });
    };

    function appendLayout(trigger){

      var layout = jQuery('<div class="npg-container npg-design npg-layout" style="display:block;width:100%;height:auto">&nbsp;</div>');
      var targetWidth = jQuery(trigger).width();
      var width = (targetWidth - 12) / targetWidth * 100 + '%';
      layout.width(width);

      if(jQuery(trigger).html().indexOf('&nbsp;') == 0){
        jQuery(trigger).html(jQuery(trigger).html().substr(6));
      }
      jQuery(trigger).append(layout);
    }


    function appendLayer(target){

      var layer = jQuery('<table class="npg-design npg-layer" border="0" cellspacing="0" cellpadding="0"></table>');
      var row1 = jQuery('<tr></tr>');
      row1.append('<td class="npg-layer-top-left npg-layer-resize"></td>');
      row1.append('<td align="center"><div class="npg-layer-top npg-layer-resize"></div></td>');
      row1.append('<td class="npg-layer-top-right npg-layer-resize"></td>');

      var row2 = jQuery('<tr></tr>');
      row2.append('<td><div class="npg-layer-left npg-layer-resize"></div></td>');
      row2.append('<td><div class="npg-container npg-layer-body">&nbsp;</div></td>');
      row2.append('<td><div class="npg-layer-right npg-layer-resize"></div></td>');

      var row3 = jQuery('<tr></tr>');
      row3.append('<td class="npg-layer-bottom-left npg-layer-resize"></td>');
      row3.append('<td align="center"><div class="npg-layer-bottom npg-layer-resize"></div></td>');
      row3.append('<td class="npg-layer-bottom-right npg-layer-resize"></td>');

      layer.append(row1);
      layer.append(row2);
      layer.append(row3);

      if(jQuery(target).hasClass('npg-layer')){
        jQuery('.npg-page-body .npg-body').append(layer);
        return true;
      }

      //获得页面滚动的距离；
      //注：document.documentElement.scrollTop为支持非谷歌内核；document.body.scrollTop为谷歌内核
      var thisScrollTop = document.documentElement.scrollTop + document.body.scrollTop;
      event = event||window.event;
      //获得相对于对象定位的横标值 = 鼠标当前相对页面的横坐标值 - 对象横坐标值；
      x = event.clientX - $('.filemanager').width() - $('#zxxScaleRulerV').width();
      //获得相对于对象定位的纵标值 = 鼠标当前相对页面的纵坐标值 - 对象纵坐标值 + 滚动条滚动的高度；
      y = event.clientY - $('.npg-title.header').height() + thisScrollTop;

      layer.css({top:y+'px', left:x+'px'});

      jQuery('.npg-page-body .npg-body').append(layer);
    }
});
