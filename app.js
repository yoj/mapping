
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/foo/:id', routes.sample1);
app.get('/nodetest/:param', routes.node);

/*http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});*/
// Socket.IO
var server = http.createServer(app);
var io = require('socket.io').listen(server);
server.listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});

var chats = [];
var sockets = {};

var latlng = new Array();

// broadcast function
function broadcast(method, message){
	for(var n in sockets){
		sockets[n].emit(method, message);
	}
}

// ネームスペースの利用
io
.of('/chat')
.on('connection', function(socket){
	sockets[socket.id] = socket;
	// イベント着火 (データ送信)
	socket.emit('chat.list', latlng);
	// イベント検知 (データ受信)
	socket.on('chat.add', function(data){
		latlng.push(data);
		broadcast('chat.add', data);
	});
	socket.on('disconnect', function(){
		delete sockets[socket.id]
	});
});

app.get('/socket', function(req, res){
	res.render('socketio', {title: 'Socket.IO DEMO'});
});
