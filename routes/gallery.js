/**
 * GET gallery docs.
 */
var path = require('path'),
	fs = require('fs'),
	marked = require('marked'),
	shell = require('shelljs'),
	GitHubApi = require("github"),
	// socket = require('socket.io'),
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

exports.sync = function(req, res, next) {
	/*res.render('sync', {
		title: 'sync',
		pretty: true
	});*/

	var reposName = req.params[0];
	var reposUrl = 'https://github.com/kissygalleryteam/' + reposName + '.git';
	// var io = socket.listen(server);

	res.writeHead(200, {
		'Content-Type': 'text/plain'
	});

	if (reposName === 'gallery-express') {
		res.write('cannot operate repos gallery-express');
		res.end();
		return;
	} else {
		var github = new GitHubApi({
			version: "3.0.0",
			timeout: 5000
		});

		github.authenticate({
			type: "oauth",
			token: "7d9e8064e9b3e5d5311c6eabe9fcf6d1243481f8"
		});

		github.repos.get({
			user: 'kissygalleryteam',
			repo: reposName
		}, function(err) {
			if (err) {
				console.log('err');
				res.write('error to find repos ' + reposUrl);
				res.end();
			} else {
				console.log('ok');

				if (!shell.which('git')) {
					shell.echo('Sorry, this script requires git');
					shell.exit(1);
				}

				if (shell.test('-d', reposName)) {
					console.log('update');
					shell.exec('cd ' + reposName + ' && git pull', function(code, output) {
						if (code === 0) {
							console.log('success');
							res.write('git pull success\nfrom ' + reposUrl);
							res.end();
						} else {
							console.log('fail');
							res.write('git pull fail\nfrom ' + reposUrl);
							res.end();
						}
					});
				} else {
					console.log('add');
					shell.exec('git clone ' + reposUrl, function(code, output) {
						if (code === 0) {
							console.log('success');
							res.write('git clone success\nfrom ' + reposUrl);
							res.end();
						} else {
							console.log('fail');
							res.write('git clone fail\nfrom ' + reposUrl);
							res.end();
						}
					});
				}
			}
		})
	}
	/*io.sockets.on('connection', function (socket) {
		var github = new GitHubApi({
			version: "3.0.0",
			timeout: 5000
		});

		github.authenticate({
			type: "oauth",
			token: "7d9e8064e9b3e5d5311c6eabe9fcf6d1243481f8"
		});

		github.repos.get({
			user: 'kissygalleryteam',
			repo: reposName
		}, function(err) {
			if (err) {
				console.log('err');
				socket.emit('error', { error: err.message });
			} else {
				console.log('ok');
				socket.emit('start', { repos: reposUrl });
				
				if (!shell.which('git')) {
					shell.echo('Sorry, this script requires git');
					shell.exit(1);
				}

				if (shell.test('-d', reposName)) {
					shell.rm('-rf', reposName)
				}

				shell.exec('git clone ' + reposUrl, function(code, output) {
					if (code === 0) {
						console.log('success');
						socket.emit('success');
					} else {
						console.log('fail');
						socket.emit('fail');
					}
				});
			}
		})
	});*/
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