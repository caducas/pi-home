
var mongodb = require('mongodb');
var ObjectID = require('mongodb').ObjectID
var server = new mongodb.Server("127.0.0.1", 27017, {});
var db;
var MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://127.0.0.1:27017/pihome', function(err, database) {
	if(err) throw err;
	db = database;
});
var format = require('util').format;

// MongoClient.connect('mongodb://127.0.0.1:27017/pihome', function(err, db) {
// 	if(err) throw err;
// });

var testConfig = {
	"ip" : "192.168.0.15",
	"config" : [
		{
			"plugin" : "Gpio",
			"listeners" : [
				{
					"listenerName" : "Button01",
					"events" : [
						{
							"conditionName" : "Button01Pressed",
							"condition" : {
								"operator" : "=",
								"value" : 1
							}
						},
						{
							"conditionName" : "Button01Released",
							"condition" : {
								"operator" : "=",
								"value" : 0
							}					
						}
					],
					"params" : {
						"pin" : 18
					}
				}
			]
		}
	]
};

var realTestConfig = {
	"ip" : "127.0.0.1",
	"config" : [
		{
			"plugin" : "Gpio",
			"listeners" : [
				{
					"listenerName" : "Button01",
					"events" : [
						{
							"conditionName" : "Button01Pressed",
							"condition" : {
								"operator" : "=",
								"value" : 1
							}
						},
						{
							"conditionName" : "Button01Released",
							"condition" : {
								"operator" : "=",
								"value" : 0
							}					
						}
					],
					"params" : {
						"pin" : 18
					}
				}
			]
		},
		{
			"plugin" : "UI",
			"listeners" : [
				{
					"listenerName" : "UIButton01",
					"uiType" : "button",
					"events" : [
						{
							"conditionName" : "pressed"
						}
					]
				}
			]
		}
	]
};


	var exampleTask1 = {
		"taskId" : "SwitchOnLED",
		"host" : "127.0.0.1",
		"plugin" : "Gpio",
		"params" : {
			"direction" : 'out',
			"pin" : 27,
			"value" : 0
		}
	};

	var exampleTask2 = {
		"taskId" : "SwitchOffLED",
		"host" : "127.0.0.1",
		"plugin" : "Gpio",
		"params" : {
			"direction" : 'out',
			"pin" : 27,
			"value" : 1
		}
	};

	var exampleTask3 = {
		"taskId" : "SwitchOnPower",
		"host" : "127.0.0.1",
		"plugin" : "plugin433",
		"params" : {
			"grpId" : 1,
			"deviceId" : 1,
			"value" : 1
		}
	};
	var exampleTask4 = {
		"taskId" : "SwitchOffPower",
		"host" : "127.0.0.1",
		"plugin" : "plugin433",
		"params" : {
			"grpId" : 1,
			"deviceId" : 1,
			"value" : 0
		}
	};

	var exampleTask5 = {
		"taskId" : "setUIButtonStatusOn",
		"host" : "127.0.0.1",
		"plugin" : "UI",
		"params" : {
			"type" : "text"
		}
	};

	var exampleTaskGroup1 = {
		"taskGroupId" : "SwitchAllOn",
		"tasks" : ["SwitchOnLED","SwitchOnPower"]
	}
	var exampleTaskGroup2 = {
		"taskGroupId" : "SwitchAllOff",
		"tasks" : ["SwitchOffLED","SwitchOffPower"]
	}

	var exampleEventGroup1 = {
		"eventGroupId" : "EventLightOn",
		"events" : [
		{
			"listenerName" : "Button01",
			"conditionName" : "Button01Pressed",
			"timeDifference" : "0"
		},
		{
			"listenerName" : "UIButton01",
			"conditionName" : "pressed",
			"timeDifference" : "5000"
		}
		],
		"taskGroups" : ["SwitchAllOn"]
	}

	var exampleEventGroup2 = {
		"eventGroupId" : "EventLightOff",
		"events" : [
		{
			"listenerName" : "Button01",
			"conditionName" : "Button01Released",
			"timeDifference" : "0"
		},
		{
			"listenerName" : "UIButton01",
			"conditionName" : "pressed",
			"timeDifference" : "5000"
		}
		],
		"taskGroups" : ["SwitchAllOff"]
	}

	var exampleEventGroup3 = {
		"eventGroupId" : "EventLightOn",
		"events" : 
		[
		{
			"listenerName" : "UIButton01",
			"conditionName" : "pressed",
			"timeDifference" : "0"
		}
		],
		"taskGroups" : ["SwitchAllOn"]
	}

