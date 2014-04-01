var express = require('express'),
    http = require('http');

app = express();
server = http.createServer(app);

var index = require('./routes/index'),
    gallery = require('./routes/gallery'),
    receive = require('./routes/receive'),
    path = require('path');
var component = require('./routes/component');
var api = require('./routes/api');
var tag = require('./routes/tag');
app.configure(function() {
    app.set('port', process.env.PORT || 3000);
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
app.get('/api/tag-coms/:name', api.tagComs);

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

server.listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});
process.on('uncaughtException', function (err) {
    console.log(err.stack);
    process.exit();
});
