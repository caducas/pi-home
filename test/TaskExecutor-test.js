var assert = require('chai').assert;
var sinon = require('sinon');

describe('TaskExecutor', function(){

	it("checks that method 'executeTask' calls the 'execute' method from correct plugin with correct parameters", function() {


		//preparation
		var taskExecutor = require(__dirname + '/../src/TaskExecutor');
		var taskConfig = {
			"taskId" : "SwitchOnPower01",
			"host" : "127.0.0.1",
			"plugin" : "plugin433",
			"params" : {
				"grpId" : 1,
				"deviceId" : 1,
				"value" : 1
			}
		};
		var pluginHelper = require(__dirname + '/../src/PluginHelper');
		pluginHelper.setPath(__dirname + '/../src/plugins/');
		var plugin433 = require(__dirname + '/../src/plugins/plugin433/plugin433');

		var returnedPlugin = {
			execute:function(opts) {
			}
		};


		var stub = sinon.stub(pluginHelper,"getPlugin").withArgs("plugin433").returns(returnedPlugin);
		var spy2 = sinon.spy(returnedPlugin,"execute");

		//execution
		taskExecutor.executeTask(taskConfig);

		//assertion
		assert(stub.calledOnce, "method 'getPlugin' from module 'PluginHelper' wasn't called");
		assert(spy2.calledOnce, "method 'execute' from plugin 'plugin433' wasn't called");
		assert(spy2.withArgs({"grpId":1,"deviceId":1,"value":1}).calledOnce, "method 'execute' from plugin 'plugin433' wasn't called with correct arguments");
	});

});