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
var fs = require('fs');

var fileName = 'C:\\Windows\\System32\\drivers\\etc\\hosts';

function test(){

	var path = 'C:\\Windows\\System32\\drivers\\etc\\test';

	// 删除文件
	fs.unlink(path, function(){});

	fs.writeFileSync(path, '');
}

exports.test = test;

exports.write = function(ip, domain){

	var data = fs.readFileSync(fileName, "utf-8");

	if(data === undefined || data === null)
		data = '';

	var reg = new RegExp('\\s*'+ip.replace('.','\.')+'\\s+'+domain.replace('.','\.'), 'gmi');

	data = data.replace(reg, '');

	data = data + '\r\n'+ip+'         '+domain+'\r\n';

	exports.writeAll(data);

};

exports.writeAll = function(data){
	try{

		fs.exists(fileName, function(exists){

			if(exists){
				// 删除文件
				fs.unlink(fileName, function(){
					fs.writeFileSync(fileName, data, {
                        flags: 'w',
                        encoding: 'utf-8',
                        mode: 0777,
                        autoClose: true
                    });
				});
			} else {

                fs.writeFileSync(fileName, data, {
                    flags: 'w',
                    encoding: 'utf-8',
                    mode: 0777,
                    autoClose: true
                });
			}
		});

		return true;
	}catch(e){
		console.log('hosts has been init fail!');

		return false;
	}
};

exports.writeData = function (data) {
    try {

        fs.writeFileSync(fileName, data, {
            flags: 'w',
            encoding: 'utf-8',
            mode: 0777,
            autoClose: true
        });

        return true;
    } catch (e) {
        console.log('hosts has been init fail!');

        return false;
    }
};

exports.read = function(){

	try
	{
		var data = fs.readFileSync(fileName, "utf-8");

		if(data === undefined || data === null)
			data = '';

		return data;
	}
	catch(e)
	{
		console.log('fail to read hosts: '+fileName);
		return '';
	}
};
