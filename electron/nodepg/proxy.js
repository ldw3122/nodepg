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

// Module to create native browser window.
var BrowserWindow;
var common = require('./lib/common');
var serverHost = new Array();
var hasError = null;

exports.start = function(electron){

	try{
		console.log("starting server...");
		if(BrowserWindow && !hasError
			&& serverHost && serverHost.length){
			return;
		}

		BrowserWindow = electron.BrowserWindow;

		var domain = require('domain');
		var EventEmitter = require('events').EventEmitter;

		var e = new EventEmitter();

		var timer = setTimeout(function () {
			e.emit('data');
		}, 10);

		var fn = function(){

			common.config(function(conf){

				if(!ensureHosts()) { //确保域名解析
					var msg = 'fail to start proxy server!';
					console.log(msg);
					throw msg;
				}

				startService(); //开启服务

				var http = require('http'),
					httpProxy = require('./lib/http-proxy/index.js');

				// Create a proxy server with custom application logic
				var proxy = httpProxy.createProxyServer({});


				// Create your custom server and just call `proxy.web()` to proxy
				// a web request to the target passed in the options
				// also you can use `proxy.ws()` to proxy a websockets request

				var server = http.createServer(function(req, res) {
					// You can define here your custom logic to handle the request
					// and then proxy the request.

					var host = req.headers.host.replace(/^(http\:\/\/|https\:\/\/)?(\w[\w\d.]+)(\:\d+)$/, '$2');

					var target = 'http://127.0.0.1:' + conf.sites[host].port;
					proxy.web(req, res, { target: target });
				});

				//代理服务器监听端口
				server.listen(conf.listen);
				console.log("started proxy for listening on port " + conf.listen);
			});
		};

		var d = domain.create();
		d.on('error', function (err) {
			console.log(err.message + '\n');
			hasError = true;
		});

		d.add(e);
		d.add(timer);

		d.run(fn);
	}
	catch(e){
		console.log(e.stack);
	}
};

exports.stop = function(electron){

	if(!serverHost)
		return;

	for(var host in serverHost){
		if(!serverHost[host])
			continue;

		serverHost[host].close();

		console.log(host + ' has been closed.');
	}

	hasError = null;
    serverHost = new Array();

    releaseHosts();

	console.log('service has been stoped.');
};

exports.runServer = function(host){

	if(!serverHost)
		return;

	if(serverHost[host])
		return;

	openWindow(host);
};

exports.closeServer = function(host){

	if(!serverHost)
		return;

	if(!serverHost[host])
		return;

	serverHost[host].close();
};

function ensureHosts(){
	console.log("ensure hosts...");
	var hosts = require("./lib/hosts");
	var data = hosts.read();
	var config = common.config();

	for(var domain in config.sites){

		console.log("host for "+domain+"...");
		var reg = new RegExp('\\s*127\.0\.0\.1\\s+'+domain.replace('.','\.'), 'gmi');

		data = data.replace(reg, '');

		data = data + '\r\n127.0.0.1         '+domain+'\r\n';

		console.log(data);
	}

	if(!hosts.writeAll(data)){
		return false;
	}

	return true;
}

function releaseHosts() {
    console.log("ensure hosts...");
    var hosts = require("./lib/hosts");
    var data = hosts.read();
    var config = common.config();

    for (var domain in config.sites) {

        console.log("host for " + domain + "...");
        var reg = new RegExp('\\s*127\.0\.0\.1\\s+' + domain.replace('.', '\.'), 'gmi');

        data = data.replace(reg, '');

        console.log(data);
    }

    if (!hosts.writeData(data)) {
        return false;
    }

    return true;
}

function debug(domain){

	var config = common.config();
	if(config.debug){
		// Open the DevTools.
		serverHost[domain].webContents.openDevTools();
	}
}

function startService(){

	var config = common.config();

	if(!config.sites)
		return;

	for(var domain in config.sites){

		//serverHost window
		openWindow(domain, config.sites[domain].port);
	}

}

function openWindow(domain, port){

	serverHost[domain] = new BrowserWindow({width: 800, height: 600, show:false, title:domain});
	serverHost[domain].loadURL('file://' + __dirname + '/admin/start.html?port='+port);
	serverHost[domain].on('closed', function () {
		serverHost[domain] = null;
	});
	debug(domain);
}

function ready(){
	if(null == hasError){
		return false;
	}
	return !hasError;
}
