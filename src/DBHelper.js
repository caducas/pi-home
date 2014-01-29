
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

// var exampleEventConfig1 = {
// 	"listenerName" : "Button01",
// 	"plugin" : "Gpio",
// 	"ip" : "127.0.0.1",
// 	"conditions" : [
// 		{
// 			"conditionName" : "Button01Pressed",
// 			"condition" : {
// 				"operator" : "=",
// 				"value" : 1
// 			}
// 		},
// 		{
// 			"conditionName" : "Button01Released",
// 			"condition" : {
// 				"operator" : "=",
// 				"value" : 0
// 			}					
// 		}
// 	],
// 	"params" : {
// 		"pin" : 18
// 	}
// };

// var exampleEventConfig2 = {
// 	"listenerName" : "UIButton01",
// 	"plugin" : "UI",
// 	"ip" : "127.0.0.1",
// 	"conditions" : [
// 		{
// 			"conditionName" : "pressed"
// 		}
// 	],
// 	"params" : {
// 		"uiName" : "buttonActivatePhysicalLightSwitch"
// 	}
// }
// var exampleEventConfig3 = {
// 	"listenerName" : "LightSensor",
// 	"plugin" : "Arduino",
// 	"ip" : "127.0.0.1",
// 	"conditions" : [
// 		{
// 			"conditionName" : "lightSensor",
// 			"condition" : {
// 				"operator" : ">=",
// 				"value" : 0
// 			}
// 		}
// 	],
// 	"params" : {
// 		"pin" : 'A5',
// 		"interval" : 1000
// 	}
// };

// var exampleEventConfig4 = {
// 	"listenerName" : "RemoteControl",
// 	"plugin" : "plugin433",
// 	"ip" : "127.0.0.1",
// 	"conditions" : [
// 		{
// 			"conditionName" : "01_on",
// 			"condition" : {
// 				"operator" : "=",
// 				"value" : "1000100000001"
// 			}
// 		},
// 		{
// 			"conditionName" : "01_off",
// 			"condition" : {
// 				"operator" : "=",
// 				"value" : "1000100000011"
// 			}					
// 		},
// 		{
// 			"conditionName" : "02_on",
// 			"condition" : {
// 				"operator" : "=",
// 				"value" : "1000010000001"
// 			}					
// 		},
// 		{
// 			"conditionName" : "02_off",
// 			"condition" : {
// 				"operator" : "=",
// 				"value" : "1000010000011"
// 			}					
// 		}
// 	],
// 	"params" : {
// 		"pin" : 18
// 	}
// };


// var exampleTask1 = {
// 	"taskId" : "SwitchOnLED",
// 	"host" : "127.0.0.1",
// 	"plugin" : "Gpio",
// 	"params" : {
// 		"direction" : 'out',
// 		"pin" : 27,
// 		"value" : 0
// 	}
// };

// var exampleTask2 = {
// 	"taskId" : "SwitchOffLED",
// 	"host" : "127.0.0.1",
// 	"plugin" : "Gpio",
// 	"params" : {
// 		"direction" : 'out',
// 		"pin" : 27,
// 		"value" : 1
// 	}
// };

// var exampleTask3 = {
// 	"taskId" : "SwitchOnPower",
// 	"host" : "127.0.0.1",
// 	"plugin" : "plugin433",
// 	"params" : {
// 		"grpId" : 1,
// 		"deviceId" : 1,
// 		"value" : 1
// 	}
// };
// var exampleTask4 = {
// 	"taskId" : "SwitchOffPower",
// 	"host" : "127.0.0.1",
// 	"plugin" : "plugin433",
// 	"params" : {
// 		"grpId" : 1,
// 		"deviceId" : 1,
// 		"value" : 0
// 	}
// };

// var exampleTask5 = {
// 	"taskId" : "setUIButtonStatusOn",
// 	"host" : "127.0.0.1",
// 	"plugin" : "UI",
// 	"params" : {
// 		"type" : "text",
// 		"name" : "Status Licht"
// 	}
// };

// var exampleFrontpageItem1 = {
// 	"name" : "labelLightStatus",
// 	"type" : "label",
// 	"description" : "Light status",
// 	"params" : {
// 		"value" : 0
// 	}
// }
// var exampleFrontpageItem2 = {
// 	"name" : "buttonActivatePhysicalLightSwitch",
// 	"type" : "button",
// 	"description" : "Activate the physical Button for 5 seconds",
// 	"params" : {
// 		"text" : "Activate"
// 	}
// }