process.on( 'SIGINT', function() {
  console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
  // some other closing procedures go here
  db.close();
  process.exit( );
})

//needed only for first execution
/*
executeDbCommand(function() {

	setEventConfig("127.0.0.1", realTestConfig);

	addTaskConfig(exampleTask1);
	addTaskConfig(exampleTask2);
	addTaskConfig(exampleTask3);
	addTaskConfig(exampleTask4);

	addTaskGroupConfig(exampleTaskGroup1);
	addTaskGroupConfig(exampleTaskGroup2);

	// getTaskGroupConfig("SwitchAllOn", function(config) {
	// 	config.eventGroups = ["EventButtonOn"];
	// 	updateTaskGroupConfig(config);
	// });

	// getTaskGroupConfig("SwitchAllOff", function(config) {
	// 	config.eventGroups = ["EventButtonOff"];
	// 	updateTaskGroupConfig(config);
	// });

	addEventGroupConfig(exampleEventGroup1);
	addEventGroupConfig(exampleEventGroup2);
	addEventGroupConfig(exampleEventGroup3);

});
*/

function getEventConfig(ip, callback) {

	var collection = db.collection('eventConfig').find({"ip":ip}).toArray(function(err, docs) {
		callback(ip, docs[0].config);
	});
}

// function getUIConfig(callback) {

// 	executeDbCommand(db.collection('eventConfig').find({"ip":"127.0.0.1","config":{$elemMatch:{"plugin":"UI"}}}).toArray(function(err, docs) {
// 		callback(docs[0].config);
// 	}));
// }



function getEventListenerNames(callback) {
	executeDbCommand(function() {
		db.collection('eventConfig').find({}).toArray(function(err, docs) {
			var arr = [];
			for(var i in docs) {
				var doc = docs[i];
				for(var i in doc.config) {
					var config = doc.config[i];
					for(var i in config.listeners) {
						arr.push(config.listeners[i].listenerName);
					}

				}

			}
			callback(arr);
		});
	});	
}

function getEventConditionNames(listenerName, callback) {
	executeDbCommand(function() {
		db.collection('eventConfig').find({config:{$elemMatch:{"listeners":{$elemMatch:{"listenerName":listenerName}}}}}).toArray(function(err, docs) {
			var arr = [];
			for(var i in docs) {
				var doc = docs[i];
				for(var i in doc.config) {
					var config = doc.config[i];
					for(var i in config.listeners) {
						if(config.listeners[i].listenerName === listenerName) {
							var events = config.listeners[i].events;
							for(var i in events) {
								arr.push(events[i].conditionName);
							}
						}
					}

				}

			}
			callback(arr);
		});
	});

}

function getEventConfigForEvent(listenerName, conditionName) {

		var collection = db.collection('eventConfig').find({"config":{$elemMatch:{"listeners":{$elemMatch:{"listenerName":listenerName, "events":{$elemMatch:{"conditionName":conditionName}}}}}}}).toArray(function(err, docs) {
			callback(ip, docs[0].config);
		});
}

function updateEventConfig(ip, newConfig) {

		db.collection('eventConfig').update({"ip":ip},{$set: { "config" : newConfig } });
}

