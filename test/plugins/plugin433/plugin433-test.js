var plugin433 = require('./../../../src/plugins/plugin433/plugin433');
var assert = require('chai').assert;
var sinon = require('sinon');

describe('plugin433', function(){

	it("checks that execute method with missing params results in errors", function() {
		var plugin = plugin433.plugin433({'shellExecutor':null});
		var error;
		//without arguments
		try {
			plugin.execute();
		} catch (err) {
			error = err;
		}
		assert.include(error.message, "Cannot read property 'grpId' of undefined");

		//empty arguments
		error = null;
		try {
			plugin.execute({});
		} catch (err) {
			error = err;
		}
		assert.include(error.message, "option 'grpId' is missing");

		//missing deviceId
		error = null;
		try {
			plugin.execute({'grpId':1});
		} catch (err) {
			error = err;
		}
		assert.include(error.message, "option 'deviceId' is missing");

		//value missing
		error = null;
		try {
			plugin.execute({'grpId':1,'deviceId':2});
		} catch (err) {
			error = err;
		}
		assert.include(error.message, "option 'value' is missing");
	});

	it("checks that function 'executes' calls shellExecutor.exec with correct params", function() {

		for(var grpId = 1; grpId <= 4; grpId++) {
			for(var deviceId = 1; deviceId<=4; deviceId++) {
				for(var value = 0;value<=1;value++) {
					//Preparation
					var shellExecutor = require('child_process');
					var spy1 = sinon.stub(shellExecutor, "exec");

					var plugin = plugin433.plugin433({'shellExecutor':shellExecutor});

					//execution
					plugin.execute({'grpId':grpId,'deviceId':deviceId,'value':value});

					//assertion
					assert(spy1.calledWith("sudo /opt/rcswitch-pi/send "+grpId+" "+deviceId+" "+value), "method 'exec' from shellExecutor should be called with correct parameters");
					spy1.restore();
				}
			}
		}
	});

});