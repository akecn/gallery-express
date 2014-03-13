var express = require('express');
var http = require('http');
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

var index = require('./routes/index'),
    gallery = require('./routes/gallery'),
    receive = require('./routes/receive'),
    path = require('path');
var component = require('./routes/component');
var api = require('./routes/api');
var tag = require('./routes/tag');
if (cluster.isMaster) {
    console.log('[master] ' + "start master...");

    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('death', function(worker) {
        process.nextTick(function () {
            cluster.fork();
        });
    });

    cluster.on('fork', function (worker) {
        console.log('[master] ' + 'fork: worker' + worker.id);
    });

    cluster.on('online', function (worker) {
        console.log('[master] ' + 'online: worker' + worker.id);
    });
    cluster.on('exit', function (worker, code, signal) {
        console.log('[master] ' + 'exit worker' + worker.id + ' died');
    });

} else if (cluster.isWorker) {
    console.log('[worker] ' + "start worker ..." + cluster.worker.id);
    var app = express();
    var server = http.createServer(app);

    process.on('message', function(msg) {
        console.log('[worker] '+msg);
        process.send('[worker] worker'+cluster.worker.id+' received!');
    });

    app.configure(function() {
        app.set('port', 80);
        app.set('views', __dirname + '/views');
        app.set('view engine', 'jade');
        app.use(express.favicon());
        app.use(express.logger('dev'));
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(require('less-middleware')({
            src: __dirname + '/public'
        }));
        app.use(express.static(path.join(__dirname, 'public')));
        app.use(app.router);
    });

    app.configure('development', function() {
        app.use(express.errorHandler());
    });

    app.get('/', index.index);
    app.get('/list', index.list);
    app.get('/coms', index.coms);

    app.get('/guide', gallery.guide);
//同步gallery-db库
    app.get('/db/sync', gallery.dbSync);
    app.get('/guide/:name', gallery.dbMd);
    app.get('/quickstart', gallery.quickstart);
    app.get('/api/version',api.version);
//获取所有最新的组件列表
    app.get('/api/coms', api.coms);
    app.get('/api/index-ad', api.indexAd);
    app.get('/api/search', api.search);

    app.post('/receive/write', receive.write);

    app.get('/receive/commits', receive.commits);

    app.get('/receive/log', receive.log);
    app.get('/component/info-sync/:name', component.sync);
    app.get('/component/all-sync', component.syncAll);
    app.get('/component/info/:name', component.getInfo);
    app.get('/clearlog', gallery.clear);

    app.get('/sync/:name', gallery.syncSingle);
    app.get('/tag/:name', tag.coms);

    /*var rCom = require('./routes/com');
     app.get('/test',rCom.all );*/

    app.get(/^((?:\/[^\/]+)+)\/([^\/]+)\/guide(?:\/(?:([^\/\.]+)(?:\.html)?)?)?$/, gallery.docs);

    app.get(/^(.+)$/, gallery.staticfile);


    app.get('*', function(req, res) {
        res.render('404', {
            title: '404',
            word: 'something seems error...',
            pretty: true
        });
    });

    server.listen(80, function() {
        console.log("Express server listening on port " + 80);
    });

}