// var exampleTaskGroup1 = {
// 	"taskGroupId" : "SwitchAllOn",
// 	"tasks" : ["SwitchOnLED","SwitchOnPower"]
// }
// var exampleTaskGroup2 = {
// 	"taskGroupId" : "SwitchAllOff",
// 	"tasks" : ["SwitchOffLED","SwitchOffPower"]
// }

// var exampleEventGroup1 = {
// 	"eventGroupId" : "EventLightOn",
// 	"events" : [
// 	{
// 		"listenerName" : "Button01",
// 		"conditionName" : "Button01Pressed",
// 		"timeDifference" : "0"
// 	},
// 	{
// 		"listenerName" : "UIButton01",
// 		"conditionName" : "pressed",
// 		"timeDifference" : "5000"
// 	}
// 	],
// 	"taskGroups" : ["SwitchAllOn"]
// }

// var exampleEventGroup2 = {
// 	"eventGroupId" : "EventLightOff",
// 	"events" : [
// 	{
// 		"listenerName" : "Button01",
// 		"conditionName" : "Button01Released",
// 		"timeDifference" : "0"
// 	},
// 	{
// 		"listenerName" : "UIButton01",
// 		"conditionName" : "pressed",
// 		"timeDifference" : "5000"
// 	}
// 	],
// 	"taskGroups" : ["SwitchAllOff"]
// }

// var exampleEventGroup3 = {
// 	"eventGroupId" : "EventLightOn",
// 	"events" : 
// 	[
// 	{
// 		"listenerName" : "UIButton01",
// 		"conditionName" : "pressed",
// 		"timeDifference" : "0"
// 	}
// 	],
// 	"taskGroups" : ["SwitchAllOn"]
// }

process.on( 'SIGINT', function() {
  console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
  db.close();
  process.exit( );
})

// executeDbCommand(function() {

	// setEventConfig("127.0.0.1", realTestConfig);

	// addTaskConfig(exampleTask1);
	// addTaskConfig(exampleTask2);
	// addTaskConfig(exampleTask3);
	// addTaskConfig(exampleTask4);
	// addTaskConfig(exampleTask5, function() {

	// });

	// addTaskGroupConfig(exampleTaskGroup1);
	// addTaskGroupConfig(exampleTaskGroup2);

	// getTaskGroupConfig("SwitchAllOn", function(config) {
	// 	config.eventGroups = ["EventButtonOn"];
	// 	updateTaskGroupConfig(config);
	// });

	// getTaskGroupConfig("SwitchAllOff", function(config) {
	// 	config.eventGroups = ["EventButtonOff"];
	// 	updateTaskGroupConfig(config);
	// });

	// addEventGroupConfig(exampleEventGroup1, function() {});
	// addEventGroupConfig(exampleEventGroup2, function() {});
	// addEventGroupConfig(exampleEventGroup3);

	// addEventConfig(exampleEventConfig1, function() {});
	// addEventConfig(exampleEventConfig2, function() {});
	// addEventConfig(exampleEventConfig3, function() {});
	// addEventConfig(exampleEventConfig4, function() {});

	// addFrontpageItem(exampleFrontpageItem1, function() {});
	// addFrontpageItem(exampleFrontpageItem2, function() {});

// });





//--------------------------FRONTPAGE---------------------------------------------------
//--------------------------------------------------------------------------------------

function addFrontpageItem(item, callback) {
	db.collection('frontend').find({"name":item.name}).toArray(function(err, docs) {
		if(docs.length === 0) {
			db.collection('frontend').insert(item, function(err, objects) {
				console.log("inserting");
				callback();
			});
		} else {
			console.log("A task with the id'" + item.name + "' already exists in database");
			callback();
		}
	});
}

function getFrontpageItems(callback) {
	db.collection('frontend').find({}).toArray(function(err, docs) {
		callback(docs);
	});	
}

function getFrontpageItemsList(callback) {
	db.collection('frontend').find({},{name:1}).sort({name:1}).toArray(function(err, docs) {
		callback(docs);
	});	
}

function getFrontpageItem(id, callback) {
	var configId = new ObjectID(id);
	db.collection('frontend').find({_id:configId}).toArray(function(err, docs) {
		callback(docs[0]);
	});	
}

