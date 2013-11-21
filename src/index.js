var onOff = require('onoff').Gpio;
var taskExecutor = require(__dirname + '/TaskExecutor');
var pluginHelper = require(__dirname + '/PluginHelper');
var gpioPlugin = pluginHelper.getPlugin('Gpio');//require('./plugins/Gpio/Gpio').Gpio({'gpioPlugin':onOff});
var plugin433 = pluginHelper.getPlugin('plugin433');//require('./plugins/plugin433/plugin433');
var events = require('events');
var eventEmitter = new events.EventEmitter();
var networkCommunicator = require(__dirname + '/NetworkCommunicator');

process.on('1234', function(value) {

	var exampleTask1 = {
		"taskId" : "SwitchOnPower",
		"host" : "127.0.0.1",
		"plugin" : "plugin433",
		"params" : {
			"grpId" : 1,
			"deviceId" : 1,
			"value" : value
		}
	};
	var exampleTask2 = {
		"taskId" : "SwitchOnLED",
		"host" : "127.0.0.1",
		"plugin" : "Gpio",
		"params" : {
			"direction" : 'out',
			"pin" : 27,
			"value" : value
		}
	};
	taskExecutor.executeTask(exampleTask2);
	taskExecutor.executeTask(exampleTask1);
});

var list = pluginHelper.getListOfPlugins();
for (var key in list) {
	console.log(key);
	}
console.log(list);

var namesList = pluginHelper.getListOfPluginNames({'path':'./../test/utils/PluginHelper/'});
console.log('names:'+namesList);
gpioPlugin.listenEvent(1234, {'pin':18});


networkCommunicator.startServer();

networkCommunicator.startClient();
setTimeout(function() {


	networkCommunicator.sendToServer('message to server');


	networkCommunicator.sendToClient('127.0.0.1','message to client');

	networkCommunicator.closeClient();

},3000);

