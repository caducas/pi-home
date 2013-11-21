/**
* Class which is used to start the server functionality on the Raspberry Pi.
*
* @class Server
*/
var networkCommunicator = require(__dirname + '/NetworkCommunicator');
var eventConfig = require(__dirname + '/../config/config.json');

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

	var configObject = {
		"command" : "config",
		"params" : eventConfig[ip]
	}

	networkCommunicator.sendToClient(ip,configObject);
});

//Event when client sends an event to the server
process.on('#eventCatched', function(catchedEvent) {

	var exampleTask1 = {
		"command" : "executeTask",
		"params" : {
			"taskId" : "SwitchOnLED",
			"host" : "127.0.0.1",
			"plugin" : "Gpio",
			"params" : {
				"direction" : 'out',
				"pin" : 27,
				"value" : 0
			}
		}
	};

	var exampleTask2 = {
		"command" : "executeTask",
		"params" : {
			"taskId" : "SwitchOnLED",
			"host" : "127.0.0.1",
			"plugin" : "Gpio",
			"params" : {
				"direction" : 'out',
				"pin" : 27,
				"value" : 1
			}
		}
	};

	var exampleTask3 = {
		"command" : "executeTask",
		"params" : {
			"taskId" : "SwitchOnPower",
			"host" : "127.0.0.1",
			"plugin" : "plugin433",
			"params" : {
				"grpId" : 1,
				"deviceId" : 1,
				"value" : 1
			}
		}
	};
	var exampleTask4 = {
		"command" : "executeTask",
		"params" : {
			"taskId" : "SwitchOffPower",
			"host" : "127.0.0.1",
			"plugin" : "plugin433",
			"params" : {
				"grpId" : 1,
				"deviceId" : 1,
				"value" : 0
			}
		}
	};

	var eventCondition = catchedEvent.condition;

	console.log('event catched:' + catchedEvent.listener + ' condition:' + catchedEvent.condition);

	if(eventCondition === 'Button01Pressed') {
		console.log("should turn led off");
		networkCommunicator.sendToClient('127.0.0.1',exampleTask1);
		networkCommunicator.sendToClient('127.0.0.1',exampleTask3);
	}
	if(eventCondition === 'Button01Released') {
		console.log("should turn led on");
		networkCommunicator.sendToClient('127.0.0.1',exampleTask2);		
		networkCommunicator.sendToClient('127.0.0.1',exampleTask4);		
	}

});

if(typeof exports !== 'undefined') {
	exports.setEventConfig = setEventConfig;
}


