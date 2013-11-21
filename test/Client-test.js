var assert = require('chai').assert;
var sinon = require('sinon');

describe('Client', function(){


	var stub1;
	var stub2;
	var stub3;

	it("checks that client module calls correct methods when starting and events are triggered", function() {

		var networkCommunicator = require(__dirname + '/../src/NetworkCommunicator');
		var taskExecutor = require(__dirname + '/../src/TaskExecutor');
		var eventHelper = require(__dirname + '/../src/EventHelper');
		stub1 = sinon.stub(networkCommunicator,"startClient");
		stub2 = sinon.stub(taskExecutor, "executeTask");
		stub3 = sinon.stub(eventHelper, "startListeners");
		//preparation

		//execution
		var client = require(__dirname + '/../src/Client');

		//assertion
		assert(stub1.calledOnce, "Method 'startClient' from module 'networkCommunicater' wasn't called when starting Client");
		console.log("outside");

		process.emit('#executeTask', {});
		assert(stub2.calledOnce, "Method 'executeTask' from module 'taskExecutor' wasn't called at event '#executeTask'");
		stub2.restore();

		process.emit('#config', {});		
		assert(stub3.calledOnce, "Method 'startListeners' from module 'eventHelper' wasn't called at event '#config' (client has received config from server)");
		stub3.restore();
		

	});
});