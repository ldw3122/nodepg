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
var common = require("./common");
var lowdb = require('./lowdb/');
var storage = require('./lowdb/file-async');
var response = null, database = function(){}, init = false;

function finder(){

}

finder.prototype.use = function(dbName){
	try{
		if(init)return;

		if(!dbName){
			dbName = 'test';
		}

		database = lowdb(common.config().db + '/' + dbName + '.json', { storage });

		init = true;
	}
	catch(err){
		var msg = 'Can not find the db path(' + common.config().db.replace('/../', '/').replace(/\\/gmi,'/') + ')<br/>';
		console.log(msg);
		if(response){
			response.write(msg);
		}
		common.error(err, response);
	}
};

finder.prototype.setResponse = function(res){
	try{
		response = res;
	}
	catch(err){
		common.error(err, response);
	}
};

finder.prototype.table = function(tableName){
	try{
		return database(tableName);
	}
	catch(err){
		common.error(err, response);
	}
};

finder.prototype.update = function(tableName, whereSet, valueSet){
	try{
		database(tableName).chain().find(whereSet).assign(valueSet);
	}
	catch(err){
		common.error(err, response);
	}
};

exports.finder = finder;
