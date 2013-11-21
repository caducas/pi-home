/**
* This module is used to handle tasks. It uses PluginHelper to load correct plugin and executes the 'execute' method of the plugin with params.
*
* @class TaskExecutor
*/

var net = require('net');
var JsonSocket = require('json-socket');
var client;

function startClient(serverIp, port) {

	client = new JsonSocket(new net.Socket());

	client.connect(port, serverIp, function() {
	    console.log('CONNECTED client TO: ' + serverIp + ':' + port);
	});

	client.on('data', function(data) {
	});

	client.on('message', function(message) {

		if(message.command==='executeTask') {
			process.emit('#executeTask', message.params);
		}

		if(message.command==='config') {
			console.log("start listeners command received!");
			process.emit('#config', message.params);
		}
	});

	client.on('close', function() {
	    console.log('Connection closed');
	    client.destroy();
	});
}

function stopClient() {
	client.destroy();
}

function sendMessage(message) {
	client.sendMessage(message);
}


if(typeof exports !== 'undefined') {
	exports.startClient = startClient;
	exports.sendMessage = sendMessage;
	exports.stopClient = stopClient;
}
