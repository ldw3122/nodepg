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

    var $ = jQuery;

    var _this = this;

    exports.render = function (callback) {

        var options = (callback ? callback : {});
        if (jQuery.isFunction(callback)) {
            options = {};
            options.callback = callback;
        }
        var resizeCenter = function () {

            $('#app .content .workspace').width($(window).width() - $('#app .content .page-toggle-panel').width())

            var width = $('#app .content .workspace').width() - ($('#app .content .filemanager:visible').width() + $('#app .content .tools:visible').width());
            $('#app .content .center').width(width - 5);

            $('.site-list').height($('.workspace-panel').height() - 20);

            if ($('.fitWidth').parents('.ui-resizable').size() > 0) {
                var el = $('.fitWidth').parents('.ui-resizable').first();
                el.find('.fitWidth').width(el.width() - 17);
            } else {
                $('.fitWidth').width('auto');
            }

            $('.fitHeight').each(function () {
                var list = $(this).siblings();
                if (!list) return;

                var height = 0;
                for (var i = 0; i < list.length; i++) {
                    if ($(list[i]).is(':visible')) {
                        height = height + $(list[i]).height();
                    }
                }

                height = $(this).parent().height() - height;
                if (height && height > 0) {
                    $(this).height(height);
                }
            });
        };

        var layout = function () {

            $('#app .content .workspace .ui-resizable-handle').show();
            $('#app .content').css({ height: $(window).height() - $('#app .header:visible').height() - 2, marginTop: 2 });
            $('#app .content .workspace').css({ height: $(window).height() - 90, marginTop: 2 });
            $('#app .content .workspace .workspace-panel:visible').css({ height: $(window).height() - 90, marginTop: 2 });
            $('#app .content .page-toggle-button').css({ height: $(window).height() - 90, marginTop: 2 });
            $('#app .content .workspace').width($('#app .content').width() - $('#app .content .page-toggle-panel:visible').width() - 5);
            resizeCenter();

            $('#app .content .filemanager').resizable('option', 'maxWidth', $('#app .content .workspace').width() - ($('#app .content .tools:visible').width()) - 200);

            var eventToRight = function () {
                if ($(this).parents('.ui-resizable').first().width() > 5) {
                    $(this).find('i').first().removeClass('toright').addClass('toleft');
                    $(this).parents('.ui-resizable').first().attr('currentWidth', $(this).parents('.ui-resizable').first().width());
                    $(this).parents('.ui-resizable').first().css({ overflow: 'hidden', width: '5px' });
                } else {
                    $(this).find('i').first().removeClass('toleft').addClass('toright');
                    $(this).parents('.ui-resizable').first().css({ overflow: 'hidden', width: $(this).parents('.ui-resizable').first().attr('currentWidth') });
                }

                resizeCenter();
            };

            var eventToLeft = function () {
                if ($(this).parents('.ui-resizable').first().width() > 5) {
                    $(this).find('i').first().removeClass('toleft').addClass('toright');
                    $(this).parents('.ui-resizable').first().attr('currentWidth', $(this).parents('.ui-resizable').first().width());
                    $(this).parents('.ui-resizable').first().css({ overflow: 'hidden', width: '5px' });
                } else {
                    $(this).find('i').first().removeClass('toright').addClass('toleft');
                    $(this).parents('.ui-resizable').first().css({ overflow: 'hidden', width: $(this).parents('.ui-resizable').first().attr('currentWidth') });
                }

                resizeCenter();
            };

            $('#app .content .workspace .ui-resizable-e').html($('<p><i class="toleft"></i></p>').mousedown(eventToLeft));
            $('#app .content .workspace .ui-resizable-w').html($('<p><i class="toright"></i></p>').mousedown(eventToRight));

            $('#app .content .page-toggle-panel').resizable({ maxWidth: 55, minWidth: 55, handles: 'w', disabled: true });
            $('#app .content .page-toggle-panel .ui-resizable-w').html($('<p><i class="toright"></i></p>').mousedown(eventToRight));
        }

        $(window).resize(layout);

        layout();

        if ($.isFunction(options.callback)) {
            options.callback.call(layout);
        }

        return _this;
    };


});
