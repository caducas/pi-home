
var mongodb = require('mongodb');
var server = new mongodb.Server("127.0.0.1", 27017, {});
var MongoClient = require('mongodb').MongoClient;
var format = require('util').format;

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
		}
	]
};

setEventConfig("127.0.0.1", realTestConfig);

function getEventConfig(ip, callback) {

	MongoClient.connect('mongodb://127.0.0.1:27017/pihome', function(err, db) {
		if(err) throw err;

		var collection = db.collection('eventConfig').find({"ip":ip}).toArray(function(err, docs) {
			console.dir(docs);
			console.log('configuration');
			console.log(docs[0].config);
			console.log(docs[0].ip);
			db.close();
			callback(ip, docs[0].config);
		});
	});
}

function updateEventConfig(ip, newConfig) {
	MongoClient.connect('mongodb://127.0.0.1:27017/pihome', function(err, db) {
		if(err) throw err;

		db.collection('eventConfig').update({"ip":ip},{$set: { "config" : newConfig } }, function(err, objects) {
			db.close();
		});
	});
}

function setEventConfig(ip, config) {

	MongoClient.connect('mongodb://127.0.0.1:27017/pihome', function(err, db) {
		if(err) throw err;

		var configToAdd = {
			"ip": ip,
			"config" : config
		};

		var collection = db.collection('eventConfig').find({"ip":ip}).toArray(function(err, docs) {
			if(docs.length === 0) {
				db.collection('eventConfig').insert(config, function(err, objects) {
					console.log("inserting");
					db.close();
				});
			} else {
				console.log("Entry for this ip already exists, use update function to update config or delete old entry before inserting new one");
			}
		});
	});
}

if(typeof exports !== 'undefined') {
	exports.getEventConfig = getEventConfig;
}
