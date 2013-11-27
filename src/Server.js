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

// process.on('exit', function (){
//   console.log('Goodbye!');
// });

//Event when client connected to server - sends configuration to client
process.on('#clientConnected', function(ip) {

	console.log("sending config to client");

	dbHelper.getEventConfig(ip, function(ip, config) {
		var configObject = {
			"command" : "config",
			"params" : config
		};
		networkCommunicator.sendToClient(ip,configObject);
	});
});

//Event when client sends an event to the server
process.on('#eventCatched', function(catchedEvent) {

	var eventCondition = catchedEvent.condition;

	console.log('event catched:' + catchedEvent.listener + ' condition:' + catchedEvent.condition);

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
						// console.log('taskGroupId');
						// console.log(taskGroupId);
						dbHelper.getTaskGroupConfig(taskGroupId, function(taskGroup) {
							// console.log('taskGroup');
							// console.log(taskGroup);
							for(var pos in taskGroup.tasks) {
								// console.log('pos');
								// console.log(pos);
								var taskId = taskGroup.tasks[pos];
								// console.log('taskId');
								// console.log(taskId);
								dbHelper.getTaskConfig(taskId, function(taskConfig) {
									// console.log('taskConfig');
									// console.log(taskConfig);

									var configObject = {
										"command" : "executeTask",
										"params" : taskConfig
									};
									networkCommunicator.sendToClient(taskConfig.host,configObject);

								});
							}
						});		
					}
				}

			});
		}
	});

});

if(typeof exports !== 'undefined') {
	exports.setEventConfig = setEventConfig;
}


