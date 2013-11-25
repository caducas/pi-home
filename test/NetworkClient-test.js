/*
var assert = require('chai').assert;
var sinon = require('sinon');
var net = require('net');

describe('NetworkClient', function(){


	var server;

	before(function() {
		server = net.createServer();
		server.listen(6969);
	});

	it("checks the functionality when receiving JSON objects from server", function() {

		//preparation
		var networkClient = require(__dirname + '/../src/NetworkClient');
		var JsonSocket = require('json-socket');
		var clientIp = '127.0.0.1';
		var client;
		//var spy1 = sinon.spy(console, "log");
		var execTaskSuccess = false;

		process.on('#executeTask',function(param) {
			if(param != {"name":"test"}) {
				assert(false, "task execution event thrown but parameters are wrong");
			}
			execTaskSuccess = true;
		});

		process.on('#config', function(param) {
			if(param != {"config":"testconfig"}) {
				assert(false, "configuration event thrown but parameters are wrong");
			}
			configSuccess = true;
		});

		server.on('connection', function(socket) {
			client = new JsonSocket(socket);

			client.sendMessage({"command":"executeTask","params":{"name":"test"}});
		});

		//execution
		networkClient.startClient('127.0.0.1',6969);

		//assertion

		//	setTimeout(function() {
		//		assert(execTaskSuccess, "NetworkClient: event for executing task not thrown");
		//		assert(configSuccess, "NetworkServer:event for configuration not thrown");
		//	},1000);
	});


	after(function() {
		server.close();
	});

});
*/
