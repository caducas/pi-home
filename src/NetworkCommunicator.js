/**
* This module is used to talk over the network (used for client and server). It uses the NetworkClient and NetworkServer module.
*
* @class NetworkCommunicator
*/

var net = require('net');
var server;
var client;

/**
* This method is used to start a server. It uses the NetworkServer module.
*
* @method startServer
*/
function startServer() {
	server = require(__dirname + '/NetworkServer');
	server.startServer();
}

/**
* This method is used to start a client which communicates to a server on given ip address and port. It uses the NetworkClient module.
*
* @method startClient
* @param {String} ip The ip address of the server.
* @param {Number} port The port of the server.
*/
function startClient(ip, port) {

	client = require(__dirname + '/NetworkClient');
	console.log("starting connecting");

	client.startClient(ip,port, function(ip, port) {
		console.log("connection to "+ip+":"+port+" failed - trying to connect in 10 sec...");
		setTimeout(function() {
			startClient(ip,port);
		},10000);

	});
	console.log("should be connecting");
}

/**
* This method is used send a message from the client to the server.
*
* @method sendToServer
* @param {Object} message The JSON object to send.
*/
function sendToServer(message) {
	client.sendMessage(message);
}

/**
* This method is used send a message from the server to a client with given ip address.
*
* @method sendToClient
* @param {String} recipient The ip address of the target client.
* @param {Object} message The JSON object to send.
*/
function sendToClient(recipient, message) {
	server.sendMessage(recipient, message);
}

if(typeof exports !== 'undefined') {
	exports.startServer = startServer;
	exports.startClient = startClient;
	exports.sendToServer = sendToServer;
	exports.sendToClient = sendToClient;
}