function getFrontpageItemByName(name, callback) {
	db.collection('frontend').find({name:name}).toArray(function(err, docs) {
		callback(docs[0]);
	});	
}

function updateFrontpageItemConfig(config, callback) {


	console.log("DBHELPER: config:");
	console.log(config);
	if((config._id+'').length>0 && (config._id+'')!=='undefined') {
		config = prepareObjectToStoreInMongoDB(config);
		console.log(config);
		executeDbCommand(function() {
			db.collection('frontend').find({_id:config._id}).toArray(function(err, docs) {
				if(docs[0].name !== config.name) {
					db.collection('events').find({params:{$elemMatch:{uiName:docs[0].name}}}).toArray(function(err, arr) {
						for(var i in arr) {
							if(arr[i].params.uiName === docs[0].name) {
								arr[i].params.uiName = config.name;
							}
							db.collection('events').save(arr[i], function(err, objects) {});
						}
					});
				}
				db.collection('frontend').save(config, function(err, objects) {
					callback();
				});
				db.collection('frontend').find({_id:config._id}).toArray(function(err, docs) {
					console.log(docs[0]);
				})
			});
		});



		// config = prepareObjectToStoreInMongoDB(config);
		// db.collection('frontend').save(config, function(err, objects) {
		// 	console.log('updated');
		// 	console.log(config);
		// 	callback();
		// });
	} else {
		addFrontpageItem(config, function() {
			callback();
		});
	}
}



function removeFrontpageItemConfig(frontpageItemId, callback) {
	var id = new ObjectID(frontpageItemId);
	db.collection('frontend').remove({_id:id}, function(err, numberOfRemovedDocs) {
		callback();
	});
}

//--------------------------SITES-------------------------------------------------------
//--------------------------------------------------------------------------------------

function getSitesList(callback) {
	db.collection('sites').find({},{name:1}).sort({name:1}).toArray(function(err, docs) {
		callback(docs);
	});	
}

function updateSite(config, callback) {

	if((config._id+'').length>0 && (config._id+'')!=='undefined') {
		config = prepareObjectToStoreInMongoDB(config);
		executeDbCommand(function() {
			db.collection('sites').save(config, function(err, objects) {
				callback();
			});
		});
	} else {
		addSite(config, function() {
			callback();
		});
	}
}

function addSite(item, callback) {
	db.collection('sites').find({"name":item.name}).toArray(function(err, docs) {
		if(docs.length === 0) {
			db.collection('sites').insert(item, function(err, objects) {
				callback();
			});
		} else {
			console.log("A site with the name:'" + item.name + "' already exists in database");
			callback();
		}
	});
}

function getSite(id, callback) {
	var configId = new ObjectID(id);
	db.collection('sites').find({_id:configId}).toArray(function(err, docs) {
		callback(docs[0]);
	});
}

function removeSite(siteId, callback) {
	var id = new ObjectID(siteId);
	db.collection('sites').remove({_id:id}, function(err, numberOfRemovedDocs) {
		callback();
	});
}


//--------------------------CONTAINERS--------------------------------------------------
//--------------------------------------------------------------------------------------

function getContainersList(callback) {
	db.collection('containers').find({},{name:1}).sort({name:1}).toArray(function(err, docs) {
		callback(docs);
	});	
}

function updateContainer(config, callback) {

	if((config._id+'').length>0 && (config._id+'')!=='undefined') {
		config = prepareObjectToStoreInMongoDB(config);
		executeDbCommand(function() {
			db.collection('containers').find({_id:config._id}).toArray(function(err, docs) {

				db.collection('sites').find({containers:{$elemMatch:{name:docs[0].name}}}).toArray(function(err, arr) {
					for(var i in arr) {
						var containers = arr[i].containers;
						for(var j in containers) {
							if(containers[j].name === docs[0].name) {
								containers[j].name = config.name;
							}
						}
						db.collection('sites').save(arr[i], function(err, objects) {});
					}
				});

				db.collection('containers').save(config, function(err, objects) {
					callback();
				});
			});
		});

	} else {
		addContainer(config, function() {
			callback();
		});
	}
}

function addContainer(item, callback) {
	db.collection('containers').find({"name":item.name}).toArray(function(err, docs) {
		if(docs.length === 0) {
			db.collection('containers').insert(item, function(err, objects) {
				callback();
			});
		} else {
			console.log("A container with the name:'" + item.name + "' already exists in database");
			callback();
		}
	});
}

