
/**
 * Module dependencies.
 */


//variable declaration
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


//for frontpage
app.get('/', function(req, res){
  res.render('home.jade');
	io.sockets.once('connection', function (socket) {

		refreshNavigation(socket);

		//loading frontpage
		dbHelper.getFrontpageItems(function(res) {
			socket.emit('getFrontpageItems', res);
		});


		socket.on("activatePhysicalButton", function() {
			process.emit('#eventCatched', {"listener":"UIButton01","condition":"pressed"});
		});

		socket.on("uiEvent", function(name) {
			dbHelper.getUIEvent(name, function(result) {
				process.emit('#eventCatched', result);
			});
		});

		socket.on("getVariableValue", function(name) {
			updateVariable(name);
		})

		process.on('#changeFrontendVariable', function(variable, value) {
			socket.emit('updateVariable', {"name":variable, "value":value});
		});

		socket.on('getFrontpageItem', function(item) {
			console.log("FRONTEND: received request for frontpageItem");
			try{
				var plugin = pluginHelper.getPlugin(item.type);
				plugin.getFrontpageItem(item, function(frontpageItem) {
					console.log("FRONTEND: frontpageItem by using plugin created: " + frontpageItem);
					socket.emit('getFrontpageItem', item, frontpageItem);
				});
			} catch(err) {
				console.log(err);
			}
		});

		socket.on('loadSite', function(siteId) {
			res.render('site.jade');
			console.log("DBHELPER:should load site now");
			dbHelper.getSite(siteId, function(site) {
				socket.emit('getSite', site);
				for(var i in site.containers) {
					dbHelper.getContainerByName(site.containers[i].name, function(container) {
						socket.emit('getContainer', container);
					});
				}
			});
		});

	});
});

app.get('/site', function(req, res) {
	res.render('site.jade');
	io.sockets.once('connection', function (socket) {
		
		refreshNavigation(socket);

		var siteId = req.query.id;
		dbHelper.getSite(siteId, function(site) {

			socket.emit('getSite', site);
			for(var i in site.containers) {
				dbHelper.getContainerByName(site.containers[i].name, function(container) {
					socket.emit('getContainer', container);
					for(var j in container.elements) {
						dbHelper.getFrontpageItemByName(container.elements[j].name, function(element) {
							// console.log("FRONTEND:element" + element);
							socket.emit('getElement', element);
						});
					}
				});
			}
		});

		socket.on("getVariableValue", function(name) {
			console.log("FRONTEND: get Variable value for variable:" + name)
			updateVariable(name);
		});


		process.on('#changeFrontendVariable', function(variable, value) {
			console.log("FRONTEND: should update Variable now");
			socket.emit('updateVariable', {"name":variable, "value":value});
		});
		
		socket.on("uiEvent", function(name) {
			dbHelper.getUIEvent(name, function(result) {
				process.emit('#eventCatched', result);
			});
		});
		
		socket.on('getFrontpageItem', function(item) {
			// console.log("FRONTEND: received request for frontpageItem");
			try{
				var plugin = pluginHelper.getPlugin(item.type);
				plugin.getFrontpageItem(item, function(frontpageItem) {
					// console.log("FRONTEND: frontpageItem by using plugin created: " + frontpageItem);
					socket.emit('getFrontpageItem', item, frontpageItem);
				});
			} catch(err) {
				console.log(err);
			}
		});

	});
});

//for configuration page of frontend
app.get('/frontpageconfig', function(req, res) {
	res.render('frontpageconfig.jade');
	io.sockets.once('connection', function (socket) {

		refreshNavigation(socket);

		dbHelper.getFrontpageItemsList(function(res) {
			socket.emit('getFrontpageItemList', res);
		});

		socket.on("getFrontpageItemConfig", function(id) {
			dbHelper.getFrontpageItem(id, function(config) {
				socket.emit('getFrontpageItemConfigResult', config);
			});
		});

		socket.on("updateFrontpageItemConfig", function(config) {
			console.log("FRONTEND: config");
			console.log(config);
			dbHelper.updateFrontpageItemConfig(config, function() {
				dbHelper.getFrontpageItemsList(function(res) {
					socket.emit('getFrontpageItemList', res);
				});
			});
		});

		socket.on("getListOfVariables", function() {
			dbHelper.getVariableList(function(res) {
				socket.emit('getListOfVariables', res);
			});			
		});

		socket.on("removeFrontpageItem", function(frontpageItemId) {
			dbHelper.removeFrontpageItemConfig(frontpageItemId, function() {
				socket.emit('removedFrontend');
				dbHelper.getFrontpageItemsList(function(res) {
					socket.emit('getFrontpageItemList', res);
				});
			});
		});

		socket.on("getEmptyConfigParams", function(type) {
			var emptyConfigParams = pluginHelper.getPlugin(type).getEmptyConfigParams();
			socket.emit('getEmptyConfigParamsResult', emptyConfigParams);
		});
	});
});