function updateEventListenerConfig(newConfig, callback) {
	console.log(newConfig);
	db.collection('eventConfig').find({"config":{$elemMatch:{"listeners":{$elemMatch:{"listenerName":newConfig.listenerName}}}}}).toArray(function(err,docs) {
		var listeners = docs[0].config.listeners;
		for(var i in listeners) {
			if(listeners[i].listenerName === newConfig.listenerName) {
				var newConfigObject = {
					"listenerName" : newConfig.listenerName,
					"events" : newConfig.conditions,
					"params" : newConfig.params
				};
				listeners[i] = newConfig;
				updateEventConfig()
			}
		}
	});
}

function setEventConfig(ip, config) {

		var configToAdd = {
			"ip": ip,
			"config" : config
		};

		var collection = db.collection('eventConfig').find({"ip":ip}).toArray(function(err, docs) {
			if(docs.length === 0) {
				db.collection('eventConfig').insert(config, function(err, objects) {
					console.log("inserting");
				});
			} else {
				console.log("Entry for this ip already exists, use update function to update config or delete old entry before inserting new one");
			}
		});
}

function getTaskConfig(taskId, callback) {
		var collection = db.collection('tasks').find({"taskId":taskId}).toArray(function(err, docs) {
			console.log(docs[0]);
			callback(docs[0]);
		});
}

function addTaskConfig(config) {

	var collection = db.collection('tasks').find({"taskId":config.taskId}).toArray(function(err, docs) {
		if(docs.length === 0) {
			db.collection('tasks').insert(config, function(err, objects) {
				console.log("inserting");
			});
		} else {
			console.log("A task with the id'" + config.taskId + "' already exists in database");
		}
	});
}

function updateTaskConfig(config) {
	config._id = new ObjectID(config._id+'');
	for(var i in config.params) {
		try {
			var newParam = parseInt(config.params[i]);
			if(newParam>=0 || newParam <0) {
				config.params[i] = newParam;
			}
		} catch (err) {
		}
	}
	db.collection('tasks').save(config, function(err, objects) {
		console.log('new task config:');
		console.log(config);
	});
}

function getTaskGroupConfig(taskGroupId, callback) {

		var collection = db.collection('taskGroups').find({"taskGroupId":taskGroupId}).toArray(function(err, docs) {
			callback(docs[0]);
		});
}

function addTaskGroupConfig(config, callback) {

		var collection = db.collection('taskGroups').find({"taskGroupId":config.taskGroupId}).toArray(function(err, docs) {
			if(docs.length === 0) {
				db.collection('taskGroups').insert(config, function(err, objects) {
					console.log("inserting");
					callback();
				});
			} else {
				console.log("A taskGroup with the id'" + config.taskGroupId + "' already exists in database");
				callback();
			}
		});
}

function updateTaskGroupConfig(config, callback) {
	if((config._id+'').length>0) {
		addTaskGroupConfig(config, function() {
			callback();
		});
	} else {
		config._id = new ObjectID(config._id+'');
		db.collection('taskGroups').save(config, function(err, objects) {
			console.log("should be updated now");
			callback();
		});
	}
}

function removeTaskGroupConfig(taskGroupId, callback) {
	var id = new ObjectID(taskGroupId);
	db.collection('taskGroups').remove({_id:id}, function(err, numberOfRemovedDocs) {
		callback();
	});
}

function getEventGroupConfig(eventGroupId, callback) {

		var collection = db.collection('eventGroups').find({"eventGroupId":eventGroupId}).toArray(function(err, docs) {
			callback(docs[0]);
		});
}

function getEventGroupConfigsForEvent(listenerName, conditionName, callback) {

		var collection = db.collection('eventGroups').find({events:{$elemMatch:{"listenerName":listenerName,"conditionName":conditionName}}}).toArray(function(err, docs) {
			callback(docs);
		});
}

