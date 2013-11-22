var assert = require('chai').assert;
var sinon = require('sinon');
var net = require('net');
var JsonSocket = require('json-socket');

describe('NetworkServer', function(){


	it("checks", function() {

		//preparation
		var networkServer = require(__dirname + '/../src/NetworkServer');
		var success = false;
		networkServer.startServer();
		var client = new JsonSocket(new net.Socket());
		client.connect(6969, '127.0.0.1', function() {
		    console.log('CONNECTED client TO: 127.0.0.1:6969');
		});

		process.on('#eventCatched', function(message) {
			if(!(message.command === "event")) {
				assert(false, "JSON-object has not the correct content");
			}
			success = true;
		});

		//execution
		client.sendMessage({"command":"event"});

		//assertion
		setTimeout(function() {
			assert(success, "no event thrown after receiving JSON-object with command 'event'");
		},3000);

	});
});
