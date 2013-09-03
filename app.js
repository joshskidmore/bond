
 //		 ____                  _ 
 //		|  _ \                | |
 //		| |_) | ___  _ __   __| |
 //		|  _ < / _ \| '_ \ / _` |
 //		| |_) | (_) | | | | (_| |
 //		|____/ \___/|_| |_|\__,_|


GLOBAL.config = require(process.argv[2] || './config.json');

var express = require('express'),
	routes = require('./routes'),
	http = require('http'),
	path = require('path'),
	sockjs = require('sockjs'),
	bond = require('./lib');


var app = express();


var sockjs_opts = {
	sockjs_url: '/js/sockjs-0.3.4.17.g95f4.js'
};

var sockjs_echo = sockjs.createServer(sockjs_opts);

sockjs_echo.on('connection', function(conn) {
    conn.on('data', function(message) {
    	console.log('inc message',message);
        conn.write(message);
    });
});



// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('1m3nkm1kn2k'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

var server = http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});


sockjs_echo.installHandlers(server, {prefix:'/echo'});

console.log(' [*] Listening on 0.0.0.0:9999' );
server.listen(9999, '127.0.0.1');
