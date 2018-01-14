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


var fs = require('fs'),
    http = require('http'),
	formidable = require("./lib/formidable");

var MIME = require('./mime.json');

var server = null;

var zlib = require("zlib");

var common = require("./lib/common");

var parser = require('./lib/jshtml/Parser');


function start(){

	common.config(function(conf){

		var match = document.URL.match(/port=(\d+)/);
		var port = match && match[1] ? match[1] : '80';

		var httpServer = http.createServer(function (req, res) {

			try{

				if(req.url == '/'){
					req.url = req.url + conf['default'];
				}

				var host = req.headers.host.replace(/^(http\:\/\/|https\:\/\/)?(\w[\w\d.]+)(\:\d+)$/, '$2');

				var urlInfo = parseURL(__dirname + '/' + conf.root + '/' + host, req.url);

				validateFiles(urlInfo.path, function (err, path) {
					if (err) {
						res.writeHead(404);
						if(conf.debug){
							common.error(err, res);
						}else{
							res.end('no such file or directory');
						}
					} else {
						ready(urlInfo, req, res);
					}
				});
			}
			catch(e){
				if(conf){
					res.end(e.stack);
				}
			}

		});

		process.on('uncaughtException', function (err) {
		    require('electron').ipcRenderer.send('error', err);
		});

		httpServer.listen(port);

	});
}

function preRender(req, res, path, mime, reader){

	var url = require("url");
	var querystring = require("querystring");
	var urlParsed = url.parse(req.url);
	if(urlParsed.query){
		//getData 为object类型 同名表单为array
		req.queryString = querystring.parse(urlParsed.query);
	}

	var form = new formidable.IncomingForm();
	var post = {}, file = {};
	form.uploadDir = '/tmp';  //文件上传 临时文件存放路径

	form
	.on('error', function(err) {
		common.error(err, res);
	})
	 //POST 普通数据 不包含文件 field 表单name value 表单value
	.on('field', function(field, value) {
		if (form.type == 'multipart') {  //有文件上传时 enctype="multipart/form-data"
			if (field in post) { //同名表单 checkbox 返回array 同get处理
				if (util.isArray(post[field]) === false) {
					post[field] = [post[field]];
				}
				post[field].push(value);
				return;
			}
		}
		post[field] = value;
	})
	.on('file', function(field, file) { //上传文件
		file[field] = file;
	})
	.on('end', function() {
		req.file = file;
		req.form = post;
		render(req, res, path, mime, reader);
	});

	form.parse(req); //解析request对象
}

function ready(urlInfo, req, res) {

	var conf = common.config();

	var reader = getReaderInfo(urlInfo.path, req);

	if(reader.state == 200){
		if(!reader.stream){
			preRender(req, res, urlInfo.path, urlInfo.mime, reader);
			return true;
		}
	}

	else if(reader.state == 206){
		setHeaders(206, "Partial Content", reader.range, reader.stream, res, urlInfo.mime);
	}

	else {
		setHeaders(416, "Request Range Not Satisfiable", reader.range, reader.stream, res, urlInfo.mime);
		return false;
	}

	if (conf.zip == 'gzip') {

		reader.stream.pipe(zlib.createGzip()).pipe(res, { end: false });

	} else if (conf.zip == 'deflate') {

		reader.stream.pipe(zlib.createDeflate()).pipe(res, { end: false });

	} else {
		reader.stream.pipe(res, { end: false });
	}

	reader.stream.on('end', function() {
		res.end();
	});

	return true;
}

function getReaderInfo(path, req){

	if (suffixName(path)=='npg') {
		return {'stream': false, 'state':200};
	}

	if(req.headers["range"]){

		var range = common.parseRange(req.headers["range"], stats.size);

		if (range) {

			var stream = fs.createReadStream(path, {"start": range.start, "end": range.end});

			return {'stream': stream, 'state':206, 'range':range};

		} else {

			return {'stream': false, 'state':416, 'range':range};
		}
	}else{

		var stream = fs.createReadStream(path);

		return {'stream': stream, 'state':200, 'range':false};
	}

}

