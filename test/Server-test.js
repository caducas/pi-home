var assert = require('chai').assert;
var sinon = require('sinon');

describe('Server', function(){


	var stub1;
	var stub2;
	var stub3;

	it("checks that method 'startListeners' starts the correct listeners", function() {

		//preparation
		var networkCommunicator = require(__dirname + '/../src/NetworkCommunicator');
		var taskExecutor = require(__dirname + '/../src/TaskExecutor');
		var eventHelper = require(__dirname + '/../src/EventHelper');
		stub1 = sinon.stub(networkCommunicator,"startServer");

		//execution
		var server = require(__dirname + '/../src/Server');

		//assertion
		assert(stub1.calledOnce, "stub1 test");
		stub1.restore();	
	});

	it("checks that method 'startListeners' starts the correct listeners", function() {

		//preparation
		var networkCommunicator = require(__dirname + '/../src/NetworkCommunicator');
		var taskExecutor = require(__dirname + '/../src/TaskExecutor');
		var eventHelper = require(__dirname + '/../src/EventHelper');
		var server = require(__dirname + '/../src/Server');
		stub2 = sinon.stub(networkCommunicator, "sendToClient");
		var testConfig = {
				"192.168.0.14" : {
					"events" : "test192",
					"tasks" : "test168"
				}
		};
		var clientTestConfig = {
			"command" : "config",
			"params" : {
				"events" : "test192",
				"tasks" : "test168"
			}
		};
		server.setEventConfig(testConfig);

		//execution
		process.emit('#clientConnected', '192.168.0.14');

		//assertion
		assert(stub2.calledOnce, "stub2 test");
		assert(stub2.calledWith('192.168.0.14',clientTestConfig), "stub2 params not correct");
		stub2.restore();	
	});

});