function getContainer(id, callback) {
	var configId = new ObjectID(id);
	db.collection('containers').find({_id:configId}).toArray(function(err, docs) {
		callback(docs[0]);
	});
}

function getContainerByName(name, callback) {
	db.collection('containers').find({name:name}).toArray(function(err, docs) {
		callback(docs[0]);
	});
}

function removeContainer(containerId, callback) {
	var id = new ObjectID(containerId);
	db.collection('containers').remove({_id:id}, function(err, numberOfRemovedDocs) {
		callback();
	});
}


//--------------------------UI-Events---------------------------------------------------
//--------------------------------------------------------------------------------------

function getUIEventNames(callback) {
	db.collection('frontend').find({type:"button"},{name:1,_id:0}).sort({name:1}).toArray(function(err, docs) {
		callback(docs);
	});
}

function getUIEvent(name, callback) {
	executeDbCommand(function() {
		var searchString = "\"obj.params.uiName=='"+name+"'\"";
		console.log(searchString);
		db.collection('events').find({}).toArray(function(err, docs) {
			for(var i in docs) {
				if(docs[i].params.uiName === name) {
					callback({listener:docs[i].listenerName,condition:docs[i].conditions[0].conditionName});
				}
			}
		});
	});	
}





//--------------------------Events------------------------------------------------------
//--------------------------------------------------------------------------------------

function getEventConfig(ip, callback) {

	db.collection('events').find({"ip":ip}).toArray(function(err, docs) {
		callback(ip, docs);
	});
}
function getEventListenerNames(callback) {
	executeDbCommand(function() {
		db.collection('events').find({}).toArray(function(err, docs) {
			var arr = [];
			for(var i in docs) {
				arr.push(docs[i].listenerName);
			}
			callback(arr);
		});
	});	
}

function getEventConditionNames(listenerName, callback) {
	executeDbCommand(function() {

		db.collection('events').find({"listenerName":listenerName},{conditions:1,_id:0}).toArray(function(err, docs) {
			var conditions = docs[0].conditions;
			var arr = [];
			console.log('conditions');
			console.log(conditions);
			for(var i in conditions) {
				console.log('i');
				console.log(i);
				console.log('docs[i]');
				console.log(conditions[i]);
				arr.push(conditions[i].conditionName);
			}
			console.log('arr');
			console.log(arr);
			callback(arr);
		});
	});

}

function getEventConfigForEvent(listenerName, conditionName) {

		var collection = db.collection('eventConfig').find({"config":{$elemMatch:{"listeners":{$elemMatch:{"listenerName":listenerName, "events":{$elemMatch:{"conditionName":conditionName}}}}}}}).toArray(function(err, docs) {
			callback(ip, docs[0].config);
		});
}

function updateEventListenerConfig(config, callback) {

	if((config._id+'').length>0 && (config._id+'')!=='undefined') {
		config = prepareObjectToStoreInMongoDB(config);
		executeDbCommand(function() {
			db.collection('events').find({_id:config._id}).toArray(function(err, docs) {
				if(docs[0].listenerName !== config.listenerName) {
					db.collection('eventGroups').find({events:{$elemMatch:{listenerName:docs[0].listenerName}}}).toArray(function(err, arr) {
						for(var i in arr) {
							var events = arr[i].events;
							for (var j in events) {
								if(events[j].listenerName === docs[0].listenerName) {
									events[j].listenerName = config.listenerName;
								}
							}
							db.collection('eventGroups').save(arr[i], function(err, objects) {});
						}
					});
				}
				db.collection('events').save(config, function(err, objects) {
					callback();
				});
			});
		});

	} else {

		//TODO in addEventConfig a second check for already existing entry is done - NOT NEEDED...
		addEventConfig(config, function() {
			callback();
		});
	}
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

function addEventConfig(config, callback) {

	var collection = db.collection('events').find({"listenerName":config.listenerName}).toArray(function(err, docs) {
		if(docs.length === 0) {
			db.collection('events').insert(config, function(err, objects) {
				console.log("inserting");
				callback();
			});
		} else {
			console.log("A task with the id'" + config.taskId + "' already exists in database");
			callback();
		}
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
			callback(eventListeners);
		});
	});

}

