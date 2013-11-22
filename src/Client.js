/**
* Class which is used to start the client functionality on the Raspberry Pi.
*
* @class Client
*/

var networkCommunicator = require(__dirname + '/NetworkCommunicator');
var taskExecutor = require(__dirname + '/TaskExecutor');
var eventHelper = require(__dirname + '/EventHelper');
var ip = '127.0.0.1';
var port = 6969;

if(process.argv[2] != null) {
	ip = process.argv[2];
}
if(process.argv[3] != null) {
	ip = process.argv[3];
}

//connects to server over network
networkCommunicator.startClient(ip,port);

//Event for executing a Task (when server sends command to start task)
process.on('#executeTask', function(task) {
	taskExecutor.executeTask(task);
});

//Event for configuration (when server sends command to do the configuration)
process.on('#config', function(eventConfig) {

	console.log("starts listeners with config");

	eventHelper.startListeners(eventConfig);
});


