/**
 * GET gallery docs.
 */
var path = require('path'),
	fs = require('fs'),
	marked = require('marked');

exports.guide = function(req, res, next) {
	var baseUrl = process.cwd(),
		urlPath = path.resolve(baseUrl, './gallery-express/readme.md');

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
						title: 'Kissy Gallery组件开发规范说明',
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
};

exports.docs = function(req, res, next) {
	var gallery = req.params[0],
		index = gallery.lastIndexOf('/'),
		title = index === -1 ? gallery : gallery.substring(index + 1),
		version = req.params[1],
		filename = req.params[2] ? req.params[2] : 'index',
		baseUrl = process.cwd();

	var urlPath = path.resolve(baseUrl, './' + gallery, './' + version, './guide/' + filename + '.md');

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
						title: title,
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
};

exports.demo = function(req, res, next) {
	var gallery = req.params[0],
		index = gallery.lastIndexOf('/'),
		title = index === -1 ? gallery : gallery.substring(index + 1),
		version = req.params[1],
		filePath = req.params[2],
		baseUrl = process.cwd();

	var urlPath = path.resolve(baseUrl, './' + gallery, './' + version, './demo/' + filePath);
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
					if(filePath.indexOf('html') !== -1){
						res.setHeader("Content-Type", "text/html");
					}
					else if(filePath.indexOf('css') !== -1){
						res.setHeader("Content-Type", "text/css");
					}
					else if(filePath.indexOf('js') !== -1){
						res.setHeader("Content-Type", "application/javascript");
					}
					res.end(data);
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
};