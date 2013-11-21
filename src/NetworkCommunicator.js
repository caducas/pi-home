/**
* This module is used to handle tasks. It uses PluginHelper to load correct plugin and executes the 'execute' method of the plugin with params.
*
* @class TaskExecutor
*/

var net = require('net');
var server;
var client;


function startServer() {
	server = require(__dirname + '/NetworkServer');
	server.startServer();
}


function startClient() {

	client = require(__dirname + '/NetworkClient');
	client.startClient('127.0.0.1',6969);
	client.sendMessage('Hello you - i am the client');
}

function sendToServer(message) {
	client.sendMessage(message);
}

function sendToClient(recipient, message) {
	server.sendMessage(recipient, message);
}

function closeClient() {
	client.stopClient();
}


if(typeof exports !== 'undefined') {
	exports.startServer = startServer;
	exports.startClient = startClient;
	exports.sendToServer = sendToServer;
	exports.sendToClient = sendToClient;
	exports.closeClient = closeClient;
}