function addEventGroupConfig(config) {

		var collection = db.collection('eventGroups').find({"eventGroupId":config.eventGroupId}).toArray(function(err, docs) {
			if(docs.length === 0) {
				db.collection('eventGroups').insert(config, function(err, objects) {
					console.log("inserting");
				});
			} else {
				console.log("An eventGroup with the id'" + config.eventGroupId + "' already exists in database");
			}
		});
}

function updateEventGroupConfig(config, callback) {

	console.log(config._id);
	console.log((config._id+'').length);

	if((config._id+'').length>0 && (config._id+'')!=='undefined') {
		config._id = new ObjectID(config._id+'');
		db.collection('eventGroups').save(config, function(err, objects) {
			console.log("should be updated now");
			callback();
		});
	} else {
		addEventGroupConfig(config, function() {
			callback();
		});
	}
}

function removeEventGroupConfig(eventGroupId, callback) {
	var id = new ObjectID(eventGroupId);
	db.collection('eventGroups').remove({_id:id}, function(err, numberOfRemovedDocs) {
		callback();
	});
}

function getTaskList(callback) {
	executeDbCommand(function() {
		db.collection('tasks').find({},{taskId:1,_id:0}).toArray(function(err, docs) {
			callback(docs);
		});
	});
}

function getEventListeners() {
	executeDbCommand(function() {
		db.collection('eventConfig').find({}).toArray(function(err, docs) {
			var eventListeners = [];
			for(var i in docs) {
				var ip = docs[i].ip;
				var configs = docs[i].config;
				for(var i in configs) {
					var config = configs[i];
					var plugin = configs[i].plugin;
					var listeners = configs[i].listeners;
					for(var i in listeners) {
						var listener = listeners[i];
						var listenerName = listeners[i].listenerName;
						var events = listeners[i].events;

						var eventListener = {
							"listenerName" : listenerName,
							"ip" : ip,
							"plugin" : plugin,
							"conditions" : events
						}

						eventListeners.push(eventListener);
					}
				}
			}



			// listenerName
			// ip
			// plugin
			// [conditions]
			// 	conditionName
			// 	condition_operator
			// 	condition_value
			console.log('eventListeners');
			console.log(eventListeners);
			callback(eventListeners);
		});
	});

}

function getEventListenerConfig(eventListenerId, callback) {
	executeDbCommand(function() {
		db.collection('eventConfig').find({config:{$elemMatch:{listeners:{$elemMatch:{listenerName:eventListenerId}}}}}).toArray(function(err, docs) {
			for(var i in docs) {
				var ip = docs[i].ip;
				var configs = docs[i].config;
				for(var i in configs) {
					var plugin = configs[i].plugin;
					var listeners = configs[i].listeners;
					for(var i in listeners) {
						if(listeners[i].listenerName === eventListenerId) {
							var listenerName = listeners[i].listenerName;
							var events = listeners[i].events;
							var params = listeners[i].params;

							var eventListener = {
								"listenerName" : listenerName,
								"ip" : ip,
								"plugin" : plugin,
								"conditions" : events,
								"params" : params
							}

							callback(eventListener);
						}
					}
				}
			}
		});
	});

}

function getEventListenerNames(callback) {
	executeDbCommand(function() {
		db.collection('eventConfig').find({}).toArray(function(err, docs) {
			var eventListenerNames = [];
			for(var i in docs) {
				var configs = docs[i].config;
				for(var i in configs) {
					var listeners = configs[i].listeners;
					for(var i in listeners) {
						var listenerName = listeners[i].listenerName;

						eventListenerNames.push(listenerName);
					}
				}
			}
			console.log('eventListeners');
			console.log(eventListenerNames);
			callback(eventListenerNames);
		});
	});
}

function getTaskListWithoutTasksGiven(listToReduceTasks, callback) {
	getTaskList(function(taskList) {
		try {
			for(var i=0;i<taskList.length;i++) {
				var index = listToReduceTasks.indexOf(taskList[i].taskId);
				if(index>-1) {
					taskList.splice(i,1);
					i--;
				}
			}
		} catch (err) {
		}
		callback(taskList);
	});	
}