function getEventListenerConfig(eventListenerId, callback) {
	executeDbCommand(function() {
		db.collection('events').find({listenerName:eventListenerId}).toArray(function(err, docs) {
			callback(docs[0]);
		});
	});
}


function removeEventListenerConfig(eventListenerId, callback) {
	var id = new ObjectID(eventListenerId);
	db.collection('events').remove({_id:id}, function(err, numberOfRemovedDocs) {
		callback();
	});
}


//--------------------------Tasks-------------------------------------------------------
//--------------------------------------------------------------------------------------

function getTaskConfig(taskId, callback) {
		var collection = db.collection('tasks').find({"taskId":taskId}).toArray(function(err, docs) {
			callback(docs[0]);
		});
}

function addTaskConfig(config, callback) {

	db.collection('tasks').find({"taskId":config.taskId}).toArray(function(err, docs) {
		if(docs.length === 0) {
			db.collection('tasks').insert(config, function(err, objects) {
				console.log("inserting");
				callback();
			});
		} else {
			console.log("A task with the id'" + config.taskId + "' already exists in database");
			callback();
		}
	});
}

function getFrontpageTasks(callback) {
	db.collection('tasks').find({"plugin":"UI"}).toArray(function(err, docs) {
		callback(docs);
	});
}

function updateTaskConfig(config, callback) {



	if((config._id+'').length>0 && (config._id+'')!=='undefined') {
		config = prepareObjectToStoreInMongoDB(config);
		console.log(config._id);


		executeDbCommand(function() {
			db.collection('tasks').find({_id:config._id}).toArray(function(err, docs) {
				if(docs[0].taskId !== config.taskId) {
					db.collection('taskGroups').find({tasks:{$in:[docs[0].taskId]}}).toArray(function(err, arr) {
						for(var i in arr) {
							var tasks = arr[i].tasks;
							for (var j in tasks) {
								if(tasks[j] === docs[0].taskId) {
									tasks[j] = config.taskId;
								}
							}
							db.collection('taskGroups').save(arr[i], function(err, objects) {});
						}
					});
				}
				db.collection('tasks').save(config, function(err, objects) {
					callback();
				});
			});
		});

	} else {
		addTaskConfig(config, function() {
			callback();
		});
	}
}

function removeTaskConfig(taskId, callback) {
	var id = new ObjectID(taskId);
	db.collection('tasks').remove({_id:id}, function(err, numberOfRemovedDocs) {
		callback();
	});
}

function getTaskList(callback) {
	executeDbCommand(function() {
		db.collection('tasks').find({},{taskId:1,_id:0}).sort({taskId:1}).toArray(function(err, docs) {
			callback(docs);
		});
	});
}



//--------------------------Taskgroups--------------------------------------------------
//--------------------------------------------------------------------------------------

function getTaskGroupConfig(taskGroupId, callback) {

		var collection = db.collection('taskGroups').find({"taskGroupId":taskGroupId}).toArray(function(err, docs) {
			callback(docs[0]);
		});
}

