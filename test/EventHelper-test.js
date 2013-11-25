
var assert = require('chai').assert;
var sinon = require('sinon');

describe('EventHelper', function(){

	var pluginHelper = require(__dirname + '/../src/PluginHelper');
	var pluginGpio = require(__dirname + '/../src/plugins/Gpio/Gpio');
	var conditionHelper = require(__dirname + '/../src/ConditionHelper');
	var eventHelper = require(__dirname + '/../src/EventHelper');
	var networkCommunicator = require(__dirname + '/../src/NetworkCommunicator');
	var eventConfig = 
		[
			{
				"plugin" : "Gpio",
				"listeners" : [
					{
						"listenerName" : "Button01",
						"events" : [
							{
								"conditionName" : "Button01Pressed",
								"condition" : {
									"operator" : "=",
									"value" : 1
								}
							},
							{
								"conditionName" : "Button01Released",
								"condition" : {
									"operator" : "=",
									"value" : 0
								}					
							}
						],
						"params" : {
							"pin" : 18
						}
					}
				]
			}
		]
	;

	beforeEach(function() {
		pluginHelper.setPath(__dirname + '/../src/plugins/');
	});

	it("checks that method 'startListeners' starts the correct listeners", function() {

		//preparation
		var stub1 = sinon.stub(pluginHelper,"getPlugin").withArgs("Gpio").returns(pluginGpio);
		var stub2 = sinon.stub(pluginGpio,"listenEvent").returns(true);

		//execution
		eventHelper.startListeners(eventConfig);

		//assertion
		assert(stub1.calledOnce, "method 'getPlugin' from module 'pluginHelper' wasn't called with argument 'Gpio'");
		assert(stub2.calledOnce, "method 'listenEvent' from module pluginGpio' wasn't called");
		assert(stub2.calledWith("Button01",{"pin":18}), "method 'listenEvent' wasn't called with correct arguments");

		//after
		pluginHelper.getPlugin.restore();
		pluginGpio.listenEvent.restore();
	});

	it("checks that in case of listener is throwing an event a message will be send to the server", function() {

		//preparation
		var stub1 = sinon.stub(pluginHelper,"getPlugin").withArgs("Gpio").returns(pluginGpio);
		var stub2 = sinon.stub(pluginGpio,"listenEvent");
		var stub3 = sinon.stub(networkCommunicator,"sendToServer");
		var stub4 = sinon.stub(conditionHelper, "checkCondition");
		stub4.withArgs(1, {"operator":"=","value":1}).returns(true);
		stub4.withArgs(1, {"operator":"=","value":0}).returns(false);
		var testObjectToSend = {"command" : "event", "listener" : "Button01", "condition" : "Button01Pressed"};

		//execution
		eventHelper.startListeners(eventConfig);

		//check for execution if condition is true
		process.emit("Button01",1);

		//assertion
		assert(stub3.calledOnce, "method 'sendToServer' from module 'networkCommunicator' wasn't called for condition 'Button01Pressed'");
		assert(stub3.calledWith(testObjectToSend), "method 'sendToServer' from module 'networkCommunicator' wasn't called with correct arguments");
		assert(stub4.calledTwice, "method 'checkCondition' from 'conditionHelper' wasn't called 2 times");
		
		//after
		pluginHelper.getPlugin.restore();
		pluginGpio.listenEvent.restore();
		conditionHelper.checkCondition.restore();
		networkCommunicator.sendToServer.restore();
	});

	it("checks that in case of listener is throwing an event which doesn't match a condition no message will be send to the server", function() {

		//preparation
		var networkCommunicator = require(__dirname + '/../src/NetworkCommunicator');
		var pluginGpio = require(__dirname + '/../src/plugins/Gpio/Gpio');
		var stub1 = sinon.stub(pluginHelper,"getPlugin").withArgs("Gpio").returns(pluginGpio);
		var stub2 = sinon.stub(pluginGpio,"listenEvent");
		var stub3 = sinon.stub(networkCommunicator,"sendToServer");
		var stub4 = sinon.stub(conditionHelper, "checkCondition");
		stub4.withArgs(2, {"operator":"=","value":1}).returns(false);
		stub4.withArgs(2, {"operator":"=","value":0}).returns(false);

		//execution
		eventHelper.startListeners(eventConfig);

		//check for execution if condition is true
		process.emit("Button01",2);

		//assertion
		assert(stub3.notCalled, "method 'sendToServer' from module 'networkCommunicator' was called but shouldn't");
		assert(stub4.calledTwice, "method 'checkCondition' from 'conditionHelper' wasn't called 2 times");
		
		//after
		pluginHelper.getPlugin.restore();
		pluginGpio.listenEvent.restore();
		conditionHelper.checkCondition.restore();
		networkCommunicator.sendToServer.restore();
	});

	afterEach(function() {
		process.removeAllListeners();
	});
});
