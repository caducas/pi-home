/**
* This module used to handle the network communication on client side.
*
* @class NetworkClient
*/
var net = require('net');
var JsonSocket = require('json-socket');
var client;
var shellExecutor = require('child_process');

/**
* This method is used to start a client which communicates to a server on given ip address and port.
*
* @method startClient
* @param {String} serverIp The ip address of the server.
* @param {Number} port The port of the server.
*/
function startClient(serverIp, port, onError) {

	client = new JsonSocket(new net.Socket());

	console.log("connecting to "+serverIp+":"+port);
	client.connect(port, serverIp, function() {
		console.log('CONNECTED client TO: ' + serverIp + ':' + port);
	});

	client.on('error', function(err) {
		if(err.code === "ECONNREFUSED") {
			// onError(serverIp, port);			
		}
    });

	client.on('data', function(data) {
	});

	client.on('message', function(message) {

		if(message.command==='executeTask') {
			console.log("execute task:");
			process.emit('#executeTask', message.params);
		}

		if(message.command==='configEventListeners') {
			console.log("start listeners command received!");
			process.emit('#config', message.params);
		}

		if(message.command==='restart') {
			var path = __dirname + '/restartClient.sh';
			console.log("NETWORKCLIENT: will restart Client using "+path);
			shellExecutor.exec(path);
		}
	});

	client.on('close', function() {
		console.log('Connection closed but reconnecting');
			onError(serverIp, port);	
		client.end();
	});
}

/**
* This method is used send a message to the server.
*
* @method sendMessage
* @param {Object} message The JSON object to send.
*/
function sendMessage(message) {
	client.sendMessage(message);
}

if(typeof exports !== 'undefined') {
	exports.startClient = startClient;
	exports.sendMessage = sendMessage;
}
