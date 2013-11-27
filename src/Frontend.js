
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

var dbHelper = require(__dirname + '/DBHelper');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res){
  res.render('home.jade');
});

app.get('/tasks', function(req, res){
  res.render('tasks.jade');
});

io.sockets.on('connection', function (socket) {
	console.log("connected");

		socket.on("activatePhysicalButton", function() {
			process.emit('#eventCatched', {"listener":"UIButton01","condition":"pressed"});
		})

		// socket.on('printTest', function () {
		// 	console.log("Test");
		// 	dbHelper.getTaskList(function(res) {
		// 		socket.emit('taskIdList', res);
		// 	});
		// 	// var data = { 'message' : 'test', pseudo : 'nik' };
		//  //      socket.emit('message', data);
		//  //      console.log("user nik send message");
		// });
});

// function startButtonListeners(socket, listeners) {
// 	for(var pos in listeners) {
// 		console.log("Starts listener for " + listeners[pos].listenerName);
// 		console.log('listeners[pos].uiType');
// 		console.log(listeners[pos].uiType);
// 		if(listeners[pos].uiType === "button") {
// 			console.log('listeners[pos].listenerName');
// 			console.log(listeners[pos].listenerName);
// 			socket.on(listeners[pos].listenerName, function() {
// 				console.log("event catched");
// 				process.emit('#eventCatched', {"listener" : listeners[pos].listenerName, "condition" : "pressed"});
// 			});
// 		}
// 	}
// }

// app.get('/taskConfig/:taskId', function(req, res) {
// 	res.render('task.jade', {taskId: req.params.taskId});

// })

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