function setHeaders(state, content, range, stream, res, mime){

	var conf = common.config();

	if (range){
		res.setHeader("Content-Range", "bytes " + range.start + "-" + range.end);
		res.setHeader("Content-Length", (range.end - range.start + 1));
	}else{
		res.removeHeader("Content-Length");
	}
	res.setHeader("Server", "Node Server Page");
	res.setHeader('Accept-Ranges', 'bytes');
	res.setHeader("Content-Type", mime);
	res.setHeader("Content-Encoding", conf.zip);

	if (range && stream){
		res.writeHead(stream, state, content);
	}else{
		res.writeHead(state, content);
	}
}

function render(req, res, viewPath, mime, reader){

	try{

		var conf = common.config();

		console.log(viewPath);

		var parsed = conf.cache.get('view:'+viewPath) || '';

		if(!parsed){

			var view = getView(viewPath);

			var exp = /(res.setHeader\(['"]Content-Type['"]\s*,\s*['"])([^'"]+)(['"]\s*\);?)/gmi;
			var mimes = view.match(exp);
			if(mimes && mimes.length){
				view = view.replace(exp, '');
				mime = mimes[mimes.length - 1].replace(exp, '$2');
			}

			var viewParser = new parser(function(code) {
				parsed += code;
			}, {});



			setHeaders(200, "ok", reader.range, reader.stream, res, mime);

			viewParser.end(view);

			if(!parsed){
				res.end();
				return true;
			}else{
				parsed = parsed.replace(/write\s*\(\s*['"]<\s*script>?['"]\s*\);.*type=\\['"]text\/nodepg\\['"][^<>]*?\s*write\(["']>(\\n)?['"]\);\s*([\w\W]+?)\s*write\(\s*['"]<\/\s*script\s*>(\\n)?['"]\s*\);/gmi, '$2');
				parsed += "res.end();";
				conf.cache.set('view:'+viewPath, parsed);
			}
		}

		var write = function(html){
			try{
				if(html === undefined){
					return;
				}
				res.write(html.toString());
			}catch(err){
				common.error(err, res);
			}
		};

		var finder = require("./lib/low-finder.js").finder;
		var db = new finder();
		db.setResponse(res);

		var fn = new Function('require', 'write', 'req', 'res', 'cache', 'common', 'db', parsed);
		fn(false, write, req, res, conf.cache, common, db);
	}
	catch(err){
		common.error(err, res);
	}
}

function getView(viewPath){

	var conf = common.config();
	if(!conf.debug){
		var view = conf.cache.get(viewPath);
		if(view){
			return view;
		}
	}

	var view = fs.readFileSync(viewPath, conf.charset);
	if(!conf.debug){
		conf.cache.set(viewPath, view, 1000 * 60);
	}

	return view;
}

function suffixName(path){
	return path.substring(path.lastIndexOf('.')+1);
}

function validateFiles(path, callback) {

	fs.stat(path.replace('..', ''), function (err, stats) {
		if (err) {
			callback(err);
		} else if (!stats.isFile()) {
			callback(new Error());
		} else {
			callback(null, path);
		}

	});

}

function parseURL(root, url) {
    var base, base2, paths, paths2, parts, parts2, source;

    if (url.indexOf('??') === -1) {
        url = url.replace('/', '/??');
    }

    source = url;
    var suffix = suffixName(url);
    if (suffix == 'npgd') {
        url = '/gen/page' + url.substr(0, url.lastIndexOf('.')) + '.npg';
    } else if (suffix == 'napi') {
        url = '/gen/api' + url.substr(0, url.lastIndexOf('.')) + '.npg';
    }

    parts = url.split('??');
    parts2 = source.split('??');
    base = parts[0];
    base2 = parts2[0];
    paths = parts[1].split(',').map(function (value) {
        return require('path').join(root, base, value);
    });
    paths2 = parts2[1].split(',').map(function (value) {
        return require('path').join(root, base2, value);
    });
	var params = '';
    var path = paths[0];
    var path2 = paths2[0];
	var arr = path.split(/\?/gmi);
	if(arr.length == 2){
		path = arr[0];
		params = arr[1];
    }

    var arr2 = path2.split(/\?/gmi);
    if (arr2.length == 2) {
        path2 = arr[0];
    }

    if (!require('fs').existsSync(path)) {
        path = path2;
    }

    return {
        mime: MIME[require('path').extname(path).toLowerCase()] || 'text/plain',
        path: path,
		params:	  params
    };
}

start();
