/**
* This module used to handle the network communication on server side.
*
* @class NetworkServer
*/

var net = require('net');
var JsonSocket = require('json-socket');

var clients = [];

/**
* This method is used to start a server.
*
* @method startServer
*/
function startServer() {
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
			// console.log('DATA received from ' + clientIp + ': ' + message);
			if(message.command === 'event') {
				process.emit('#eventCatched', message);
			}
			if(message.command === 'variable') {
				process.emit('#changeVariable', message.variable, message.value);
			}
			if(message.command === 'data') {
				process.emit('#pluginDataReceived', message.plugin, message.value);
			}
		});
	});
}

/**
* This method is used send a message from the server to a client with given ip address.
*
* @method sendMessage
* @param {String} recipient The ip address of the target client.
* @param {Object} message The JSON object to send.
*/
function sendMessage(recipient,message) {
	// console.log(message);
	try {
		clients[recipient].sendMessage(message);
	} catch(err) {
		console.log("Error sending to Client - maybe Client not started?");
	}
}


if(typeof exports !== 'undefined') {
	exports.startServer = startServer;
	exports.sendMessage = sendMessage;
}