function addTaskGroupConfig(config, callback) {

		db.collection('taskGroups').find({"taskGroupId":config.taskGroupId}).toArray(function(err, docs) {
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
	if((config._id+'').length>0 && (config._id+'')!=='undefined') {
		console.log("should update now");
		// config._id = new ObjectID(config._id+'');
		config = prepareObjectToStoreInMongoDB(config);
		console.log(config._id);

		executeDbCommand(function() {
			db.collection('taskGroups').find({_id:config._id}).toArray(function(err, docs) {
				if(docs[0].taskGroupId !== config.taskGroupId) {
					console.log('NOT EQUAL');
					db.collection('eventGroups').find({taskGroups:{$in:[docs[0].taskGroupId]}}).toArray(function(err, arr) {
						for(var i in arr) {
							var taskGroups = arr[i].taskGroups;
							for (var j in taskGroups) {
								if(taskGroups[j] === docs[0].taskGroupId) {
									taskGroups[j] = config.taskGroupId;
								}
							}
							db.collection('eventGroups').save(arr[i], function(err, objects) {});
						}
					});
				}
				db.collection('taskGroups').save(config, function(err, objects) {
					callback();
				});
			});
		});
	} else {
		console.log("should add now");
		addTaskGroupConfig(config, function() {
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





//--------------------------Eventgroups-------------------------------------------------
//--------------------------------------------------------------------------------------

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

function addEventGroupConfig(config, callback) {

		var collection = db.collection('eventGroups').find({"eventGroupId":config.eventGroupId}).toArray(function(err, docs) {
			if(docs.length === 0) {
				db.collection('eventGroups').insert(config, function(err, objects) {
					console.log("inserting");
					callback();
				});
			} else {
				console.log("An eventGroup with the id'" + config.eventGroupId + "' already exists in database");
				callback();
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




// ------------------------------------- VARIABLES ----------------------------------------------


function setVariable(variableName, variableValue, callback) {

	var collection = db.collection('variables').find({"name":variableName}).toArray(function(err, docs) {
		if(docs.length === 0) {
			db.collection('variables').insert({"name":variableName, "value": variableValue}, function(err, objects) {
				console.log("inserting");
				callback();
			});
		} else {

			db.collection('variables').update({"name":variableName}, {$set:{"value":variableValue}}, function(err) {
				console.log("updated existing entry");
				callback();				
			});
		}
	});
}

function getVariable(variableName, callback) {

	db.collection('variables').find({"name":variableName}).toArray(function(err, docs) {
		callback(docs[0]);
	});
}

function getVariableList(callback) {
	executeDbCommand(function() {
		db.collection('variables').find({},{name:1,_id:0}).sort({name:1}).toArray(function(err, docs) {
			callback(docs);
		});
	});
}



// ------------------------------------- OTHERS ----------------------------------------------


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
		db.collection('taskGroups').find({},{taskGroupId:1,_id:0}).sort({taskGroupId:1}).toArray(function(err, docs) {
			callback(docs);
		});
	});
}

function getEventGroupList(callback) {
	executeDbCommand(function() {
		db.collection('eventGroups').find({},{eventGroupId:1,_id:0}).sort({eventGroupId:1}).toArray(function(err, docs) {
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

function prepareObjectToStoreInMongoDB(config) {
	config._id = new ObjectID(config._id+'');


	//store everything as string...
	for(var i in config.params) {
		try {
			var newParam = parseInt(config.params[i]);
			if(newParam.toString().length === config.params[i].length && (newParam>=0 || newParam <0)) {
				config.params[i] = newParam;
			}
		} catch (err) {
		}
	}
	return config;
}

if(typeof exports !== 'undefined') {

	//add

	//update
	exports.updateTaskGroupConfig = updateTaskGroupConfig;
	exports.updateTaskConfig = updateTaskConfig;
	exports.updateEventGroupConfig = updateEventGroupConfig;
	exports.updateEventListenerConfig = updateEventListenerConfig;
	exports.updateFrontpageItemConfig = updateFrontpageItemConfig;
	exports.setVariable = setVariable;
	exports.updateSite = updateSite;
	exports.updateContainer = updateContainer;

	//delete
	exports.removeTaskGroupConfig = removeTaskGroupConfig;
	exports.removeEventGroupConfig = removeEventGroupConfig;
	exports.removeSite = removeSite;
	exports.removeContainer = removeContainer;
	exports.removeFrontpageItemConfig = removeFrontpageItemConfig;
	exports.removeEventListenerConfig = removeEventListenerConfig;

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
	exports.getEventConditionNames = getEventConditionNames;
	exports.getTaskGroupList = getTaskGroupList;
	exports.getTaskListWithoutTasksGiven = getTaskListWithoutTasksGiven;
	exports.getEventListenerNames = getEventListenerNames;
	exports.getEventListenerConfig = getEventListenerConfig;
	exports.getFrontpageItems = getFrontpageItems;
	exports.getUIEvent = getUIEvent;
	exports.getFrontpageItemsList = getFrontpageItemsList;
	exports.getFrontpageItem = getFrontpageItem;
	exports.getUIEventNames = getUIEventNames;
	exports.removeTaskConfig = removeTaskConfig;
	exports.getVariable = getVariable;
	exports.getVariableList = getVariableList;
	exports.getSitesList = getSitesList;
	exports.getSite = getSite;
	exports.getContainersList = getContainersList;
	exports.getContainer = getContainer;
	exports.getContainerByName = getContainerByName;
	exports.getFrontpageItemByName = getFrontpageItemByName;

	exports.logEvent = logEvent;
	exports.checksEventOccuranceInLog = checksEventOccuranceInLog;
	// exports.getUIConfig = getUIConfig;

}
