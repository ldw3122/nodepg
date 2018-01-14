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
﻿

exports.parseRange = function (str, size) {

    if (str.indexOf(",") != -1) {

        return;
    }

    var range = str.split("-"),

        start = parseInt(range[0], 10),
        end = parseInt(range[1], 10);

    // Case: -100
    if (isNaN(start)) {

        start = size - end;
        end = size - 1;

    // Case: 100-
    } else if (isNaN(end)) {
        end = size - 1;
    }

    // Invalid

    if (isNaN(start) || isNaN(end) || start > end || end > size) {
        return;
    }

    return {start: start, end: end};

};

var conf = false;
exports.config = function(callback){

	if(conf){
		if(callback){
			callback(conf);
		}
		return conf;
	}

	var fs = require('fs');
	var get = function(path){

		var ensure = function(){
			conf.root = conf.root || '.';
			conf.zip = conf.zip.toLowerCase();
			conf.db =  isLibPath ?
			__dirname + '/../' + conf.db.replace(/\\/gmi,'/') :
			__dirname + '/' + conf.db.replace(/\\/gmi,'/');
		};

		var isLibPath = path.indexOf('../')==0;

		conf = require(path);

		var listen = conf.listen || 80;

		var cache = isLibPath ?
			require("../lib/Cache/Cache").createCache("LRU", 100 * 100 * 10) :
			require("./lib/Cache/Cache").createCache("LRU", 100 * 100 * 10);

		var path = isLibPath ?
			__dirname + '/../' + conf.root + '/config.json' :
			__dirname + '/' + conf.root + '/config.json';

		var webConfig = cache.get('NSP_CONFIG');
		if(webConfig){
			conf = webConfig;
			conf.cache = cache;
			conf.cache.set('NSP_CONFIG', webConfig, 1000 * 60);
			ensure();
			callback(conf);
			return;
		}

		fs.exists(path, function(exists) {
			if (exists) {
				var json = fs.readFileSync(path);
				var webConfig = JSON.parse(json);
				if(!webConfig.debug){
					cache.set('NSP_CONFIG', webConfig, 1000 * 60);
				}
				conf = webConfig;
				conf.cache = cache;
				conf.listen = listen;
			}
			ensure();
			callback(conf);
		});
	};

	if(__dirname.indexOf('lib')==__dirname.length-3){
		get('../package.json');
	}else{
		get('./package.json');
	}
};


exports.error = function(err, response){

	exports.config(function(){

		if(!err){
			return;
		}
		console.log(err.message);
		console.log(err.stack);

		if(!response){
			return;
		}

		if(conf.debug){
			response.end(err.stack);
		}else{
			response.end(err.message);
		}

	});
};
