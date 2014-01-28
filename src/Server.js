/**
* Class which is used to start the server functionality on the Raspberry Pi.
*
* @class Server
*/
var networkCommunicator = require(__dirname + '/NetworkCommunicator');
var eventConfig = require(__dirname + '/../config/config.json');
var dbHelper = require(__dirname + '/DBHelper');
var frontend = require(__dirname + '/Frontend');
var async = require('async');
var pluginHelper = require('./PluginHelper');

//starts network server to enable clients to connect
networkCommunicator.startServer();

/**
* Setter for eventConfig (for testing purpose).
*
* @method setEventConfig
* @param {Object} newEventConfig The configuration as JSON-Object.
*/
function setEventConfig(newEventConfig) {
	eventConfig = newEventConfig;
}

//Event when client connected to server - sends configuration to client
process.on('#clientConnected', function(ip) {

	console.log("sending config to client");

	dbHelper.getEventConfig(ip, function(ip, config) {
		console.log("config");
		console.log(config);
		var configObject = {
			"command" : "configEventListeners",
			"params" : config
		};
		// console.log(configObject);
		networkCommunicator.sendToClient(ip,configObject);
	});
});

process.on('#uiEventCatched', function(id) {
	dbHelper.getEvent(id, function(result) {
	});
});

//Event when client sends an event to the server
process.on('#eventCatched', function(catchedEvent) {

	console.log('event catched:' + catchedEvent.listener + ' condition:' + catchedEvent.condition);

	checkEventForEventGroupsSuccess(catchedEvent);

});
process.on('#pluginDataReceived', function(pluginname, data) {

	var plugin = pluginHelper.getPlugin(pluginname);
	plugin.processPluginData(data, function(nameOfVariable) {
		console.log('SERVER: update Variable ' + nameOfVariable);
		frontend.updateVariable(nameOfVariable);
	});

});
// process.on('#changeVariable', function(variableEvent) {

// 	console.log("CHANGE VARIABLE RECEIVED!!!");

// 	frontend.updateVariable(variableEvent.variable, variableEvent.value);

// 	// dbHelper.setVariable(variableEvent.variable, variableEvent.value);

// });

function checkEventForEventGroupsSuccess(catchedEvent) {

	var now = new Date();

	dbHelper.logEvent((now).toJSON(), catchedEvent.listener, catchedEvent.condition);

	dbHelper.getEventGroupConfigsForEvent(catchedEvent.listener, catchedEvent.condition, function(eventGroups) {

		//
		for(var pos in eventGroups) {
			var eventGroup = eventGroups[pos];

			var conditionFulfilled = true;
			var conditionCheckFinished = false;

			var events = eventGroup.events;

			async.each(events, function(eventInGroup, callback) {

				if(eventInGroup.listenerName !== catchedEvent.listener || eventInGroup.conditionName !== catchedEvent.condition) {
					now.setMilliseconds(now.getMilliseconds() - eventInGroup.timeDifference);
					dbHelper.checksEventOccuranceInLog(eventInGroup.listenerName,eventInGroup.conditionName,now.toJSON(), function(result) {
						if(result===false) {
							conditionFulfilled = false;
						}
						callback();
					});
				} else {
					callback();
				}

			}, function() {
				if(conditionFulfilled === true) {
					console.log("exec task");
					var taskGroups = eventGroup.taskGroups;
					for(var pos in taskGroups) {
						var taskGroupId = taskGroups[pos];
						dbHelper.getTaskGroupConfig(taskGroupId, function(taskGroup) {
							for(var pos in taskGroup.tasks) {
								var taskId = taskGroup.tasks[pos];
								dbHelper.getTaskConfig(taskId, function(taskConfig) {
									var configObject = {
										"command" : "executeTask",
										"params" : taskConfig
									};
									if(taskConfig.plugin!=='UI') {
										networkCommunicator.sendToClient(taskConfig.host,configObject);
									} else {
										frontend.executeTask(taskConfig);
									}

								});
							}
						});		
					}
				}

			});
		}
	});

}

if(typeof exports !== 'undefined') {
	exports.setEventConfig = setEventConfig;
}


