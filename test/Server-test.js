var assert = require('chai').assert;
var sinon = require('sinon');

describe('Server', function(){


	var stub1;
	var stub2;
	var stub3;

	it("checks that network server is started at startup of server module", function() {

		//preparation
		var networkCommunicator = require(__dirname + '/../src/NetworkCommunicator');
		stub1 = sinon.stub(networkCommunicator,"startServer");

		//execution
		var server = require(__dirname + '/../src/Server');

		//assertion
		assert(stub1.calledOnce, "stub1 test");
		stub1.restore();
	});

	it("checks that correct config is sent after client connected to server", function() {
		console.log("test");

		//preparation
		var networkCommunicator = require(__dirname + '/../src/NetworkCommunicator');
		var taskExecutor = require(__dirname + '/../src/TaskExecutor');
		var eventHelper = require(__dirname + '/../src/EventHelper');
		var server = require(__dirname + '/../src/Server');
		var dbHelper = require(__dirname + '/../src/DBHelper');
		var testConfig = [{
				"plugin":"test"
			}];
		stub1 = sinon.stub(dbHelper,"getEventConfig").yields("192.168.0.14",testConfig);
		stub2 = sinon.stub(networkCommunicator, "sendToClient");

		var clientTestConfig = {
			"command" : "config",
			"params" : [{
				"plugin":"test"
			}]
		};

		//execution
		process.emit('#clientConnected', '192.168.0.14');

		//assertion
		assert(stub1.calledOnce, "stub1 test");
		assert(stub2.calledOnce, "stub2 test");
		assert(stub2.calledWith('192.168.0.14',clientTestConfig), "stub2 params not correct");
		stub2.restore();
		stub1.restore();
	});

});