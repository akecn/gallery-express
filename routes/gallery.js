/**
 * GET gallery docs.
 */
var path = require('path'),
	fs = require('fs'),
	marked = require('marked'),
	shell = require('shelljs'),
	GitHubApi = require("github"),
	mime = require('./mime');
var DB = './gallery-db/';
var component = require('./component');
var github = new GitHubApi({
	version: "3.0.0",
	timeout: 5000
});

github.authenticate({
	type: "oauth",
	token: "fa54fd27365f90a9932285323805a6b59568f474"
});

function renderMD(urlPath, postTitle, res) {
	log('target file: ' + urlPath);
	fs.readFile(urlPath, 'utf8', function(err, data) {
		if (err) {
			readFileError(res, err);
		} else {
			log('ready for render md file');
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
}

function renderStatic(urlPath, res) {
	log('target file: ' + urlPath);
	fs.readFile(urlPath, 'binary', function(err, data) {
		if (err) {
			readFileError(res, err);
		} else {
			log('ready to response static file');
			var ext = path.extname(urlPath);
			ext = ext ? ext.slice(1) : 'unknown';
			var contentType = mime.types[ext] || 'text/plain';
			res.writeHead(200, {
				'Content-Type': contentType
			});
			res.write(data, 'binary');
			res.end();
			log('response end');
		}
	});
}

function readFileError(res, err) {
	log('read file error');
	res.render('404', {
		title: '404',
		word: err,
		pretty: true
	});
}

function fileNotFound(res, urlPath) {
	log('file not found');
	res.render('404', {
		title: '404',
		word: 'file not exist: ' + urlPath,
		pretty: true
	});
}

function log(text) {
	var t = new Date().toLocaleString();
	fs.exists('log.txt', function(exists) {
		if (exists) {
			fs.appendFileSync('log.txt', t + ': ' + text + '\t\r\n');
		} else {
			fs.writeFileSync('log.txt', t + ': ' + text + '\t\r\n');
		}
	});
}

exports.guide = function(req, res, next) {
	log('request for guide');
	var baseUrl = process.cwd(),
		urlPath = path.resolve(baseUrl, DB+'readme.md');

	renderMD(urlPath, 'Kissy Gallery组件开发规范说明', res);

};

exports.quickstart = function(req, res, next) {
	log('request for quickstart');
	var baseUrl = process.cwd(),
		urlPath = path.resolve(baseUrl, DB+'quick-start.md');
	renderMD(urlPath, '十五分钟开发一个kissy组件', res);
};


exports.clear = function(req, res, next) {
	var t = new Date().toLocaleString();
	var tag = new Date().getTime();
	fs.renameSync('log.txt', 'log_' + tag + '.txt');
	fs.writeFileSync('log.txt', 'clear at: ' + t + ', old file tag: ' + tag);
	res.writeHead(200, {
		'Content-Type': 'text/plain'
	});
	res.write('log file is clear, old log file is renamed log_' + tag + '.txt');
	res.end();
};



exports.syncSingle = function(req, res, next) {
	log('request for single sync');

	var reposName = req.params.name;
	var reposUrl = 'https://github.com/kissygalleryteam/' + reposName + '.git';
	log('target repos: ' + reposName);

	res.writeHead(200, {
		'Content-Type': 'text/plain'
	});

	if (reposName === 'gallery-express') {
		res.write('cannot operate repos gallery-express');
		res.end();
		return;
	}

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
                    var text;
					if (code === 0) {
						log('git pull success');
						log('output: ' + output);
                        text = output + '\ngit pull success from ' + reposUrl;
					} else {
						log('git pull fail');
						log('output: ' + output);
                        text = output + '\ngit pull fail from ' + reposUrl;
					}
                   component.sync(req,res,text);
				});
			} else {
				log('repos not exist on server, begin git clone');
				shell.exec('git clone ' + reposUrl, function(code, output) {
                    var text;
                    if (code === 0) {
                        log('git clone success');
                        log('output: ' + output);
                        text = output + '\ngit clone success from ' + reposUrl;
                    } else {
                        log('git clone fail');
                        log('output: ' + output);
                        text = output + '\ngit clone fail from ' + reposUrl;
                    }
                    component.sync(req,res,text);
				});
			}
		}
	});
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

	var urlPathOp = urlPath.replace('.md', '.html');

	fs.exists(urlPath, function(exists) {
		if (exists) {
			renderMD(urlPath, title, res);
		} else {
			fs.exists(urlPathOp, function(existsOp) {
				if (existsOp) {
					renderStatic(urlPathOp, res);
				} else {
					fileNotFound(res, urlPath);
				}
			});
		}
	});
};

exports.staticfile = function(req, res, next) {
	log('request for file');
	var filePath = req.params[0],
		baseUrl = process.cwd();

	var urlPath = path.resolve(baseUrl, './' + filePath);

	fs.exists(urlPath, function(exists) {
		if (exists) {
			renderStatic(urlPath, res);
		} else {
			fileNotFound(res, urlPath);
		}
	});
};
//拉取gallery-db的数据
exports.dbSync = function(req, res, next) {
    log('pull gallery-db.');

    if (!shell.which('git')) {
        shell.echo('Sorry, this script requires git');
        shell.exit(1);
    }
    shell.exec('cd gallery-db && git pull', function(code, output) {
        if (code === 0) {
            log('git pull gallery-db success');
            log('output: ' + output);
            res.write('git pull gallery-db success,output:'+output);
            res.end();
        } else {
            log('git pull gallery-db fail');
            log('output: ' + output);
            res.write('git pull gallery-db fail,output:'+output);
            res.end();
        }
    });
};
//显示gallery-db下的文档
exports.dbMd = function(req, res, next) {
    var md = req.params.name;
    var url = DB+md;
    url = url.replace(/\.html$/,'.md');
    console.log(url);
    renderMD(url,md, res);
};