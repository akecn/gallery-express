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
	log('target file: ' + urlPath);
	fs.exists(urlPath, function(exists) {
		if (exists) {
			fs.readFile(urlPath, 'utf8', function(err, data) {
				if (err) {
					log('file read error');
					res.render('404', {
						title: '404',
						word: err,
						pretty: true
					});
				} else {
					log('ready for render file');
					var tokens = marked.lexer(data);
					var htmlContent = marked.parser(tokens);
					res.render('show', {
						title: postTitle,
						blogContent: htmlContent,
						pretty: true
					});
					log('render finished');
				}
			});
		} else {
			log('file not found');
			res.render('404', {
				title: '404',
				word: 'file not exist: ' + urlPath,
				pretty: true
			});
		}
	});
}

function log(text) {
	var t = new Date().toLocaleString();
	fs.exists('log.txt', function(exists) {
		if (exists) {
			fs.appendFileSync('log.txt', t + ': ' + text + '\t\r\n', function(err) {
				if (err) {
					console.log(err);
				}
			});
		} else {
			fs.writeFileSync('log.txt', t + ': ' + text + '\t\r\n', function(err) {
				if (err) {
					console.log(err);
				}
			});
		}
	});
}

exports.guide = function(req, res, next) {
	log('request for guide');
	var baseUrl = process.cwd(),
		urlPath = path.resolve(baseUrl, './gallery-express/readme.md');

	renderMD(urlPath, 'Kissy Gallery组件开发规范说明', res);

};

exports.quickstart = function(req, res, next) {
	log('request for quickstart');
	var baseUrl = process.cwd(),
		urlPath = path.resolve(baseUrl, './gallery-express/quick-start.md');

	renderMD(urlPath, '十五分钟开发一个kissy组件', res);

};

exports.sync = function(req, res, next) {
	log('request for sync');
	/*res.render('sync', {
		title: 'sync',
		pretty: true
	});*/

	var reposName = req.params[0];
	var reposUrl = 'https://github.com/kissygalleryteam/' + reposName + '.git';
	// var io = socket.listen(server);
	log('target repos: ' + reposName);

	res.writeHead(200, {
		'Content-Type': 'text/plain'
	});

	if (reposName === 'gallery-express') {
		res.write('cannot operate repos gallery-express');
		res.end();
		return;
	}

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
			log('error to get repos from github');
			res.write('error to find repos: ' + reposUrl);
			res.end();
		} else {
			log('success to get repos from github');
			if (!shell.which('git')) {
				shell.echo('Sorry, this script requires git');
				shell.exit(1);
			}

			if (shell.test('-d', reposName)) {
				log('repos exists on server, begin git pull');
				shell.exec('cd ' + reposName + ' && git pull', function(code, output) {
					if (code === 0) {
						log('git pull success');
						res.write('git pull success\nfrom ' + reposUrl);
						res.end();
					} else {
						log('git pull fail');
						res.write('git pull fail\nfrom ' + reposUrl);
						res.end();
					}
				});
			} else {
				log('repos not exist on server, begin git clone');
				shell.exec('git clone ' + reposUrl, function(code, output) {
					if (code === 0) {
						log('git clone success');
						res.write('git clone success\nfrom ' + reposUrl);
						res.end();
					} else {
						log('git clone fail');
						res.write('git clone fail\nfrom ' + reposUrl);
						res.end();
					}
				});
			}
		}
	});

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
	log('request for doc');
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
	log('request for file');
	var filePath = req.params[0],
		baseUrl = process.cwd();

	var urlPath = path.resolve(baseUrl, './' + filePath);
	log('target file: ' + urlPath);

	fs.exists(urlPath, function(exists) {
		if (exists) {
			fs.readFile(urlPath, 'binary', function(err, data) {
				if (err) {
					log('read file error');
					res.render('404', {
						title: '404',
						word: err,
						pretty: true
					});
				} else {
					log('ready to response');
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
			log('file not found');
			res.render('404', {
				title: '404',
				word: 'file not exist: ' + urlPath,
				pretty: true
			});
		}
	});
};