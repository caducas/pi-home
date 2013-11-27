
var mongodb = require('mongodb');
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

function getEventConfigForEvent(listenerName, conditionName) {

		var collection = db.collection('eventConfig').find({"config":{$elemMatch:{"listeners":{$elemMatch:{"listenerName":listenerName, "events":{$elemMatch:{"conditionName":conditionName}}}}}}}).toArray(function(err, docs) {
			callback(ip, docs[0].config);
		});
}

function updateEventConfig(ip, newConfig) {

		db.collection('eventConfig').update({"ip":ip},{$set: { "config" : newConfig } });
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

		db.collection('tasks').save(config, function(err, objects) {
		});
}

function getTaskGroupConfig(taskGroupId, callback) {

		var collection = db.collection('taskGroups').find({"taskGroupId":taskGroupId}).toArray(function(err, docs) {
			callback(docs[0]);
		});
}

function addTaskGroupConfig(config) {

		var collection = db.collection('taskGroups').find({"taskGroupId":config.taskGroupId}).toArray(function(err, docs) {
			if(docs.length === 0) {
				db.collection('taskGroups').insert(config, function(err, objects) {
					console.log("inserting");
				});
			} else {
				console.log("A taskGroup with the id'" + config.taskGroupId + "' already exists in database");
			}
		});
}

function updateTaskGroupConfig(config) {

		db.collection('taskGroups').save(config, function(err, objects) {
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

function updateEventGroupConfig(config) {

		db.collection('eventGroups').save(config);
}

function getTaskList(callback) {
	db.collection('tasks').find({},{taskId:1,_id:0}).toArray(function(err, docs) {
		callback(docs);
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
	exports.getEventConfig = getEventConfig;
	exports.getTaskConfig = getTaskConfig;
	exports.getTaskGroupConfig = getTaskGroupConfig;
	exports.getEventGroupConfigsForEvent = getEventGroupConfigsForEvent;
	exports.getTaskList = getTaskList;
	exports.logEvent = logEvent;
	exports.getEventConfigForEvent = getEventConfigForEvent;
	exports.checksEventOccuranceInLog = checksEventOccuranceInLog;
	// exports.getUIConfig = getUIConfig;

}
