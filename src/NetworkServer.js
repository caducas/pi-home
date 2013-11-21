/**
* This module is used to handle tasks. It uses PluginHelper to load correct plugin and executes the 'execute' method of the plugin with params.
*
* @class TaskExecutor
*/

var net = require('net');
var JsonSocket = require('json-socket');

var clients = [];

function startServer() {
	//var ip = '127.0.0.1';
	var port = 6969;
	var server = net.createServer();

	server.listen(port);
	server.on('connection', function(socket) {
		var clientIp = socket.remoteAddress;
	    console.log('CONNECTED: ' + socket.remoteAddress +':'+ socket.remotePort);
		socket = new JsonSocket(socket);
		clients[clientIp] = socket;

		process.emit('#clientConnected',clientIp);


		socket.on('message', function(message) {
	        console.log('DATA received from ' + clientIp + ': ' + message);
	        if(message.command === 'event') {
				process.emit('#eventCatched', message);
	        }   
		});

	});
}

function sendMessage(recipient,message) {
	clients[recipient].sendMessage(message);
}


if(typeof exports !== 'undefined') {
	exports.startServer = startServer;
	exports.sendMessage = sendMessage;
}
