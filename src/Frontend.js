
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

var dbHelper = require(__dirname + '/DBHelper');
var pluginHelper = require(__dirname + '/PluginHelper');

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

	io.sockets.once('connection', function (socket) {
		socket.on("activatePhysicalButton", function() {
			process.emit('#eventCatched', {"listener":"UIButton01","condition":"pressed"});
		});
	});
});

app.get('/tasks', function(req, res){
  	res.render('tasks.jade');
	io.sockets.once('connection', function (socket) {

		dbHelper.getTaskList(function(res) {
			socket.emit('taskIdList', res);
		});

		socket.on("getTaskConfig", function(taskId) {
			socket.emit('getAvailablePlugins', pluginHelper.getListOfPluginNames());
			dbHelper.getTaskConfig(taskId, function(taskConfig) {
				console.log("Test");
				socket.emit('getTaskConfigResult', taskConfig);
			});

		});

		socket.on("updateTaskConfig", function(taskConfig) {
			dbHelper.updateTaskConfig(taskConfig, function() {
			});
		});
	});
});

app.get('/events', function(req, res){
  	res.render('events.jade');
	io.sockets.once('connection', function (socket) {
		socket.emit('getAvailablePlugins', pluginHelper.getListOfPluginNames());
		dbHelper.getEventListenerNames(function(res) {
			socket.emit('listenerNamesList', res);
		});

		socket.on("getEventConfig", function(eventId) {
			// socket.emit('getAvailablePlugins', pluginHelper.getListOfPluginNames());
			dbHelper.getEventListenerConfig(eventId, function(eventListenerConfig) {
				console.log(eventListenerConfig);
				socket.emit('getEventListenerConfigResult', eventListenerConfig);
			});

		});

		socket.on("updateEventListenerConfig", function(eventListenerConfig) {
			console.log(1);
			dbHelper.updateEventListenerConfig(eventListenerConfig, function() {
				console.log(2);
				dbHelper.getEventListenerNames(function(res) {
					socket.emit('listenerNamesList', res);
				});
			});
		});
	});
});

app.get('/eventgroups', function(req, res){
  	res.render('eventgroups.jade');
	io.sockets.once('connection', function (socket) {

		dbHelper.getEventGroupList(function(res) {
			socket.emit('eventGroupsIdList', res);
		});

		socket.on("getEventGroupConfig", function(eventGroupId) {
			dbHelper.getEventGroupConfig(eventGroupId, function(eventGroupConfig) {
				socket.emit('getEventGroupConfigResult', eventGroupConfig);
			});
		});

		socket.on("getListenerNames", function() {
			dbHelper.getEventListenerNames(function(res) {
				socket.emit('getListenerNames', res);
			})
		});

		socket.on("getConditionNames", function(listenerName) {
			dbHelper.getEventConditionNames(listenerName, function(res) {
				socket.emit('getConditionNames', res);
			});
		});

		socket.on("updateEventGroupConfig", function(eventGroupConfig) {
			console.log(1);
			dbHelper.updateEventGroupConfig(eventGroupConfig, function() {
				console.log(2);
				dbHelper.getEventGroupList(function(res) {
					console.log(3);
					socket.emit('eventGroupsIdList', res);
				});
			});
		});

		socket.on("removeEventGroup", function(eventGroupId) {
			dbHelper.removeEventGroupConfig(eventGroupId, function() {
				socket.emit('removedEventGroup');
				dbHelper.getEventGroupList(function(res) {
					socket.emit('eventGroupsIdList', res);
				});
			});
		});

		socket.on("getTaskGroupNames", function() {
			dbHelper.getTaskGroupList(function(taskGroupNames) {
				socket.emit('getTaskGroupNames', taskGroupNames);
			});
		});

	});
});

app.get('/taskgroups', function(req, res){
  	res.render('taskgroups.jade');
	io.sockets.once('connection', function (socket) {

			dbHelper.getTaskGroupList(function(res) {
				socket.emit('taskGroupsIdList', res);
			});

			socket.on("getTaskGroupConfig", function(taskGroupId) {
				dbHelper.getTaskGroupConfig(taskGroupId, function(taskGroupConfig) {
					socket.emit('getTaskGroupConfigResult', taskGroupConfig);
				});
				dbHelper.getUnassignedTaskList(taskGroupId, function(unassignedTaskList) {
					socket.emit('getUnassignedTaskList', unassignedTaskList);
				});
			});

			socket.on("updateTaskGroupConfig", function(taskGroupConfig) {
				console.log(1);
				dbHelper.updateTaskGroupConfig(taskGroupConfig, function() {
					console.log(2);
					dbHelper.getTaskGroupList(function(res) {
						console.log(3);
						socket.emit('taskGroupsIdList', res);
					});
				});
			})

			socket.on("updateUnassignedTaskList", function(listToReduceTasks) {
				dbHelper.getTaskListWithoutTasksGiven(listToReduceTasks, function(taskList) {
					socket.emit('getUnassignedTaskList', taskList);
				});
			})

			socket.on("removeTaskGroup", function(taskGroupId) {
				dbHelper.removeTaskGroupConfig(taskGroupId, function() {
					socket.emit('removedTaskGroup');
					dbHelper.getTaskGroupList(function(res) {
						socket.emit('taskGroupsIdList', res);
					});
				})
			})
			
	});
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