app.get('/sites', function(req, res) {
	res.render('sites.jade');
	io.sockets.once('connection', function (socket) {

		refreshNavigation(socket);

		dbHelper.getSitesList(function(res) {
			socket.emit('getSitesList', res);
		});

		socket.on("updateSite", function(config) {
			dbHelper.updateSite(config, function() {
				dbHelper.getSitesList(function(res) {
					socket.emit('getSitesList', res);
				});
			});
		});

		socket.on("getSite", function(id) {
			dbHelper.getSite(id, function(config) {
				socket.emit('getSite', config);
			});
		});

		socket.on("removeSite", function(siteId) {
			dbHelper.removeSite(siteId, function() {
				dbHelper.getSitesList(function(res) {
					socket.emit('getSitesList', res);
				});
			});
		});

		socket.on("getContainerNames", function() {
			dbHelper.getContainersList(function(res) {
				socket.emit('getContainerNames', res);
			});
		});
	});
});

app.get('/containers', function(req, res) {
	res.render('containers.jade');
	io.sockets.once('connection', function (socket) {

		refreshNavigation(socket);

		dbHelper.getContainersList(function(res) {
			socket.emit('getContainersList', res);
		});

		socket.on("updateContainer", function(config) {
			dbHelper.updateContainer(config, function() {
				dbHelper.getContainersList(function(res) {
					socket.emit('getContainersList', res);
				});
			});
		});

		socket.on("getContainer", function(id) {
			dbHelper.getContainer(id, function(config) {
				socket.emit('getContainer', config);
			});
			dbHelper.getFrontpageItemsList(function(elementName) {
				socket.emit('getElementNames', elementName);
			});
		});

		socket.on("removeContainer", function(id) {
			dbHelper.removeContainer(id, function() {
				dbHelper.getContainersList(function(res) {
					socket.emit('getContainersList', res);
				});
			});
		});

		socket.on("getElementNames", function() {
			dbHelper.getFrontpageItemsList(function(elementName) {
				socket.emit('getElementNames', elementName);
			});			
		});
	});
});

//for configuration page of tasks
app.get('/tasks', function(req, res){
  	res.render('tasks.jade');
	io.sockets.once('connection', function (socket) {

		refreshNavigation(socket);

		dbHelper.getTaskList(function(res) {
			socket.emit('taskIdList', res);
			socket.emit('getAvailablePlugins', pluginHelper.getListOfPluginNames());
		});

		socket.on("getTaskConfig", function(taskId) {
			socket.emit('getAvailablePlugins', pluginHelper.getListOfPluginNames());
			dbHelper.getTaskConfig(taskId, function(taskConfig) {
				socket.emit('getTaskConfigResult', taskConfig);
			});
		});

		socket.on("updateTaskConfig", function(taskConfig) {
			dbHelper.updateTaskConfig(taskConfig, function() {
				dbHelper.getTaskList(function(res) {
					socket.emit('taskIdList', res);
				});
			});
		});

		socket.on("removeTask", function(taskId) {
			dbHelper.removeTaskConfig(taskId, function() {
				socket.emit('removedTask');
				dbHelper.getTaskList(function(res) {
					socket.emit('taskIdList', res);
				});
			});
		});
	});
});

//for configuration page of events
app.get('/events', function(req, res){
  	res.render('events.jade');
	io.sockets.once('connection', function (socket) {

		refreshNavigation(socket);

		socket.emit('getAvailablePlugins', pluginHelper.getListOfPluginNames());
		dbHelper.getEventListenerNames(function(res) {
			socket.emit('listenerNamesList', res);
		});

		socket.on("getEventConfig", function(eventId) {
			socket.emit('getAvailablePlugins', pluginHelper.getListOfPluginNames());
			dbHelper.getEventListenerConfig(eventId, function(eventListenerConfig) {
				socket.emit('getEventListenerConfigResult', eventListenerConfig);
			});

		});

		socket.on("updateEventListenerConfig", function(eventListenerConfig) {
			dbHelper.updateEventListenerConfig(eventListenerConfig, function() {
				dbHelper.getEventListenerNames(function(res) {
					socket.emit('listenerNamesList', res);
				});
			});
		});

		socket.on("getUIEventElements", function() {
			dbHelper.getUIEventNames(function(res) {
				socket.emit('getUIEventElementsResult', res);
			});
		});

		socket.on("removeEventConfig", function(eventId) {
			dbHelper.removeEventListenerConfig(eventId, function() {
				socket.emit('removedEventConfig');
				dbHelper.getEventListenerNames(function(res) {
					socket.emit('listenerNamesList', res);
				});
			});
		});
	});
});

//for configuration page of eventgroups
app.get('/eventgroups', function(req, res){
  	res.render('eventgroups.jade');
	io.sockets.once('connection', function (socket) {
		
		refreshNavigation(socket);

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
			dbHelper.updateEventGroupConfig(eventGroupConfig, function() {
				dbHelper.getEventGroupList(function(res) {
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

//for configuration page of taskgroups
app.get('/taskgroups', function(req, res){
  	res.render('taskgroups.jade');
	io.sockets.once('connection', function (socket) {

		refreshNavigation(socket);

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
				dbHelper.updateTaskGroupConfig(taskGroupConfig, function() {
					dbHelper.getTaskGroupList(function(res) {
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

app.get('/wfrog', function(req, res){
  res.render('wfrog.jade');
	io.sockets.once('connection', function (socket) {

		refreshNavigation(socket);
		
	});
});

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

function updateVariable(variableName) {
	dbHelper.getVariable(variableName, function(res) {
		process.emit('#changeFrontendVariable', variableName, res.value);
	})
}

function refreshNavigation(socket) {
	dbHelper.getSitesList(function(res) {
		socket.emit('getSites', res);
	});
}

if(typeof exports !== 'undefined') {
	exports.updateVariable = updateVariable;
}