function getUnassignedTaskList(taskGroupId, callback) {
	getTaskList(function(taskList) {
		getTaskGroupConfig(taskGroupId, function(taskGroupConfig) {
			for(var i=0;i<taskList.length;i++) {
			// for(var i in taskList) {
				var index = taskGroupConfig.tasks.indexOf(taskList[i].taskId);
				if(index>-1) {
					taskList.splice(i,1);
					i--;
				}
			}
			callback(taskList);
		});
	});
}

function getTaskGroupList(callback) {
	executeDbCommand(function() {
		db.collection('taskGroups').find({},{taskGroupId:1,_id:0}).toArray(function(err, docs) {
			callback(docs);
		});
	});
}

function getEventGroupList(callback) {
	executeDbCommand(function() {
		db.collection('eventGroups').find({},{eventGroupId:1,_id:0}).toArray(function(err, docs) {
			callback(docs);
		});
	});
}

function logEvent(time, listenerName, conditionName) {

				console.log("adding log");

			db.collection('logEvents').insert({"time":time,"listenerName":listenerName,"conditionName":conditionName}, function(err, objects) {
				console.log("log inserted");
		});
}

function checksEventOccuranceInLog(listenerName, conditionName, afterTime, callback) {

	MongoClient.connect('mongodb://127.0.0.1:27017/pihome', function(err, db) {
		if(err) throw err;

		console.log({"time":{$gt:afterTime},"listenerName":listenerName,"conditionName":conditionName});

		db.collection('logEvents').find({"time":{$gt:afterTime},"listenerName":listenerName,"conditionName":conditionName}).toArray(function(err, docs) {
			if(docs.length===0) {
				callback(false);
			} else {
				callback(true);
			}
		});
	});
}

function executeDbCommand(executeFunction) {
	if(db !== undefined) {
		executeFunction();
	} else {
		MongoClient.connect('mongodb://127.0.0.1:27017/pihome', function(err, database) {
			if(err) throw err;
			console.log("opened new connection to database");
			db = database;
			executeFunction();
		});
	}
}

if(typeof exports !== 'undefined') {

	//add

	//update
	exports.updateTaskGroupConfig = updateTaskGroupConfig;
	exports.updateTaskConfig = updateTaskConfig;
	exports.updateEventGroupConfig = updateEventGroupConfig;
	exports.updateEventListenerConfig = updateEventListenerConfig;

	//delete
	exports.removeTaskGroupConfig = removeTaskGroupConfig;
	exports.removeEventGroupConfig = removeEventGroupConfig;

	//get
	exports.getEventConfig = getEventConfig;
	exports.getTaskConfig = getTaskConfig;
	exports.getTaskGroupConfig = getTaskGroupConfig;
	exports.getEventGroupConfig = getEventGroupConfig;
	exports.getEventGroupConfigsForEvent = getEventGroupConfigsForEvent;
	exports.getTaskList = getTaskList;
	exports.getEventConfigForEvent = getEventConfigForEvent;
	exports.getUnassignedTaskList = getUnassignedTaskList;
	exports.getTaskGroupList = getTaskGroupList;
	exports.getEventGroupList = getEventGroupList;
	exports.getEventListenerNames = getEventListenerNames;
	exports.getEventConditionNames = getEventConditionNames;
	exports.getTaskGroupList = getTaskGroupList;
	exports.getTaskListWithoutTasksGiven = getTaskListWithoutTasksGiven;
	exports.getEventListenerNames = getEventListenerNames;
	exports.getEventListenerConfig = getEventListenerConfig;

	exports.logEvent = logEvent;
	exports.checksEventOccuranceInLog = checksEventOccuranceInLog;
	// exports.getUIConfig = getUIConfig;

}
