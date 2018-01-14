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

    var _this = this;

    var profile ={
        root: './nodepg'
    };

    exports.getWebConfig = function () {
        var path = 'web/config.json';

        return _this.getJson(path);
    };

    exports.saveWebConfig = function (data) {
        var path = 'web/config.json';

        var fs = window.require('fs');
        for (var name in data.sites) {
            var fullpath = profile.root + '/web/' + name;
            if (fs.existsSync(fullpath))
                continue;

            fs.mkdirSync(fullpath, 0777);
        }

        _this.saveJson(path, data);
    };

    exports.rename = function(path1, path2){

        if(!path1 || !path2)
            return;

        path1 = profile.root + '/' + path1;
        path2 = profile.root + '/' + path2;
        var fs = window.require('fs');
        fs.rename(path1, path2);
    };

    exports.mkdir = function (path) {
        var fs = window.require('fs');

        var fullpath = profile.root + '/' + path;

        fs.mkdirSync(fullpath, 0777);
    };

    exports.getWeb = function () {
        var root = { name: 'root', children : [], open: true, isDir: true, title: '', isSite: false, isRoot: true };

        var conf = _this.getWebConfig();

        for (var name in conf.sites) {
            var path = './web/' + name;
            root.children.push({
                name: name,
                children : _this.getDirs(path, 'gen'),
                fullpath: path,
                open: true,
                isDir: true,
                title: name + ':' + conf.sites[name].port,
                isSite: true,
                isRoot: false,
                port: conf.sites[name].port,
            });
        }

        return root;
    };

    exports.getImages = function(siteName){
        var root = { name: 'root', children : [], open: true, isDir: true, title: '', isSite: false, isRoot: true };

        var conf = _this.getWebConfig();

        for (var name in conf.sites) {

            if(siteName!=name){
                continue;
            }

            var path = './web/' + name;
            root.children.push({
                name: name,
                children : _this.getDirs(path, 'gen', ['jpg', 'jpeg', 'png', 'gif', 'jpe', 'jp2']),
                fullpath: path,
                open: true,
                isDir: true,
                title: name + ':' + conf.sites[name].port,
                isSite: true,
                isRoot: false,
                port: conf.sites[name].port,
            });
        }

        return root;
    };

    exports.rmdir = function (path) {

        var fs = window.require('fs');

        path = profile.root + '/' + path;

        var files = [];

        if (fs.existsSync(path)) {

            files = fs.readdirSync(path);

            files.forEach(function (file, index) {

                var curPath = path + "/" + file;

                if (fs.statSync(curPath).isDirectory()) { // recurse

                    deleteFolderRecursive(curPath);

                } else { // delete file

                    fs.unlinkSync(curPath);

                }
            });

            fs.rmdirSync(path);
        }
    };

    exports.unlink = function(path){

        var fs = window.require('fs');

        path = profile.root + '/' + path;
        if (fs.existsSync(path)) {

            fs.unlinkSync(path);
        }
    };

    exports.getDirs = function (path, filter, fileTypes) {
        var fs = window.require('fs');
        var mypath = profile.root + '/' + path + '/';

        var paths = fs.readdirSync(mypath);
        var children = [];
        for (var i = 0; i < paths.length; i++) {
            if (filter && filter.indexOf(paths[i]) > -1)
                continue;

            var stat = fs.lstatSync(mypath + "/" + paths[i]);
            var isDir = stat.isDirectory();
            if(!isDir && fileTypes && fileTypes.length > 0){
                var arr = paths[i].split('.');
                if(!arr || !arr.length || arr.length < 1)
                    continue;

                var suffix = arr[arr.length - 1];

                if (fileTypes.indexOf(suffix) == -1)
                    continue;
            }

            var type = '', isSite = _this.isSite(path);
            if (isSite) {
                type = '网站(Site)';
            } else if (isDir) {
                type = '目录(Dir)';
            } else {
                type = '文件(file)';
            }

            children.push({ name: paths[i], title: type + '：' + paths[i], fullpath: path + '/' + paths[i], isSite: isSite, open: false, children: [], isDir: isDir, size: stat.size });
        }

        return children;
    };

    exports.isSite = function (path) {

        var folder = path;
        if (path.indexOf("./") == 0)
            folder = path.substring(2);

        return folder.toLowerCase() == 'web';
    };

    exports.getStore = function (name) {
        var path = profile.root + '/admin/js/store/' + name + '.json';

        return _this.getJson(path);
    };

    exports.getJson = function (path) {
        var str = _this.fsRead(path);
        return JSON.parse(str);
    };

    exports.saveJson = function (path, data) {
        _this.fsWrite(path, JSON.stringify(data, null, 4));
    };

    exports.fsExists = function (path, isAbsolute) {

        try
        {
            if(!isAbsolute){
                path = profile.root + '/' + path + '/';
            }

            var fs = window.require('fs');
            fs.accessSync(path, fs.F_OK);

            return true;
        }
        catch(e){
            return false;
        }
    }

    exports.imgRead = function (path, isAbsolute) {

        var fullpath = (isAbsolute ? path : profile.root + '/' + path + '/');

        var fs = window.require('fs');
        var bin = fs.readFileSync(fullpath);

        var data = new Buffer(bin).toString('base64');

        var base64 = 'data:image;base64,' + data;

        return base64;
    };

    exports.fsRead = function (path, isAbsolute) {

        var fullpath = (isAbsolute ? path : profile.root + '/' + path + '/');

        var fs = window.require('fs');
        var bin = fs.readFileSync(fullpath);

        if (bin[0] === 0xEF && bin[1] === 0xBB && bin[2] === 0xBF) {
            bin = bin.slice(3);
        }

        var str = bin.toString('utf-8');

        return str;
    };

    exports.fsWrite = function (path, text, isAbsolute) {

        var fullpath = (isAbsolute ? path : profile.root + '/' + path + '/');

        var fs = window.require('fs');

        fs.writeFileSync(fullpath, text);
    };

    exports.saveImage = function (path, text, isAbsolute) {

        var fullpath = (isAbsolute ? path : profile.root + '/' + path + '/');

        var fs = window.require('fs');

        var base64Data = text.replace(/^data:image\/\w+;base64,/, '');

        var dataBuffer = new Buffer(base64Data, 'base64');

        fs.writeFileSync(fullpath, dataBuffer);
    };

    exports.copy = function(path1, path2){

        var data = _this.fsRead(path1);
        _this.fsWrite(path2, data);
    };

    exports.isUrl = function (str_url) {
        var strRegex = '^((https|http|ftp|rtsp|mms)?://)'
            + '?(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?' //ftp的user@
            + '(([0-9]{1,3}.){3}[0-9]{1,3}' // IP形式的URL- 199.194.52.184
            + '|' // 允许IP和DOMAIN（域名）
            + '([0-9a-z_!~*\'()-]+.)*' // 域名- www.
            + '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' // 二级域名
            + '[a-z]{2,6})' // first level domain- .com or .museum
            + '(:[0-9]{1,4})?' // 端口- :80
            + '((/?)|' // a slash isn't required if there is no file name
            + '(/[0-9a-z_!~*\'().;?:@&=+$,%#-]+)+/?)$';

        var re = new RegExp(strRegex);
        //re.test()
        if (re.test(str_url)) {
            return (true);
        } else {
            return (false);
        }
    };

    //-------------------------------------
		/*RGB颜色转换为16进制*/
		exports.colorHex = function(val){
			var that = val;
			//十六进制颜色值的正则表达式
			var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
			// 如果是rgb颜色表示
			if (/^(rgb|RGB)/.test(that)) {
				var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
				var strHex = "#";
				for (var i=0; i<aColor.length; i++) {
					var hex = Number(aColor[i]).toString(16);
					if (hex === "0") {
						hex += hex;
					}
					strHex += hex;
				}
				if (strHex.length !== 7) {
					strHex = that;
				}
				return strHex;
			} else if (reg.test(that)) {
				var aNum = that.replace(/#/,"").split("");
				if (aNum.length === 6) {
					return that;
				} else if(aNum.length === 3) {
					var numHex = "#";
					for (var i=0; i<aNum.length; i+=1) {
						numHex += (aNum[i] + aNum[i]);
					}
					return numHex;
				}
			}
			return that;
		};

		//-------------------------------------------------

		/*16进制颜色转为RGB格式*/
		exports.colorRgb = function(val){
			var sColor = val.toLowerCase();
			//十六进制颜色值的正则表达式
			var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
			// 如果是16进制颜色
			if (sColor && reg.test(sColor)) {
				if (sColor.length === 4) {
					var sColorNew = "#";
					for (var i=1; i<4; i+=1) {
						sColorNew += sColor.slice(i, i+1).concat(sColor.slice(i, i+1));
					}
					sColor = sColorNew;
				}
				//处理六位的颜色值
				var sColorChange = [];
				for (var i=1; i<7; i+=2) {
					sColorChange.push(parseInt("0x"+sColor.slice(i, i+2)));
				}
				return "RGB(" + sColorChange.join(",") + ")";
			}
			return sColor;
		};
});
