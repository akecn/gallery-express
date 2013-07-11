var express = require('express'),
    http = require('http');

app = express();
server = http.createServer(app);

var index = require('./routes/index'),
    gallery = require('./routes/gallery'),
    receive = require('./routes/receive'),
    path = require('path');
var scan = require('./scan');
scan.init('.');

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

app.get('/guide', gallery.guide);

app.get('/quickstart', gallery.quickstart);

app.post('/receive/write', receive.write);

app.get('/receive/commits', receive.commits);

app.get('/receive/log', receive.log);
app.get('/components/info-sync', scan.sync);
app.get('/clearlog', gallery.clear);
//app.get('/repos', gallery.getRepos);

// app.get('/sync', gallery.sync);

app.get(/^\/sync\/(.+)$/, gallery.syncSingle);

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