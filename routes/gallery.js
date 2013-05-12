/**
 * GET gallery docs.
 */
var path = require('path'),
	fs = require('fs'),
	marked = require('marked'),
	mime = require('./mime');

function renderMD(urlPath, postTitle, res) {
	fs.exists(urlPath, function(exists) {
		if (exists) {
			fs.readFile(urlPath, 'utf8', function(err, data) {
				if (err) {
					res.render('404', {
						title: '404',
						word: err,
						pretty: true
					});
				} else {
					var tokens = marked.lexer(data);
					var htmlContent = marked.parser(tokens);
					res.render('show', {
						title: postTitle,
						blogContent: htmlContent,
						pretty: true
					});
				}
			});
		} else {
			res.render('404', {
				title: '404',
				word: 'file not exist: ' + urlPath,
				pretty: true
			});
		}
	});
}

exports.guide = function(req, res, next) {
	var baseUrl = process.cwd(),
		urlPath = path.resolve(baseUrl, './gallery-express/readme.md');

	renderMD(urlPath, 'Kissy Gallery组件开发规范说明', res);

};

exports.quickstart = function(req, res, next) {
	var baseUrl = process.cwd(),
		urlPath = path.resolve(baseUrl, './gallery-express/quick-start.md');

	renderMD(urlPath, '十五分钟开发一个kissy组件', res);

};

exports.docs = function(req, res, next) {
	var gallery = req.params[0],
		index = gallery.lastIndexOf('/'),
		title = index === -1 ? gallery : gallery.substring(index + 1),
		version = req.params[1],
		filename = req.params[2] ? req.params[2] : 'index',
		baseUrl = process.cwd();

	var urlPath = path.resolve(baseUrl, './' + gallery, './' + version, './guide/' + filename + '.md');

	renderMD(urlPath, title, res);

};

exports.staticfile = function(req, res, next) {
	var filePath = req.params[0],
		baseUrl = process.cwd();

	var urlPath = path.resolve(baseUrl, './' + filePath);

	fs.exists(urlPath, function(exists) {
		if (exists) {
			fs.readFile(urlPath, 'binary', function(err, data) {
				if (err) {
					res.render('404', {
						title: '404',
						word: err,
						pretty: true
					});
				} else {
					var ext = path.extname(filePath);
					ext = ext ? ext.slice(1) : 'unknown';
					var contentType = mime.types[ext] || 'text/plain';
					res.writeHead(200, {
						'Content-Type': contentType
					});
					res.write(data, 'binary');
					res.end();
				}
			});
		} else {
			res.render('404', {
				title: '404',
				word: 'file not exist: ' + urlPath,
				pretty: true
			});
		}
	});
}